FROM rust:1.86 AS rust-builder

WORKDIR /app

COPY . .

RUN cargo build --release

FROM node:lts-slim AS react-builder

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm i
RUN pnpm run build

FROM debian:stable-slim AS runner

WORKDIR /app

COPY --from=rust-builder /app/target/release/editor ./editor
COPY --from=react-builder /app/static ./static

EXPOSE 3000
CMD ["./editor"]