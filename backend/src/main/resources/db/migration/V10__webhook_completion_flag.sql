SET search_path TO hotel, public;

ALTER TABLE hotel.processed_events
  ADD COLUMN IF NOT EXISTS completed BOOLEAN;

UPDATE hotel.processed_events SET completed = TRUE WHERE TRUE;

ALTER TABLE hotel.processed_events
  ALTER COLUMN completed SET NOT NULL;

ALTER TABLE hotel.processed_events
  ALTER COLUMN completed SET DEFAULT FALSE;
