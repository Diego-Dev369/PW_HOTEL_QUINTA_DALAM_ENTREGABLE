import { useState } from 'react';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

export default function AdminUsuarios() {
  const [activeModal, setActiveModal] = useState(null); // 'create', 'edit', 'delete', 'toggle'
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPassword1, setShowPassword1] = useState(false);
  const [nameInitials, setNameInitials] = useState('CM');

  const closeModal = () => setActiveModal(null);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const initials = name.trim().split(/\s+/).slice(0,2).map(w => w[0]?.toUpperCase()).join('');
    setNameInitials(initials || '??');
  };

  const openDeleteModal = (userName) => {
    setUserToDelete(userName);
    setActiveModal('delete');
  };

  return (
    <>
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Gestión de <em>Usuarios</em></h1>
            <p className="admin-page-subtitle">Administra los accesos y roles del panel de control.</p>
          </div>
          <button type="button" className="admin-btn admin-btn--primary" onClick={() => setActiveModal('create')}>
            <i className="fa-solid fa-user-plus"></i> Nuevo usuario
          </button>
        </div>

        <div className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-users-gear"></i> Todos los usuarios</h2>
            <div className="admin-usuarios-toolbar" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="admin-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input className="admin-search__input" type="search" placeholder="Buscar por nombre..." />
              </div>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th><th>Rol</th><th>Estado</th><th>Último acceso</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* ── USUARIO 1 ── */}
                <tr>
                  <td>
                    <div className="admin-table__guest">
                      <div className="admin-table__avatar">CM</div>
                      <div><strong>Carolina Mendoza</strong><small>carolina@quintadalam.mx</small></div>
                    </div>
                  </td>
                  <td><span className="admin-badge admin-badge--gold">Administrador</span></td>
                  <td><span className="admin-badge admin-badge--confirmed">Activo</span></td>
                  <td className="admin-usuarios-table__date">Hoy, 10:42 am</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn admin-icon-btn--edit" onClick={() => setActiveModal('edit')}><i className="fa-solid fa-pen"></i></button>
                      <button className="admin-icon-btn admin-icon-btn--view" onClick={() => setActiveModal('toggle')}><i className="fa-solid fa-power-off"></i></button>
                      <button className="admin-icon-btn admin-icon-btn--delete" onClick={() => openDeleteModal('Carolina Mendoza')}><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>

                {/* ── USUARIO 2 ── */}
                <tr className="admin-table__row--muted">
                  <td>
                    <div className="admin-table__guest">
                      <div className="admin-table__avatar" style={{ background: '#5c6b7a' }}>TG</div>
                      <div><strong>Tomás Guerrero</strong><small>tomas@quintadalam.mx</small></div>
                    </div>
                  </td>
                  <td><span className="admin-badge admin-badge--neutral">Recepción</span></td>
                  <td><span className="admin-badge admin-badge--cancelled">Inactivo</span></td>
                  <td className="admin-usuarios-table__date">Hace 2 meses</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn admin-icon-btn--edit" onClick={() => setActiveModal('edit')}><i className="fa-solid fa-pen"></i></button>
                      <button className="admin-icon-btn admin-icon-btn--view" onClick={() => setActiveModal('toggle')}><i className="fa-solid fa-power-off"></i></button>
                      <button className="admin-icon-btn admin-icon-btn--delete" onClick={() => openDeleteModal('Tomás Guerrero')}><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL: Crear/Editar Usuario */}
      <div className={`admin-modal-backdrop ${activeModal === 'create' || activeModal === 'edit' ? 'is-open' : ''}`}>
        <div className="admin-modal admin-modal--sm">
          <div className="admin-modal__header">
            <h3 className="admin-modal__title">
              <i className="fa-solid fa-user-plus"></i> {activeModal === 'edit' ? 'Editar usuario' : 'Nuevo usuario'}
            </h3>
            <button type="button" className="admin-modal__close" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
          </div>
          <form className="admin-modal__form" noValidate>
            <div className="admin-usuario-form-top" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="admin-table__avatar" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>{nameInitials}</div>
              <div className="admin-form-grid" style={{ flex: 1 }}>
                <div className="admin-form__group admin-form__group--full">
                  <label className="admin-form__label">Nombre completo</label>
                  <input className="admin-form__input" type="text" defaultValue="Carolina Mendoza" onChange={handleNameChange} required />
                </div>
              </div>
            </div>

            <div className="admin-form__group">
              <label className="admin-form__label">Correo electrónico</label>
              <input className="admin-form__input" type="email" defaultValue="carolina@quintadalam.mx" required />
            </div>

            <div className="admin-form-grid">
              <div className="admin-form__group">
                <label className="admin-form__label">Rol</label>
                <select className="admin-form__input" defaultValue="Administrador">
                  <option>Administrador</option>
                  <option>Editor</option>
                  <option>Recepción</option>
                </select>
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Estado</label>
                <select className="admin-form__input" defaultValue="activo">
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {activeModal === 'create' && (
              <div className="admin-form__group">
                <label className="admin-form__label">Contraseña</label>
                <div className="admin-search">
                  <input className="admin-form__input" type={showPassword1 ? "text" : "password"} style={{ paddingLeft: '1rem' }} />
                  <i className={`fa-solid ${showPassword1 ? "fa-eye-slash" : "fa-eye"}`} style={{ left: 'auto', right: '1rem', cursor: 'pointer', pointerEvents: 'auto' }} onClick={() => setShowPassword1(!showPassword1)}></i>
                </div>
              </div>
            )}

            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn--primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDeleteModal 
        isOpen={activeModal === 'delete'} 
        onClose={closeModal} 
        onConfirm={closeModal}
        itemName={`al usuario ${userToDelete}`} 
      />
    </>
  );
}