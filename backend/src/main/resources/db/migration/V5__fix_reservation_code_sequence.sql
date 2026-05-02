SET search_path TO hotel, public;

-- Garantiza que la secuencia exista en el esquema hotel.
CREATE SEQUENCE IF NOT EXISTS hotel.reservation_folio_seq START WITH 1000 INCREMENT BY 1;

-- Recompila la función con referencia schema-qualified para evitar fallos por search_path.
CREATE OR REPLACE FUNCTION hotel.fn_assign_reservation_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.reservation_code IS NULL OR NEW.reservation_code = '' THEN
    NEW.reservation_code :=
      'RES-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' ||
      LPAD(nextval('hotel.reservation_folio_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reservation_code ON hotel.reservations;
CREATE TRIGGER trg_reservation_code
BEFORE INSERT ON hotel.reservations
FOR EACH ROW
EXECUTE FUNCTION hotel.fn_assign_reservation_code();
