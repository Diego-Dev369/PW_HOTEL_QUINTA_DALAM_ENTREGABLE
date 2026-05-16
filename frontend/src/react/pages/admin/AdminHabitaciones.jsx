import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { fetchRooms, updateRoom } from '../../services/staffApi';

const STATUS_LABELS = {
  ACTIVE: 'Activa',
  INACTIVE: 'Inactiva',
  MAINTENANCE: 'Mantenimiento',
};

const STATUS_BADGE = {
  ACTIVE: 'admin-badge--confirmed',
  INACTIVE: 'admin-badge--cancelled',
  MAINTENANCE: 'admin-badge--pending',
};

export default function AdminHabitaciones() {
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [isSuiteModalOpen, setIsSuiteModalOpen] = useState(false);
  const [editingSuite, setEditingSuite] = useState(null); // Room completa en edición

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [suiteToDelete, setSuiteToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // ── Carga inicial desde API real ──
  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    setLoading(true);
    setApiError(null);
    try {
      const data = await fetchRooms();
      setSuites(data || []);
    } catch (e) {
      setApiError(e?.response?.data?.message || 'No fue posible cargar las habitaciones. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  }

  // ── Abrir modal de edición cargando datos actuales ──
  const handleEdit = (suite) => {
    setEditingSuite(suite);
    reset({
      nombre: suite.name,
      subtitulo: suite.subtitle || '',
      categoria: suite.category,
      descripcion: suite.description || '',
      precio: suite.nightlyRateAmount,
      capacidad: suite.capacity,
      bedType: suite.bedType || '',
      status: suite.status,
      featured: suite.featured,
    });
    setSaveError(null);
    setIsSuiteModalOpen(true);
  };

  const closeSuiteModal = () => {
    setIsSuiteModalOpen(false);
    setEditingSuite(null);
    setSaveError(null);
    reset();
  };

  // ── Submit: PUT real al backend ──
  const onSubmitSuite = async (data) => {
    if (!editingSuite) return;
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        name: data.nombre.trim(),
        subtitle: data.subtitulo?.trim() || null,
        category: data.categoria,
        description: data.descripcion?.trim() || null,
        capacity: Number(data.capacidad),
        bedType: data.bedType?.trim() || null,
        status: data.status || 'ACTIVE',
        featured: Boolean(data.featured),
        nightlyRateGross: data.precio ? Number(data.precio) : null,
        currency: 'MXN',
      };
      const updated = await updateRoom(editingSuite.id, payload);
      // Actualizar la suite en la lista local sin refetch completo
      setSuites((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      closeSuiteModal();
    } catch (e) {
      setSaveError(e?.response?.data?.message || 'Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  // ── Eliminar (solo UI por ahora: el backend usa soft-delete vía status=INACTIVE) ──
  const openDeleteModal = (suite) => {
    setSuiteToDelete(suite);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    // El backend no tiene endpoint DELETE de rooms (por diseño — integridad de reservas).
    // Desactivamos la suite poniendo status=INACTIVE como parche enterprise correcto.
    if (!suiteToDelete) { setIsDeleteModalOpen(false); return; }
    try {
      const payload = {
        name: suiteToDelete.name,
        subtitle: suiteToDelete.subtitle || null,
        category: suiteToDelete.category,
        description: suiteToDelete.description || null,
        capacity: suiteToDelete.capacity,
        bedType: suiteToDelete.bedType || null,
        status: 'INACTIVE',
        featured: false,
        nightlyRateGross: null,
        currency: 'MXN',
      };
      const updated = await updateRoom(suiteToDelete.id, payload);
      setSuites((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch {
      // Si falla, refetch completo
      loadRooms();
    } finally {
      setIsDeleteModalOpen(false);
      setSuiteToDelete(null);
    }
  };

  // ── Filtrado local por nombre o categoría ──
  const filteredSuites = suites.filter((suite) => {
    const term = searchTerm.toLowerCase();
    return (
      (suite.name || '').toLowerCase().includes(term) ||
      (suite.category || '').toLowerCase().includes(term)
    );
  });

  return (
    <>
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Gestión de <em>Habitaciones</em></h1>
            <p className="admin-page-subtitle">Edita suites del hotel. Los cambios se persisten en base de datos.</p>
          </div>
          <button className="admin-btn admin-btn--primary" onClick={loadRooms} disabled={loading}>
            <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-rotate-right'}`}></i>
            {loading ? ' Cargando…' : ' Refrescar'}
          </button>
        </div>

        {/* ── Error API ── */}
        {apiError && (
          <p className="admin-card" style={{ color: '#a33', padding: '1rem', marginBottom: '1rem' }}>
            <i className="fa-solid fa-triangle-exclamation"></i> {apiError}
          </p>
        )}

        <section className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-bed"></i> Suites registradas</h2>
            <div className="admin-search">
              <i className="fa-solid fa-magnifying-glass"></i>
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
                  <th>Suite</th><th>Categoría</th><th>Capacidad</th><th>Precio/noche</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Cargando habitaciones…</td></tr>
                ) : filteredSuites.length > 0 ? (
                  filteredSuites.map((suite) => (
                    <tr key={suite.id} className={suite.featured ? 'admin-table__row--featured' : ''}>
                      <td>
                        <div className="admin-table__room-info">
                          <div>
                            <strong>{suite.name}</strong>
                            <small>{suite.subtitle}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${suite.category?.toLowerCase().includes('superior') ? 'admin-badge--gold' : 'admin-badge--neutral'}`}>
                          {suite.category}
                        </span>
                      </td>
                      <td>{suite.capacity} personas</td>
                      <td className="admin-table__price">
                        ${Number(suite.nightlyRateAmount).toLocaleString('es-MX', { minimumFractionDigits: 2 })} {suite.currency}
                      </td>
                      <td>
                        <span className={`admin-badge ${STATUS_BADGE[suite.status] || 'admin-badge--neutral'}`}>
                          {STATUS_LABELS[suite.status] || suite.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button
                            className="admin-icon-btn admin-icon-btn--edit"
                            title="Editar"
                            onClick={() => handleEdit(suite)}
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            className="admin-icon-btn admin-icon-btn--delete"
                            title="Desactivar"
                            onClick={() => openDeleteModal(suite)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                      {searchTerm ? `No se encontraron suites para "${searchTerm}"` : 'No hay habitaciones registradas.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ── MODAL EDICIÓN ── */}
      <div className={`admin-modal-backdrop ${isSuiteModalOpen ? 'is-open' : ''}`}>
        <div className="admin-modal">
          <div className="admin-modal__header">
            <h2 className="admin-modal__title">
              <i className="fa-solid fa-bed"></i> Editar Suite
            </h2>
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
                  className="admin-form__input"
                  type="text"
                  placeholder="Ej. Historia & Elegancia"
                  {...register("subtitulo")}
                />
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Categoría</label>
                <input
                  className={`admin-form__input ${errors.categoria ? 'input-error' : ''}`}
                  type="text"
                  placeholder="Ej. Suite Superior"
                  {...register("categoria", { required: "La categoría es obligatoria" })}
                />
                {errors.categoria && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.categoria.message}</span>}
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Precio / noche (MXN, impuestos incluidos)</label>
                <input
                  className={`admin-form__input ${errors.precio ? 'input-error' : ''}`}
                  type="number"
                  step="0.01"
                  placeholder="3200.00"
                  {...register("precio", {
                    min: { value: 1, message: "El precio debe ser mayor a 0" }
                  })}
                />
                {errors.precio && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.precio.message}</span>}
                <small style={{color: '#888', fontSize: '11px'}}>Este precio se cobra exactamente en Stripe (IVA + ISH ya incluidos).</small>
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
                    max: { value: 20, message: "Máximo 20 personas" }
                  })}
                />
                {errors.capacidad && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.capacidad.message}</span>}
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Tipo de cama</label>
                <input
                  className="admin-form__input"
                  type="text"
                  placeholder="Ej. 1 King Size"
                  {...register("bedType")}
                />
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Estado</label>
                <select className="admin-form__input" {...register("status", { required: true })}>
                  <option value="ACTIVE">Activa</option>
                  <option value="INACTIVE">Inactiva</option>
                  <option value="MAINTENANCE">Mantenimiento</option>
                </select>
              </div>
            </div>

            <div className="admin-form__group admin-form__group--full">
              <label className="admin-form__label">Descripción</label>
              <textarea
                className="admin-form__input"
                rows="3"
                placeholder="Descripción de la suite…"
                {...register("descripcion")}
              ></textarea>
            </div>

            <div className="admin-form__group admin-form__group--full">
              <label className="admin-checkbox admin-checkbox--featured">
                <input type="checkbox" {...register("featured")} /> <i className="fa-solid fa-star"></i> Marcar como suite <strong>destacada</strong>
              </label>
            </div>

            {saveError && (
              <p style={{ color: '#a33', fontSize: '13px', margin: '0.5rem 0' }}>
                <i className="fa-solid fa-triangle-exclamation"></i> {saveError}
              </p>
            )}

            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeSuiteModal} disabled={saving}>
                Cancelar
              </button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? <><i className="fa-solid fa-spinner fa-spin"></i> Guardando…</> : <><i className="fa-solid fa-floppy-disk"></i> Guardar Suite</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSuiteToDelete(null); }}
        onConfirm={handleDeleteConfirm}
        itemName={`la suite ${suiteToDelete?.name}`}
      />
    </>
  );
}