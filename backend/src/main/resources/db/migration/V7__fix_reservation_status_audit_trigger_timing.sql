SET search_path TO hotel, public;

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
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reservation_status_audit ON hotel.reservations;
CREATE TRIGGER trg_reservation_status_audit
AFTER INSERT OR UPDATE OF status, cancellation_reason
ON hotel.reservations
FOR EACH ROW
EXECUTE FUNCTION hotel.fn_audit_reservation_status();
