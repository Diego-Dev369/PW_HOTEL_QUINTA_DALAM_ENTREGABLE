import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './react/context/ThemeContext';
import { BookingDateProvider } from './react/context/BookingDateContext.jsx';

import RouteEffects from './react/hooks/RouteEffects.jsx';
import Home from './react/pages/Home.jsx';
import Habitaciones from './react/pages/Habitaciones.jsx';
import Nosotros from './react/pages/Nosotros.jsx';
import Contacto from './react/pages/Contacto.jsx';
import Login from './react/pages/Login.jsx';
import Reservaciones from './react/pages/Reservaciones.jsx';
import AdminIndex from './react/pages/admin/AdminIndex.jsx';
import AdminLayout from './react/components/AdminLayout';
import AdminDashboard from './react/pages/admin/AdminDashboard.jsx';
import AdminReservaciones from './react/pages/admin/AdminReservaciones.jsx';
import AdminHabitaciones from './react/pages/admin/AdminHabitaciones.jsx';
import AdminNosotros from './react/pages/admin/AdminNosotros.jsx';
import AdminContacto from './react/pages/admin/AdminContacto.jsx';
import AdminGlobals from './react/pages/admin/AdminGlobals.jsx';
import AdminUsuarios from './react/pages/admin/AdminUsuarios.jsx';
import NotFound from './react/pages/NotFound.jsx';

import PublicLayout from './react/components/PublicLayout.jsx';

export default function App() {  
  return (
    <ThemeProvider>
      <BookingDateProvider>
        <BrowserRouter 
          future={{ 
            v7_startTransition: true, 
            v7_relativeSplatPath: true 
          }}>
          <RouteEffects />
          <Routes>
            {/* Rutas Públicas */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/habitaciones" element={<Habitaciones />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reservaciones" element={<Reservaciones />} />
            </Route>

            {/* Rutas Administrativas */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="reservaciones" element={<AdminReservaciones />} />
              <Route path="habitaciones" element={<AdminHabitaciones />} />
              <Route path="inicio" element={<AdminIndex />} />
              <Route path="nosotros" element={<AdminNosotros />} />
              <Route path="contacto" element={<AdminContacto />} />
              <Route path="globals" element={<AdminGlobals />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BookingDateProvider>
    </ThemeProvider>
  );
}
