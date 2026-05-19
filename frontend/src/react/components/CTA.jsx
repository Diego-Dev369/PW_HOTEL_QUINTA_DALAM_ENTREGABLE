import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.jsx';

const inView = { viewport: { once: true, margin: '-50px' } };

export default function CTA({
  eyebrow,
  titulo,
  descripcion,
  textoBoton1,
  textoBoton2
}) {
  const { t } = useLanguage();
  const finalEyebrow = eyebrow || t.cta.eyebrow;
  const finalTitle = titulo || t.cta.title;
  const finalDescription = descripcion || t.cta.description;
  const finalButton1 = textoBoton1 || t.common.bookNow;
  const finalButton2 = textoBoton2 || t.common.contactUs;

  const formatTitle = (text) => text
    .replace('reservacion', '<em>reservacion</em>')
    .replace('experiencia', '<em>experiencia</em>')
    .replace('experience', '<em>experience</em>');

  return (
    <motion.section
      className="cta-band"
      aria-label={finalTitle}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      {...inView}
    >
      <div className="cta-band__inner">
        <div className="cta-band__text">
          <span className="section__eyebrow section__eyebrow--gold">{finalEyebrow}</span>
          <h2
            className="cta-band__title"
            dangerouslySetInnerHTML={{ __html: formatTitle(finalTitle) }}
          ></h2>
          <p className="cta-band__desc">{finalDescription}</p>
        </div>
        <div className="cta-band__actions">
          <Link to="/reservaciones" className="btn btn--primary">{finalButton1}</Link>
          <Link to="/contacto" className="btn btn--ghost-light">{finalButton2}</Link>
        </div>
      </div>
    </motion.section>
  );
}
