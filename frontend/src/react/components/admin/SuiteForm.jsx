import AdminModalBase from './AdminModalBase';

export default function SuiteModal({ isOpen, onClose, suiteData = {} }) {
    return (
        <AdminModalBase 
        isOpen={isOpen} 
        onClose={onClose} 
        title={suiteData.id ? "Editar Suite" : "Nueva Suite"} 
        icon="fa-bed"
        >
        <form className="admin-modal__form">
            <div className="admin-form-grid">
            <div className="admin-form__group">
                <label className="admin-form__label">Nombre de la suite</label>
                <input className="admin-form__input" type="text" placeholder="Ej. Pátzcuaro" defaultValue={suiteData.nombre} />
            </div>
            <div className="admin-form__group">
                <label className="admin-form__label">Categoría</label>
                <select className="admin-form__input" defaultValue={suiteData.categoria || ""}>
                <option value="" disabled>Selecciona...</option>
                <option>Suite Deluxe</option>
                <option>Suite Superior</option>
                <option>Suite Estudio</option>
                </select>
            </div>
            <div className="admin-form__group">
                <label className="admin-form__label">Precio / noche (MXN)</label>
                <input className="admin-form__input" type="number" placeholder="2500" defaultValue={suiteData.precio} />
            </div>
            <div className="admin-form__group">
                <label className="admin-form__label">Capacidad</label>
                <input className="admin-form__input" type="number" placeholder="2" defaultValue={suiteData.capacidad} />
            </div>
            </div>

            <div className="admin-form__group admin-form__group--full">
            <label className="admin-form__label">Descripción larga</label>
            <textarea className="admin-form__input" rows="3" placeholder="Descripción completa..." defaultValue={suiteData.descripcion}></textarea>
            </div>

            <div className="admin-form__group admin-form__group--full">
            <label className="admin-form__label">Imagen principal</label>
            <div className="admin-upload">
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <p>Arrastra una imagen o <span>haz clic para subir</span></p>
            </div>
            </div>

            <div className="admin-modal__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="admin-btn admin-btn--primary">
                <i className="fa-solid fa-floppy-disk"></i> Guardar Suite
            </button>
            </div>
        </form>
        </AdminModalBase>
    );
}