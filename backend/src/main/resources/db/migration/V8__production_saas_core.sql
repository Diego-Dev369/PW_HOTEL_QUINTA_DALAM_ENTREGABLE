SET search_path TO hotel, public;

-- Solo ampliación de ENUMs (transacción aislada: el uso de valores nuevos va en migraciones siguientes).

DO $$
BEGIN
  ALTER TYPE hotel.role_code ADD VALUE IF NOT EXISTS 'RECEPTION';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TYPE hotel.reservation_status ADD VALUE IF NOT EXISTS 'PARTIALLY_PAID';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
