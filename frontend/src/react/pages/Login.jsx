import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <main>
      <section className="section section--cream login-page">
        <div className="container">
          <div className="login-wrapper">
            <div className="login__header">
              <span className="section__eyebrow">Acceso</span>
              <h1 className="section__title">Iniciar <em>Sesión</em></h1>
              <span className="section__ornament">✦ — — ✦</span>
            </div>

            <form className="form login__form" action="#" noValidate>
              <div className="form__group">
                <label className="form__label" htmlFor="email">Correo electrónico</label>
                <input className="form__input" type="email" id="email" placeholder="tu@correo.com" required autoComplete="email" />
              </div>
              <div className="form__group">
                <label className="form__label" htmlFor="password">Contraseña</label>
                <input className="form__input" type="password" id="password" placeholder="••••••••" required autoComplete="current-password" />
              </div>
              <div className="login__options">
                <label className="login__remember">
                  <input type="checkbox" /> Recordarme
                </label>
                <a href="#" className="login__forgot">¿Olvidaste tu contraseña?</a>
              </div>
              <button type="submit" className="btn btn--primary login__submit">
                <i className="fa-solid fa-right-to-bracket"></i> Acceder
              </button>
            </form>

            <div className="login__footer">
              <p className="login__register">
                ¿No tienes cuenta? <Link to="/reservaciones" className="login__register-link">Haz una reservación</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}