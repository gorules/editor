use axum::extract::{DefaultBodyLimit,Path as EPath};
use axum::body::Bytes;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post, delete};
use axum::{Extension, Json, Router};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::path::PathBuf;
use std::env;
use std::fs;
use std::path::Path;
use std::thread::available_parallelism;
use tokio::sync::Mutex;
use tokio_util::task::LocalPoolHandle;
use tower_http::compression::CompressionLayer;
use tower_http::cors::CorsLayer;
use tower_http::services::{ServeDir, ServeFile};
use tower_http::set_status::SetStatus;
use tower_http::trace::TraceLayer;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;
use zen_engine::model::DecisionContent;
use zen_engine::{DecisionEngine, DecisionGraphResponse, EvaluationError, EvaluationOptions};

const IS_DEVELOPMENT: bool = cfg!(debug_assertions);    
const DEFAULT_RULES_DIR: &str = "/app/rules";

#[tokio::main]
async fn main() {
    let local_pool = LocalPoolHandle::new(available_parallelism().map(Into::into).unwrap_or(1));
    let rules_dir = env::var("RULES_DIR").unwrap_or_else(|_| DEFAULT_RULES_DIR.to_string());

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "editor=info,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let host_address = IS_DEVELOPMENT.then_some("127.0.0.1").unwrap_or("0.0.0.0");
    let listener_address = format!("{host_address}:3000");

    // Correct layer usage for `LocalPoolHandle`
    let app = Router::new()
        .route("/api/health", get(health))
        .route(
            "/api/simulate",
            post(simulate).layer(DefaultBodyLimit::max(16 * 1024 * 1024)),
        )
        .route("/api/list", get(list_files))
        .route("/api/save/:filename", post(save_file))
        .route("/api/delete/:filename", delete(delete_file))
        .layer(Extension(rules_dir.clone()))
        .layer(Extension(local_pool)) // Apply local_pool as an extension
        .nest_service("/", serve_dir_service());
    let listener = tokio::net::TcpListener::bind(listener_address)
        .await
        .unwrap();
    let compression_layer = CompressionLayer::new().gzip(true).br(true);

    tracing::info!("🚀 Listening on http://{}", listener.local_addr().unwrap());

    let mut app_with_layers = app
        .layer(TraceLayer::new_for_http())
        .layer(compression_layer);
    if let Ok(_) = env::var("CORS_PERMISSIVE") {
        app_with_layers = app_with_layers.layer(CorsLayer::permissive())
    }

    axum::serve(listener, app_with_layers).await.unwrap();
}

async fn list_files(Extension(rules_dir): Extension<String>) -> impl IntoResponse {
    let rules_dir = PathBuf::from(rules_dir);
    let mut file_map = serde_json::Map::new();

    if let Ok(entries) = fs::read_dir(rules_dir) {
        for entry in entries {
            if let Ok(entry) = entry {
                if let Ok(file_name) = entry.file_name().into_string() {
                    if file_name.ends_with(".json") {
                        let file_path = entry.path();
                        if let Ok(file_content) = fs::read_to_string(&file_path) {
                            if let Ok(json_content) = serde_json::from_str(&file_content) {
                                let key = file_name.trim_end_matches(".json").to_string();
                                file_map.insert(key, json_content);
                            }
                        }
                    }
                }
            }
        }
    }

    Json(json!(file_map))
}

async fn save_file(
    EPath(filename): EPath<String>,
    Extension(rules_dir): Extension<String>, 
    value: Bytes
) -> StatusCode {
    let file_path = PathBuf::from(format!("{}/{}.json", rules_dir, filename));

    match fs::write(file_path, value) {
        Ok(_) => StatusCode::OK,
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR,
    }
}

async fn delete_file(EPath(filename): EPath<String>, Extension(rules_dir): Extension<String>) -> impl IntoResponse {
    let file_path = PathBuf::from(format!("{}/{}.json", rules_dir, filename));

    match fs::remove_file(file_path) {
        Ok(_) => StatusCode::OK,
        Err(_) => StatusCode::NOT_FOUND,
    }
}

fn serve_dir_service() -> ServeDir<SetStatus<ServeFile>> {
    let work_dir = env::current_dir().ok().map_or("static".to_string(), |dir| {
        dir.to_string_lossy().to_string()
    });
    let static_path = Path::new(&work_dir).join("static");
    let index_path = static_path.join("index.html");

    ServeDir::new(static_path).not_found_service(ServeFile::new(index_path))
}

async fn health() -> (StatusCode, String) {
    (StatusCode::OK, String::from("healthy"))
}

#[derive(Deserialize, Serialize)]
struct SimulateRequest {
    context: Value,
    content: DecisionContent,
}

async fn simulate(
    Extension(local_pool): Extension<LocalPoolHandle>,
    Json(payload): Json<SimulateRequest>,
) -> Result<Json<DecisionGraphResponse>, SimulateError> {
    let engine = DecisionEngine::default();
    let decision = engine.create_decision(payload.content.into());

    let result = local_pool
        .spawn_pinned(move || async move {
            decision
                .evaluate_with_opts(
                    &payload.context,
                    EvaluationOptions {
                        trace: Some(true),
                        max_depth: None,
                    },
                )
                .await
        })
        .await
        .expect("Thread failed to join")?;

    return Ok(Json(result));
}

struct SimulateError(Box<EvaluationError>);

impl IntoResponse for SimulateError {
    fn into_response(self) -> Response {
        (
            StatusCode::BAD_REQUEST,
            serde_json::to_string(&self.0).unwrap_or_default(),
        )
            .into_response()
    }
}

impl From<Box<EvaluationError>> for SimulateError {
    fn from(value: Box<EvaluationError>) -> Self {
        Self(value)
    }
}
