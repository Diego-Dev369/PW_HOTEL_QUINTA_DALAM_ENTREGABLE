import { motion } from 'framer-motion';
import CTA from '../components/CTA';
import { useLanguage } from '../context/LanguageContext.jsx';

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
  const { t } = useLanguage();

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">Hotel Quinta Dalam</span>
          <h1 className="page-hero__title">
            {t.aboutPage.title} <em>{t.aboutPage.titleEm}</em>
          </h1>
          <p className="page-hero__subtitle">{t.aboutPage.subtitle}</p>
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
              <motion.span className="section__eyebrow" variants={fadeUp}>{t.aboutPage.legacy}</motion.span>
              <motion.h2 className="section__title" id="h2-historia-familia" variants={fadeUp}>
                {t.aboutPage.title} <em>{t.aboutPage.titleEm}</em>
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
                  {t.aboutPage.caption}
                </figcaption>
              </motion.figure>

              <motion.div className="historia-family__content" variants={fadeUp}>
                <p className="historia-family__lead">
                  {t.aboutPage.lead}
                </p>
                <p className="historia-family__text">
                  {t.aboutPage.p1}
                </p>
                <p className="historia-family__text">
                  {t.aboutPage.p2}
                </p>
                <p className="historia-family__text">
                  {t.aboutPage.p3}
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
              <span className="section__eyebrow">{t.aboutPage.who}</span>
              <h2 className="section__title" id="h2-mision">
                {t.aboutPage.missionVision} <em>{t.aboutPage.visionEm}</em>
              </h2>
              <motion.span className="section__ornament" aria-hidden="true" variants={fadeUp}>
                ✦ ─── ✦ ─── ✦
              </motion.span>
            </motion.div>

            <motion.article className="nosotros-split" aria-label="Misión del hotel" variants={fadeUp}>
              <div className="nosotros-split__icon" aria-hidden="true"><i className="fa-solid fa-heart"></i></div>
              <div className="nosotros-split__content">
                <h3 className="nosotros-split__title">{t.aboutPage.missionTitle} <em>{t.aboutPage.missionEm}</em></h3>
                <p className="nosotros-split__text">
                  {t.aboutPage.missionText}
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
                <h3 className="nosotros-split__title">{t.aboutPage.visionTitle} <em>{t.aboutPage.visionEm}</em></h3>
                <p className="nosotros-split__text">
                  {t.aboutPage.visionText}
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
              <span className="section__eyebrow section__eyebrow--gold">{t.aboutPage.valuesEyebrow}</span>
              <h2 className="section__title" id="h2-valores" style={{ color: 'var(--color-parchment-light)' }}>
                {t.aboutPage.valuesTitle} <em>{t.aboutPage.valuesEm}</em>
              </h2>
              <span className="section__ornament" aria-hidden="true">✦ ─── ✦ ─── ✦</span>
            </motion.div>

            <motion.div className="valores__grid" variants={staggerContainer}>
              <motion.article className="valor-card" variants={fadeUp}>
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-handshake"></i>
                </div>
                <h3 className="valor-card__title">{t.aboutPage.values[0].title}</h3>
                <p className="valor-card__text">
                  {t.aboutPage.values[0].text}
                </p>
              </motion.article>

              <motion.article className="valor-card" variants={fadeUp}>
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-leaf"></i>
                </div>
                <h3 className="valor-card__title">{t.aboutPage.values[1].title}</h3>
                <p className="valor-card__text">
                  {t.aboutPage.values[1].text}
                </p>
              </motion.article>

              <motion.article className="valor-card" variants={fadeUp}>
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-palette"></i>
                </div>
                <h3 className="valor-card__title">{t.aboutPage.values[2].title}</h3>
                <p className="valor-card__text">
                  {t.aboutPage.values[2].text}
                </p>
              </motion.article>

              <motion.article className="valor-card" variants={fadeUp}>
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-gem"></i>
                </div>
                <h3 className="valor-card__title">{t.aboutPage.values[3].title}</h3>
                <p className="valor-card__text">
                  {t.aboutPage.values[3].text}
                </p>
              </motion.article>
            </motion.div>
          </div>
        </motion.section>

        <CTA />
      </motion.main>
    </>
  );
}
