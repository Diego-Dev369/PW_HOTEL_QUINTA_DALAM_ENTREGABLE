SET search_path TO hotel, public;

-- ============================================================================
-- Migración V11: Mejoras de validación y logging para pagos Stripe
-- ============================================================================

-- 1. Agregar columna para tracking de intentos de pago fallidos
ALTER TABLE hotel.reservations
  ADD COLUMN IF NOT EXISTS last_payment_attempt_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_failure_count INT NOT NULL DEFAULT 0;

-- 2. Índice para consultas de reservaciones con pagos pendientes
CREATE INDEX IF NOT EXISTS idx_reservations_pending_payment_dates 
  ON hotel.reservations(status, check_in) 
  WHERE status = 'PENDING_PAYMENT';

-- 3. Tabla para tracking de sesiones de Stripe (auditoría)
CREATE TABLE IF NOT EXISTS hotel.stripe_session_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL UNIQUE,
  payment_intent_id VARCHAR(255),
  reservation_id UUID NOT NULL REFERENCES hotel.reservations(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency CHAR(3) NOT NULL,
  customer_email VARCHAR(255),
  success_url TEXT,
  cancel_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_stripe_session_reservation 
  ON hotel.stripe_session_audit(reservation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_stripe_session_status 
  ON hotel.stripe_session_audit(status, created_at);

-- 4. Función para actualizar contador de intentos fallidos
CREATE OR REPLACE FUNCTION hotel.fn_track_payment_attempt()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Solo tracking para reservaciones en PENDING_PAYMENT
  IF NEW.status = 'PENDING_PAYMENT' AND OLD.status = 'PENDING_PAYMENT' THEN
    -- No hacer nada si sigue en pending (intento no completado)
    NULL;
  ELSIF NEW.status = 'PENDING_PAYMENT' AND OLD.status != 'PENDING_PAYMENT' THEN
    -- Volvió a pending desde otro estado (reintento)
    NEW.payment_failure_count := COALESCE(NEW.payment_failure_count, 0) + 1;
    NEW.last_payment_attempt_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

-- 5. Trigger para tracking de intentos
DROP TRIGGER IF EXISTS trg_track_payment_attempts ON hotel.reservations;

CREATE TRIGGER trg_track_payment_attempts
  BEFORE UPDATE ON hotel.reservations
  FOR EACH ROW
  EXECUTE FUNCTION hotel.fn_track_payment_attempt();

-- 6. Comentario de documentación
COMMENT ON TABLE hotel.stripe_session_audit IS 'Auditoría de sesiones Stripe creadas para cada intento de pago';
COMMENT ON COLUMN hotel.reservations.payment_failure_count IS 'Número de intentos de pago fallidos para esta reservación';
COMMENT ON COLUMN hotel.reservations.last_payment_attempt_at IS 'Última vez que se intentó procesar un pago';