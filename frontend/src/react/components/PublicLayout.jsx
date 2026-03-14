import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <>
      <Header />
      {/* El Outlet renderiza el contenido dinámico de cada página (Home, Habitaciones, etc.) */}
      <Outlet />
      <Footer />
    </>
  );
}