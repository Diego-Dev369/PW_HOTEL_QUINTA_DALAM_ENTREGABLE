import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import roomUruapan from '../../assets/images/rooms/204-uruapan.jpeg';
import roomPatzcuaro from '../../assets/images/rooms/104-patzcuaro.jpeg';
import roomParacho from '../../assets/images/rooms/102-paracho.jpeg';
import roomYunuen from '../../assets/images/rooms/103-yunuen.jpeg';
import roomCuanajo from '../../assets/images/rooms/207-cuanajo.jpeg';
import roomTlalpujagua from '../../assets/images/rooms/205-tlalpujagua.jpeg';

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
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


export default function Habitaciones() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">Nuestras Suites</span>
          <h1 className="page-hero__title">Descanso y <em>Tradición</em></h1>
          <p className="page-hero__subtitle">
            Cada espacio ha sido diseñado para reflejar la esencia de Michoacán,
            combinando artesanía local con el máximo confort contemporáneo.
          </p>
          <span className="page-hero__ornament" aria-hidden="true">✦ ─── ✦ ─── ✦</span>
        </div>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <motion.section
          className="section section--cream rooms-page"
          aria-labelledby="h2-suites"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          {...inView}
        >
          <div className="container">
            <motion.div className="section__header" variants={fadeUp}>
              <span className="section__eyebrow">Disponibilidad</span>
              <h2 className="section__title" id="h2-suites">Elige tu <em>Suite</em></h2>
              <p className="section__subtitle">Cada habitación lleva el nombre de un Pueblo Mágico de Michoacán</p>
              <span className="section__ornament" aria-hidden="true">✦ ─── ✦ ─── ✦</span>
            </motion.div>
          </div>

          <div className="container">
            <motion.div
              className="rooms-page__list"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              {...inView}
            >
              {/* Suite Uruapan */}
              <motion.article className="room-row" id="suite-uruapan" variants={fadeUp}>
                <div className="room-row__left">
                  <div className="room-card">
                    <div className="room-card__img-wrap">
                      <img src={roomUruapan} alt="Suite Uruapan" className="room-card__img" loading="lazy" width="600" height="450" />
                      <span className="room-card__badge">Suite Deluxe</span>
                    </div>
                    <div className="room-card__body">
                      <h3 className="room-card__title">Uruapan</h3>
                      <em className="room-card__sub">Naturaleza &amp; Tradición</em>
                      <p className="room-card__desc">Frescura, armonía y descanso entre ecos de bosque y artesanía local.</p>
                      <ul className="room-card__amenities">
                        <li className="room-card__amenity" title="Wi-Fi incluido"><i className="fa-solid fa-wifi" aria-hidden="true"></i></li>
                        <li className="room-card__amenity" title="Aire acondicionado"><i className="fa-solid fa-snowflake" aria-hidden="true"></i></li>
                        <li className="room-card__amenity" title="Desayuno incluido"><i className="fa-solid fa-mug-hot" aria-hidden="true"></i></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="room-row__right">
                  <h3 className="room-row__title">Suite <em>Uruapan</em></h3>
                  <p className="room-row__text">
                    Equipada con detalles en madera tallada a mano y textiles originarios de la región purépecha.
                  </p>
                  <div className="room-row__specs">
                    <span><i className="fa-solid fa-user-group" aria-hidden="true"></i> 2 Personas</span>
                    <span><i className="fa-solid fa-bed" aria-hidden="true"></i> 1 King Size</span>
                    <span><i className="fa-solid fa-expand" aria-hidden="true"></i> 28 m²</span>
                  </div>
                  <div className="room-row__action">
                    <div className="room-row__price">
                      <small>Tarifa por noche</small>
                      <strong>$2,500 <span>MXN</span></strong>
                    </div>
                    <Link to="/reservaciones" className="btn btn--primary">Reservar Ahora</Link>
                  </div>
                </div>
              </motion.article>

              {/* Suite Yunuen */}
            <motion.article className="room-row" id="suite-yunuen" variants={fadeUp}>
              <div className="room-row__left">
                <div className="room-card">
                  <div className="room-card__img-wrap">
                    <img
                      src={roomYunuen}
                      alt="Suite Yunuen — habitación con vista al jardín"
                      className="room-card__img"
                      loading="lazy"
                      width="600"
                      height="450"
                    />
                    <span className="room-card__badge">Suite Deluxe</span>
                  </div>
                  <div className="room-card__body">
                    <h3 className="room-card__title">Yunuen</h3>
                    <em className="room-card__sub">Lago &amp; Serenidad</em>
                    <p className="room-card__desc">
                      Calma lacustre y paz profunda inspirada en la isla de Janitzio.
                    </p>
                    <ul
                      className="room-card__amenities"
                      aria-label="Amenidades de la Suite Yunuen"
                    >
                      <li className="room-card__amenity" title="Wi-Fi incluido">
                        <i className="fa-solid fa-wifi" aria-hidden="true"></i>
                      </li>
                      <li className="room-card__amenity" title="Aire acondicionado">
                        <i className="fa-solid fa-snowflake" aria-hidden="true"></i>
                      </li>
                      <li className="room-card__amenity" title="Desayuno incluido">
                        <i className="fa-solid fa-mug-hot" aria-hidden="true"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="room-row__right">
                <h3 className="room-row__title">Suite <em>Yunuen</em></h3>
                <p className="room-row__text">
                  Inspirada en la tranquilidad de las islas del lago de
                  Pátzcuaro, esta suite combina tonos tierra con piezas
                  artesanales únicas. Un espacio íntimo diseñado para el
                  descanso absoluto, con iluminación cálida y acabados naturales
                  que evocan la orilla del lago.
                </p>
                <div className="room-row__specs">
                  <span>
                    <i className="fa-solid fa-user-group" aria-hidden="true"></i> 2
                    Personas
                  </span>
                  <span>
                    <i className="fa-solid fa-bed" aria-hidden="true"></i> 1 King
                    Size
                  </span>
                  <span>
                    <i className="fa-solid fa-expand" aria-hidden="true"></i> 30
                    m²
                  </span>
                </div>
                <div className="room-row__action">
                  <div className="room-row__price">
                    <small>Tarifa por noche</small>
                    <strong>$2,700 <span>MXN</span></strong>
                  </div>
                  <Link to="/reservaciones" className="btn btn--primary">
                    Reservar Ahora
                  </Link>
                </div>
              </div>
            </motion.article>

            {/* Suite Pátzcuaro */}
            <motion.article className="room-row" id="suite-patzcuaro" variants={fadeUp}>
              <div className="room-row__left">
                <div className="room-card room-card--featured">
                  <div className="room-card__img-wrap">
                    <img
                      src={roomPatzcuaro}
                      alt="Suite Pátzcuaro — suite superior con elegancia colonial"
                      className="room-card__img"
                      loading="lazy"
                      width="600"
                      height="450"
                    />
                    <span className="room-card__badge">Suite Superior</span>
                  </div>
                  <div className="room-card__body">
                    <h3 className="room-card__title">Pátzcuaro</h3>
                    <em className="room-card__sub">Historia &amp; Elegancia</em>
                    <p className="room-card__desc">
                      Elegancia clásica y serenidad a orillas del lago más
                      místico de México.
                    </p>
                    <ul
                      className="room-card__amenities"
                      aria-label="Amenidades de la Suite Pátzcuaro"
                    >
                      <li className="room-card__amenity" title="Wi-Fi incluido">
                        <i className="fa-solid fa-wifi" aria-hidden="true"></i>
                      </li>
                      <li className="room-card__amenity" title="Aire acondicionado">
                        <i className="fa-solid fa-snowflake" aria-hidden="true"></i>
                      </li>
                      <li className="room-card__amenity" title="Desayuno incluido">
                        <i className="fa-solid fa-mug-hot" aria-hidden="true"></i>
                      </li>
                      <li className="room-card__amenity" title="Tina de baño">
                        <i className="fa-solid fa-bath" aria-hidden="true"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="room-row__right">
                <h3 className="room-row__title">Suite <em>Pátzcuaro</em></h3>
                <p className="room-row__text">
                  Nuestra suite más emblemática rinde homenaje a la ciudad
                  colonial más bella de Michoacán. Con vigas de madera
                  originales, tapetes artesanales y una tina de baño de cantera
                  rosada, esta suite eleva cada instante a una experiencia de
                  lujo auténtico.
                </p>
                <div className="room-row__specs">
                  <span>
                    <i className="fa-solid fa-user-group" aria-hidden="true"></i> 2
                    Personas
                  </span>
                  <span>
                    <i className="fa-solid fa-bed" aria-hidden="true"></i> 1 King
                    Size
                  </span>
                  <span>
                    <i className="fa-solid fa-expand" aria-hidden="true"></i> 35
                    m²
                  </span>
                  <span>
                    <i className="fa-solid fa-bath" aria-hidden="true"></i> Tina
                    incluida
                  </span>
                </div>
                <div className="room-row__action">
                  <div className="room-row__price">
                    <small>Tarifa por noche</small>
                    <strong>$3,200 <span>MXN</span></strong>
                  </div>
                  <Link to="/reservaciones" className="btn btn--primary">
                    Reservar Ahora
                  </Link>
                </div>
              </div>
            </motion.article>

            {/* Suite Tlalpujagua */}
            <motion.article className="room-row" id="suite-tlalpujagua" variants={fadeUp}>
              <div className="room-row__left">
                <div className="room-card">
                  <div className="room-card__img-wrap">
                    <img
                      src={roomTlalpujagua}
                      alt="Suite Tlalpujagua — decoración artesanal con esferas navideñas"
                      className="room-card__img"
                      loading="lazy"
                      width="600"
                      height="450"
                    />
                    <span className="room-card__badge">Suite Estudio</span>
                  </div>
                  <div className="room-card__body">
                    <h3 className="room-card__title">Tlalpujagua</h3>
                    <em className="room-card__sub">Color &amp; Artesanía</em>
                    <p className="room-card__desc">
                      Vivacidad, color y el espíritu artesanal de la capital de
                      las esferas.
                    </p>
                    <ul
                      className="room-card__amenities"
                      aria-label="Amenidades de la Suite Tlalpujagua"
                    >
                      <li className="room-card__amenity" title="Wi-Fi incluido">
                        <i className="fa-solid fa-wifi" aria-hidden="true"></i>
                      </li>
                      <li className="room-card__amenity" title="Aire acondicionado">
                        <i className="fa-solid fa-snowflake" aria-hidden="true"></i>
                      </li>
                      <li className="room-card__amenity" title="Desayuno incluido">
                        <i className="fa-solid fa-mug-hot" aria-hidden="true"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="room-row__right">
                <h3 className="room-row__title">Suite <em>Tlalpujagua</em></h3>
                <p className="room-row__text">
                  Decorada con las icónicas esferas de vidrio soplado del pueblo
                  mágico homónimo, esta suite celebra el color y la creatividad
                  michoacana. Un refugio alegre y cálido, perfecto para quienes
                  buscan una estancia con personalidad y carácter propio.
                </p>
                <div className="room-row__specs">
                  <span>
                    <i className="fa-solid fa-user-group" aria-hidden="true"></i> 2
                    Personas
                  </span>
                  <span>
                    <i className="fa-solid fa-bed" aria-hidden="true"></i> 1 Queen
                    Size
                  </span>
                  <span>
                    <i className="fa-solid fa-expand" aria-hidden="true"></i> 26
                    m²
                  </span>
                </div>
                <div className="room-row__action">
                  <div className="room-row__price">
                    <small>Tarifa por noche</small>
                    <strong>$2,500 <span>MXN</span></strong>
                  </div>
                  <Link to="/reservaciones" className="btn btn--primary">
                    Reservar Ahora
                  </Link>
                </div>
              </div>
            </motion.article>

            {/* Suite Cuanajo */}
            <motion.article className="room-row" id="suite-cuanajo" variants={fadeUp}>
              <div className="room-row__left">
                <div className="room-card">
                  <div className="room-card__img-wrap">
                    <img
                      src={roomCuanajo}
                      alt="Suite Cuanajo — vista interior con decoración michoacana"
                      className="room-card__img"
                      loading="lazy"
                      width="600"
                      height="450"
                    />
                    <span className="room-card__badge">Suite Deluxe</span>
                  </div>
                  <div className="room-card__body">
                    <h3 className="room-card__title">Cuanajo</h3>
                    <em className="room-card__sub">Naturaleza &amp; Tradición</em>
                    <p className="room-card__desc">
                      Frescura, armonía y descanso entre ecos de bosque y
                      artesanía local.
                    </p>
                    <ul
                      className="room-card__amenities"
                      aria-label="Amenidades de la Suite Cuanajo"
                    >
                      <li className="room-card__amenity" title="Wi-Fi incluido">
                        <i className="fa-solid fa-wifi" aria-hidden="true"></i>
                      </li>
                      <li className="room-card__amenity" title="Aire acondicionado">
                        <i className="fa-solid fa-snowflake" aria-hidden="true"></i>
                      </li>
                      <li className="room-card__amenity" title="Desayuno incluido">
                        <i className="fa-solid fa-mug-hot" aria-hidden="true"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="room-row__right">
                <h3 className="room-row__title">Suite <em>Cuanajo</em></h3>
                <p className="room-row__text">
                  Equipada con detalles en madera tallada a mano y textiles
                  originarios de la región purépecha. Su distribución ofrece un
                  ambiente de relajación total, ideal para quienes buscan
                  escapar del ruido y disfrutar de una noche de sueño reparador
                  entre aromas de bosque.
                </p>
                <div className="room-row__specs">
                  <span>
                    <i className="fa-solid fa-user-group" aria-hidden="true"></i> 4
                    Personas
                  </span>
                  <span>
                    <i className="fa-solid fa-bed" aria-hidden="true"></i> 2
                    matrimoniales
                  </span>
                  <span>
                    <i className="fa-solid fa-expand" aria-hidden="true"></i> 28
                    m²
                  </span>
                </div>
                <div className="room-row__action">
                  <div className="room-row__price">
                    <small>Tarifa por noche</small>
                    <strong>$1,700 <span>MXN</span></strong>
                  </div>
                  <Link to="/reservaciones" className="btn btn--primary">
                    Reservar Ahora
                  </Link>
                </div>
              </div>
            </motion.article>

            {/* Suite Paracho */}
            <motion.article className="room-row" id="suite-paracho" variants={fadeUp}>
              <div className="room-row__left">
                <div className="room-card">
                  <div className="room-card__img-wrap">
                    <img
                      src={roomParacho}
                      alt="Suite Paracho — vista interior con decoración michoacana"
                      className="room-card__img"
                      loading="lazy"
                      width="600"
                      height="450"
                    />
                    <span className="room-card__badge">Suite Deluxe</span>
                  </div>
                  <div className="room-card__body">
                    <h3 className="room-card__title">Paracho</h3>
                    <em className="room-card__sub">Sofisticación &amp; Cultura</em>
                    <p className="room-card__desc">
                      Frescura, armonía y descanso entre ecos de bosque y
                      artesanía local.
                    </p>
                    <ul
                      className="room-card__amenities"
                      aria-label="Amenidades de la Suite Paracho"
                    >
                      <li className="room-card__amenity" title="Wi-Fi incluido">
                        <i className="fa-solid fa-wifi" aria-hidden="true"></i>
                      </li>
                      <li className="room-card__amenity" title="Aire acondicionado">
                        <i className="fa-solid fa-snowflake" aria-hidden="true"></i>
                      </li>
                      <li className="room-card__amenity" title="Desayuno incluido">
                        <i className="fa-solid fa-mug-hot" aria-hidden="true"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="room-row__right">
                <h3 className="room-row__title">Suite <em>Paracho</em></h3>
                <p className="room-row__text">
                  Equipada con detalles en madera tallada a mano y textiles
                  originarios de la región purépecha. Su distribución ofrece un
                  ambiente de relajación total, ideal para quienes buscan
                  escapar del ruido y disfrutar de una noche de sueño reparador
                  entre aromas de bosque.
                </p>
                <div className="room-row__specs">
                  <span>
                    <i className="fa-solid fa-user-group" aria-hidden="true"></i> 4
                    Personas
                  </span>
                  <span>
                    <i className="fa-solid fa-bed" aria-hidden="true"></i> 2
                    matrimoniales
                  </span>
                  <span>
                    <i className="fa-solid fa-expand" aria-hidden="true"></i> 28
                    m²
                  </span>
                </div>
                <div className="room-row__action">
                  <div className="room-row__price">
                    <small>Tarifa por noche</small>
                    <strong>$3,100 <span>MXN</span></strong>
                  </div>
                  <Link to="/reservaciones" className="btn btn--primary">
                    Reservar Ahora
                  </Link>
                </div>
              </div>
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
              <span className="section__eyebrow section__eyebrow--gold">¿Lista tu suite favorita?</span>
              <h2 className="cta-band__title">Confirma tu <em>reservación</em></h2>
              <p className="cta-band__desc">Disponibilidad limitada. Asegura tu estancia hoy.</p>
            </div>
            <div className="cta-band__actions">
              <Link to="/reservaciones" className="btn btn--primary">Ver disponibilidad</Link>
              <Link to="/contacto" className="btn btn--ghost">Contáctanos</Link>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </>
  );
}
