export default function Contacto() {
  return (
    <>
      {/* PAGE HERO */}
      <div className="page-hero">
        <span className="page-hero__eyebrow">Estamos aquí para ti</span>
        <h1 className="page-hero__title">Contacto</h1>
        <p className="page-hero__subtitle">
          Escríbenos o visítanos en el corazón de Michoacán
        </p>
        <span className="page-hero__ornament" aria-hidden="true">✦ ─── ✦ ─── ✦</span>
      </div>

      {/* MAIN */}
      <main>
        <section className="section" aria-labelledby="h2-contacto">
          <div className="container">
            <div className="contacto__grid">
              
              {/* Formulario */}
              <div className="contacto__form-wrap">
                <h2 className="contacto__title" id="h2-contacto">
                  Envíanos un <em>Mensaje</em>
                </h2>

                <form className="form" action="#" method="get" noValidate>
                  <div className="form__row">
                    <div className="form__group">
                      <label className="form__label" htmlFor="nombre">Nombre</label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="form__input"
                        placeholder="Tu nombre"
                        autoComplete="given-name"
                        required
                      />
                    </div>
                    <div className="form__group">
                      <label className="form__label" htmlFor="apellido">Apellido</label>
                      <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        className="form__input"
                        placeholder="Tu apellido"
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="email">Correo electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form__input"
                      placeholder="tu@email.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="telefono">Teléfono (opcional)</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      className="form__input"
                      placeholder="+52 443 000 0000"
                      autoComplete="tel"
                    />
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="asunto">Asunto</label>
                    <input
                      type="text"
                      id="asunto"
                      name="asunto"
                      className="form__input"
                      placeholder="¿En qué podemos ayudarte?"
                      required
                    />
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="mensaje">Mensaje</label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      className="form__textarea"
                      placeholder="Cuéntanos más..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn--primary">
                    <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
                    Enviar mensaje
                  </button>
                </form>
              </div>

              {/* Info de contacto */}
              <div className="contacto__info">
                <h2 className="contacto__title">Visítanos en <em>Michoacán</em></h2>

                <ul className="contacto__info-list">
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true">
                      <i className="fa-solid fa-location-dot"></i>
                    </span>
                    <div>
                      <strong>Dirección</strong>
                      <p>Morelia, Michoacán, México</p>
                    </div>
                  </li>
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true">
                      <i className="fa-solid fa-phone"></i>
                    </span>
                    <div>
                      <strong>Teléfono</strong>
                      <p><a href="tel:+524430000000">+52 443 000 0000</a></p>
                    </div>
                  </li>
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true">
                      <i className="fa-solid fa-envelope"></i>
                    </span>
                    <div>
                      <strong>Correo</strong>
                      <p>
                        <a href="mailto:reservas@quintadalam.mx">reservas@quintadalam.mx</a>
                      </p>
                    </div>
                  </li>
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true">
                      <i className="fa-solid fa-clock"></i>
                    </span>
                    <div>
                      <strong>Horario de atención</strong>
                      <p>Lunes a domingo · 8:00 – 20:00 hrs</p>
                    </div>
                  </li>
                </ul>

                {/* Mapa con estilos en línea corregidos para React */}
                <div className="contacto__map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60358.93085988832!2d-101.22441!3d19.7059504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842d0e0cb4da6b29%3A0x82c1c42f9c3a44c5!2sMorelia%2C%20Michoac%C3%A1n!5e0!3m2!1ses!2smx!4v1700000000000"
                    style={{ border: 0, width: '100%', height: '300px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación del Hotel Quinta Dalam en Morelia, Michoacán"
                  ></iframe>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}