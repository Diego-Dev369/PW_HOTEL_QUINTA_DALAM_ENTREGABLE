import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RouteEffects from './react/hooks/RouteEffects.jsx';
import Home from './react/pages/Home.jsx';
import Habitaciones from './react/pages/Habitaciones.jsx';
import Nosotros from './react/pages/Nosotros.jsx';
import Contacto from './react/pages/Contacto.jsx';
import Login from './react/pages/Login.jsx';
import Reservaciones from './react/pages/Reservaciones.jsx';
import ModalDemo from './react/pages/ModalDemo.jsx';
import AdminIndex from './react/pages/admin/AdminIndex.jsx';
import AdminDashboard from './react/pages/admin/AdminDashboard.jsx';
import AdminReservaciones from './react/pages/admin/AdminReservaciones.jsx';
import AdminHabitaciones from './react/pages/admin/AdminHabitaciones.jsx';
import AdminNosotros from './react/pages/admin/AdminNosotros.jsx';
import AdminContacto from './react/pages/admin/AdminContacto.jsx';
import AdminUsuarios from './react/pages/admin/AdminUsuarios.jsx';
import NotFound from './react/pages/NotFound.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/habitaciones" element={<Habitaciones />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservaciones" element={<Reservaciones />} />
        <Route path="/modal-demo" element={<ModalDemo />} />

        <Route path="/admin" element={<AdminIndex />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reservaciones" element={<AdminReservaciones />} />
        <Route path="/admin/habitaciones" element={<AdminHabitaciones />} />
        <Route path="/admin/nosotros" element={<AdminNosotros />} />
        <Route path="/admin/contacto" element={<AdminContacto />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}