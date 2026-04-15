import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import eventGarden from '../../assets/images/exteriores/exterior_hotel_dalam.jpg';

const inView = { viewport: { once: true, margin: '-40px' } };

export default function EventSection() {
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
              alt="Jardín principal de Quinta Dalam para eventos"
              className="events-highlight__image"
              loading="lazy"
            />
          </div>

          <div className="events-highlight__content">
            <span className="section__eyebrow">Eventos Boutique</span>
            <h2 className="section__title">
              Celebra en nuestro <em>Jardín</em>
            </h2>
            <p className="events-highlight__copy">
              Si estás pensando en organizar tu evento en un hermoso jardín y aún no sabes dónde... Ven a Quinta Dalam. Contamos con el lugar indicado.
            </p>
            <Link to="/contacto" className="btn btn--primary">
              Cotizar evento
            </Link>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
