// ============================================================
//  App.jsx — Quinta Dalam (Refactorizado v2)
//  Envuelve la aplicación en <ThemeProvider> para que
//  todos los componentes accedan al tema vía useTheme().
//
//  UBICACIÓN: src/App.jsx  (raíz del proyecto)
// ============================================================
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './react/context/ThemeContext.jsx';

import RouteEffects from './react/hooks/RouteEffects.jsx';
import PublicLayout from './react/components/PublicLayout.jsx';
import AdminLayout from './react/components/AdminLayout';
import Home from './react/pages/Home.jsx';

// Páginas públicas (code-splitting)
const Habitaciones = lazy(() => import('./react/pages/Habitaciones.jsx'));
const Nosotros = lazy(() => import('./react/pages/Nosotros.jsx'));
const Contacto = lazy(() => import('./react/pages/Contacto.jsx'));
const Login = lazy(() => import('./react/pages/Login.jsx'));
const Reservaciones = lazy(() => import('./react/pages/Reservaciones.jsx'));
const NotFound = lazy(() => import('./react/pages/NotFound.jsx'));

// Páginas admin (code-splitting)
const AdminIndex = lazy(() => import('./react/pages/admin/AdminIndex.jsx'));
const AdminDashboard = lazy(() => import('./react/pages/admin/AdminDashboard.jsx'));
const AdminReservaciones = lazy(() => import('./react/pages/admin/AdminReservaciones.jsx'));
const AdminHabitaciones = lazy(() => import('./react/pages/admin/AdminHabitaciones.jsx'));
const AdminNosotros = lazy(() => import('./react/pages/admin/AdminNosotros.jsx'));
const AdminContacto = lazy(() => import('./react/pages/admin/AdminContacto.jsx'));
const AdminUsuarios = lazy(() => import('./react/pages/admin/AdminUsuarios.jsx'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas — comparten Navbar + Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/"              element={<Home />} />
          <Route path="/habitaciones"  element={<Habitaciones />} />
          <Route path="/nosotros"      element={<Nosotros />} />
          <Route path="/contacto"      element={<Contacto />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/reservaciones" element={<Reservaciones />} />
        </Route>

        {/* Rutas de administrador — siempre oscuras, sin toggle */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard"    element={<AdminDashboard />} />
          <Route path="reservaciones" element={<AdminReservaciones />} />
          <Route path="habitaciones" element={<AdminHabitaciones />} />
          <Route path="inicio"       element={<AdminIndex />} />
          <Route path="nosotros"     element={<AdminNosotros />} />
          <Route path="contacto"     element={<AdminContacto />} />
          <Route path="usuarios"     element={<AdminUsuarios />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    // ThemeProvider FUERA del Router para envolver todo
    <ThemeProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <RouteEffects />
        <Suspense fallback={null}>
          <AnimatedRoutes />
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
