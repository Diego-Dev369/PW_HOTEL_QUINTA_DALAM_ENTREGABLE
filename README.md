# Hotel Quinta Dalam - Cloud Deployment (AWS)

Sistema web hotelero con frontend React/Vite y backend Spring Boot, desplegado en AWS.

## Arquitectura actual

- Frontend: AWS Amplify
- API pública HTTPS: AWS CloudFront
- Backend origen: AWS Elastic Beanstalk (Spring Boot, puerto 5000)
- Base de datos: Amazon RDS PostgreSQL (schema `hotel`)
- Pagos: Stripe (checkout + webhook)

Flujo:

`Amplify (SPA) -> CloudFront (HTTPS) -> Elastic Beanstalk -> RDS PostgreSQL`

## URLs actuales

- Frontend: `https://migration-main-to-cloud.du4ip4vy4x6rx.amplifyapp.com`
- API (HTTPS): `https://dxdh4cii3hm04.cloudfront.net`
- Backend origen (EB): `http://quintadalamhotel.us-east-1.elasticbeanstalk.com`

## Stack técnico

- Frontend: React 18, Vite 5, Axios, React Router, SCSS, Framer Motion
- Backend: Java, Spring Boot 3.4.4, Spring Security, JPA/Hibernate, Flyway
- DB: PostgreSQL
- Infra: Amplify, CloudFront, Elastic Beanstalk, RDS

## Estructura principal

- `frontend/` SPA React
- `backend/` API Spring Boot
- `backend/src/main/resources/db/migration/` migraciones Flyway
- `scripts/` scripts operativos
- `docs/` documentación técnica y runbooks

## Variables de entorno clave

### Frontend (Amplify)

- `VITE_API_BASE_URL=https://dxdh4cii3hm04.cloudfront.net`
- `VITE_API_TIMEOUT_MS=20000` (opcional)

### Backend (Elastic Beanstalk)

- `SPRING_PROFILES_ACTIVE=prod`
- `SERVER_PORT=5000`
- `DB_URL=jdbc:postgresql://<rds-endpoint>:5432/postgres`
- `DB_USERNAME=<usuario_db>`
- `DB_PASSWORD=<password_db>`
- `JWT_SECRET=<secreto_fuerte>`
- `APP_CORS_ALLOWED_ORIGINS=<origenes_frontend>`
- `APP_FRONTEND_BASE_URL=<url_frontend>`
- `PAYMENT_STRIPE_MODE=test|live`
- `PAYMENT_STRIPE_SECRET_KEY=<stripe_sk_...>`
- `PAYMENT_WEBHOOK_SECRET=<whsec_...>`
- `MANAGEMENT_HEALTH_MAIL_ENABLED=false` (temporal si SMTP no está listo)

## Build y empaquetado

### Backend

```powershell
cd backend
mvnw.cmd clean package -DskipTests
```

Artefacto: `backend/target/*.jar`

### Frontend

```powershell
cd frontend
npm install
npm run build
```

## Despliegue (resumen)

1. Actualizar código en repositorio.
2. Generar nuevo `.jar` backend.
3. Desplegar jar en Elastic Beanstalk.
4. Confirmar logs Flyway + `actuator/health`.
5. Desplegar frontend en Amplify (si hubo cambios front).
6. Verificar llamadas del front a CloudFront (HTTPS).

## Migraciones importantes recientes

- `V13__seed_default_admin.sql`: crea/actualiza admin por defecto.
- `V14__repair_rooms_seed_and_reactivate.sql`: repara habitaciones seed y re-activa suites con soft-delete.

## Usuario admin por defecto

- Email: `admin@quintadalam.local`
- Password: `Admin12345`

Recomendación: cambiar contraseña al primer inicio.

## Verificaciones rápidas

- Health API: `GET /actuator/health` -> `{"status":"UP"}`
- Rooms públicas: `GET /api/v1/rooms`
- Login: `POST /api/v1/auth/login`

## Troubleshooting

### 1) Front en blanco / error HTTPS en producción

Síntoma: `VITE_API_BASE_URL debe usar HTTPS en produccion.`

Acción:
- Configurar `VITE_API_BASE_URL` con URL HTTPS (CloudFront).
- Redeploy en Amplify.

### 2) 502 en Elastic Beanstalk

Síntoma: Nginx `connect() failed (111) ... 127.0.0.1:5000`.

Acción:
- Revisar `web.stdout.log` para causa real del crash.
- Corregir variables (`DB_URL`, `JWT_SECRET`, etc).

### 3) Habitaciones no cargan en nube

Síntoma: frontend muestra que no hay habitaciones.

Causas típicas:
- suites en `hotel.rooms` con `deleted_at` (soft-delete),
- drift de datos en `room_rates`.

Acción:
- desplegar migración `V14__repair_rooms_seed_and_reactivate.sql`.
- verificar endpoint `GET /api/v1/rooms`.

### 4) Health DOWN por correo

Síntoma: `/actuator/health` DOWN por `mail`.

Acción:
- temporal: `MANAGEMENT_HEALTH_MAIL_ENABLED=false`
- definitivo: configurar SMTP real con credenciales válidas.

## Seguridad mínima recomendada

- Rotar secretos expuestos (DB, JWT, Stripe).
- Mantener CORS restringido al frontend real.
- Configurar WAF/rate-limit en edge según presupuesto.
- Mantener backups y restauración validados en RDS.

## Notas académicas

Este repositorio y su documentación técnica cubren la práctica de Cómputo en la Nube (Unidad 5), incluyendo:
- planeación,
- selección de nube,
- despliegue,
- validación operativa.
