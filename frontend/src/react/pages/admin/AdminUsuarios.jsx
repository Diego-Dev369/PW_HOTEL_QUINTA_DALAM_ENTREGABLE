import { useState } from 'react';
import { useForm } from 'react-hook-form'; 
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

const mockUsuarios = [
  { id: 1, nombre: 'Carolina Mendoza', correo: 'carolina@quintadalam.mx', rol: 'Administrador', estado: 'Activo', ultimoAcceso: 'Hoy, 10:42 am', iniciales: 'CM', colorBg: '' },
  { id: 2, nombre: 'Tomás Guerrero', correo: 'tomas@quintadalam.mx', rol: 'Recepción', estado: 'Inactivo', ultimoAcceso: 'Hace 2 meses', iniciales: 'TG', colorBg: '#5c6b7a' }
];

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(mockUsuarios); 
  const [activeModal, setActiveModal] = useState(null); 
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPassword1, setShowPassword1] = useState(false);
  const [nameInitials, setNameInitials] = useState('??');
  
  // ── ESTADO DE LA BÚSQUEDA ──
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const closeModal = () => {
    setActiveModal(null);
    reset(); 
    setNameInitials('??');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const initials = name.trim().split(/\s+/).slice(0,2).map(w => w[0]?.toUpperCase()).join('');
    setNameInitials(initials || '??');
  };

  const openDeleteModal = (userName) => {
    setUserToDelete(userName);
    setActiveModal('delete');
  };

  const onSubmitUsuario = (data) => {
    console.log("Datos del usuario listos para BD:", data);
    alert(`¡Usuario ${activeModal === 'create' ? 'creado' : 'editado'} con éxito!`);
    closeModal();
  };

  // ── LÓGICA DE FILTRADO ──
  const filteredUsuarios = usuarios.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.nombre.toLowerCase().includes(term) ||
      user.correo.toLowerCase().includes(term)
    );
  });

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
                <input 
                  className="admin-search__input" 
                  type="search" 
                  placeholder="Buscar por nombre o correo..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                {/* ── Uso del array filtrado ── */}
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((user) => (
                    <tr key={user.id} className={user.estado === 'Inactivo' ? 'admin-table__row--muted' : ''}>
                      <td>
                        <div className="admin-table__guest">
                          <div className="admin-table__avatar" style={user.colorBg ? { background: user.colorBg } : {}}>
                            {user.iniciales}
                          </div>
                          <div>
                            <strong>{user.nombre}</strong>
                            <small>{user.correo}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${user.rol === 'Administrador' ? 'admin-badge--gold' : 'admin-badge--neutral'}`}>
                          {user.rol}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${user.estado === 'Activo' ? 'admin-badge--confirmed' : 'admin-badge--cancelled'}`}>
                          {user.estado}
                        </span>
                      </td>
                      <td className="admin-usuarios-table__date">{user.ultimoAcceso}</td>
                      <td>
                        <div className="admin-table__actions">
                          <button className="admin-icon-btn admin-icon-btn--edit" onClick={() => setActiveModal('edit')}><i className="fa-solid fa-pen"></i></button>
                          <button className="admin-icon-btn admin-icon-btn--delete" onClick={() => openDeleteModal(user.nombre)}><i className="fa-solid fa-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                      No se encontraron usuarios para "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal con formualrio validado */}
      <div className={`admin-modal-backdrop ${activeModal === 'create' || activeModal === 'edit' ? 'is-open' : ''}`}>
        <div className="admin-modal admin-modal--sm">
          <div className="admin-modal__header">
            <h3 className="admin-modal__title">
              <i className="fa-solid fa-user-plus"></i> {activeModal === 'edit' ? 'Editar usuario' : 'Nuevo usuario'}
            </h3>
            <button type="button" className="admin-modal__close" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
          </div>
          
          <form className="admin-modal__form" onSubmit={handleSubmit(onSubmitUsuario)} noValidate>
            <div className="admin-usuario-form-top" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="admin-table__avatar" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>{nameInitials}</div>
              <div className="admin-form-grid" style={{ flex: 1 }}>
                <div className="admin-form__group admin-form__group--full">
                  <label className="admin-form__label">Nombre completo</label>
                  <input 
                    className={`admin-form__input ${errors.nombre ? 'input-error' : ''}`} 
                    type="text" 
                    placeholder="Ej. Carolina Mendoza"
                    {...register("nombre", { 
                      required: "El nombre es obligatorio",
                      onChange: handleNameChange
                    })} 
                  />
                  {errors.nombre && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.nombre.message}</span>}
                </div>
              </div>
            </div>

            <div className="admin-form__group">
              <label className="admin-form__label">Correo electrónico</label>
              <input 
                className={`admin-form__input ${errors.correo ? 'input-error' : ''}`} 
                type="email" 
                placeholder="usuario@quintadalam.mx"
                {...register("correo", { 
                  required: "El correo es obligatorio",
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Correo inválido" }
                })} 
              />
              {errors.correo && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.correo.message}</span>}
            </div>

            <div className="admin-form-grid">
              <div className="admin-form__group">
                <label className="admin-form__label">Rol</label>
                <select className="admin-form__input" defaultValue="Administrador" {...register("rol")}>
                  <option>Administrador</option>
                  <option>Editor</option>
                  <option>Recepción</option>
                </select>
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Estado</label>
                <select className="admin-form__input" defaultValue="activo" {...register("estado")}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {activeModal === 'create' && (
              <div className="admin-form__group">
                <label className="admin-form__label">Contraseña</label>
                <div className="admin-search">
                  <input 
                    className={`admin-form__input ${errors.password ? 'input-error' : ''}`} 
                    type={showPassword1 ? "text" : "password"} 
                    style={{ paddingLeft: '1rem' }} 
                    {...register("password", { 
                      required: "Requerida para usuarios nuevos",
                      minLength: { value: 6, message: "Mínimo 6 caracteres" }
                    })}
                  />
                  <i 
                    className={`fa-solid ${showPassword1 ? "fa-eye-slash" : "fa-eye"}`} 
                    style={{ left: 'auto', right: '1rem', cursor: 'pointer', pointerEvents: 'auto' }} 
                    onClick={() => setShowPassword1(!showPassword1)}
                  ></i>
                </div>
                {errors.password && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.password.message}</span>}
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