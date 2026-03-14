import { useState } from 'react';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

export default function AdminHabitaciones() {
  const [isSuiteModalOpen, setIsSuiteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [suiteToDelete, setSuiteToDelete] = useState(null);

  const openDeleteModal = (suiteName) => {
    setSuiteToDelete(suiteName);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log(`Suite ${suiteToDelete} eliminada`);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Gestión de <em>Habitaciones</em></h1>
            <p className="admin-page-subtitle">Crea, edita y elimina las suites del hotel.</p>
          </div>
          <button className="admin-btn admin-btn--primary" onClick={() => setIsSuiteModalOpen(true)}>
            <i className="fa-solid fa-plus"></i> Nueva Suite
          </button>
        </div>

        <section className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-bed"></i> Suites registradas</h2>
            <div className="admin-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="search" placeholder="Buscar suite..." className="admin-search__input" />
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Suite</th><th>Categoría</th><th>Capacidad</th><th>Precio</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* ── SUITE DE PRUEBA 1 ── */}
                <tr>
                  <td>
                    <div className="admin-table__room-info">
                      <div className="admin-table__room-thumb" style={{ backgroundImage: 'url("/images/rooms/204-uruapan.jpeg")' }}></div>
                      <div><strong>Uruapan</strong><small>Naturaleza & Tradición</small></div>
                    </div>
                  </td>
                  <td><span className="admin-badge admin-badge--neutral">Suite Deluxe</span></td>
                  <td>2 personas</td>
                  <td className="admin-table__price">$2,500 MXN</td>
                  <td><span className="admin-badge admin-badge--confirmed">Activa</span></td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn admin-icon-btn--edit" title="Editar" onClick={() => setIsSuiteModalOpen(true)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className="admin-icon-btn admin-icon-btn--delete" title="Eliminar" onClick={() => openDeleteModal('Uruapan')}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* ── SUITE DE PRUEBA 2 ── */}
                <tr className="admin-table__row--featured">
                  <td>
                    <div className="admin-table__room-info">
                      <div className="admin-table__room-thumb" style={{ backgroundImage: 'url("/images/rooms/104-patzcuaro.jpeg")' }}></div>
                      <div><strong>Pátzcuaro</strong><small>Historia & Elegancia</small></div>
                    </div>
                  </td>
                  <td><span className="admin-badge admin-badge--gold">Suite Superior</span></td>
                  <td>4 personas</td>
                  <td className="admin-table__price">$3,800 MXN</td>
                  <td><span className="admin-badge admin-badge--confirmed">Activa</span></td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn admin-icon-btn--edit" title="Editar" onClick={() => setIsSuiteModalOpen(true)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className="admin-icon-btn admin-icon-btn--delete" title="Eliminar" onClick={() => openDeleteModal('Pátzcuaro')}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL: Nueva Suite */}
      <div className={`admin-modal-backdrop ${isSuiteModalOpen ? 'is-open' : ''}`}>
        <div className="admin-modal">
          <div className="admin-modal__header">
            <h2 className="admin-modal__title"><i className="fa-solid fa-bed"></i> Editar Suite</h2>
            <button type="button" className="admin-modal__close" onClick={() => setIsSuiteModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <form className="admin-modal__form" noValidate>
            <div className="admin-form-grid">
              <div className="admin-form__group">
                <label className="admin-form__label">Nombre de la suite</label>
                <input className="admin-form__input" type="text" defaultValue="Pátzcuaro" />
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Subtítulo</label>
                <input className="admin-form__input" type="text" defaultValue="Historia & Elegancia" />
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Categoría</label>
                <select className="admin-form__input" defaultValue="superior">
                  <option value="deluxe">Suite Deluxe</option>
                  <option value="superior">Suite Superior</option>
                  <option value="estudio">Suite Estudio</option>
                </select>
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Precio / noche (MXN)</label>
                <input className="admin-form__input" type="number" defaultValue="3800" />
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Capacidad (personas)</label>
                <input className="admin-form__input" type="number" defaultValue="4" />
              </div>
            </div>

            <div className="admin-form__group admin-form__group--full">
              <label className="admin-form__label">Descripción larga</label>
              <textarea className="admin-form__input" rows="3" defaultValue="Elegancia clásica y serenidad a orillas del lago más místico de México."></textarea>
            </div>

            <div className="admin-form__group admin-form__group--full">
              <label className="admin-form__label">Amenidades incluidas</label>
              <div className="admin-checkboxes">
                <label className="admin-checkbox"><input type="checkbox" defaultChecked /> <i className="fa-solid fa-wifi"></i> Wi-Fi</label>
                <label className="admin-checkbox"><input type="checkbox" defaultChecked /> <i className="fa-solid fa-snowflake"></i> Aire Acond.</label>
                <label className="admin-checkbox"><input type="checkbox" defaultChecked /> <i className="fa-solid fa-mug-hot"></i> Desayuno</label>
                <label className="admin-checkbox"><input type="checkbox" defaultChecked /> <i className="fa-solid fa-bath"></i> Tina</label>
              </div>
            </div>

            <div className="admin-form__group admin-form__group--full">
              <label className="admin-checkbox admin-checkbox--featured">
                <input type="checkbox" defaultChecked /> <i className="fa-solid fa-star"></i> Marcar como suite <strong>destacada</strong>
              </label>
            </div>

            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setIsSuiteModalOpen(false)}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn--primary">
                <i className="fa-solid fa-floppy-disk"></i> Guardar Suite
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteConfirm}
        itemName={`la suite ${suiteToDelete}`} 
      />
    </>
  );
}