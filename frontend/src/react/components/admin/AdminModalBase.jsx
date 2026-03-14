export default function AdminModalBase({ isOpen, onClose, title, icon, children, size = "md" }) {
    if (!isOpen) return null;

    return (
        <div className="admin-modal-backdrop is-open">
        <div className={`admin-modal ${size === 'sm' ? 'admin-modal--sm' : ''}`}>
            <div className="admin-modal__header">
            <h2 className="admin-modal__title">
                <i className={`fa-solid ${icon}`}></i> {title}
            </h2>
            <button type="button" className="admin-modal__close" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>
            </div>
            {children}
        </div>
        </div>
    );
}