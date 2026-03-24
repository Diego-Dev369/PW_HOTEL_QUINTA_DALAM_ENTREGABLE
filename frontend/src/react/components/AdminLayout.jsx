import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
    const location = useLocation();

    const breadcrumbs = {
        "/admin/dashboard": "Dashboard",
        "/admin/reservaciones": "Reservaciones",
        "/admin/habitaciones": "Habitaciones",
        "/admin/inicio": "Editor — Página de Inicio",
        "/admin/nosotros": "Editor — Nosotros",
        "/admin/contacto": "Editor — Contacto",
        "/admin/usuarios": "Usuarios",
    };

    const currentBreadcrumb = breadcrumbs[location.pathname] || "Panel";

    return (
        <div className="admin-body">
        {/* ── SIDEBAR GLOBAL ── */}
        <aside className="admin-sidebar">
            <div className="admin-sidebar__header">
            <div className="admin-sidebar__brand">
                <span className="admin-sidebar__brand-icon">✦</span>
                <div>
                <p className="admin-sidebar__brand-name">Quinta Dalam</p>
                <p className="admin-sidebar__brand-role">Panel de Control</p>
                </div>
            </div>
            </div>

            <nav className="admin-nav" aria-label="Navegación del panel">
            <p className="admin-nav__group-label">General</p>
            <ul className="admin-nav__list">
                <li>
                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                    isActive
                        ? "admin-nav__link admin-nav__link--active"
                        : "admin-nav__link"
                    }
                >
                    <i className="fa-solid fa-gauge-high"></i>
                    <span>Dashboard</span>
                </NavLink>
                </li>
                <li>
                <NavLink
                    to="/admin/reservaciones"
                    className={({ isActive }) =>
                    isActive
                        ? "admin-nav__link admin-nav__link--active"
                        : "admin-nav__link"
                    }
                >
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>Reservaciones</span>
                </NavLink>
                </li>
            </ul>

            <p className="admin-nav__group-label">Contenido</p>
            <ul className="admin-nav__list">
                <li>
                <NavLink
                    to="/admin/habitaciones"
                    className={({ isActive }) =>
                    isActive
                        ? "admin-nav__link admin-nav__link--active"
                        : "admin-nav__link"
                    }
                >
                    <i className="fa-solid fa-bed"></i>
                    <span>Habitaciones</span>
                </NavLink>
                </li>
                <li>
                <NavLink
                    to="/admin/inicio"
                    className={({ isActive }) =>
                    isActive
                        ? "admin-nav__link admin-nav__link--active"
                        : "admin-nav__link"
                    }
                >
                    <i className="fa-solid fa-house"></i>
                    <span>Página de Inicio</span>
                </NavLink>
                </li>
                <li>
                <NavLink
                    to="/admin/nosotros"
                    className={({ isActive }) =>
                    isActive
                        ? "admin-nav__link admin-nav__link--active"
                        : "admin-nav__link"
                    }
                >
                    <i className="fa-solid fa-heart"></i>
                    <span>Nosotros</span>
                </NavLink>
                </li>
                <li>
                <NavLink
                    to="/admin/contacto"
                    className={({ isActive }) =>
                    isActive
                        ? "admin-nav__link admin-nav__link--active"
                        : "admin-nav__link"
                    }
                >
                    <i className="fa-solid fa-location-dot"></i>
                    <span>Contacto</span>
                </NavLink>
                </li>
            </ul>

            <p className="admin-nav__group-label">Sistema</p>
            <ul className="admin-nav__list">
                <li>
                <NavLink
                    to="/admin/usuarios"
                    className={({ isActive }) =>
                    isActive
                        ? "admin-nav__link admin-nav__link--active"
                        : "admin-nav__link"
                    }
                >
                    <i className="fa-solid fa-users-gear"></i>
                    <span>Usuarios</span>
                </NavLink>
                </li>
            </ul>
            </nav>

            <div className="admin-sidebar__footer">
            <Link to="/" className="admin-sidebar__view-site" target="_blank">
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Ver sitio
                web
            </Link>
            <Link to="/login" className="admin-sidebar__logout">
                <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
            </Link>
            </div>
        </aside>

        {/* ── CONTENEDOR PRINCIPAL ── */}
        <div className="admin-layout">
            <header className="admin-topbar">
            <div className="admin-topbar__breadcrumb">
                <Link to="/admin/dashboard">Panel</Link>
                <i className="fa-solid fa-chevron-right"></i>
                {/* Breadcrumb dinámico */}
                <span className="admin-topbar__breadcrumb-current">
                {currentBreadcrumb}
                </span>
            </div>
            </header>

            <Outlet />
        </div>
        </div>
    );
}
