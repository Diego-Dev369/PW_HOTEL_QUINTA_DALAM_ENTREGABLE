-- Run as PostgreSQL superuser in production bootstrap only.

-- Application user with limited privileges.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'qd_app_user') THEN
    CREATE ROLE qd_app_user LOGIN PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
  END IF;
END$$;

-- Read-only user for reports and BI.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'qd_readonly_user') THEN
    CREATE ROLE qd_readonly_user LOGIN PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
  END IF;
END$$;

GRANT CONNECT ON DATABASE quinta_dalam_db TO qd_app_user, qd_readonly_user;

\c quinta_dalam_db

GRANT USAGE ON SCHEMA hotel TO qd_app_user, qd_readonly_user;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA hotel TO qd_app_user;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA hotel TO qd_app_user;

GRANT SELECT ON ALL TABLES IN SCHEMA hotel TO qd_readonly_user;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA hotel TO qd_readonly_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA hotel
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO qd_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA hotel
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO qd_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA hotel
  GRANT SELECT ON TABLES TO qd_readonly_user;
