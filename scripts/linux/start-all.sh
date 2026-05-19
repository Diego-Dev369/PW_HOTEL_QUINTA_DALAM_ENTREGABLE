#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "[INFO] Root: $ROOT_DIR"

if [[ ! -f "$ROOT_DIR/.env" ]]; then
  echo "[INFO] .env not found, copying from .env.example"
  cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
fi

if command -v docker >/dev/null 2>&1; then
  echo "[INFO] Starting local PostgreSQL with docker-compose (optional)"
  docker compose -f "$ROOT_DIR/docker-compose.yml" up -d postgres || true
fi

echo "[INFO] Starting backend"
(cd "$BACKEND_DIR" && ./mvnw spring-boot:run) &
BACKEND_PID=$!

echo "[INFO] Starting frontend"
(cd "$FRONTEND_DIR" && npm run dev -- --host 0.0.0.0) &
FRONTEND_PID=$!

cleanup() {
  echo "[INFO] Stopping services..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

wait
