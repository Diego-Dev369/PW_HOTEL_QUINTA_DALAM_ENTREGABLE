export default function Reservaciones() {
  return (
    <main>
      <section className="section section--cream reserva-page">
        <div className="container">
          <div className="reserva-wrapper">
            <div className="reserva__header">
              <span className="section__eyebrow">Formulario</span>
              <h1 className="section__title">Nueva <em>Reservación</em></h1>
              <span className="section__ornament">✦ — —</span>
            </div>

            <form className="form reserva__form" action="#" noValidate>
              <div className="form__grid">
                <div className="form__group">
                  <label className="form__label" htmlFor="nombre">
                    Nombre completo
                  </label>
                  <input
                    className="form__input"
                    type="text"
                    id="nombre"
                    placeholder="Ej. Juan Pérez"
                    required
                  />
                </div>
                <div className="form__group">
                  <label className="form__label" htmlFor="correo">
                    Correo electrónico
                  </label>
                  <input
                    className="form__input"
                    type="email"
                    id="correo"
                    placeholder="tu@correo.com"
                    required
                  />
                </div>

                <div className="form__group form__group--full">
                  <label className="form__label" htmlFor="telefono">Teléfono</label>
                  <input
                    className="form__input"
                    type="tel"
                    id="telefono"
                    placeholder="+52 443 000 0000"
                    required
                  />
                </div>

                <div className="form__group">
                  <label className="form__label" htmlFor="entrada">
                    Fecha de entrada
                  </label>
                  <input
                    className="form__input"
                    type="date"
                    id="entrada"
                    required
                  />
                </div>
                <div className="form__group">
                  <label className="form__label" htmlFor="salida">
                    Fecha de salida
                  </label>
                  <input className="form__input" type="date" id="salida" required />
                </div>

                <div className="form__group">
                  <label className="form__label" htmlFor="personas">
                    Número de personas
                  </label>
                  <input
                    className="form__input"
                    type="number"
                    id="personas"
                    min="1"
                    max="10"
                    placeholder="2"
                    required
                  />
                </div>
                
                <div className="form__group">
                  <label className="form__label" htmlFor="habitacion">
                    Tipo de habitación
                  </label>
                  {/* En React es mejor usar defaultValue en el select en lugar de selected en el option */}
                  <select className="form__input" id="habitacion" defaultValue="" required>
                    <option value="" disabled>
                      Selecciona una suite
                    </option>
                    <option value="sencilla">Suite Sencilla</option>
                    <option value="doble">Suite Doble</option>
                    <option value="presidencial">Suite Presidencial</option>
                  </select>
                </div>

                <div className="form__group form__group--full">
                  <label className="form__label" htmlFor="comentarios">
                    Comentarios adicionales
                  </label>
                  <textarea
                    className="form-textarea"
                    id="comentarios"
                    rows="4"
                    placeholder="Escriba aquí alguna solicitud especial..."
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="btn btn--primary reserva__submit">
                Completar Reservación
              </button>
            </form>

            <p className="reserva__notice">
              <i className="fa-solid fa-code pull-left"></i>
              Este módulo se encuentra en desarrollo. Próximamente contará con
              sistema de pagos y validación automática.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}