import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../hooks/useToast.js';
import ToastStack from '../components/ToastStack.jsx';

function normalizeApiError(error) {
  if (error?.response?.status === 409) return 'El correo ya está registrado.';
  if (error?.response?.data?.message) return error.response.data.message;
  return 'No se pudo crear la cuenta. Intenta de nuevo.';
}

export default function Register() {
  const navigate = useNavigate();
  const { register: registerAuth, loading } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { toasts, removeToast, pushError, pushSuccess } = useToast();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await registerAuth({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password
      });
      pushSuccess('Cuenta creada correctamente. Bienvenido a Quinta Dalam.');
      navigate('/mi-cuenta');
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
              <span className="section__eyebrow">Cuenta</span>
              <h1 className="section__title">Crear <em>Cuenta</em></h1>
              <span className="section__ornament">✦ — — ✦</span>
            </div>

            <form className="form login__form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form__group">
                <label className="form__label" htmlFor="firstName">Nombre</label>
                <input
                  className={`form__input ${errors.firstName ? 'input-error' : ''}`}
                  id="firstName"
                  type="text"
                  {...register('firstName', { required: 'El nombre es obligatorio' })}
                />
                {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
              </div>

              <div className="form__group">
                <label className="form__label" htmlFor="lastName">Apellido</label>
                <input
                  className={`form__input ${errors.lastName ? 'input-error' : ''}`}
                  id="lastName"
                  type="text"
                  {...register('lastName', { required: 'El apellido es obligatorio' })}
                />
                {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
              </div>

              <div className="form__group">
                <label className="form__label" htmlFor="email">Correo electrónico</label>
                <input
                  className={`form__input ${errors.email ? 'input-error' : ''}`}
                  id="email"
                  type="email"
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
                <label className="form__label" htmlFor="phone">Teléfono</label>
                <input
                  className={`form__input ${errors.phone ? 'input-error' : ''}`}
                  id="phone"
                  type="tel"
                  {...register('phone', {
                    required: 'El teléfono es obligatorio',
                    pattern: {
                      value: /^[0-9+\-\s()]{10,15}$/,
                      message: 'Ingresa un teléfono válido'
                    }
                  })}
                />
                {errors.phone && <span className="form-error">{errors.phone.message}</span>}
              </div>

              <div className="form__group">
                <label className="form__label" htmlFor="password">Contraseña</label>
                <input
                  className={`form__input ${errors.password ? 'input-error' : ''}`}
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres' }
                  })}
                />
                {errors.password && <span className="form-error">{errors.password.message}</span>}
              </div>

              <div className="form__group">
                <label className="form__label" htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  className={`form__input ${errors.confirmPassword ? 'input-error' : ''}`}
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirma tu contraseña',
                    validate: (value) => value === password || 'Las contraseñas no coinciden'
                  })}
                />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
              </div>

              <button type="submit" className="btn btn--primary login__submit" disabled={loading}>
                {loading ? <span className="btn__spinner" aria-hidden="true" /> : null}
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <div className="login__footer">
              <p className="login__register">
                ¿Ya tienes cuenta? <Link to="/login" className="login__register-link">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <ToastStack toasts={toasts} onClose={removeToast} />
    </main>
  );
}
