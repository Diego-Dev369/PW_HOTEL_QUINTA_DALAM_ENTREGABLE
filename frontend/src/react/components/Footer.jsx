import { Link } from 'react-router-dom';
import logoImg from '../../assets/icons/posible_logo.jpeg';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <img
            src={logoImg}
            alt="Logo Hotel Quinta Dalam"
            className="footer__brand-logo"
            width="52"
            height="52"
          />
          <p className="footer__brand-name">Hotel Quinta Dalam</p>
          <p className="footer__brand-tagline">Pueblos Mágicos · Michoacán</p>
          <p className="footer__brand-desc">
            Un refugio colonial donde la tradición y el lujo se encuentran en el
            corazón de Michoacán.
          </p>
        </div>

        <nav aria-label="Mapa del sitio">
          <p className="footer__nav-title">Explore</p>
          <ul className="footer__nav-list">
            <li><Link to="/habitaciones" className="footer__nav-link">Habitaciones</Link></li>
            <li><Link to="/reservaciones" className="footer__nav-link">Reservaciones</Link></li>
            <li><Link to="/nosotros" className="footer__nav-link">Nosotros</Link></li>
            <li><Link to="/contacto" className="footer__nav-link">Contacto</Link></li>
          </ul>
        </nav>

        <div>
          <p className="footer__nav-title">Contacto</p>
          <address className="footer__address">
            <p>
              <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
              Morelia, Michoacán, México
            </p>
            <p>
              <i className="fa-solid fa-phone" aria-hidden="true"></i>
              <a href="tel:+524430000000">+52 443 000 0000</a>
            </p>
            <p>
              <i className="fa-solid fa-envelope" aria-hidden="true"></i>
              <a href="mailto:reservas@quintadalam.mx">reservas@quintadalam.mx</a>
            </p>
          </address>
        </div>

        <div>
          <p className="footer__nav-title">Redes Sociales</p>
          <div className="footer__social-links">
            <a
              href="https://www.facebook.com/profile.php?id=61584681841684"
              className="footer__social-link"
              aria-label="Facebook de Hotel Quinta Dalam"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.instagram.com/quintadalam"
              className="footer__social-link"
              aria-label="Instagram de Hotel Quinta Dalam"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.tiktok.com/@quintadalam"
              className="footer__social-link"
              aria-label="TikTok de Hotel Quinta Dalam"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-tiktok" aria-hidden="true"></i>
            </a>
          </div>

          {/*<p className="footer__newsletter-label">Suscríbete</p>
          <div className="footer__newsletter-form">
            <label htmlFor="newsletter-email" className="visually-hidden">Correo electrónico</label>
            <input
              type="email"
              id="newsletter-email"
              name="newsletter-email"
              className="footer__newsletter-input"
              placeholder="tu@email.com"
              autoComplete="email"
            />
            <button
              type="button"
              className="footer__newsletter-btn"
              aria-label="Suscribirse"
            >
              →
            </button>
          </div>*/}
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          <small>&copy; 2026 Hotel Quinta Dalam. Todos los derechos reservados.</small>
        </p>
        <div className="footer__certifications">
          <p>
            <a href="https://validator.w3.org/check?uri=referer">
              <img src="https://www.w3.org/Icons/valid-html401" alt="Valid HTML 4.01 Transitional" height="31" width="88" />
            </a>
          </p>
          <p>
            <a href="https://jigsaw.w3.org/css-validator/check/referer">
              <img
                style={{ border: 0, width: '88px', height: '31px' }}
                src="https://jigsaw.w3.org/css-validator/images/vcss"
                alt="¡CSS Válido!"
              />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}