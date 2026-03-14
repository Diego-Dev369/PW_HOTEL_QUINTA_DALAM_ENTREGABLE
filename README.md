# ✦ Hotel Quinta Dalam — Web & Admin Panel

Plataforma integral para el **Hotel Quinta Dalam**, un alojamiento boutique ubicado en los Pueblos Mágicos de Michoacán. Este proyecto incluye tanto la **Landing Page** orientada al cliente (con alto enfoque en UI/UX y diseño premium) como un **Panel de Administración** escalable para la gestión del hotel.

## 🚀 Tecnologías Principales

* **Frontend Framework:** React 18 + Vite
* **Enrutamiento:** React Router DOM v6
* **Estilos:** SASS (SCSS) con arquitectura modular (Variables, Mixins, BEM).
* **Íconos:** Font Awesome 6
* **Arquitectura CSS:** Glassmorphism, CSS Grid/Flexbox, diseño 100% responsivo (Mobile-First).

## 🏗️ Arquitectura del Proyecto

El proyecto está diseñado bajo principios DRY (Don't Repeat Yourself) y separación de responsabilidades:

### Panel de Administración (Arquitectura Senior)
* **`AdminLayout`**: Plantilla maestra que envuelve todas las rutas privadas. Mantiene el estado del `Sidebar` y el `Topbar` intactos durante la navegación, re-renderizando únicamente el `<main>` dinámico vía `<Outlet />`.
* **Componentes Reutilizables**:
    * `<MetricCard />`: Tarjetas de KPI para dashboards.
    * `<ConfirmDeleteModal />`: Modal de advertencia destructiva universal.
    * `<AdminModalBase />`: "Cáscara" base para la inyección de cualquier formulario (usuarios, suites, red social, etc.).
* **Páginas (SPA)**: Dashboard, Habitaciones, Reservaciones, Usuarios y Editores de Contenido (Home, Nosotros, Contacto).

### Interfaz Pública (Boutique UI)
* Uso extensivo de paletas de colores cálidos (`$color-parchment`, `$color-adobe`, `$color-gold`) y tipografías contrastantes (`Playfair Display` para títulos, `Lato` para lectura).
* Vistas clave: Index, Habitaciones, Reservaciones, Login interactivo y Página de Error 404 personalizada.

## 📂 Estructura de Carpetas Principal

```text
frontend/
├── public/                 # Assets estáticos
├── src/
│   ├── assets/             # Imágenes y SVGs del hotel
│   ├── react/
│   │   ├── components/     # Componentes aislados (admin y públicos)
│   │   └── pages/          # Vistas enrutables
│   │       ├── admin/      # Vistas del panel de control
│   │       └── ...         # Vistas públicas (Home, Login, 404, etc.)
│   ├── styles/             # Arquitectura SASS
│   │   ├── abstracts/      # Variables, Mixins globales
│   │   ├── components/     # Estilos por componente
│   │   ├── layout/         # Header, Footer, Admin Sidebar
│   │   └── pages/          # Estilos específicos por vista
│   ├── App.jsx             # Enrutador principal
│   └── main.jsx            # Punto de entrada de React