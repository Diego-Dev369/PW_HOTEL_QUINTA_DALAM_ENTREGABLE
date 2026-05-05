import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();

  const basePath = location.pathname.startsWith('/reception') ? '/reception' : '/admin';

  const breadcrumbs = {
    '/admin/dashboard': 'Dashboard',
    '/admin/reservaciones': 'Reservaciones',
    '/admin/habitaciones': 'Habitaciones',
    '/admin/inicio': 'Editor — Página de Inicio',
    '/admin/nosotros': 'Editor — Nosotros',
    '/admin/contacto': 'Editor — Contacto',
    '/admin/globals': 'Globals',
    '/admin/usuarios': 'Usuarios',
    '/reception/dashboard': 'Recepción — Dashboard',
    '/reception/reservations': 'Recepción — Reservaciones',
  };

  const currentBreadcrumb = breadcrumbs[location.pathname] || 'Panel';

  return (
    <div className="admin-body">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__brand-icon">✦</span>
            <div>
              <p className="admin-sidebar__brand-name">Quinta Dalam</p>
              <p className="admin-sidebar__brand-role">
                {basePath === '/reception' ? 'Recepción & Operaciones' : 'Panel de Control'}
              </p>
            </div>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Navegación del panel">
          <p className="admin-nav__group-label">{basePath === '/reception' ? 'Recepción' : 'General'}</p>
          <ul className="admin-nav__list">
            <li>
              <NavLink
                to={`${basePath}/dashboard`}
                className={({ isActive }) =>
                  isActive ? 'admin-nav__link admin-nav__link--active' : 'admin-nav__link'}
              >
                <i className="fa-solid fa-gauge-high"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={basePath === '/reception' ? `${basePath}/reservations` : `${basePath}/reservaciones`}
                className={({ isActive }) =>
                  isActive ? 'admin-nav__link admin-nav__link--active' : 'admin-nav__link'}
              >
                <i className="fa-solid fa-calendar-check"></i>
                <span>Reservaciones</span>
              </NavLink>
            </li>
          </ul>

          {basePath === '/admin' && (
            <>
              <p className="admin-nav__group-label">Contenido</p>
              <ul className="admin-nav__list">
                <li>
                  <NavLink
                    to="/admin/habitaciones"
                    className={({ isActive }) =>
                      isActive ? 'admin-nav__link admin-nav__link--active' : 'admin-nav__link'}
                  >
                    <i className="fa-solid fa-bed"></i>
                    <span>Habitaciones</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/inicio"
                    className={({ isActive }) =>
                      isActive ? 'admin-nav__link admin-nav__link--active' : 'admin-nav__link'}
                  >
                    <i className="fa-solid fa-house"></i>
                    <span>Página de Inicio</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/nosotros"
                    className={({ isActive }) =>
                      isActive ? 'admin-nav__link admin-nav__link--active' : 'admin-nav__link'}
                  >
                    <i className="fa-solid fa-heart"></i>
                    <span>Nosotros</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/contacto"
                    className={({ isActive }) =>
                      isActive ? 'admin-nav__link admin-nav__link--active' : 'admin-nav__link'}
                  >
                    <i className="fa-solid fa-location-dot"></i>
                    <span>Contacto</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/globals"
                    className={({ isActive }) =>
                      isActive ? 'admin-nav__link admin-nav__link--active' : 'admin-nav__link'}
                  >
                    <i className="fa-solid fa-sliders"></i>
                    <span>Globals</span>
                  </NavLink>
                </li>
              </ul>

              <p className="admin-nav__group-label">Sistema</p>
              <ul className="admin-nav__list">
                <li>
                  <NavLink
                    to="/admin/usuarios"
                    className={({ isActive }) =>
                      isActive ? 'admin-nav__link admin-nav__link--active' : 'admin-nav__link'}
                  >
                    <i className="fa-solid fa-users-gear"></i>
                    <span>Usuarios</span>
                  </NavLink>
                </li>
              </ul>
            </>
          )}

          {basePath === '/reception' && (
            <>
              <p className="admin-nav__group-label">Admin</p>
              <ul className="admin-nav__list">
                <li>
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                      isActive ? 'admin-nav__link admin-nav__link--active' : 'admin-nav__link'}
                  >
                    <i className="fa-solid fa-shield"></i>
                    <span>Ir al panel admin</span>
                  </NavLink>
                </li>
              </ul>
            </>
          )}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__view-site" target="_blank" rel="noreferrer">
            <i className="fa-solid fa-arrow-up-right-from-square"></i> Ver sitio
          </Link>
          <Link to="/login" className="admin-sidebar__logout">
            <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
          </Link>
        </div>
      </aside>

      <div className="admin-layout">
        <header className="admin-topbar">
          <div className="admin-topbar__breadcrumb">
            <Link to={`${basePath}/dashboard`}>Panel</Link>
            <i className="fa-solid fa-chevron-right"></i>
            <span className="admin-topbar__breadcrumb-current">{currentBreadcrumb}</span>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
