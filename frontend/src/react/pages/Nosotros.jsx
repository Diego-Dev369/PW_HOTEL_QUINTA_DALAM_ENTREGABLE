import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import exteriorHotel from '../../assets/images/exteriores/exterior_hotel_dalam.jpg';

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
};

const inView = { viewport: { once: true, margin: '-50px' } };

export default function Nosotros() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">Hotel Quinta Dalam</span>
          <h1 className="page-hero__title">
            Nuestra <em>Historia</em>
          </h1>
          <p className="page-hero__subtitle">Pasión por Michoacán, vocación por la hospitalidad</p>
          <span className="page-hero__ornament" aria-hidden="true">✦ ─── ✦ ─── ✦</span>
        </div>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <section className="section historia-family" style={{ backgroundColor: 'var(--color-surface)' }} aria-labelledby="h2-historia-familia">
          <div className="container">
            <motion.div
              className="section__header"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              {...inView}
            >
              <motion.span className="section__eyebrow" variants={fadeUp}>Legado Familiar</motion.span>
              <motion.h2 className="section__title" id="h2-historia-familia" variants={fadeUp}>
                Nuestra <em>Historia</em>
              </motion.h2>
              <motion.span className="section__ornament" aria-hidden="true" variants={fadeUp}>
                ✦ ─── ✦ ─── ✦
              </motion.span>
            </motion.div>

            <motion.div
              className="historia-family__editorial"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              {...inView}
            >
              <motion.figure className="historia-family__hero-img" variants={fadeUp}>
                <img
                  src={exteriorHotel}
                  alt="Exterior majestuoso del Hotel Quinta Dalam al atardecer"
                  className="historia-family__image-main"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="historia-family__caption">
                  El refugio familiar que se transformó en un tributo a Michoacán.
                </figcaption>
              </motion.figure>

              <motion.div className="historia-family__content" variants={fadeUp}>
                <p className="historia-family__lead">
                  Quinta Dalam nace en Quencio, un pueblito pintoresco de Michoacán con un hermoso
                  nacimiento de agua.
                </p>
                <p className="historia-family__text">
                  Originalmente concebido por Daniel, un joven visionario, y su padre Roberto, el
                  proyecto comenzó como un hogar familiar destinado a dejar una huella positiva,
                  más allá de lo lucrativo. Años de esfuerzo y desvelos levantaron este edificio frente
                  al manantial, sin romper la armonía del pueblo.
                </p>
                <p className="historia-family__text">
                  Aunque el proyecto sobrevivió al inicio de la pandemia, tristemente Daniel y Laura
                  fueron víctimas mortales de la misma, dejando luto en la familia Medina.
                </p>
                <p className="historia-family__text">
                  En un acto de amor puro, Roberto continuó la obra de su hijo, plasmando en cada
                  habitación un pedazo de Michoacán (Morelia, Uruapan, Pátzcuaro, Tlalpujahua,
                  Paracho, Tzintzuntzan, Coeneo y la suite principal Quencio) y el espíritu
                  inquebrantable de la familia. Hoy, Quinta Dalam es un refugio de paz, tradición y
                  amor que honra su memoria.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.section
          className="section"
          style={{ backgroundColor: 'var(--color-bg-alt)' }}
          aria-labelledby="h2-mision"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          {...inView}
        >
          <div className="container">
            <motion.div className="section__header" variants={fadeUp}>
              <span className="section__eyebrow">Quiénes Somos</span>
              <h2 className="section__title" id="h2-mision">
                Misión &amp; <em>Visión</em>
              </h2>
              <motion.span className="section__ornament" aria-hidden="true" variants={fadeUp}>
                ✦ ─── ✦ ─── ✦
              </motion.span>
            </motion.div>

            <motion.article className="nosotros-split" aria-label="Misión del hotel" variants={fadeUp}>
              <div className="nosotros-split__icon" aria-hidden="true"><i className="fa-solid fa-heart"></i></div>
              <div className="nosotros-split__content">
                <h3 className="nosotros-split__title">Nuestra <em>Misión</em></h3>
                <p className="nosotros-split__text">
                  Brindar una experiencia de hospitalidad auténtica que celebre la riqueza cultural
                  de los Pueblos Mágicos de Michoacán. Cada detalle de nuestra casa refleja el
                  compromiso con la tradición, el arte local y el bienestar de cada huésped.
                </p>
              </div>
            </motion.article>

            <motion.div className="nosotros-split__divider" aria-hidden="true" variants={fadeUp}>✦</motion.div>

            <motion.article
              className="nosotros-split nosotros-split--reverse"
              aria-label="Visión del hotel"
              variants={fadeUp}
            >
              <div className="nosotros-split__icon" aria-hidden="true"><i className="fa-solid fa-star"></i></div>
              <div className="nosotros-split__content">
                <h3 className="nosotros-split__title">Nuestra <em>Visión</em></h3>
                <p className="nosotros-split__text">
                  Ser el referente de hospitalidad boutique en Michoacán, reconocidos por
                  preservar el patrimonio cultural mientras ofrecemos experiencias que conectan a
                  nuestros huéspedes con la esencia profunda de esta tierra mágica.
                </p>
              </div>
            </motion.article>
          </div>
        </motion.section>

        <motion.section
          className="section section--dark"
          aria-labelledby="h2-valores"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          {...inView}
        >
          <div className="container">
            <motion.div className="section__header section__header--light" variants={fadeUp}>
              <span className="section__eyebrow section__eyebrow--gold">Lo que nos define</span>
              <h2 className="section__title" id="h2-valores" style={{ color: 'var(--color-parchment-light)' }}>
                Nuestros <em>Valores</em>
              </h2>
              <span className="section__ornament" aria-hidden="true">✦ ─── ✦ ─── ✦</span>
            </motion.div>

            <motion.div className="valores__grid" variants={staggerContainer}>
              <motion.article className="valor-card" variants={fadeUp}>
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-handshake"></i>
                </div>
                <h3 className="valor-card__title">Hospitalidad</h3>
                <p className="valor-card__text">
                  Cada huésped es parte de nuestra familia. El calor michoacano en cada gesto.
                </p>
              </motion.article>

              <motion.article className="valor-card" variants={fadeUp}>
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-leaf"></i>
                </div>
                <h3 className="valor-card__title">Sustentabilidad</h3>
                <p className="valor-card__text">
                  Compromiso con el medio ambiente y las comunidades locales de Michoacán.
                </p>
              </motion.article>

              <motion.article className="valor-card" variants={fadeUp}>
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-palette"></i>
                </div>
                <h3 className="valor-card__title">Cultura</h3>
                <p className="valor-card__text">
                  Preservamos y celebramos las tradiciones artesanales y gastronómicas del estado.
                </p>
              </motion.article>

              <motion.article className="valor-card" variants={fadeUp}>
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-gem"></i>
                </div>
                <h3 className="valor-card__title">Excelencia</h3>
                <p className="valor-card__text">
                  Estándares de calidad que elevan cada detalle de tu experiencia.
                </p>
              </motion.article>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="cta-band"
          aria-label="Llamada a reservar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          {...inView}
        >
          <div className="cta-band__inner">
            <div className="cta-band__text">
              <span className="section__eyebrow section__eyebrow--gold">Ven a conocernos</span>
              <h2 className="cta-band__title">Reserva tu <em>experiencia</em></h2>
              <p className="cta-band__desc">Descubre de cerca lo que nos hace únicos en Michoacán.</p>
            </div>
            <div className="cta-band__actions">
              <Link to="/reservaciones" className="btn btn--primary">Reservar ahora</Link>
              <Link to="/contacto" className="btn btn--ghost-light">Contáctanos</Link>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </>
  );
}