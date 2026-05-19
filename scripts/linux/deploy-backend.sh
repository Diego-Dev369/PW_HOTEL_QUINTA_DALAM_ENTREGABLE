#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
SERVICE_NAME="${SERVICE_NAME:-quintadalam-backend}"
JAR_TARGET="${JAR_TARGET:-$BACKEND_DIR/target/backend-0.0.1-SNAPSHOT.jar}"
SYSTEMD_DIR="${SYSTEMD_DIR:-/etc/systemd/system}"

echo "[INFO] Building backend jar..."
cd "$BACKEND_DIR"
./mvnw -DskipTests clean package

if [[ ! -f "$JAR_TARGET" ]]; then
  echo "[ERROR] JAR not found at: $JAR_TARGET"
  exit 1
fi

echo "[INFO] Copying jar to /opt/$SERVICE_NAME/"
sudo mkdir -p "/opt/$SERVICE_NAME"
sudo cp "$JAR_TARGET" "/opt/$SERVICE_NAME/app.jar"

echo "[INFO] Installing systemd unit template"
sudo cp "$ROOT_DIR/deployment/linux/$SERVICE_NAME.service" "$SYSTEMD_DIR/$SERVICE_NAME.service"
sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"
sudo systemctl status "$SERVICE_NAME" --no-pager
