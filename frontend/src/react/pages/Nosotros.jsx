import { Link } from 'react-router-dom';

export default function Nosotros() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">Hotel Quinta Dalam</span>
          <h1 className="page-hero__title">Nuestra <em>Historia</em></h1>
          <p className="page-hero__subtitle">Pasión por Michoacán, vocación por la hospitalidad</p>
          <span className="page-hero__ornament" aria-hidden="true">✦ ─── ✦ ─── ✦</span>
        </div>
      </div>

      <main>
        <section className="section" aria-labelledby="h2-mision">
          <div className="container">
            <div className="section__header">
              <span className="section__eyebrow">Quiénes Somos</span>
              <h2 className="section__title" id="h2-mision">Misión &amp; <em>Visión</em></h2>
              <span className="section__ornament" aria-hidden="true">✦ ─── ✦ ─── ✦</span>
            </div>

            <article className="nosotros-split" aria-label="Misión del hotel">
              <div className="nosotros-split__icon" aria-hidden="true"><i className="fa-solid fa-heart"></i></div>
              <div className="nosotros-split__content">
                <h3 className="nosotros-split__title">Nuestra <em>Misión</em></h3>
                <p className="nosotros-split__text">
                  Brindar una experiencia de hospitalidad auténtica que celebre la
                  riqueza cultural de los Pueblos Mágicos de Michoacán. Cada
                  detalle de nuestra casa refleja el compromiso con la tradición,
                  el arte local y el bienestar de cada huésped.                
                </p>
              </div>
            </article>

            <div className="nosotros-split__divider" aria-hidden="true">✦</div>

            <article className="nosotros-split nosotros-split--reverse" aria-label="Visión del hotel">
              <div className="nosotros-split__icon" aria-hidden="true"><i className="fa-solid fa-star"></i></div>
              <div className="nosotros-split__content">
                <h3 className="nosotros-split__title">Nuestra <em>Visión</em></h3>
                <p className="nosotros-split__text">  
                  Ser el referente de hospitalidad boutique en Michoacán,
                  reconocidos por preservar el patrimonio cultural mientras
                  ofrecemos experiencias que conectan a nuestros huéspedes con la
                  esencia profunda de esta tierra mágica.
                  </p>
              </div>
            </article>
          </div>
        </section>

        <section className="section section--dark" aria-labelledby="h2-valores">
          <div className="container">
            <div className="section__header section__header--light">
              <span className="section__eyebrow section__eyebrow--gold">
                Lo que nos define
              </span>
              <h2 className="section__title" id="h2-valores">
                Nuestros <em>Valores</em>
              </h2>
              <span className="section__ornament" aria-hidden="true">
                ✦ ─── ✦ ─── ✦
              </span>
            </div>

            <div className="valores__grid">
              <article className="valor-card">
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-handshake"></i>
                </div>
                <h3 className="valor-card__title">Hospitalidad</h3>
                <p className="valor-card__text">
                  Cada huésped es parte de nuestra familia. El calor michoacano en
                  cada gesto.
                </p>
              </article>

              <article className="valor-card">
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-leaf"></i>
                </div>
                <h3 className="valor-card__title">Sustentabilidad</h3>
                <p className="valor-card__text">
                  Compromiso con el medio ambiente y las comunidades locales de
                  Michoacán.
                </p>
              </article>

              <article className="valor-card">
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-palette"></i>
                </div>
                <h3 className="valor-card__title">Cultura</h3>
                <p className="valor-card__text">
                  Preservamos y celebramos las tradiciones artesanales y
                  gastronómicas del estado.
                </p>
              </article>

              <article className="valor-card">
                <div className="valor-card__icon" aria-hidden="true">
                  <i className="fa-solid fa-gem"></i>
                </div>
                <h3 className="valor-card__title">Excelencia</h3>
                <p className="valor-card__text">
                  Estándares de calidad que elevan cada detalle de tu experiencia.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="cta-band" aria-label="Llamada a reservar">
          <div className="cta-band__inner">
            <div className="cta-band__text">
              <span className="section__eyebrow section__eyebrow--gold">Ven a conocernos</span>
              <h2 className="cta-band__title">Reserva tu <em>experiencia</em></h2>
              <p className="cta-band__desc">Descubre de cerca lo que nos hace únicos en Michoacán.</p>
            </div>
            <div className="cta-band__actions">
              <Link to="/reservaciones" className="btn btn--primary">Reservar ahora</Link>
              <Link to="/contacto" className="btn btn--ghost">Contáctanos</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}