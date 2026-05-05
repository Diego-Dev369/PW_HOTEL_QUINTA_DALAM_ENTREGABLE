import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { forgotPassword } from '../services/authService.js';
import { useToast } from '../hooks/useToast.js';
import ToastStack from '../components/ToastStack.jsx';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { toasts, removeToast, pushError, pushSuccess } = useToast();

  const onSubmit = async (data) => {
    try {
      const message = await forgotPassword({ email: data.email });
      pushSuccess(message || 'Si el correo existe, te enviaremos instrucciones.');
    } catch (error) {
      pushError(error?.response?.data?.message || 'No se pudo procesar la solicitud.');
    }
  };

  return (
    <main>
      <section className="section section--cream login-page">
        <div className="container">
          <div className="login-wrapper">
            <div className="login__header">
              <span className="section__eyebrow">Seguridad</span>
              <h1 className="section__title">Recuperar <em>Contraseña</em></h1>
              <span className="section__ornament">✦ — — ✦</span>
            </div>

            <form className="form login__form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form__group">
                <label className="form__label" htmlFor="forgot-email">Correo electrónico</label>
                <input
                  id="forgot-email"
                  className={`form__input ${errors.email ? 'input-error' : ''}`}
                  type="email"
                  {...register('email', {
                    required: 'El correo es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Correo inválido'
                    }
                  })}
                />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>

              <button type="submit" className="btn btn--primary login__submit">
                Enviar enlace
              </button>
            </form>

            <div className="login__footer">
              <p className="login__register">
                <Link to="/login" className="login__register-link">Volver a iniciar sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <ToastStack toasts={toasts} onClose={removeToast} />
    </main>
  );
}
