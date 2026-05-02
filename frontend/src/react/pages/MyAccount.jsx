import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ToastStack from '../components/ToastStack.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { changePassword, updateCurrentUser } from '../services/authService.js';

function mapError(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export default function MyAccount() {
  const { user, refreshUser } = useAuth();
  const { toasts, removeToast, pushError, pushSuccess } = useToast();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    if (!user) return;
    profileForm.reset({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || ''
    });
  }, [user, profileForm]);

  const onSaveProfile = async (data) => {
    setSavingProfile(true);
    try {
      await updateCurrentUser(data);
      await refreshUser();
      pushSuccess('Perfil actualizado correctamente.');
    } catch (error) {
      pushError(mapError(error, 'No se pudo actualizar el perfil.'));
    } finally {
      setSavingProfile(false);
    }
  };

  const onSavePassword = async (data) => {
    setSavingPassword(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      passwordForm.reset();
      pushSuccess('Contraseña actualizada correctamente.');
    } catch (error) {
      pushError(mapError(error, 'No se pudo actualizar la contraseña.'));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <main>
      <section className="section section--cream account-page">
        <div className="container">
          <div className="account-page__header">
            <span className="section__eyebrow">Mi Cuenta</span>
            <h1 className="section__title">Perfil <em>Huésped</em></h1>
            <span className="section__ornament">✦ — — ✦</span>
          </div>

          <div className="account-page__grid">
            <article className="account-card">
              <h2 className="account-card__title">Datos personales</h2>
              <form className="form" onSubmit={profileForm.handleSubmit(onSaveProfile)} noValidate>
                <div className="form__group">
                  <label className="form__label" htmlFor="profile-firstName">Nombre</label>
                  <input className="form__input" id="profile-firstName" {...profileForm.register('firstName', { required: true })} />
                </div>
                <div className="form__group">
                  <label className="form__label" htmlFor="profile-lastName">Apellido</label>
                  <input className="form__input" id="profile-lastName" {...profileForm.register('lastName', { required: true })} />
                </div>
                <div className="form__group">
                  <label className="form__label" htmlFor="profile-email">Correo</label>
                  <input className="form__input" id="profile-email" type="email" {...profileForm.register('email', { required: true })} />
                </div>
                <div className="form__group">
                  <label className="form__label" htmlFor="profile-phone">Teléfono</label>
                  <input className="form__input" id="profile-phone" {...profileForm.register('phone')} />
                </div>
                <button type="submit" className="btn btn--primary" disabled={savingProfile}>
                  {savingProfile ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </form>
            </article>

            <article className="account-card">
              <h2 className="account-card__title">Seguridad</h2>
              <form className="form" onSubmit={passwordForm.handleSubmit(onSavePassword)} noValidate>
                <div className="form__group">
                  <label className="form__label" htmlFor="password-current">Contraseña actual</label>
                  <input className="form__input" id="password-current" type="password" {...passwordForm.register('currentPassword', { required: true })} />
                </div>
                <div className="form__group">
                  <label className="form__label" htmlFor="password-next">Nueva contraseña</label>
                  <input className="form__input" id="password-next" type="password" {...passwordForm.register('newPassword', { required: true, minLength: 8 })} />
                </div>
                <div className="form__group">
                  <label className="form__label" htmlFor="password-confirm">Confirmar nueva contraseña</label>
                  <input
                    className="form__input"
                    id="password-confirm"
                    type="password"
                    {...passwordForm.register('confirmPassword', {
                      required: true,
                      validate: (value) => value === passwordForm.watch('newPassword') || 'Las contraseñas no coinciden'
                    })}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <span className="form-error">{passwordForm.formState.errors.confirmPassword.message}</span>
                  )}
                </div>
                <button type="submit" className="btn btn--outline" disabled={savingPassword}>
                  {savingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </form>
            </article>
          </div>
        </div>
      </section>
      <ToastStack toasts={toasts} onClose={removeToast} />
    </main>
  );
}
