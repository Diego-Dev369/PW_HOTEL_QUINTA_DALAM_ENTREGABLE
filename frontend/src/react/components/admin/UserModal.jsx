import { useState } from 'react';
import AdminModalBase from './AdminModalBase';

export default function UserModal({ isOpen, onClose, userData = {} }) {
    const [initials, setInitials] = useState('??');

    const handleNameChange = (e) => {
        const name = e.target.value;
        const parts = name.trim().split(/\s+/);
        const ini = parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('');
        setInitials(ini || '??');
    };

    return (
        <AdminModalBase isOpen={isOpen} onClose={onClose} title="Gestión de Usuario" icon="fa-user-plus">
        <form className="admin-modal__form">
            <div className="admin-usuario-form-top">
            <div className="admin-usuario-avatar-preview">{initials}</div>
            <div className="admin-form-grid" style={{ flex: 1 }}>
                <div className="admin-form__group">
                <label className="admin-form__label">Nombre completo *</label>
                <input className="admin-form__input" type="text" onChange={handleNameChange} required />
                </div>
                <div className="admin-form__group">
                <label className="admin-form__label">Correo electrónico *</label>
                <input className="admin-form__input" type="email" required />
                </div>
            </div>
            </div>

            <div className="admin-form-grid">
            <div className="admin-form__group">
                <label className="admin-form__label">Rol</label>
                <select className="admin-form__input">
                <option>Administrador</option>
                <option>Editor</option>
                <option>Recepción</option>
                </select>
            </div>
            <div className="admin-form__group">
                <label className="admin-form__label">Estado</label>
                <select className="admin-form__input">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                </select>
            </div>
            </div>

            <div className="admin-modal__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="admin-btn admin-btn--primary">Guardar Usuario</button>
            </div>
        </form>
        </AdminModalBase>
    );
}