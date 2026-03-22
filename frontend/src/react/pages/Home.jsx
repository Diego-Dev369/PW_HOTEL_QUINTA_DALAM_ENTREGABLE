import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import roomUruapan    from '../../assets/images/rooms/204-uruapan.jpeg';
import roomPatzcuaro  from '../../assets/images/rooms/104-patzcuaro.jpeg';
import roomParacho    from '../../assets/images/rooms/102-paracho.jpeg';
import ArtesaniaManual from '../../assets/images/interiores/decoracion1.jpeg';
import Paisaje         from '../../assets/images/exteriores/vista_manantial.jpeg';
import Hospitalidad    from '../../assets/images/interiores/sala_vista1.jpeg';
import Gastronomia     from '../../assets/images/interiores/cocina_barra.jpeg';
import ZonaExterior    from '../../assets/images/exteriores/exterior_hotel.jpeg'; 
import salaVista2      from '../../assets/images/interiores/sala_vista2.jpeg';

// ── Variantes de animación reutilizables ──────────────────────
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -22 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 22 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: 'easeOut' } },
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const heroFadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const inView = { viewport: { once: true, margin: '-80px' } };

// ── SUBCOMPONENTES ───────────────────────────────────────────
function SectionHeader({ eyebrow, title, titleEm, subtitle, light = false }) {
  return (
    <motion.div
      className={`section__header${light ? ' section__header--light' : ''}`}
      variants={staggerContainer} initial="hidden" whileInView="show" {...inView}
    >
      <motion.span className="section__eyebrow" variants={fadeUp}>{eyebrow}</motion.span>
      <motion.h2 className="section__title" variants={fadeUp}>
        {title} {titleEm && <em>{titleEm}</em>}
      </motion.h2>
      {subtitle && <motion.p className="section__subtitle" variants={fadeUp}>{subtitle}</motion.p>}
      <motion.span className="section__ornament" aria-hidden="true" variants={fadeUp}>
        ✦ ─── ✦ ─── ✦
      </motion.span>
    </motion.div>
  );
}

function RoomCard({ img, alt, badge, title, sub, desc, amenities, featured = false }) {
  return (
    <motion.article
      className={`room-card${featured ? ' room-card--featured' : ''}`}
      variants={cardFadeUp} whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
    >
      <div className="room-card__img-wrap">
        <img src={img} alt={alt} className="room-card__img" loading="lazy" width="800" height="600" />
        <span className="room-card__badge">{badge}</span>
      </div>
      <div className="room-card__body">
        <h3 className="room-card__title">{title}</h3>
        <em className="room-card__sub">{sub}</em>
        <p className="room-card__desc">{desc}</p>
        <ul className="room-card__amenities" aria-label="Amenidades">
          {amenities.map(({ icon, title: t }) => (
            <li key={t} className="room-card__amenity" title={t}>
              <i className={icon} aria-hidden="true"></i>
            </li>
          ))}
        </ul>
        <Link to="/habitaciones" className="room-card__link btn btn--outline">Ver detalles</Link>
      </div>
    </motion.article>
  );
}

function ServiceCard({ icon, title, text }) {
  return (
    <motion.article
      className="service-card" variants={cardFadeUp} whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 70, damping: 20 }}
    >
      <div className="service-card__icon-wrap">
        <i className={`${icon} service-card__icon`} aria-hidden="true"></i>
      </div>
      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__text">{text}</p>
    </motion.article>
  );
}

function ExpCard({ img, alt, title }) {
  return (
    <motion.article className="exp-card" variants={scaleUp}>
      <div className="exp-card__img-wrap">
        <img src={img} alt={alt} className="exp-card__img" loading="lazy" />
      </div>
      <h3 className="exp-card__title">{title}</h3>
    </motion.article>
  );
}

// ── DATOS ────────────────────────────────────────────────────
const rooms = [
  {
    img: roomUruapan, alt: 'Suite Uruapan', badge: 'Suite Deluxe', title: 'Uruapan', sub: 'Naturaleza & Tradición', desc: 'Frescura, armonía y descanso entre ecos de bosque y artesanía local.',
    amenities: [{ icon: 'fa-solid fa-wifi', title: 'Wi-Fi' }, { icon: 'fa-solid fa-snowflake', title: 'Aire' }, { icon: 'fa-solid fa-mug-hot', title: 'Desayuno' }],
  },
  {
    img: roomPatzcuaro, alt: 'Suite Pátzcuaro', badge: 'Suite Superior', title: 'Pátzcuaro', sub: 'Historia & Elegancia', desc: 'Elegancia clásica y serenidad a orillas del lago más místico de México.', featured: true,
    amenities: [{ icon: 'fa-solid fa-wifi', title: 'Wi-Fi' }, { icon: 'fa-solid fa-snowflake', title: 'Aire' }, { icon: 'fa-solid fa-mug-hot', title: 'Desayuno' }, { icon: 'fa-solid fa-bath', title: 'Tina' }],
  },
  {
    img: roomParacho, alt: 'Suite Paracho', badge: 'Suite Estándar', title: 'Paracho', sub: 'Arte & Autenticidad', desc: 'Artesanía viva, música de fondo y la calidez del pueblo más musical.',
    amenities: [{ icon: 'fa-solid fa-wifi', title: 'Wi-Fi' }, { icon: 'fa-solid fa-snowflake', title: 'Aire' }, { icon: 'fa-solid fa-mug-hot', title: 'Desayuno' }],
  },
];

