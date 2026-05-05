import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { resetPassword } from '../services/authService.js';
import { useToast } from '../hooks/useToast.js';
import ToastStack from '../components/ToastStack.jsx';

function mapResetError(error) {
  const code = error?.response?.data?.details?.code || error?.response?.data?.code;
  const message = error?.response?.data?.message || '';
  if (code === 'PASSWORD_RESET_TOKEN_INVALID' || message.toLowerCase().includes('token')) {
    return 'El enlace de recuperación es inválido, expiró o ya fue utilizado.';
  }
  return message || 'No se pudo restablecer la contraseña.';
}

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const { toasts, removeToast, pushError, pushSuccess } = useToast();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!token) {
      pushError('Token inválido. Solicita un nuevo enlace de recuperación.');
      return;
    }
    try {
      const message = await resetPassword({
        token,
        newPassword: data.newPassword
      });
      pushSuccess(message || 'Contraseña actualizada correctamente.');
    } catch (error) {
      pushError(mapResetError(error));
    }
  };

  const newPassword = watch('newPassword');

  return (
    <main>
      <section className="section section--cream login-page">
        <div className="container">
          <div className="login-wrapper">
            <div className="login__header">
              <span className="section__eyebrow">Seguridad</span>
              <h1 className="section__title">Nueva <em>Contraseña</em></h1>
              <span className="section__ornament">✦ — — ✦</span>
            </div>

            {!token ? (
              <div className="login__footer">
                <p className="form-error">Token inválido. Solicita un nuevo enlace.</p>
                <p className="login__register">
                  <Link to="/forgot-password" className="login__register-link">Solicitar recuperación</Link>
                </p>
              </div>
            ) : (
              <form className="form login__form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form__group">
                  <label className="form__label" htmlFor="newPassword">Nueva contraseña</label>
                  <input
                    id="newPassword"
                    type="password"
                    className={`form__input ${errors.newPassword ? 'input-error' : ''}`}
                    {...register('newPassword', {
                      required: 'La contraseña es obligatoria',
                      minLength: { value: 8, message: 'Mínimo 8 caracteres' }
                    })}
                  />
                  {errors.newPassword && <span className="form-error">{errors.newPassword.message}</span>}
                </div>

                <div className="form__group">
                  <label className="form__label" htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`form__input ${errors.confirmPassword ? 'input-error' : ''}`}
                    {...register('confirmPassword', {
                      required: 'Confirma tu contraseña',
                      validate: (value) => value === newPassword || 'Las contraseñas no coinciden'
                    })}
                  />
                  {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
                </div>

                <button type="submit" className="btn btn--primary login__submit">
                  Restablecer contraseña
                </button>
              </form>
            )}

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
