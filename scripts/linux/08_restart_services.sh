#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${SERVICE_NAME:-quintadalam-backend}"

echo "[INFO] Restarting backend service: $SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"
sudo systemctl status "$SERVICE_NAME" --no-pager

echo "[INFO] Reloading Nginx..."
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx --no-pager
