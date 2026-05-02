ALTER TABLE hotel.users
  ALTER COLUMN email TYPE VARCHAR(255) USING email::text;

ALTER TABLE hotel.reservations
  ALTER COLUMN guest_email TYPE VARCHAR(255) USING guest_email::text;
