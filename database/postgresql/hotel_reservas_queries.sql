-- ============================================================
-- Query 1: Habitaciones disponibles en un rango [check_in, check_out)
-- Parámetros:
--   :p_check_in  -> DATE
--   :p_check_out -> DATE
--   :p_guests    -> SMALLINT (opcional, puede ser NULL)
-- ============================================================
SELECT
  r.id,
  r.code,
  r.name,
  r.subtitle,
  r.category,
  r.capacity,
  rr.nightly_rate_amount,
  rr.currency
FROM hotel.rooms r
LEFT JOIN LATERAL (
  SELECT rr1.nightly_rate_amount, rr1.currency
  FROM hotel.room_rates rr1
  WHERE rr1.room_id = r.id
    AND rr1.valid_during @> '2026-05-10'::date
  ORDER BY lower(rr1.valid_during) DESC, rr1.created_at DESC
  LIMIT 1
) rr ON TRUE
WHERE r.status = 'ACTIVE'
  AND r.capacity >= 2
  AND '2026-05-15'::date > '2026-05-10'::date
  AND NOT EXISTS (
    SELECT 1
    FROM hotel.reservations res
    WHERE res.room_id = r.id
      AND res.status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CHECKED_IN')
      AND res.stay_range && daterange('2026-05-10'::date, '2026-05-15'::date, '[)')
  )
ORDER BY r.capacity, r.name;


-- ============================================================
-- Query 2 (opcional): Intento de bloqueo para flujo de creación de reserva
-- Uso sugerido: transacción SERIALIZABLE + INSERT directo en reservations.
-- Si hay colisión, el EXCLUDE CONSTRAINT la rechaza automáticamente.
-- ============================================================
-- BEGIN;
-- SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- INSERT INTO hotel.reservations (...campos...)
-- VALUES (...);
-- COMMIT;

