#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <s3_bucket> [cloudfront_distribution_id]"
  exit 1
fi

BUCKET="$1"
CF_DISTRIBUTION_ID="${2:-}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "[INFO] Building frontend..."
cd "$FRONTEND_DIR"
npm ci
npm run build

echo "[INFO] Uploading dist to s3://$BUCKET"
aws s3 sync dist "s3://$BUCKET" --delete

if [[ -n "$CF_DISTRIBUTION_ID" ]]; then
  echo "[INFO] Invalidating CloudFront distribution $CF_DISTRIBUTION_ID"
  aws cloudfront create-invalidation --distribution-id "$CF_DISTRIBUTION_ID" --paths "/*"
fi

echo "[INFO] Frontend deployment completed."
