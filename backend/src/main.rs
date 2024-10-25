use axum::extract::DefaultBodyLimit;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Extension, Json, Router};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::env;
use std::path::Path;
use std::thread::available_parallelism;
use tokio_util::task::LocalPoolHandle;
use tower_http::compression::CompressionLayer;
use tower_http::cors::CorsLayer;
use tower_http::services::{ServeDir, ServeFile};
use tower_http::set_status::SetStatus;
use tower_http::trace::TraceLayer;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;
use zen_engine::model::DecisionContent;
use zen_engine::{DecisionEngine, EvaluationError, EvaluationOptions};

const IS_DEVELOPMENT: bool = cfg!(debug_assertions);

#[tokio::main]
async fn main() {
    let local_pool = LocalPoolHandle::new(available_parallelism().map(Into::into).unwrap_or(1));

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "editor=info,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let host_address = IS_DEVELOPMENT.then_some("127.0.0.1").unwrap_or("0.0.0.0");
    let listener_address = format!("{host_address}:3000");

    let app = Router::new()
        .route("/api/health", get(health))
        .route(
            "/api/simulate",
            post(simulate).layer(DefaultBodyLimit::max(16 * 1024 * 1024)),
        )
        .layer(Extension(local_pool))
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
) -> Result<Json<Value>, SimulateError> {
    let engine = DecisionEngine::default();
    let decision = engine.create_decision(payload.content.into());

    let result = local_pool
        .spawn_pinned(move || async move {
            decision
                .evaluate_with_opts(
                    payload.context.into(),
                    EvaluationOptions {
                        trace: Some(true),
                        max_depth: None,
                    },
                )
                .await
                .map(serde_json::to_value)
        })
        .await
        .expect("Thread failed to join")?
        .map_err(|_| SimulateError::from(Box::new(EvaluationError::DepthLimitExceeded)))?;

    Ok(Json(result))
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
