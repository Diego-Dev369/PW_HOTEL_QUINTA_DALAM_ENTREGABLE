#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${SERVICE_NAME:-quintadalam-backend}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:8080/actuator/health}"

echo "==== Host ===="
hostnamectl || true

echo "==== Uptime ===="
uptime

echo "==== Disk usage ===="
df -h

echo "==== Memory ===="
free -h

echo "==== Backend service status ===="
sudo systemctl status "$SERVICE_NAME" --no-pager || true

echo "==== Nginx status ===="
sudo systemctl status nginx --no-pager || true

echo "==== Health endpoint ===="
curl -fsS "$HEALTH_URL" || true
echo

echo "==== Recent backend logs ===="
sudo journalctl -u "$SERVICE_NAME" -n 80 --no-pager || true
