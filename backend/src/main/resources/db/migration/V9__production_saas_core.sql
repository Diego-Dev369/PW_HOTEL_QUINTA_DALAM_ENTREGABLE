SET search_path TO hotel, public;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ---------------------------------------------------------------------------
-- Roles: recepción (Spring Security espera ROLE_RECEPTION)
-- ---------------------------------------------------------------------------
INSERT INTO hotel.roles (code, name, description)
SELECT 'RECEPTION', 'Recepción', 'Front desk y operaciones de estancia.'
WHERE NOT EXISTS (SELECT 1 FROM hotel.roles r WHERE r.code = 'RECEPTION');

-- ---------------------------------------------------------------------------
-- Migración constrain anti-solapes: incluir PARTIALLY_PAID
-- (requiere valor 'PARTIALLY_PAID' ya comprometido en migración anterior)
-- ---------------------------------------------------------------------------
ALTER TABLE hotel.reservations DROP CONSTRAINT IF EXISTS ex_reservation_no_overlap;

ALTER TABLE hotel.reservations
ADD CONSTRAINT ex_reservation_no_overlap
EXCLUDE USING gist (
  room_id WITH =,
  stay_range WITH &&
)
WHERE (
  status = 'PENDING_PAYMENT'::hotel.reservation_status
  OR status = 'PARTIALLY_PAID'::hotel.reservation_status
  OR status = 'CONFIRMED'::hotel.reservation_status
);

-- ---------------------------------------------------------------------------
-- Columnas financieras detalladas (MXN hospedaje: base gravable + IVA + ISH)
-- ---------------------------------------------------------------------------
ALTER TABLE hotel.reservations
  ADD COLUMN IF NOT EXISTS room_base_amount NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS iva_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ish_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pricing_snapshot JSONB;

UPDATE hotel.reservations
SET room_base_amount = subtotal_amount
WHERE room_base_amount IS NULL;

ALTER TABLE hotel.reservations
  ALTER COLUMN room_base_amount SET NOT NULL;

