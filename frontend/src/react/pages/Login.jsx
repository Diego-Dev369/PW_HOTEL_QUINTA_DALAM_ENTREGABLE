import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../hooks/useToast.js';
import ToastStack from '../components/ToastStack.jsx';

function normalizeApiError(error) {
  if (error?.response?.status === 401) return 'Correo o contraseña incorrectos.';
  if (error?.response?.data?.message) return error.response.data.message;
  return 'No se pudo iniciar sesión. Intenta de nuevo.';
}

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { toasts, removeToast, pushError, pushSuccess } = useToast();

  const onSubmit = async (data) => {
    try {
      const profile = await login({
        email: data.email,
        password: data.password
      });

      pushSuccess('Sesión iniciada correctamente.');
      if ((profile?.roles || []).includes('ADMIN')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/reservaciones');
      }
    } catch (error) {
      pushError(normalizeApiError(error));
    }
  };

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

            <form className="form login__form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form__group">
                <label className="form__label" htmlFor="email">Correo electrónico</label>
                <input
                  className={`form__input ${errors.email ? 'input-error' : ''}`}
                  type="email"
                  id="email"
                  placeholder="ejemplo@quintadalam.mx"
                  {...register('email', {
                    required: 'El correo es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Ingresa un correo válido'
                    }
                  })}
                />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>

              <div className="form__group">
                <label className="form__label" htmlFor="password">Contraseña</label>
                <input
                  className={`form__input ${errors.password ? 'input-error' : ''}`}
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                  })}
                />
                {errors.password && <span className="form-error">{errors.password.message}</span>}
              </div>

              <div className="login__options">
                <label className="login__remember">
                  <input type="checkbox" /> Recordarme
                </label>
                <Link to="/forgot-password" className="login__forgot">¿Olvidaste tu contraseña?</Link>
              </div>

              <button type="submit" className="btn btn--primary login__submit" disabled={loading}>
                {loading ? <span className="btn__spinner" aria-hidden="true" /> : <i className="fa-solid fa-right-to-bracket"></i>}
                {loading ? 'Validando...' : 'Acceder'}
              </button>
            </form>

            <div className="login__footer">
              <p className="login__register">
                ¿No tienes cuenta? <Link to="/registro" className="login__register-link">Crear cuenta</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <ToastStack toasts={toasts} onClose={removeToast} />
    </main>
  );
}
