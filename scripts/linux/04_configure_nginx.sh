#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <domain>"
  exit 1
fi

DOMAIN="$1"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TEMPLATE="$ROOT_DIR/deployment/nginx/quintadalam.conf"
TARGET="/etc/nginx/sites-available/quintadalam.conf"
LINK="/etc/nginx/sites-enabled/quintadalam.conf"

if [[ ! -f "$TEMPLATE" ]]; then
  echo "[ERROR] Nginx template not found: $TEMPLATE"
  exit 1
fi

echo "[INFO] Rendering nginx config for domain: $DOMAIN"
TMP_FILE="$(mktemp)"
sed "s/__DOMAIN__/$DOMAIN/g" "$TEMPLATE" > "$TMP_FILE"

sudo cp "$TMP_FILE" "$TARGET"
rm -f "$TMP_FILE"

if [[ -L /etc/nginx/sites-enabled/default ]]; then
  sudo rm -f /etc/nginx/sites-enabled/default
fi
sudo ln -sf "$TARGET" "$LINK"

sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager
