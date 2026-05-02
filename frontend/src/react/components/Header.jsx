import { NavLink, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext.jsx';

import logoImg from '../../assets/icons/posible_logo.jpeg';
import banderaMex from '../../assets/icons/bandera_mexico.png';
import banderaEu from '../../assets/icons/bandera_eu.png';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="20" height="20">
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="20" height="20">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const profileRef = useRef(null);
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Mi cuenta';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const closeMobileMenu = () => {
    const checkbox = document.getElementById('nav-toggle');
    if (checkbox) checkbox.checked = false;
    setProfileMenuOpen(false);
  };

  return (
    <>
      <input type="checkbox" id="nav-toggle" className="header__nav-toggle-input" hidden />
      
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        
        <div className="header__brand">
          <Link to="/" className="header__logo-link" aria-label="Hotel Quinta Dalam - Inicio" onClick={closeMobileMenu}>
            <img src={logoImg} alt="Logo Hotel Quinta Dalam" className="header__logo-img" width="44" height="44" />
            <div className="header__logo-text">
              <span className="header__logo-name">Hotel Quinta Dalam</span>
              <span className="header__logo-tagline">Hotel Boutique</span>
            </div>
          </Link>
        </div>

        <nav className="header__nav" aria-label="Navegación principal">
          <ul className="header__menu">
            <li><NavLink to="/habitaciones" onClick={closeMobileMenu} className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>Habitaciones</NavLink></li>
            <li><NavLink to="/nosotros" onClick={closeMobileMenu} className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>Nosotros</NavLink></li>
            <li><NavLink to="/contacto" onClick={closeMobileMenu} className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>Contacto</NavLink></li>
          </ul>

          <div className="header__mobile-actions">
            {isAuthenticated ? (
              <>
                <Link to="/mi-cuenta" onClick={closeMobileMenu} className="header__mobile-login">Mi cuenta</Link>
                <Link to="/mis-reservaciones" onClick={closeMobileMenu} className="header__mobile-login">Mis reservaciones</Link>
                <button type="button" onClick={() => { closeMobileMenu(); logout(); }} className="header__mobile-login">Cerrar Sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMobileMenu} className="header__mobile-login">Iniciar Sesión</Link>
                <Link to="/registro" onClick={closeMobileMenu} className="header__mobile-login">Registrarse</Link>
              </>
            )}
            <Link to="/reservaciones" onClick={closeMobileMenu} className="header__mobile-cta">Reservar Ahora</Link>
            
            {/* ── Extras Móvil (Idiomas y Redes) ── */}
            <div className="header__mobile-extras">
              <div className="header__mobile-lang">
                <a href="#" className="header__lang-switch">
                  <img src={banderaMex} alt="ES" className="header__flag" width="18" height="12" /> ES
                </a>
                <span className="header__divider" aria-hidden="true"></span>
                <a href="#" className="header__lang-switch">
                  <img src={banderaEu} alt="EN" className="header__flag" width="18" height="12" /> EN
                </a>
              </div>
              
              <div className="header__mobile-socials">
                <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
              </div>
            </div>
            {/* ──────────────────────────────────── */}
          </div>
        </nav>

        <div className="header__actions">
          <a href="#" className="header__lang-switch">
            <img src={banderaMex} alt="ES" className="header__flag" width="18" height="12" /> ES
          </a>
          <span className="header__divider" aria-hidden="true"></span>
          <a href="#" className="header__lang-switch">
            <img src={banderaEu} alt="EN" className="header__flag" width="18" height="12" /> EN
          </a>

          {isAuthenticated ? (
            <div className="header__profile" ref={profileRef}>
              <button type="button" className="header__login header__profile-trigger" onClick={() => setProfileMenuOpen((open) => !open)}>
                {displayName} <i className={`fa-solid ${profileMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true"></i>
              </button>
              {profileMenuOpen && (
                <div className="header__profile-menu">
                  <Link to="/mi-cuenta" className="header__profile-item" onClick={closeMobileMenu}>Mi cuenta</Link>
                  <Link to="/mis-reservaciones" className="header__profile-item" onClick={closeMobileMenu}>Mis reservaciones</Link>
                  {(user?.roles || []).includes('ADMIN') && (
                    <Link to="/admin/dashboard" className="header__profile-item" onClick={closeMobileMenu}>Panel admin</Link>
                  )}
                  <button type="button" className="header__profile-item header__profile-item--danger" onClick={() => { closeMobileMenu(); logout(); }}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="header__login"> Iniciar Sesión </Link>
              <Link to="/registro" className="header__login"> Registrarse </Link>
            </>
          )}
          <Link to="/reservaciones" className="header__cta"> Reservar </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <button 
            className="header__theme-toggle" 
            onClick={toggleTheme} 
            aria-label="Cambiar tema" 
            style={{ background: 'none', border: 'none', color: '#C9973A', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', marginRight: '0.5rem' }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <label 
            htmlFor="nav-toggle" className="header__hamburger" style={{ marginLeft: 0 }}
            aria-label="Abrir menú de navegación"
          >
            <span className="header__hamburger-bar"></span>
            <span className="header__hamburger-bar"></span>
            <span className="header__hamburger-bar"></span>
          </label>
        </div>
      </header>
    </>
  );
}