const services = [
  { icon: 'fa-solid fa-bed', title: 'Habitaciones Premium', text: 'Diseño boutique con máximo confort y detalles artesanales únicos.' },
  { icon: 'fa-solid fa-tree', title: 'Entorno Natural', text: 'Tranquilidad y conexión profunda con la naturaleza michoacana.' },
  { icon: 'fa-solid fa-concierge-bell', title: 'Atención Personalizada', text: 'Hospitalidad auténtica michoacana con calidez y servicio de lujo.' },
  { icon: 'fa-solid fa-utensils', title: 'Desayuno Regional', text: 'Sabores tradicionales que despiertan los sentidos cada mañana.' },
];

const experiences = [
  { img: ArtesaniaManual, alt: 'Artesanía', title: 'Artesanía\nMichoacana' },
  { img: Paisaje, alt: 'Naturaleza', title: 'Naturaleza\nAsombrosa' },
  { img: Hospitalidad, alt: 'Cultura', title: 'Cultura y\nHospitalidad' },
  { img: Gastronomia, alt: 'Gastronomía', title: 'Gastronomía\nRegional' },
];

const lookbook = [
  { src: ArtesaniaManual, alt: 'Sala de estar' }, { src: Paisaje, alt: 'Fachada colonial' }, { src: Hospitalidad, alt: 'Detalles artesanales' },
  { src: Gastronomia, alt: 'Vista al manantial' }, { src: ZonaExterior, alt: 'Interiores acogedores' }, { src: salaVista2, alt: 'Cocina tradicional' },
];

