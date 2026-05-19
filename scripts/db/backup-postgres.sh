#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKUP_DIR="$ROOT_DIR/ops/backups"
TS="$(date +%Y%m%d_%H%M%S)"

: "${DB_HOST:?DB_HOST is required}"
: "${DB_PORT:=5432}"
: "${DB_NAME:?DB_NAME is required}"
: "${DB_USER:?DB_USER is required}"
: "${DB_PASSWORD:?DB_PASSWORD is required}"

mkdir -p "$BACKUP_DIR"
export PGPASSWORD="$DB_PASSWORD"

OUT_FILE="$BACKUP_DIR/${DB_NAME}_${TS}.sql.gz"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" | gzip > "$OUT_FILE"

unset PGPASSWORD
echo "[INFO] Backup created: $OUT_FILE"
