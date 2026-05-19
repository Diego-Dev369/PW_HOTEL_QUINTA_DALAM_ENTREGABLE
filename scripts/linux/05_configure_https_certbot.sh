#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <domain> <email>"
  exit 1
fi

DOMAIN="$1"
EMAIL="$2"

echo "[INFO] Requesting Let's Encrypt certificate for $DOMAIN"
sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect

echo "[INFO] Testing certificate auto-renew..."
sudo certbot renew --dry-run