-- ---------------------------------------------------------------------------
-- Configuración multi-hotel lite (clave → JSON)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel.hotel_settings (
  key VARCHAR(80) PRIMARY KEY,
  value_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO hotel.hotel_settings (key, value_json)
VALUES ('tax.mx', '{"ivaRate":"0.16","ishRate":"0.03","note":"Tarifarios publicados como base hospedaje antes impuestos; ajustable por hotel_settings."}')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS hotel.feature_flags (
  key VARCHAR(80) PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  payload JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hotel.cancellation_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(60) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
  cutoff_hours_before_check_in INT NOT NULL DEFAULT 48,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO hotel.cancellation_policies (code, name, fee_percent, cutoff_hours_before_check_in)
VALUES
  ('DEFAULT', 'Política estándar Quinta Dalam', 50.00, 72),
  ('FLEX', 'Flexible', 0, 24),
  ('STRICT', 'Estricta', 100, 168)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Bloqueos físicos mantenimiento / hold OTA → evita ocupar como reserva OTB
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel.room_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES hotel.rooms(id) ON DELETE CASCADE,
  block_range DATERANGE NOT NULL,
  reason VARCHAR(80) NOT NULL,
  metadata JSONB,
  created_by UUID REFERENCES hotel.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_room_block_range CHECK (lower(block_range) < upper(block_range)),
  CONSTRAINT ex_room_block_overlap EXCLUDE USING gist (
    room_id WITH =,
    block_range WITH &&
  )
);

CREATE INDEX IF NOT EXISTS idx_room_blocks_room ON hotel.room_blocks (room_id, lower(block_range));

-- ---------------------------------------------------------------------------
-- Auditoría técnica (acciones usuario)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel.security_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES hotel.users(id) ON DELETE SET NULL,
  actor_email VARCHAR(255),
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(80),
  entity_id UUID,
  details JSONB,
  ip VARCHAR(45),
  user_agent VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON hotel.security_audit_events (created_at DESC);

-- ---------------------------------------------------------------------------
-- Historial modificaciones fecha/suite
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel.reservation_amendments (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  reservation_id UUID NOT NULL REFERENCES hotel.reservations(id) ON DELETE CASCADE,
  previous_check_in DATE NOT NULL,
  previous_check_out DATE NOT NULL,
  new_check_in DATE NOT NULL,
  new_check_out DATE NOT NULL,
  previous_total NUMERIC(12, 2),
  new_total NUMERIC(12, 2),
  reason TEXT,
  changed_by UUID REFERENCES hotel.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Ledger financiero canon (stripe, efectivo, transferencia…)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  CREATE TYPE hotel.ledger_payment_method AS ENUM (
    'STRIPE_CARD',
    'CASH',
    'BANK_TRANSFER',
    'COMPLIMENTARY',
    'ADJUSTMENT',
    'STRIPE_REFUND'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS hotel.payment_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES hotel.reservations(id) ON DELETE RESTRICT,
  method hotel.ledger_payment_method NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'MXN',
  stripe_charge_id VARCHAR(255),
  stripe_refund_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255),
  note TEXT,
  metadata JSONB,
  recorded_by UUID REFERENCES hotel.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_ledger_currency CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE INDEX IF NOT EXISTS idx_ledger_reservation ON hotel.payment_ledger_entries (reservation_id, created_at DESC);

CREATE TABLE IF NOT EXISTS hotel.notifications_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind VARCHAR(60) NOT NULL,
  reservation_id UUID REFERENCES hotel.reservations(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  attempts INT NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_outbox_status ON hotel.notifications_outbox (status, created_at);

CREATE TABLE IF NOT EXISTS hotel.external_calendar_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  room_id UUID NOT NULL REFERENCES hotel.rooms(id) ON DELETE CASCADE,
  ical_feed_url TEXT,
  imported_block_prefix VARCHAR(20) DEFAULT 'OTA',
  last_sync_at TIMESTAMPTZ,
  metadata JSONB,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- payments: permitir cargos sólo Stripe o NULL (walk-in efectivo sólo ledger)
-- ---------------------------------------------------------------------------
ALTER TABLE hotel.payments ALTER COLUMN stripe_session_id DROP NOT NULL;

ALTER TABLE hotel.payments DROP CONSTRAINT IF EXISTS payments_stripe_session_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS ux_payments_stripe_session_alive
  ON hotel.payments (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL AND deleted_at IS NULL;

COMMENT ON COLUMN hotel.payments.stripe_session_id IS 'NULL para cargos externos manejados sólo por payment_ledger_entries.';

CREATE OR REPLACE FUNCTION hotel.fn_fill_reservation_pricing()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_rate NUMERIC(12,2);
  v_currency CHAR(3);
  v_nights INTEGER;
BEGIN
  v_nights := NEW.check_out - NEW.check_in;
  IF v_nights <= 0 THEN
    RAISE EXCEPTION 'Rango de fechas invalido: check_out debe ser mayor a check_in';
  END IF;

  IF NEW.nightly_rate_amount IS NULL OR NEW.nightly_rate_amount <= 0 OR NEW.currency IS NULL THEN
    SELECT rr.nightly_rate_amount, rr.currency
      INTO v_rate, v_currency
    FROM hotel.room_rates rr
    WHERE rr.room_id = NEW.room_id
      AND rr.valid_during @> NEW.check_in
      AND rr.deleted_at IS NULL
    ORDER BY lower(rr.valid_during) DESC, rr.created_at DESC
    LIMIT 1;

    IF v_rate IS NULL THEN
      RAISE EXCEPTION 'No existe tarifa vigente para room_id % y fecha %', NEW.room_id, NEW.check_in;
    END IF;

    IF NEW.nightly_rate_amount IS NULL OR NEW.nightly_rate_amount <= 0 THEN
      NEW.nightly_rate_amount := v_rate;
    END IF;

    IF NEW.currency IS NULL THEN
      NEW.currency := v_currency;
    END IF;
  END IF;

  IF NEW.subtotal_amount IS NULL OR NEW.subtotal_amount <= 0 THEN
    NEW.subtotal_amount := NEW.nightly_rate_amount * v_nights;
    NEW.room_base_amount := NEW.subtotal_amount;
  ELSIF NEW.room_base_amount IS NULL OR NEW.room_base_amount <= 0 THEN
    NEW.room_base_amount := NEW.subtotal_amount;
  END IF;

  NEW.iva_amount := COALESCE(NEW.iva_amount, 0);
  NEW.ish_amount := COALESCE(NEW.ish_amount, 0);

  NEW.taxes_amount := COALESCE(NEW.taxes_amount, NEW.iva_amount + NEW.ish_amount);

  IF COALESCE(NEW.taxes_amount, 0) = 0 AND (NEW.iva_amount > 0 OR NEW.ish_amount > 0) THEN
    NEW.taxes_amount := NEW.iva_amount + NEW.ish_amount;
  END IF;

  IF NEW.total_amount IS NULL OR NEW.total_amount <= 0 THEN
    NEW.total_amount := NEW.subtotal_amount + NEW.taxes_amount;
  END IF;

  RETURN NEW;
END;
$$;
