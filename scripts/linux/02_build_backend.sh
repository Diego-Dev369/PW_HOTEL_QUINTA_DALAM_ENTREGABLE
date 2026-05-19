#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

echo "[INFO] Building backend jar..."
cd "$BACKEND_DIR"
./mvnw -DskipTests clean package

JAR_FILE="$(ls target/*.jar | head -n 1)"
if [[ -z "${JAR_FILE:-}" ]]; then
  echo "[ERROR] No JAR generated in target/"
  exit 1
fi

echo "[INFO] Backend artifact: $JAR_FILE"
