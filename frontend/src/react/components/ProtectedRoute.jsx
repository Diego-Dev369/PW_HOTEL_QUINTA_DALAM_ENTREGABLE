import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * @param {object} props
 * @param {boolean} [props.requireAdmin]
 * @param {string[]} [props.allowedRoles] — ejemplo: ["ADMIN","RECEPTION"]
 */
export default function ProtectedRoute({ requireAdmin = false, allowedRoles = null }) {
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

  const roles = user?.roles || [];

  if (requireAdmin && !roles.includes('ADMIN')) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const ok = allowedRoles.some((r) => roles.includes(r));
    if (!ok) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