const heroSlides = [
  { src: Paisaje, alt: 'Paisajes naturales' },
  { src: Hospitalidad, alt: 'Sala principal' },
  { src: Gastronomia, alt: 'Interior gastronómico' },
];

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────
export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);

  // Obtener la fecha de hoy en formato YYYY-MM-DD para bloquear fechas pasadas
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const interval = setInterval(() => setHeroIndex((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const activeHero = heroSlides[heroIndex];

  return (
    <motion.main initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.55, ease: 'easeOut' }}>

      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section className="hero" aria-label="Portada principal">
        <div className="hero__overlay" aria-hidden="true" />
        <AnimatePresence initial={false}>
          <motion.img
            key={activeHero.src} src={activeHero.src} alt={activeHero.alt} className="hero__bg" loading={heroIndex === 0 ? 'eager' : 'lazy'}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: [1.01, 1.045, 1.02], x: [0, -4, 0], y: [0, -3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.8 }, scale: { duration: 30, repeat: Infinity, repeatType: 'mirror' } }}
          />
        </AnimatePresence>
        <motion.div className="hero__content" variants={heroStagger} initial="hidden" animate="show">
          <motion.h1 className="hero__title" variants={heroFadeUp}>Vive la Magia<br />de Michoacán</motion.h1>
          <motion.p className="hero__subtitle" variants={heroFadeUp}>Descubre la hospitalidad, artesanía y cultura de los Pueblos Mágicos.</motion.p>
          <motion.div variants={heroFadeUp}>
            <Link to="/reservaciones" className="hero__cta btn btn--primary">Reservar Ahora</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ BARRA DE RESERVAS ══════════════════════════════ */}
      <motion.section aria-label="Búsqueda de disponibilidad" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
        <div className="booking">
          <div className="booking__card">
            <div className="booking__field">
              <label className="booking__label" htmlFor="check-in"><i className="fa-regular fa-calendar"></i>Llegada</label>
              <input type="date" id="check-in" className="booking__input" min={today} />
            </div>
            <div className="booking__divider" />
            <div className="booking__field">
              <label className="booking__label" htmlFor="check-out"><i className="fa-regular fa-calendar-check"></i>Salida</label>
              <input type="date" id="check-out" className="booking__input" min={today} />
            </div>
            <div className="booking__divider" />
            <div className="booking__field">
              <label className="booking__label" htmlFor="guests"><i className="fa-regular fa-user"></i>Huéspedes</label>
              <select id="guests" className="booking__input booking__input--select" defaultValue="2">
                <option value="1">1 Persona</option><option value="2">2 Personas</option><option value="3">3 Personas</option><option value="4">4+ Personas</option>
              </select>
            </div>
            <motion.div whileTap={{ scale: 0.95 }} style={{ display: 'flex' }}>
              <Link to="/reservaciones" className="booking__btn">Buscar</Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══ HABITACIONES ═══════════════════════════════════ */}
      <section className="rooms section" id="habitaciones">
        <SectionHeader eyebrow="Nuestras Suites" title="Habitaciones con" titleEm="Encanto" subtitle="Diseño inspirado en la tradición y el confort contemporáneo" />
        <motion.div className="rooms__grid" variants={staggerContainer} initial="hidden" whileInView="show" {...inView}>
          {rooms.map((room) => <RoomCard key={room.title} {...room} />)}
        </motion.div>
        <motion.div className="rooms__cta-wrap" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} {...inView}>
          <Link to="/habitaciones" className="btn btn--primary">Ver todas las habitaciones</Link>
        </motion.div>
      </section>

      {/* ═══ EXPERIENCIAS ═══════════════════════════════════ */}
      <section className="experiences section--dark" id="experiencias">
        <div className="experiences__inner">
          <SectionHeader eyebrow="La Experiencia Dalam" title="Momentos que" titleEm="Perduran" subtitle="Cada rincón de Michoacán tiene una historia que contarte" />
          <motion.div className="experiences__grid" variants={staggerContainer} initial="hidden" whileInView="show" {...inView}>
            {experiences.map((exp) => <ExpCard key={exp.title} {...exp} />)}
          </motion.div>
        </div>
      </section>

      {/* ═══ SERVICIOS ══════════════════════════════════════ */}
      <section className="services section section--cream" id="servicios">
        <SectionHeader eyebrow="Lo que ofrecemos" title="Servicios de" titleEm="Distinción" subtitle="Todo lo necesario para una estancia verdaderamente inolvidable" />
        <motion.div className="services__grid" variants={staggerContainer} initial="hidden" whileInView="show" {...inView}>
          {services.map((svc) => <ServiceCard key={svc.title} {...svc} />)}
        </motion.div>
      </section>

      {/* ═══ GALERÍA LOOKBOOK ═══════════════════════════════ */}
      <section className="lookbook section section--dark">
        <div className="container">
          <SectionHeader eyebrow="Atmósfera" title="Nuestra" titleEm="Esencia" subtitle="Capturamos los momentos que definen la estancia en Quinta Dalam" />
          <motion.div className="lookbook__grid" variants={staggerContainer} initial="hidden" whileInView="show" {...inView}>
            {lookbook.map(({ src, alt }, i) => (
              <motion.div 
                key={alt} 
                className="lookbook__item" 
                variants={scaleUp} 
                custom={i}
              >
                <img src={src} alt={alt} className="lookbook__img" loading="lazy" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ NOSOTROS PREVIEW ═══════════════════════════════ */}
      <section className="about section section--white" id="sobre-nosotros">
        <div className="about__inner">
          <motion.div className="about__text" variants={staggerContainer} initial="hidden" whileInView="show" {...inView}>
            <motion.span className="section__eyebrow" variants={fadeLeft}>Nuestra Historia</motion.span>
            <motion.h2 className="about__title" variants={fadeLeft}>Una Experiencia <em>Boutique</em> sin igual</motion.h2>
            <motion.p className="about__desc" variants={fadeLeft}>
              Hotel Quinta Dalam nació del amor por la cultura michoacana y el arte de la hospitalidad...
            </motion.p>
            <motion.div variants={fadeLeft}><Link to="/nosotros" className="btn btn--primary">Conocer nuestra historia</Link></motion.div>
          </motion.div>
          <motion.div className="about__media" variants={fadeRight} initial="hidden" whileInView="show" {...inView}>
            <img src={ZonaExterior} alt="Exterior colonial" className="about__img" loading="lazy" />
            <div className="about__badge" aria-hidden="true">
              <span className="about__badge-num">2</span><span className="about__badge-text">años de hospitalidad</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA FINAL ══════════════════════════════════════ */}
      <section className="cta-band">
        <div className="cta-band__inner">
          <motion.div className="cta-band__text" variants={staggerContainer} initial="hidden" whileInView="show" {...inView}>
            <motion.span className="section__eyebrow section__eyebrow--gold" variants={fadeUp}>¿Listo para tu escapada?</motion.span>
            <motion.h2 className="cta-band__title" variants={fadeUp}>Reserva tu estancia <em>perfecta</em></motion.h2>
          </motion.div>
          <motion.div className="cta-band__actions" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} {...inView}>
            <Link to="/reservaciones" className="btn btn--primary">Ver disponibilidad</Link>
            <Link to="/contacto" className="btn btn--ghost-light">Contáctanos</Link>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}