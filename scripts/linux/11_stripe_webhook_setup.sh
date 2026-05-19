#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <stripe_api_key> <webhook_url>"
  echo "Example: $0 sk_live_xxx https://api.tudominio.com/api/v1/webhooks/stripe"
  exit 1
fi

STRIPE_API_KEY="$1"
WEBHOOK_URL="$2"

if ! command -v stripe >/dev/null 2>&1; then
  echo "[ERROR] Stripe CLI not found. Install from https://docs.stripe.com/stripe-cli"
  exit 1
fi

echo "[INFO] Logging in Stripe CLI..."
stripe login

echo "[INFO] Creating Stripe webhook endpoint..."
stripe webhook_endpoints create \
  --api-key "$STRIPE_API_KEY" \
  --url "$WEBHOOK_URL" \
  --enabled-events checkout.session.completed \
  --enabled-events checkout.session.expired \
  --enabled-events payment_intent.succeeded \
  --enabled-events payment_intent.payment_failed

echo "[INFO] Webhook endpoint created. Copy generated signing secret to PAYMENT_WEBHOOK_SECRET."
