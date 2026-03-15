// ============================================================
//  PublicLayout.jsx — Quinta Dalam (Refactorizado v2)
//  Layout de las páginas públicas. Incluye:
//   - Navbar con botón Dark Mode toggle
//   - Detección de scroll para clase --scrolled
//   - Outlet para páginas hijas
//   - Footer
//
//  UBICACIÓN: src/react/components/PublicLayout.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import logoImg from '../../assets/icons/posible_logo.jpeg';

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

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        {/* Brand */}
        <div className="footer__brand">
          <span className="footer__brand-name">Quinta Dalam</span>
          <span className="footer__brand-tagline">Hotel Boutique · Michoacán</span>
          <p className="footer__brand-desc">
            Hospitalidad boutique en el corazón de los Pueblos Mágicos, donde la tradición colonial se encuentra con el diseño contemporáneo.
          </p>
        </div>

        {/* Nav */}
        <nav aria-label="Mapa del sitio">
          <p className="footer__nav-title">Navegación</p>
          <ul className="footer__nav-list">
            {[
              { to: '/',              label: 'Inicio' },
              { to: '/habitaciones',  label: 'Habitaciones' },
              { to: '/nosotros',      label: 'Nosotros' },
              { to: '/contacto',      label: 'Contacto' },
              { to: '/reservaciones', label: 'Reservaciones' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer__nav-link">{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Dirección */}
        <address className="footer__address">
          <p>
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
            <span>Meseta Purépecha, Michoacán, México</span>
          </p>
          <p>
            <i className="fa-solid fa-phone" aria-hidden="true"></i>
            <a href="tel:+524431234567">+52 443 123 4567</a>
          </p>
          <p>
            <i className="fa-solid fa-envelope" aria-hidden="true"></i>
            <a href="mailto:hola@quintadalam.mx">hola@quintadalam.mx</a>
          </p>
        </address>

        {/* Social */}
        <div>
          <div className="footer__social-links">
            {[
              { href: '#', icon: 'fa-brands fa-instagram', label: 'Instagram' },
              { href: '#', icon: 'fa-brands fa-facebook',  label: 'Facebook' },
              { href: '#', icon: 'fa-brands fa-tiktok',    label: 'TikTok' },
            ].map(({ href, icon, label }) => (
              <a key={label} href={href} className="footer__social-link"
                aria-label={label} target="_blank" rel="noopener noreferrer">
                <i className={icon} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__copyright">
          <small>© {new Date().getFullYear()} Hotel Quinta Dalam. Todos los derechos reservados.</small>
        </div>
        <div className="footer__certifications" aria-label="Certificaciones web">
          <a
            href="https://validator.w3.org/check?uri=referer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Certificación HTML en W3C Validator"
          >
            <img
              src="https://www.w3.org/Icons/valid-html401"
              alt="Valid HTML 4.01 Transitional"
              width="88"
              height="31"
              loading="lazy"
            />
          </a>
          <a
            href="https://jigsaw.w3.org/css-validator/check/referer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Certificación CSS en W3C Validator"
          >
            <img
              src="https://jigsaw.w3.org/css-validator/images/vcss"
              alt="¡CSS Válido!"
              width="88"
              height="31"
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

// ── PublicLayout ──────────────────────────────────────────────
export default function PublicLayout() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled]   = useState(false);

  // Detectar scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/',              label: 'Inicio' },
    { to: '/habitaciones',  label: 'Habitaciones' },
    { to: '/nosotros',      label: 'Nosotros' },
    { to: '/contacto',      label: 'Contacto' },
    { to: '/admin/dashboard', label: 'Admin', admin: true },
  ];

  return (
    <>
      {/* Checkbox invisible para toggle mobile sin JS extra */}
      <input
        type="checkbox"
        id="nav-toggle"
        className="header__nav-toggle-input"
        aria-hidden="true"
      />

      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        {/* Brand */}
        <div className="header__brand">
          <Link
            to="/"
            className="header__logo-link"
            onClick={() => (document.getElementById('nav-toggle').checked = false)}
          >
            <img
              src={logoImg}
              alt="Logo Hotel Quinta Dalam"
              className="header__logo-img"
            />
            <div className="header__logo-text">
              <span className="header__logo-name">Quinta Dalam</span>
              <span className="header__logo-tagline">Hotel Boutique</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="header__nav" aria-label="Menú principal">
          <ul className="header__menu">
            {navLinks.map(({ to, label, admin }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `header__link${isActive ? ' header__link--active' : ''}${admin ? ' header__link--admin' : ''}`
                  }
                  onClick={() => (document.getElementById('nav-toggle').checked = false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* Acciones dentro del menú mobile */}
          <div className="header__mobile-actions">
            <Link
              to="/reservaciones"
              className="header__mobile-cta"
              onClick={() => (document.getElementById('nav-toggle').checked = false)}
            >
              Reservar
            </Link>
          </div>
        </nav>

        {/* Acciones desktop */}
        <div className="header__actions">
          <Link to="/login" className="header__login">Acceso</Link>
          <span className="header__divider" aria-hidden="true" />
          <Link to="/reservaciones" className="header__cta">
            Reservar
          </Link>
          <button className="header__theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <button className="header__theme-toggle header__theme-toggle--mobile" onClick={toggleTheme}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Hamburguesa (mobile) */}
        <label
          htmlFor="nav-toggle"
          className="header__hamburger"
          aria-label="Abrir menú"
        >
          <span className="header__hamburger-bar" />
          <span className="header__hamburger-bar" />
          <span className="header__hamburger-bar" />
        </label>
      </header>

      {/* Páginas hijas */}
      <Outlet />

      <Footer />
    </>
  );
}
