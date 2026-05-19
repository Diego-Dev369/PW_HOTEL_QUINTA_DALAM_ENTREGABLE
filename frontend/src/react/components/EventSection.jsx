import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import eventGarden from '../../assets/images/exteriores/exterior_hotel_dalam.jpg';
import { useLanguage } from '../context/LanguageContext.jsx';

const inView = { viewport: { once: true, margin: '-40px' } };

export default function EventSection() {
  const { t } = useLanguage();

  return (
    <section className="events-highlight section section--cream" id="eventos">
      <div className="container">
        <motion.article
          className="events-highlight__card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          {...inView}
        >
          <div className="events-highlight__media">
            <img
              src={eventGarden}
              alt={t.event.alt}
              className="events-highlight__image"
              loading="lazy"
            />
          </div>

          <div className="events-highlight__content">
            <span className="section__eyebrow">{t.event.eyebrow}</span>
            <h2 className="section__title">
              {t.event.title} <em>{t.event.titleEm}</em>
            </h2>
            <p className="events-highlight__copy">
              {t.event.copy}
            </p>
            <Link to="/contacto" className="btn btn--primary">
              {t.event.button}
            </Link>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
