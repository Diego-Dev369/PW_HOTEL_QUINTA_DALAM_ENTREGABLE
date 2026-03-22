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