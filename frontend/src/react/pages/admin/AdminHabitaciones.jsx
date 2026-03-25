import { useState } from 'react';
import { useForm } from 'react-hook-form'; 
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

const mockSuites = [
  { id: 1, nombre: 'Uruapan', subtitulo: 'Naturaleza & Tradición', categoria: 'Suite Deluxe', capacidad: 2, precio: 2500, estado: 'Activa', destacada: false, imagen: '/images/rooms/204-uruapan.jpeg' },
  { id: 2, nombre: 'Pátzcuaro', subtitulo: 'Historia & Elegancia', categoria: 'Suite Superior', capacidad: 4, precio: 3800, estado: 'Activa', destacada: true, imagen: '/images/rooms/104-patzcuaro.jpeg' }
];

export default function AdminHabitaciones() {
  const [suites, setSuites] = useState(mockSuites); 
  const [isSuiteModalOpen, setIsSuiteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [suiteToDelete, setSuiteToDelete] = useState(null);

  // ── ESTADO PARA LA BÚSQUEDA ──
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const openDeleteModal = (suiteName) => {
    setSuiteToDelete(suiteName);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log(`Suite ${suiteToDelete} eliminada (simulación)`);
    setIsDeleteModalOpen(false);
  };

  const closeSuiteModal = () => {
    setIsSuiteModalOpen(false);
    reset(); 
  };

  const onSubmitSuite = (data) => {
    console.log("Datos de la suite listos para BD:", data);
    alert("¡Suite guardada con éxito!\nRevisa la consola para ver los datos.");
    closeSuiteModal();
  };

  // ── LÓGICA DE FILTRADO (Por nombre o categoría) ──
  const filteredSuites = suites.filter((suite) => {
    const term = searchTerm.toLowerCase();
    return (
      suite.nombre.toLowerCase().includes(term) ||
      suite.categoria.toLowerCase().includes(term)
    );
  });

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
              {/* ── INPUT DE BÚSQUEDA CONECTADO ── */}
              <input 
                type="search" 
                placeholder="Buscar suite o categoría..." 
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
                  <th>Suite</th><th>Categoría</th><th>Capacidad</th><th>Precio</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* ── USAMOS LA LISTA FILTRADA AQUÍ ── */}
                {filteredSuites.length > 0 ? (
                  filteredSuites.map((suite) => (
                    <tr key={suite.id} className={suite.destacada ? 'admin-table__row--featured' : ''}>
                      <td>
                        <div className="admin-table__room-info">
                          <div className="admin-table__room-thumb" style={{ backgroundImage: `url("${suite.imagen}")` }}></div>
                          <div>
                            <strong>{suite.nombre}</strong>
                            <small>{suite.subtitulo}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${suite.categoria === 'Suite Superior' ? 'admin-badge--gold' : 'admin-badge--neutral'}`}>
                          {suite.categoria}
                        </span>
                      </td>
                      <td>{suite.capacidad} personas</td>
                      <td className="admin-table__price">${suite.precio} MXN</td>
                      <td><span className="admin-badge admin-badge--confirmed">{suite.estado}</span></td>
                      <td>
                        <div className="admin-table__actions">
                          <button className="admin-icon-btn admin-icon-btn--edit" title="Editar" onClick={() => setIsSuiteModalOpen(true)}>
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button className="admin-icon-btn admin-icon-btn--delete" title="Eliminar" onClick={() => openDeleteModal(suite.nombre)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                      No se encontraron suites para "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL CON FORMULARIO VALIDADO (se mantiene igual) */}
      <div className={`admin-modal-backdrop ${isSuiteModalOpen ? 'is-open' : ''}`}>
        <div className="admin-modal">
          <div className="admin-modal__header">
            <h2 className="admin-modal__title"><i className="fa-solid fa-bed"></i> { 'Gestión de Suite' }</h2>
            <button type="button" className="admin-modal__close" onClick={closeSuiteModal}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <form className="admin-modal__form" onSubmit={handleSubmit(onSubmitSuite)} noValidate>
            <div className="admin-form-grid">
              
              <div className="admin-form__group">
                <label className="admin-form__label">Nombre de la suite</label>
                <input 
                  className={`admin-form__input ${errors.nombre ? 'input-error' : ''}`} 
                  type="text" 
                  placeholder="Ej. Pátzcuaro"
                  {...register("nombre", { required: "El nombre es obligatorio" })} 
                />
                {errors.nombre && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.nombre.message}</span>}
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Subtítulo</label>
                <input 
                  className={`admin-form__input ${errors.subtitulo ? 'input-error' : ''}`} 
                  type="text" 
                  placeholder="Ej. Historia & Elegancia"
                  {...register("subtitulo", { required: "El subtítulo es obligatorio" })} 
                />
                {errors.subtitulo && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.subtitulo.message}</span>}
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Categoría</label>
                <select 
                  className="admin-form__input" 
                  defaultValue=""
                  {...register("categoria", { required: "Selecciona una categoría" })}
                >
                  <option value="" disabled>Selecciona...</option>
                  <option value="deluxe">Suite Deluxe</option>
                  <option value="superior">Suite Superior</option>
                  <option value="estudio">Suite Estudio</option>
                </select>
                {errors.categoria && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.categoria.message}</span>}
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Precio / noche (MXN)</label>
                <input 
                  className={`admin-form__input ${errors.precio ? 'input-error' : ''}`} 
                  type="number" 
                  placeholder="3800"
                  {...register("precio", { 
                    required: "El precio es obligatorio",
                    min: { value: 1, message: "El precio debe ser mayor a 0" }
                  })} 
                />
                {errors.precio && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.precio.message}</span>}
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Capacidad (personas)</label>
                <input 
                  className={`admin-form__input ${errors.capacidad ? 'input-error' : ''}`} 
                  type="number" 
                  placeholder="4"
                  {...register("capacidad", { 
                    required: "La capacidad es obligatoria",
                    min: { value: 1, message: "Mínimo 1 persona" },
                    max: { value: 10, message: "Máximo 10 personas" }
                  })} 
                />
                {errors.capacidad && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.capacidad.message}</span>}
              </div>
            </div>

            <div className="admin-form__group admin-form__group--full">
              <label className="admin-form__label">Descripción larga</label>
              <textarea 
                className={`admin-form__input ${errors.descripcion ? 'input-error' : ''}`} 
                rows="3" 
                placeholder="Elegancia clásica..."
                {...register("descripcion", { required: "La descripción es obligatoria" })}
              ></textarea>
              {errors.descripcion && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.descripcion.message}</span>}
            </div>

            <div className="admin-form__group admin-form__group--full">
              <label className="admin-form__label">Amenidades incluidas</label>
              <div className="admin-checkboxes">
                <label className="admin-checkbox"><input type="checkbox" {...register("amenidades.wifi")} /> <i className="fa-solid fa-wifi"></i> Wi-Fi</label>
                <label className="admin-checkbox"><input type="checkbox" {...register("amenidades.aire")} /> <i className="fa-solid fa-snowflake"></i> Aire Acond.</label>
                <label className="admin-checkbox"><input type="checkbox" {...register("amenidades.desayuno")} /> <i className="fa-solid fa-mug-hot"></i> Desayuno</label>
                <label className="admin-checkbox"><input type="checkbox" {...register("amenidades.tina")} /> <i className="fa-solid fa-bath"></i> Tina</label>
              </div>
            </div>

            <div className="admin-form__group admin-form__group--full">
              <label className="admin-checkbox admin-checkbox--featured">
                <input type="checkbox" {...register("destacada")} /> <i className="fa-solid fa-star"></i> Marcar como suite <strong>destacada</strong>
              </label>
            </div>

            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeSuiteModal}>Cancelar</button>
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