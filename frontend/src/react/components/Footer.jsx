import { Link } from 'react-router-dom';
import logoImg from '../../assets/icons/posible_logo.jpeg';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Footer() {
  const { t } = useLanguage();

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
          <h2 className="footer__brand-name">Hotel Quinta Dalam</h2>
          <p className="footer__brand-tagline">{t.boutiqueHotel}</p>
          <p className="footer__brand-desc">{t.footer.desc}</p>
        </div>

        <nav aria-label={t.footer.sitemap}>
          <p className="footer__nav-title">{t.footer.explore}</p>
          <ul className="footer__nav-list">
            <li><Link to="/habitaciones" className="footer__nav-link">{t.rooms}</Link></li>
            <li><Link to="/reservaciones" className="footer__nav-link">{t.footer.reservations}</Link></li>
            <li><Link to="/nosotros" className="footer__nav-link">{t.about}</Link></li>
            <li><Link to="/contacto" className="footer__nav-link">{t.contact}</Link></li>
          </ul>
        </nav>

        <div>
          <p className="footer__nav-title">{t.contact}</p>
          <address className="footer__address">
            <p>
              <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
              Morelia, Michoacan, Mexico
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
          <p className="footer__nav-title">{t.footer.social}</p>
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
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          <small>&copy; 2026 Hotel Quinta Dalam. {t.footer.copyright}</small>
        </p>
        <div className="footer__certifications">
          <a href="https://jigsaw.w3.org/css-validator/check/referer" target="_blank" rel="noopener">
            <img
              style={{ border: 0, width: '88px', height: '31px' }}
              src="https://jigsaw.w3.org/css-validator/images/vcss"
              alt="CSS valido"
            />
          </a>

          <a href="https://validator.w3.org/check?uri=referer" target="_blank" rel="noopener">
            <img
              style={{ border: 0, width: '88px', height: '31px' }}
              src="https://www.w3.org/Icons/valid-xhtml10"
              alt="HTML5 valido"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
