SET search_path TO hotel, public;

INSERT INTO hotel.rooms (code, name, subtitle, category, description, capacity, size_m2, bed_type, status, is_featured)
VALUES
  ('suite-uruapan', 'Suite Uruapan', 'Naturaleza y descanso', 'Suite Superior', 'Suite inspirada en la frescura de Uruapan.', 2, 28.00, '1 King Size', 'ACTIVE', TRUE),
  ('suite-patzcuaro', 'Suite Patzcuaro', 'Historia y lago', 'Suite Superior', 'Suite elegante con esencia de Patzcuaro.', 2, 30.00, '1 King Size', 'ACTIVE', TRUE),
  ('suite-paracho', 'Suite Paracho', 'Madera y tradicion', 'Suite Doble', 'Suite doble con acabados artesanales.', 4, 32.00, '2 Matrimoniales', 'ACTIVE', FALSE),
  ('suite-yunuen', 'Suite Yunuen', 'Serenidad lacustre', 'Suite Superior', 'Suite tranquila para estancias romanticas.', 2, 27.00, '1 Queen Size', 'ACTIVE', FALSE),
  ('suite-tlalpujagua', 'Suite Tlalpujagua', 'Color y artesania', 'Suite Junior', 'Suite calida con identidad local.', 2, 25.00, '1 Queen Size', 'ACTIVE', FALSE),
  ('suite-cuanajo', 'Suite Cuanajo', 'Calidez en madera', 'Suite Doble', 'Suite amplia para familias pequenas.', 4, 34.00, '2 Matrimoniales', 'ACTIVE', FALSE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO hotel.room_rates (room_id, valid_during, nightly_rate_amount, currency, note)
SELECT r.id, daterange(DATE '2025-01-01', DATE '2035-01-01', '[)'), v.price, 'MXN', 'Tarifa base seed'
FROM (
  VALUES
    ('suite-uruapan', 3200.00::numeric),
    ('suite-patzcuaro', 3400.00::numeric),
    ('suite-paracho', 3000.00::numeric),
    ('suite-yunuen', 2800.00::numeric),
    ('suite-tlalpujagua', 2600.00::numeric),
    ('suite-cuanajo', 3100.00::numeric)
) AS v(code, price)
JOIN hotel.rooms r ON r.code = v.code
WHERE NOT EXISTS (
  SELECT 1
  FROM hotel.room_rates rr
  WHERE rr.room_id = r.id
    AND rr.deleted_at IS NULL
    AND rr.valid_during && daterange(DATE '2025-01-01', DATE '2035-01-01', '[)')
);
