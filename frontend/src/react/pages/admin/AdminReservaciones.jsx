import { useState } from 'react';
import { useForm } from 'react-hook-form';
import MetricCard from '../../components/admin/MetricCard';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

const mockReservaciones = [
  {
    id: '#RES-8042',
    huespedNombre: 'Javier Villanueva',
    huespedCorreo: 'javier.v@email.com',
    huespedIniciales: 'JV',
    suite: 'Pátzcuaro',
    personas: 2,
    fechaEntrada: '2026-03-24',
    fechaSalida: '2026-03-28',
    estado: 'Confirmada'
  },
  {
    id: '#RES-8043',
    huespedNombre: 'Ana Sofía Ruiz',
    huespedCorreo: 'ana.ruiz@email.com',
    huespedIniciales: 'AR',
    suite: 'Uruapan',
    personas: 2,
    fechaEntrada: '2026-04-10',
    fechaSalida: '2026-04-12',
    estado: 'Pendiente'
  }
];

export default function AdminReservaciones() {
  const [reservaciones] = useState(mockReservaciones);
  const [activeModal, setActiveModal] = useState(null); // 'view', 'edit', 'delete'
  const [currentRes, setCurrentRes] = useState(null); // Guarda la reserva seleccionada
  
  // ── ESTADO PARA LA BÚSQUEDA ──
  const [searchTerm, setSearchTerm] = useState('');

  // Hook Form del modal de edición
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const openModal = (type, res) => {
    setCurrentRes(res);
    setActiveModal(type);
    
    // Si vamos a editar, se pre-llena el formulario con setValue de la libreia
    if(type === 'edit' && res) {
      setValue("huespedNombre", res.huespedNombre);
      setValue("suite", res.suite);
      setValue("estado", res.estado);
      setValue("fechaEntrada", res.fechaEntrada);
      setValue("fechaSalida", res.fechaSalida);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setCurrentRes(null);
    reset();
  };

  const onSubmitEdit = (data) => {
    console.log("Datos de reservación actualizados en BD:", data);
    alert(`Reservación ${currentRes.id} actualizada con éxito.`);
    closeModal();
  };

  const handleConfirmDelete = () => {
    console.log(`Reservación ${currentRes?.id} eliminada.`);
    alert(`La reservación ${currentRes?.id} fue cancelada.`);
    closeModal();
  };

  // ── LÓGICA DE FILTRADO ──
  const filteredReservaciones = reservaciones.filter((res) => {
    const term = searchTerm.toLowerCase();
    return (
      res.huespedNombre.toLowerCase().includes(term) ||
      res.id.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Gestión de <em>Reservaciones</em></h1>
            <p className="admin-page-subtitle">Administra, filtra y confirma las estancias de los huéspedes.</p>
          </div>
        </div>

        <div className="admin-metrics">
          <MetricCard title="Total Reservas" value={reservaciones.length.toString()} icon="fa-list-check" colorClass="metric-card__icon--gold" />
          <MetricCard title="Pendientes" value={reservaciones.filter(r => r.estado === 'Pendiente').length.toString()} icon="fa-clock" colorClass="metric-card__icon--adobe" />
          <MetricCard title="Confirmadas" value={reservaciones.filter(r => r.estado === 'Confirmada').length.toString()} icon="fa-circle-check" colorClass="metric-card__icon--forest" />
        </div>

        <section className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title">
              <i className="fa-solid fa-calendar-days"></i> Listado Maestro
            </h2>
            <div className="admin-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="search" 
                placeholder="Buscar por huésped o folio..." 
                className="admin-search__input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Huésped</th>
                  <th>Suite</th>
                  <th>Estancia (Entrada - Salida)</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* ── Aqui se usa el array filtrado ── */}
                {filteredReservaciones.length > 0 ? (
                  filteredReservaciones.map((res) => (
                    <tr key={res.id}>
                      <td className="admin-table__id">{res.id}</td>
                      <td>
                        <div className="admin-table__guest">
                          <div className="admin-table__avatar">{res.huespedIniciales}</div>
                          <div>
                            <strong>{res.huespedNombre}</strong>
                            <small>{res.huespedCorreo}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{res.suite}</strong>
                        <small style={{color: 'var(--admin-text-muted)', display: 'block'}}>{res.personas} huéspedes</small>
                      </td>
                      <td>
                        <strong>{res.fechaEntrada}</strong>
                        <small style={{color: 'var(--admin-text-muted)', display: 'block'}}>→ {res.fechaSalida}</small>
                      </td>
                      <td>
                        <span className={`admin-badge ${res.estado === 'Confirmada' ? 'admin-badge--confirmed' : 'admin-badge--pending'}`}>
                          {res.estado}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button className="admin-icon-btn admin-icon-btn--view" title="Ver detalles" onClick={() => openModal('view', res)}>
                            <i className="fa-solid fa-eye"></i>
                          </button>
                          <button className="admin-icon-btn admin-icon-btn--edit" title="Editar" onClick={() => openModal('edit', res)}>
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button className="admin-icon-btn admin-icon-btn--delete" title="Cancelar Reserva" onClick={() => openModal('delete', res)}>
                            <i className="fa-solid fa-ban"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                      No se encontraron reservaciones para "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ── MODAL: VER DETALLES ── */}
      {activeModal === 'view' && currentRes && (
        <div className="admin-modal-backdrop is-open">
          <div className="admin-modal admin-modal--sm">
            <div className="admin-modal__header">
              <h2 className="admin-modal__title"><i className="fa-solid fa-list-check"></i> Detalles de Reserva</h2>
              <button type="button" className="admin-modal__close" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="admin-modal__body" style={{ padding: '1.5rem', color: '#EDE8DE' }}>
              <p><strong>Folio:</strong> {currentRes.id}</p>
              <p><strong>Huésped:</strong> {currentRes.huespedNombre} ({currentRes.huespedCorreo})</p>
              <p><strong>Suite:</strong> {currentRes.suite}</p>
              <p><strong>Personas:</strong> {currentRes.personas}</p>
              <p><strong>Llegada:</strong> {currentRes.fechaEntrada}</p>
              <p><strong>Salida:</strong> {currentRes.fechaSalida}</p>
              <p><strong>Estado:</strong> <span style={{color: '#C9973A'}}>{currentRes.estado}</span></p>
            </div>
            <div className="admin-modal__actions">
              <button className="admin-btn admin-btn--primary" onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EDITAR RESERVACIÓN ── */}
      <div className={`admin-modal-backdrop ${activeModal === 'edit' ? 'is-open' : ''}`}>
        <div className="admin-modal admin-modal--sm">
          <div className="admin-modal__header">
            <h2 className="admin-modal__title"><i className="fa-solid fa-pen"></i> Editar Reserva {currentRes?.id}</h2>
            <button type="button" className="admin-modal__close" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
          </div>
          <form className="admin-modal__form" onSubmit={handleSubmit(onSubmitEdit)} noValidate>
            
            <div className="admin-form__group">
              <label className="admin-form__label">Nombre del Huésped</label>
              <input className={`admin-form__input ${errors.huespedNombre ? 'input-error' : ''}`} type="text" {...register("huespedNombre", { required: "Requerido" })} />
            </div>

            <div className="admin-form-grid">
              <div className="admin-form__group">
                <label className="admin-form__label">Llegada</label>
                <input className={`admin-form__input ${errors.fechaEntrada ? 'input-error' : ''}`} type="date" {...register("fechaEntrada", { required: "Requerida" })} />
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Salida</label>
                <input className={`admin-form__input ${errors.fechaSalida ? 'input-error' : ''}`} type="date" {...register("fechaSalida", { required: "Requerida" })} />
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form__group">
                <label className="admin-form__label">Suite Asignada</label>
                <select className="admin-form__input" {...register("suite")}>
                  <option value="Uruapan">Uruapan</option>
                  <option value="Pátzcuaro">Pátzcuaro</option>
                  <option value="Paracho">Paracho</option>
                </select>
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Estado</label>
                <select className="admin-form__input" {...register("estado")}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn--primary">Actualizar</button>
            </div>
          </form>
        </div>
      </div>

      {/* ── MODAL: CANCELAR - ELIMINAR ── */}
      <ConfirmDeleteModal 
        isOpen={activeModal === 'delete'} 
        onClose={closeModal} 
        onConfirm={handleConfirmDelete}
        itemName={`la reservación ${currentRes?.id}`} 
      />
    </>
  );
}