SET search_path TO hotel, public;

-- Usuario administrador por defecto (idempotente).
-- Nota: se usa pgcrypto.crypt para guardar hash BCrypt compatible con Spring Security.
INSERT INTO hotel.users (email, password_hash, first_name, last_name, status)
VALUES (
  'admin@quintadalam.local',
  crypt('Admin12345', gen_salt('bf', 10)),
  'Admin',
  'Quinta Dalam',
  'ACTIVE'::hotel.user_status
)
ON CONFLICT (email) DO UPDATE
SET
  password_hash = EXCLUDED.password_hash,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  status = 'ACTIVE'::hotel.user_status,
  updated_at = NOW();

INSERT INTO hotel.user_roles (user_id, role_id)
SELECT u.id, r.id
FROM hotel.users u
JOIN hotel.roles r ON r.code = 'ADMIN'::hotel.role_code
WHERE u.email = 'admin@quintadalam.local'
ON CONFLICT (user_id, role_id) DO NOTHING;
