# Hotel Quinta Dalam - Web & Admin Panel

Plataforma integral para el Hotel Quinta Dalam, un alojamiento boutique ubicado en los Pueblos Mágicos de Michoacán. Este proyecto incluye tanto la interfaz pública orientada al cliente (Landing Page premium) como un panel administrativo escalable para la gestión operativa del hotel.

## Tecnologías Principales

* Frontend Framework: React 18 + Vite.
* Enrutamiento: React Router DOM v6.
* Animaciones: Framer Motion (Transiciones de página y efectos de scroll).
* Estado Global: React Context API (Gestión del sistema de temas).
* Estilos: SASS (SCSS) con arquitectura modular y Custom Properties para temas dinámicos.
* Iconografía: Font Awesome 6.

## Arquitectura del Proyecto

El proyecto está diseñado bajo principios de escalabilidad y separación de responsabilidades:

### Sistema de Temas Dinámico
* ThemeContext: Proveedor global que gestiona el intercambio entre modo claro y modo oscuro.
* Tematización vía CSS Variables: Implementación técnica en _themes.scss que permite cambios de interfaz en tiempo real sin recargas de página.

### Interfaz Pública (Boutique UI)
* Diseño Responsivo: Adaptabilidad total desde dispositivos móviles hasta pantallas de escritorio.
* Experiencia de Usuario: Galería Lookbook simétrica, Hero animado con cambio de slides y formularios con validación de estados.
* Vistas: Inicio, Habitaciones, Nosotros, Contacto, Reservaciones y Login.

### Panel de Administración
* AdminLayout: Plantilla maestra que gestiona la persistencia de la navegación administrativa mediante el uso de Outlet.
* Componentes Reutilizables:
    * MetricCard: Tarjetas de visualización de métricas y estados.
    * SuiteForm: Formulario dinámico para la gestión de habitaciones.
    * UserModal: Interfaz para la administración de usuarios del sistema.
    * ConfirmDeleteModal: Sistema de confirmación para acciones destructivas.

## Estado de producto (lectura ejecutiva honesta — 2026-05)

Este repositorio ahora incluye núcleos **realmente ejecutables**:

- Migraciones **`V8`–`V10`**: `V8` sólo extiende ENUMs; `V9` núcleo SaaS (ledger, settings, impuestos, `PARTIALLY_PAID` en constraints); `V10` `processed_events.completed`. Rol **`RECEPTION`**, políticas/feature flags/outbox inicial.
- **Fiscal México (MVP técnico)**: `TaxMxService` arma base hospedaje + **IVA 16% / ISH 3% parametrizables** en `hotel_settings.tax.mx`; el total cobrado vía Stripe refleja el gran total MXN.
- **Stripe**: sólo **`checkout.session.completed`** confirma económicamente; `PaymentService` saneado; **`StripeCheckoutCompletionHandler`** escribe ledger + **`ReservationFinanceSynchronizer`** ajusta `PENDING / PARTIAL / CONFIRMED` sin mocks.
- **Recepción / Admin API**: `/api/v1/reception/**` *(ADMIN ó RECEPTION)* y `/api/v1/admin/reservations*` *(ADMIN)* con walk-in, cobros manuales, check-in/out guiados por ledger.
- **Export iCal público**: `GET /api/public/ical/export` *(sin ACL todavía: proteja en Nginx en Internet real)*.

**Aún pendiente antes de llamarlo “lista para facturación empresarial + SaaS público multi-hotel”** (lista no exhaustiva): motor de **reembolsos Stripe** orquestado desde UI/legal, modificaciones/amendments con historia y reprogramaciones completas UI, automatización SMTP/PDF desde `notifications_outbox`, import iCal Airbnb/Booking, auditoría seguridad granular, infra `nginx/systemd`/CI reproducible multi-tenant — ver issues internos siguientes PRs.

> **PostgreSQL Docker:** define siempre `POSTGRES_PASSWORD` en `.env`; el archivo compose incluye un fallback *sólo* para desarrollo.

Para asignar recepción a un usuario tras migración:

```sql
INSERT INTO hotel.user_roles(user_id, role_id)
SELECT u.id, r.id FROM hotel.users u, hotel.roles r
WHERE u.email = 'TU_CORREO' AND r.code = 'RECEPTION'
ON CONFLICT DO NOTHING;
```

## Estructura de Carpetas

```text
src/
├── assets/                 # Recursos gráficos (imágenes, iconos, banderas)
├── react/
│   ├── components/         # Componentes compartidos y layouts (Público/Admin)
│   ├── context/            # Lógica del ThemeProvider (Modo Oscuro)
│   ├── hooks/              # Custom hooks y efectos de ruta
│   └── pages/              # Vistas principales del sistema
│       ├── admin/          # Módulos del panel de control
│       └── ...             # Vistas para el cliente final
├── styles/                 # Arquitectura SASS Modular
│   ├── abstracts/          # Variables, Mixins y Definición de Temas
│   ├── base/               # Estilos globales, Reset y Normalize
│   ├── components/         # Estilos específicos de componentes (Botones, Cards, Forms)
│   ├── layout/             # Estilos de Header, Footer y Estructuras de Layout
│   └── pages/              # Estilos únicos para cada vista del sitio
├── App.jsx                 # Enrutador principal y configuración de AnimatePresence
└── main.jsx                # Punto de entrada de la aplicación
## Estructura General Actual

```text
backend/                    # Spring Boot API REST + Flyway + JWT + Stripe
database/
└── postgresql/             # SQL base y consultas de apoyo
frontend/
└── src/                    # React + SCSS modular
docker-compose.yml          # PostgreSQL + pgAdmin opcional
start-all.ps1               # Arranque integrado local
stop-all.ps1                # Detiene frontend y backend
```

## Levantar Todo Junto (Localhost)

Requisitos: **JDK 21**, **Node.js + npm**, y PostgreSQL accesible en `DB_URL` (por defecto `localhost:5432/quinta_dalam_db`) **o** Docker para `-UseDockerDb`.

`start-all.ps1` crea `.env` desde `.env.example` si falta, carga variables, opcionalmente levanta Postgres en Docker, ejecuta `mvn clean compile`, `flyway:repair`, arranca el backend y **espera** `actuator/health` antes de lanzar Vite.

Desde la raiz del repo:

```powershell
cd C:\ProyectoPW\PW_HOTEL_QUINTA_DALAM_ENTREGABLE
.\start-all.ps1
```

PostgreSQL en Docker (recomendado en Windows):

```powershell
.\start-all.ps1 -UseDockerDb
```

Detener servicios (no detiene Docker salvo flag):

```powershell
.\stop-all.ps1
.\stop-all.ps1 -StopDockerDb
```
