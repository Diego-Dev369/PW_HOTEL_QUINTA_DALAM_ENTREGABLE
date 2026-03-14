import { Link } from 'react-router-dom';
import imgEncabezado from '../../assets/images/img_encabezado.png';
import roomUruapan from '../../assets/images/rooms/204-uruapan.jpeg';
import roomPatzcuaro from '../../assets/images/rooms/104-patzcuaro.jpeg';
import roomParacho from '../../assets/images/rooms/102-paracho.jpeg';

import ArtesaniaManual  from "../../assets/images/interiores/decoracion1.jpeg";
import Paisaje from '../../assets/images/exteriores/vista_manantial.jpeg';
import Hospitalidad from '../../assets/images/interiores/sala_vista1.jpeg';
import Gastronomia from '../../assets/images/interiores/cocina_barra.jpeg';
import ZonaExterior from '../../assets/images/exteriores/exterior_hotel.jpeg';
import salaVista2 from '../../assets/images/interiores/sala_vista2.jpeg';


export default function Home() {
  return (
    <main>
      {/* ═══ HERO ═════════════════════════════════════════════ */}
      <section className="hero" aria-label="Portada principal">
        <div className="hero__overlay" aria-hidden="true"></div>
        <img
          src={imgEncabezado}
          alt="Vista de los Pueblos Mágicos de Michoacán al atardecer"
          className="hero__bg"
        />
        <div className="hero__content">
          <h1 className="hero__title">Vive la Magia<br />de Michoacán</h1>
          <p className="hero__subtitle">
            Descubre la hospitalidad, artesanía y cultura de los Pueblos Mágicos.
          </p>
          <Link to="/reservaciones" className="hero__cta btn btn--primary">
            Reservar Ahora
          </Link>
        </div>
      </section>

      {/* ═══ BARRA DE RESERVAS ════════════════════════════════ */}
      <section aria-label="Búsqueda de disponibilidad">
        <div className="booking">
          <div className="booking__card">
            <div className="booking__field">
              <label className="booking__label" htmlFor="check-in">
                <i className="fa-regular fa-calendar" aria-hidden="true"></i>
                Llegada
              </label>
              <input
                type="date"
                id="check-in"
                name="check-in"
                className="booking__input"
              />
            </div>
            <div className="booking__divider" aria-hidden="true"></div>
            <div className="booking__field">
              <label className="booking__label" htmlFor="check-out">
                <i className="fa-regular fa-calendar-check" aria-hidden="true"></i>
                Salida
              </label>
              <input
                type="date"
                id="check-out"
                name="check-out"
                className="booking__input"
              />
            </div>
            <div className="booking__divider" aria-hidden="true"></div>
            <div className="booking__field">
              <label className="booking__label" htmlFor="guests">
                <i className="fa-regular fa-user" aria-hidden="true"></i>
                Huéspedes
              </label>
              <select
                id="guests"
                name="guests"
                className="booking__input booking__input--select"
                defaultValue="2"
              >
                <option value="1">1 Persona</option>
                <option value="2">2 Personas</option>
                <option value="3">3 Personas</option>
                <option value="4">4+ Personas</option>
              </select>
            </div>
            <Link to="/reservaciones" className="booking__btn">
              Buscar
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ HABITACIONES ═════════════════════════════════════ */}
      <section className="rooms section" id="habitaciones">
        <div className="section__header">
          <span className="section__eyebrow">Nuestras Suites</span>
          <h2 className="section__title">Habitaciones con <em>Encanto</em></h2>
          <p className="section__subtitle">
            Diseño inspirado en la tradición y el confort contemporáneo
          </p>
          <span className="section__ornament" aria-hidden="true">
            ✦ ─── ✦ ─── ✦
          </span>
        </div>
        <div className="rooms__grid">
          <article className="room-card">
            <div className="room-card__img-wrap">
              <img
                src={roomUruapan}
                alt="Suite Uruapan — dormitorio principal con decoración michoacana"
                className="room-card__img"
                loading="lazy"
                width="800"
                height="600"
              />
              <span className="room-card__badge">Suite Deluxe</span>
            </div>
            <div className="room-card__body">
              <h3 className="room-card__title">Uruapan</h3>
              <em className="room-card__sub">Naturaleza &amp; Tradición</em>
              <p className="room-card__desc">
                Frescura, armonía y descanso entre ecos de bosque y artesanía local.
              </p>
              <ul className="room-card__amenities" aria-label="Amenidades de la habitación">
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
              <Link to="/habitaciones" className="room-card__link btn btn--outline">
                Ver detalles
              </Link>
            </div>
          </article>

          <article className="room-card room-card--featured">
            <div className="room-card__img-wrap">
              <img
                src={roomPatzcuaro}
                alt="Suite Pátzcuaro — suite superior con vista al lago"
                className="room-card__img"
                loading="lazy"
                width="800"
                height="600"
              />
              <span className="room-card__badge">Suite Superior</span>
            </div>
            <div className="room-card__body">
              <h3 className="room-card__title">Pátzcuaro</h3>
              <em className="room-card__sub">Historia &amp; Elegancia</em>
              <p className="room-card__desc">
                Elegancia clásica y serenidad a orillas del lago más místico de México.
              </p>
              <ul className="room-card__amenities" aria-label="Amenidades de la habitación">
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
              <Link to="/habitaciones" className="room-card__link btn btn--outline">
                Ver detalles
              </Link>
            </div>
          </article>

          <article className="room-card">
            <div className="room-card__img-wrap">
              <img
                src={roomParacho}
                alt="Suite Paracho — ambiente artesanal con instrumentos michoacanos"
                className="room-card__img"
                loading="lazy"
                width="800"
                height="600"
              />
              <span className="room-card__badge">Suite Estudio</span>
            </div>
            <div className="room-card__body">
              <h3 className="room-card__title">Paracho</h3>
              <em className="room-card__sub">Artesanía &amp; Carácter</em>
              <p className="room-card__desc">
                Calidez, autenticidad y el espíritu musical de la capital de la guitarra.
              </p>
              <ul className="room-card__amenities" aria-label="Amenidades de la habitación">
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
              <Link to="/habitaciones" className="room-card__link btn btn--outline">
                Ver detalles
              </Link>
            </div>
          </article>
        </div>
        <div className="rooms__cta-wrap">
          <Link to="/habitaciones" className="btn btn--primary">
            Ver todas las habitaciones
          </Link>
        </div>
      </section>

      {/* ═══ EXPERIENCIAS ═════════════════════════════════════ */}
      <section className="experiences section section--dark" id="experiencias">
        <div className="experiences__inner">
          <div className="section__header section__header--light">
            <span className="section__eyebrow section__eyebrow--gold">
              Descubre
            </span>
            <h2 className="section__title">
              Vive una Experiencia <em>Inolvidable</em>
            </h2>
            <span className="section__ornament" aria-hidden="true">
              ✦ ─── ✦ ─── ✦
            </span>
          </div>
          <div className="experiences__grid">
            <article className="exp-card">
              <div className="exp-card__img-wrap">
                <img
                  src={ArtesaniaManual}
                  alt="Artesanía tradicional michoacana"
                  className="exp-card__img"
                  loading="lazy"
                />
              </div>
              <h3 className="exp-card__title">Artesanía<br />Tradicional</h3>
            </article>
            <article className="exp-card">
              <div className="exp-card__img-wrap">
                <img
                  src={Paisaje}
                  alt="Naturaleza y paisajes de Michoacán"
                  className="exp-card__img"
                  loading="lazy"
                />
              </div>
              <h3 className="exp-card__title">Naturaleza<br />Asombrosa</h3>
            </article>
            <article className="exp-card">
              <div className="exp-card__img-wrap">
                <img
                  src={Hospitalidad}
                  alt="Cultura y hospitalidad michoacana"
                  className="exp-card__img"
                  loading="lazy"
                />
              </div>
              <h3 className="exp-card__title">Cultura y<br />Hospitalidad</h3>
            </article>
            <article className="exp-card">
              <div className="exp-card__img-wrap">
                <img
                  src={Gastronomia}
                  alt="Gastronomía regional de Michoacán"
                  className="exp-card__img"
                  loading="lazy"
                />
              </div>
              <h3 className="exp-card__title">Gastronomía<br />Regional</h3>
            </article>
          </div>
        </div>
      </section>

      {/* ═══ SERVICIOS ════════════════════════════════════════ */}
      <section className="services section" id="servicios">
        <div className="section__header">
          <span className="section__eyebrow">Lo que ofrecemos</span>
          <h2 className="section__title">Servicios de <em>Distinción</em></h2>
          <p className="section__subtitle">
            Todo lo necesario para una estancia verdaderamente inolvidable
          </p>
          <span className="section__ornament" aria-hidden="true">
            ✦ ─── ✦ ─── ✦
          </span>
        </div>
        <div className="services__grid">
          <article className="service-card">
            <div className="service-card__icon-wrap">
              <i className="fa-solid fa-bed service-card__icon" aria-hidden="true"></i>
            </div>
            <h3 className="service-card__title">Habitaciones Premium</h3>
            <p className="service-card__text">
              Diseño boutique con máximo confort y detalles artesanales únicos.
            </p>
          </article>
          <article className="service-card">
            <div className="service-card__icon-wrap">
              <i className="fa-solid fa-tree service-card__icon" aria-hidden="true"></i>
            </div>
            <h3 className="service-card__title">Entorno Natural</h3>
            <p className="service-card__text">
              Tranquilidad y conexión profunda con la naturaleza michoacana.
            </p>
          </article>
          <article className="service-card">
            <div className="service-card__icon-wrap">
              <i className="fa-solid fa-concierge-bell service-card__icon" aria-hidden="true"></i>
            </div>
            <h3 className="service-card__title">Atención Personalizada</h3>
            <p className="service-card__text">
              Hospitalidad auténtica michoacana con calidez y servicio de lujo.
            </p>
          </article>
          <article className="service-card">
            <div className="service-card__icon-wrap">
              <i className="fa-solid fa-utensils service-card__icon" aria-hidden="true"></i>
            </div>
            <h3 className="service-card__title">Desayuno Regional</h3>
            <p className="service-card__text">
              Sabores tradicionales que despiertan los sentidos cada mañana.
            </p>
          </article>
        </div>
      </section>

      {/*  ═══ GALERIA ════════════════════════════════════════ */}
      <section className="lookbook section">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Atmósfera</span>
            <h2 className="section__title">Nuestra <em>Esencia</em></h2>
            <p className="section__subtitle">Capturamos los momentos que definen la estancia en Quinta Dalam.</p>
            <span className="section__ornament" aria-hidden="true">✦ ─── ✦</span>
          </div>

          <div className="lookbook__grid">
            <div className="lookbook__item">
              <img src={ArtesaniaManual} alt="Sala de estar" className="lookbook__img" loading="lazy" />
            </div>
            <div className="lookbook__item ">
              <img src={Paisaje} alt="Fachada colonial" className="lookbook__img" loading="lazy" />
            </div>
            <div className="lookbook__item ">
              <img src={Hospitalidad} alt="Detalles artesanales" className="lookbook__img" loading="lazy" />
            </div>
            <div className="lookbook__item ">
              <img src={Gastronomia} alt="Vista al manantial" className="lookbook__img" loading="lazy" />
            </div>
            <div className="lookbook__item ">
              <img src={ZonaExterior} alt="Interiores acogedores" className="lookbook__img" loading="lazy" />
            </div>
            <div className="lookbook__item ">
              <img src={salaVista2} alt="Cocina tradicional" className="lookbook__img" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ NOSOTROS PREVIEW ═════════════════════════════════ */}
      <section className="about section" id="sobre-nosotros">
        <div className="about__inner">
          <div className="about__text">
            <span className="section__eyebrow">Nuestra Historia</span>
            <h2 className="about__title">
              Una Experiencia <em>Boutique</em> sin igual
            </h2>
            <span className="section__ornament" aria-hidden="true">✦ ─── ✦</span>
            <p className="about__desc">
              Hotel Quinta Dalam nació del amor por la cultura michoacana y el arte de la hospitalidad. Combinamos tradición colonial, diseño moderno y el calor de los Pueblos Mágicos para ofrecerte una estancia que trasciende lo ordinario.
            </p>
            <Link to="/nosotros" className="btn btn--primary">
              Conocer nuestra historia
            </Link>
          </div>
          <div className="about__media">
            <img
              src={ZonaExterior}
              alt="Exterior colonial del Hotel Quinta Dalam rodeado de jardines"
              className="about__img"
              loading="lazy"
            />
            <div className="about__badge" aria-hidden="true">
              <span className="about__badge-num">2</span>
              <span className="about__badge-text">años de hospitalidad</span>
            </div>
          </div>
        </div>
      </section>

      

      {/* ═══ CTA FINAL ════════════════════════════════════════ */}
      <section className="cta-band" aria-label="Llamada a reservar">
        <div className="cta-band__inner">
          <div className="cta-band__text">
            <span className="section__eyebrow section__eyebrow--gold">
              ¿Listo para tu escapada?
            </span>
            <h2 className="cta-band__title">
              Reserva tu estancia <em>perfecta</em>
            </h2>
            <p className="cta-band__desc">
              Vive una experiencia inolvidable en el corazón de Michoacán.
            </p>
          </div>
          <div className="cta-band__actions">
            <Link to="/reservaciones" className="btn btn--primary">
              Ver disponibilidad
            </Link>
            <Link to="/contacto" className="btn btn--ghost">
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}