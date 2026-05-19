#!/usr/bin/env bash
set -euo pipefail

echo "[INFO] Stopping Spring Boot and Vite processes"
pkill -f "spring-boot:run" || true
pkill -f "vite" || true

echo "[INFO] Optional: stopping Docker postgres"
if command -v docker >/dev/null 2>&1; then
  docker compose down || true
fi

echo "[INFO] Done"
