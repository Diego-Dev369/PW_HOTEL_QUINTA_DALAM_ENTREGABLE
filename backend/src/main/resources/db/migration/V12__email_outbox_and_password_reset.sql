SET search_path TO hotel, public;

-- ---------------------------------------------------------------------------
-- Outbox resiliente para notificaciones por email
-- ---------------------------------------------------------------------------
ALTER TABLE IF EXISTS hotel.notifications_outbox
  ADD COLUMN IF NOT EXISTS next_attempt_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS dead_letter_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_outbox_status_next_attempt
  ON hotel.notifications_outbox (status, next_attempt_at, created_at);

-- ---------------------------------------------------------------------------
-- Tokens de recuperación de contraseña (hash SHA-256 en reposo)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES hotel.users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  requested_ip VARCHAR(64),
  user_agent VARCHAR(400)
);

CREATE INDEX IF NOT EXISTS idx_password_reset_user_active
  ON hotel.password_reset_tokens (user_id, expires_at)
  WHERE used_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_password_reset_expires_at
  ON hotel.password_reset_tokens (expires_at);
