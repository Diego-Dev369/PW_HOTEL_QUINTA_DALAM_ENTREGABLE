import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ requireAdmin = false }) {
  const { isAuthenticated, user, initializing } = useAuth();

  if (initializing) {
    return (
      <main className="section section--cream" style={{ paddingTop: '140px', minHeight: '40vh' }}>
        <div className="container">
          <p>Cargando sesión...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    const roles = user?.roles || [];
    if (!roles.includes('ADMIN')) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
