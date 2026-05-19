import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { fetchUsers, createUser, updateUser, deactivateUser, activateUser } from '../../services/staffApi';

function getInitials(firstName, lastName) {
  const a = (firstName || '').trim()[0] || '';
  const b = (lastName || '').trim()[0] || '';
  return (a + b).toUpperCase() || '??';
}

function roleBadgeClass(roles = []) {
  if (roles.includes('ADMIN')) return 'admin-badge--gold';
  if (roles.includes('RECEPTION')) return 'admin-badge--confirmed';
  return 'admin-badge--neutral';
}

function roleLabel(roles = []) {
  if (roles.includes('ADMIN')) return 'Administrador';
  if (roles.includes('RECEPTION')) return 'Recepcion';
  if (roles.includes('GUEST')) return 'Huesped';
  return roles.join(', ') || 'Sin rol';
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: { role: 'GUEST' }
  });

  const nameWatch = watch('firstName', '');
  const lastNameWatch = watch('lastName', '');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setApiError(null);
    try {
      const data = await fetchUsers();
      setUsuarios(data || []);
    } catch (e) {
      setApiError(e?.response?.data?.message || 'No fue posible cargar usuarios.');
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setEditingUser(null);
    reset({ firstName: '', lastName: '', email: '', phone: '', password: '', role: 'GUEST' });
    setShowPassword(false);
    setSaveError(null);
    setActiveModal('edit');
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.roles?.[0] || 'GUEST',
    });
    setShowPassword(false);
    setSaveError(null);
    setActiveModal('edit');
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setActiveModal('delete');
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingUser(null);
    setUserToDelete(null);
    setSaveError(null);
    reset({ role: 'GUEST' });
  };

  const onSubmitUsuario = async (data) => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        email: data.email.trim().toLowerCase(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone?.trim() || null,
      };

      if (editingUser) {
        const updated = await updateUser(editingUser.id, payload);
        setUsuarios((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      } else {
        const created = await createUser({
          ...payload,
          password: data.password,
          role: data.role || 'GUEST',
        });
        setUsuarios((prev) => [created, ...prev]);
      }

      closeModal();
    } catch (e) {
      setSaveError(e?.response?.data?.message || 'Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) { closeModal(); return; }
    try {
      await deactivateUser(userToDelete.id);
      setUsuarios((prev) => prev.map((u) =>
        u.id === userToDelete.id ? { ...u, status: 'INACTIVE' } : u
      ));
    } catch {
      loadUsers();
    } finally {
      closeModal();
    }
  };

  const handleActivateUser = async (user) => {
    try {
      const updated = await activateUser(user.id);
      setUsuarios((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch {
      loadUsers();
    }
  };

  const filteredUsuarios = usuarios.filter((user) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(term) || (user.email || '').toLowerCase().includes(term);
  });

  const previewInitials = getInitials(nameWatch, lastNameWatch);
  const isEditing = Boolean(editingUser);

  return (
    <>
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Gestion de <em>Usuarios</em></h1>
            <p className="admin-page-subtitle">Administra accesos y roles del sistema.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" className="admin-btn admin-btn--primary" onClick={openCreateModal}>
              <i className="fa-solid fa-user-plus"></i> Nuevo usuario
            </button>
            <button type="button" className="admin-btn admin-btn--primary" onClick={loadUsers} disabled={loading}>
              <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-rotate-right'}`}></i>
              {loading ? ' Cargando...' : ' Refrescar'}
            </button>
          </div>
        </div>

        {apiError && (
          <p className="admin-card" style={{ color: '#a33', padding: '1rem', marginBottom: '1rem' }}>
            <i className="fa-solid fa-triangle-exclamation"></i> {apiError}
          </p>
        )}

        <div className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-users-gear"></i> Todos los usuarios</h2>
            <div className="admin-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                className="admin-search__input"
                type="search"
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th><th>Rol</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Cargando usuarios...</td></tr>
                ) : filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((user) => (
                    <tr key={user.id} className={user.status === 'INACTIVE' ? 'admin-table__row--muted' : ''}>
                      <td>
                        <div className="admin-table__guest">
                          <div className="admin-table__avatar">{getInitials(user.firstName, user.lastName)}</div>
                          <div>
                            <strong>{user.firstName} {user.lastName}</strong>
                            <small>{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td><span className={`admin-badge ${roleBadgeClass(user.roles)}`}>{roleLabel(user.roles)}</span></td>
                      <td>
                        <span className={`admin-badge ${user.status === 'ACTIVE' ? 'admin-badge--confirmed' : 'admin-badge--cancelled'}`}>
                          {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button className="admin-icon-btn admin-icon-btn--edit" title="Editar" onClick={() => openEditModal(user)}>
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          {user.status === 'INACTIVE' ? (
                            <button
                              className="admin-icon-btn admin-icon-btn--edit"
                              title="Reactivar"
                              onClick={() => handleActivateUser(user)}
                            >
                              <i className="fa-solid fa-user-check"></i>
                            </button>
                          ) : (
                            <button
                              className="admin-icon-btn admin-icon-btn--delete"
                              title="Desactivar"
                              onClick={() => openDeleteModal(user)}
                            >
                              <i className="fa-solid fa-user-slash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                      {searchTerm ? `No se encontraron usuarios para "${searchTerm}"` : 'No hay usuarios registrados.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <div className={`admin-modal-backdrop ${activeModal === 'edit' ? 'is-open' : ''}`}>
        <div className="admin-modal admin-modal--sm">
          <div className="admin-modal__header">
            <h3 className="admin-modal__title">
              <i className={`fa-solid ${isEditing ? 'fa-user-pen' : 'fa-user-plus'}`}></i> {isEditing ? 'Editar usuario' : 'Nuevo usuario'}
            </h3>
            <button type="button" className="admin-modal__close" onClick={closeModal}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form className="admin-modal__form" onSubmit={handleSubmit(onSubmitUsuario)} noValidate>
            <div className="admin-usuario-form-top" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="admin-table__avatar" style={{ width: '50px', height: '50px', fontSize: '1.2rem', flexShrink: 0 }}>
                {previewInitials}
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="admin-form__group" style={{ margin: 0 }}>
                  <label className="admin-form__label">Nombre</label>
                  <input className={`admin-form__input ${errors.firstName ? 'input-error' : ''}`} type="text" {...register('firstName', { required: 'El nombre es obligatorio' })} />
                  {errors.firstName && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.firstName.message}</span>}
                </div>
                <div className="admin-form__group" style={{ margin: 0 }}>
                  <label className="admin-form__label">Apellidos</label>
                  <input className={`admin-form__input ${errors.lastName ? 'input-error' : ''}`} type="text" {...register('lastName', { required: 'Los apellidos son obligatorios' })} />
                  {errors.lastName && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.lastName.message}</span>}
                </div>
              </div>
            </div>

            <div className="admin-form__group">
              <label className="admin-form__label">Correo electronico</label>
              <input
                className={`admin-form__input ${errors.email ? 'input-error' : ''}`}
                type="email"
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Correo invalido' }
                })}
              />
              {errors.email && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.email.message}</span>}
            </div>

            {!isEditing && (
              <>
                <div className="admin-form__group">
                  <label className="admin-form__label">Contrasena temporal</label>
                  <input
                    className={`admin-form__input ${errors.password ? 'input-error' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'La contrasena es obligatoria',
                      minLength: { value: 8, message: 'Minimo 8 caracteres' }
                    })}
                  />
                  {errors.password && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.password.message}</span>}
                </div>
                <label style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', fontSize: '13px' }}>
                  <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} /> Mostrar contrasena
                </label>
                <div className="admin-form__group">
                  <label className="admin-form__label">Rol</label>
                  <select className="admin-form__input" {...register('role')}>
                    <option value="GUEST">Huesped</option>
                    <option value="RECEPTION">Recepcion</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
              </>
            )}

            <div className="admin-form__group">
              <label className="admin-form__label">Telefono (opcional)</label>
              <input className="admin-form__input" type="tel" {...register('phone')} />
            </div>

            {saveError && <p style={{ color: '#a33', fontSize: '13px', margin: '0.5rem 0' }}><i className="fa-solid fa-triangle-exclamation"></i> {saveError}</p>}

            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeModal} disabled={saving}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? <><i className="fa-solid fa-spinner fa-spin"></i> Guardando...</> : (isEditing ? 'Guardar' : 'Crear usuario')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        itemName={`al usuario ${userToDelete?.firstName} ${userToDelete?.lastName}`}
      />
    </>
  );
}
