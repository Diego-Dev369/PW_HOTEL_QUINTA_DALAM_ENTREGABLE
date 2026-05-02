SET search_path TO hotel, public;

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

  NEW.subtotal_amount := NEW.nightly_rate_amount * v_nights;
  NEW.taxes_amount := COALESCE(NEW.taxes_amount, 0);
  NEW.total_amount := COALESCE(NEW.total_amount, NEW.subtotal_amount + NEW.taxes_amount);

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION hotel.fn_audit_reservation_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO hotel.reservation_status_history(reservation_id, old_status, new_status, reason)
    VALUES (NEW.id, NULL, NEW.status, 'Creación');
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO hotel.reservation_status_history(reservation_id, old_status, new_status, reason)
    VALUES (NEW.id, OLD.status, NEW.status, NEW.cancellation_reason);

    IF NEW.status = 'CANCELLED' AND NEW.cancelled_at IS NULL THEN
      NEW.cancelled_at := NOW();
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
