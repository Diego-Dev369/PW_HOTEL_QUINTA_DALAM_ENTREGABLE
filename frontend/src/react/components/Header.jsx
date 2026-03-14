import { NavLink, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import logoImg from '../../assets/icons/posible_logo.jpeg';
import banderaMex from '../../assets/icons/bandera_mexico.png';
import banderaEu from '../../assets/icons/bandera_eu.png';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Checkbox para el menú móvil */}
      <input type="checkbox" id="nav-toggle" className="header__nav-toggle-input" hidden />
      
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header__brand">
          <Link to="/" className="header__logo-link" aria-label="Hotel Quinta Dalam - Inicio">
            <img
              src={logoImg}
              alt="Logo Hotel Quinta Dalam"
              className="header__logo-img"
              width="44"
              height="44"
            />
            <div className="header__logo-text">
              <span className="header__logo-name">Hotel Quinta Dalam</span>
              <span className="header__logo-tagline">Pueblos Mágicos · Michoacán</span>
            </div>
          </Link>
        </div>

        <nav className="header__nav" aria-label="Navegación principal">
          <ul className="header__menu">
            <li>
              <NavLink to="/habitaciones" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>
                Habitaciones
              </NavLink>
            </li>
            <li>
              <a href="/#experiencias" className="header__link">Experiencias</a>
            </li>
            <li>
              <a href="/#servicios" className="header__link">Servicios</a>
            </li>
            <li>
              <NavLink to="/nosotros" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>
                Nosotros
              </NavLink>
            </li>
            <li>
              <NavLink to="/contacto" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>
                Contacto
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>
                aDMIN
              </NavLink>
            </li>
          </ul>

          <div className="header__mobile-actions">
            <Link to="/login" className="header__mobile-login">Iniciar Sesión</Link>
            <Link to="/reservaciones" className="header__mobile-cta">Reservar Ahora</Link>
          </div>
        </nav>

        <div className="header__actions">
          {/* Idioma ES */}
          <a href="#" className="header__lang-switch">
            <img
              src={banderaMex}
              alt="Cambiar idioma a español"
              className="header__flag"
              width="18"
              height="12"
            />
            ES
          </a>

          <span className="header__divider" aria-hidden="true"></span>

          {/* Idioma EN */}
          <a href="#" className="header__lang-switch">
            <img
              src={banderaEu}
              alt="Switch language to English"
              className="header__flag"
              width="18"
              height="12"
            />
            EN
          </a>

          {/* Login */}
          <Link to="/login" className="header__login"> Iniciar Sesión </Link>

          {/* CTA */}
          <Link to="/reservaciones" className="header__cta"> Reservar </Link>
        </div>

        <label htmlFor="nav-toggle" className="header__hamburger">
          <span className="header__hamburger-bar"></span>
          <span className="header__hamburger-bar"></span>
          <span className="header__hamburger-bar"></span>
        </label>
      </header>
    </>
  );
}