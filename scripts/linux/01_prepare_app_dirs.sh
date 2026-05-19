#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/quintadalam-backend}"
APP_USER="${APP_USER:-www-data}"
APP_GROUP="${APP_GROUP:-www-data}"

echo "[INFO] Creating app directories..."
sudo mkdir -p "$APP_DIR" /var/log/quintadalam /var/backups/quintadalam
sudo chown -R "$APP_USER:$APP_GROUP" "$APP_DIR" /var/log/quintadalam
sudo chmod 750 "$APP_DIR"

if [[ ! -f "$APP_DIR/.env" ]]; then
  echo "[WARN] $APP_DIR/.env does not exist yet."
  echo "[INFO] Copy config/env/.env.prod.example and fill real values."
fi

echo "[INFO] Directories ready."
