export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName = "este elemento" }) {
    return (
        <div className={`admin-modal-backdrop ${isOpen ? 'is-open' : ''}`}>
        <div className="admin-modal admin-modal--sm">
            <div className="admin-modal__header">
            <h2 className="admin-modal__title admin-modal__title--danger">
                <i className="fa-solid fa-triangle-exclamation"></i> Confirmar eliminación
            </h2>
            <button type="button" className="admin-modal__close" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>
            </div>
            <div className="admin-modal__body">
            <p>¿Estás seguro de que deseas eliminar {itemName}? Esta acción no se puede deshacer.</p>
            </div>
            <div className="admin-modal__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>Cancelar</button>
            <button type="button" className="admin-btn admin-btn--danger" onClick={onConfirm}>
                <i className="fa-solid fa-trash"></i> Eliminar
            </button>
            </div>
        </div>
        </div>
    );
}