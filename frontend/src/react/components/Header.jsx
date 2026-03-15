import { NavLink, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

// Importaciones de imágenes
import logoImg from '../../assets/icons/posible_logo.jpeg';
import banderaMex from '../../assets/icons/bandera_mexico.png';
import banderaEu from '../../assets/icons/bandera_eu.png';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2"  x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.22" y1="4.22"  x2="7.05" y2="7.05" />
      <line x1="16.95" y1="16.95" x2="19.78" y2="19.78" />
      <line x1="2"  y1="12" x2="6"  y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="7.05" y2="16.95" />
      <line x1="16.95" y1="7.05"  x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <input
        type="checkbox"
        id="nav-toggle"
        className="header__nav-toggle-input"
        hidden
      />
      
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        {/* BRAND / LOGO */}
        <div className="header__brand">
          <Link
            to="/"
            className="header__logo-link"
            aria-label="Hotel Quinta Dalam - Inicio"
            onClick={() => (document.getElementById('nav-toggle').checked = false)}
          >
            <img
              src={logoImg}
              alt="Logo Hotel Quinta Dalam"
              className="header__logo-img"
            />
            <div className="header__logo-text">
              <span className="header__logo-name">Hotel Quinta Dalam</span>
              <span className="header__logo-tagline">Pueblos Mágicos · Michoacán</span>
            </div>
          </Link>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="header__nav" aria-label="Navegación principal">
          <ul className="header__menu">
            <li><NavLink to="/habitaciones" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`} onClick={() => (document.getElementById('nav-toggle').checked = false)}>Habitaciones</NavLink></li>
            <li><a href="/#experiencias" className="header__link" onClick={() => (document.getElementById('nav-toggle').checked = false)}>Experiencias</a></li>
            <li><a href="/#servicios" className="header__link" onClick={() => (document.getElementById('nav-toggle').checked = false)}>Servicios</a></li>
            <li><NavLink to="/nosotros" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`} onClick={() => (document.getElementById('nav-toggle').checked = false)}>Nosotros</NavLink></li>
            <li><NavLink to="/contacto" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`} onClick={() => (document.getElementById('nav-toggle').checked = false)}>Contacto</NavLink></li>
            <li><NavLink to="/admin/dashboard" className={({ isActive }) => `header__link header__link--admin ${isActive ? 'header__link--active' : ''}`} onClick={() => (document.getElementById('nav-toggle').checked = false)}>ADMIN</NavLink></li>
          </ul>

          <div className="header__mobile-actions">
            <Link to="/login" className="header__mobile-login" onClick={() => (document.getElementById('nav-toggle').checked = false)}>Iniciar Sesión</Link>
            <Link to="/reservaciones" className="header__mobile-cta" onClick={() => (document.getElementById('nav-toggle').checked = false)}>Reservar Ahora</Link>
          </div>
        </nav>

        {/* ACCIONES DESKTOP */}
        <div className="header__actions">
          <a href="#" className="header__lang-switch">
            <img src={banderaMex} alt="ES" className="header__flag" width="18" height="12" /> ES
          </a>
          <span className="header__divider" aria-hidden="true"></span>
          <a href="#" className="header__lang-switch">
            <img src={banderaEu} alt="EN" className="header__flag" width="18" height="12" /> EN
          </a>

          <Link to="/login" className="header__login"> Acceso </Link>
          <Link to="/reservaciones" className="header__cta"> Reservar </Link>

          <button className="header__theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <button className="header__theme-toggle header__theme-toggle--mobile" onClick={toggleTheme}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* HAMBURGUESA */}
        <label htmlFor="nav-toggle" className="header__hamburger">
          <span className="header__hamburger-bar"></span>
          <span className="header__hamburger-bar"></span>
          <span className="header__hamburger-bar"></span>
        </label>
      </header>
    </>
  );
}
