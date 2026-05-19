#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SERVICE_NAME="${SERVICE_NAME:-quintadalam-backend}"
SERVICE_FILE="$ROOT_DIR/deployment/linux/$SERVICE_NAME.service"
SYSTEMD_FILE="/etc/systemd/system/$SERVICE_NAME.service"

if [[ ! -f "$SERVICE_FILE" ]]; then
  echo "[ERROR] Service template not found: $SERVICE_FILE"
  exit 1
fi

echo "[INFO] Installing systemd service..."
sudo cp "$SERVICE_FILE" "$SYSTEMD_FILE"
sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME"

echo "[INFO] systemd service installed: $SYSTEMD_FILE"
