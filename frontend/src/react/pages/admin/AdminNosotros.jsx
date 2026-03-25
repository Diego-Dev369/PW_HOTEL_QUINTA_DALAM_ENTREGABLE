import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

// Mock de la BD para los valores
const mockValores = [
  { id: 1, titulo: 'Hospitalidad', icono: 'fa-handshake', descripcion: 'Cada huésped es parte de nuestra familia. El calor michoacano en cada gesto.' },
  { id: 2, titulo: 'Sustentabilidad', icono: 'fa-leaf', descripcion: 'Compromiso con el medio ambiente y las comunidades locales de Michoacán.' },
  { id: 3, titulo: 'Cultura', icono: 'fa-palette', descripcion: 'Preservamos y celebramos las tradiciones artesanales y gastronómicas.' },
  { id: 4, titulo: 'Excelencia', icono: 'fa-gem', descripcion: 'Estándares de calidad que elevan cada detalle de tu experiencia.' }
];

export default function AdminNosotros() {
  const [valores, setValores] = useState(mockValores);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [iconPreview, setIconPreview] = useState('fa-solid fa-star');
  const [editingId, setEditingId] = useState(null);

  // Configuración de React Hook Form 
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleEditClick = (id) => setEditingId(id);
  const handleCancelEdit = () => setEditingId(null);
  
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  // Función al enviar el formulario del modal de valores
  const onSubmitValor = (data) => {
    console.log("Nuevo valor listo para BD:", data);
    alert("¡Valor guardado con éxito!");
    closeModal();
  };

  // Función genérica para guardar secciones estáticas
  const onSubmitData = (data) => {
    console.log("Sección actualizada:", data);
    alert("¡Sección guardada correctamente!");
  };

  return (
    <>
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Editor — <em>Nosotros</em></h1>
            <p className="admin-page-subtitle">Edita la historia, misión, visión y valores del hotel.</p>
          </div>
        </div>

        {/* ── 1. HERO ── */}
        <section className="admin-card admin-editor-section" aria-labelledby="h2-nos-hero">
          <div className="admin-card__header">
            <h2 className="admin-card__title" id="h2-nos-hero"><i className="fa-solid fa-image"></i> Hero de la página</h2>
          </div>
          <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form-grid">
              <div className="admin-form__group">
                <label className="admin-form__label">Eyebrow</label>
                <input className="admin-form__input" type="text" defaultValue="Hotel Quinta Dalam" {...register("heroEyebrow")} />
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Título</label>
                <input className="admin-form__input" type="text" defaultValue="Nuestra Historia" {...register("heroTitle")} />
              </div>
              <div className="admin-form__group admin-form__group--full">
                <label className="admin-form__label">Subtítulo</label>
                <input className="admin-form__input" type="text" defaultValue="Pasión por Michoacán, vocación por la hospitalidad" {...register("heroSubtitle")} />
              </div>
            </div>
            <div className="admin-editor-actions">
              <button type="button" className="admin-btn admin-btn--ghost">Descartar</button>
              <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Guardar Hero</button>
            </div>
          </form>
        </section>

        {/* ── 2. HISTORIA ── */}
        <section className="admin-card admin-editor-section" aria-labelledby="h2-historia">
          <div className="admin-card__header">
            <h2 className="admin-card__title" id="h2-historia"><i className="fa-solid fa-book-open"></i> Nuestra Historia (Legado Familiar)</h2>
          </div>
          <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form-grid">
              <div className="admin-form__group">
                <label className="admin-form__label">Eyebrow</label>
                <input className="admin-form__input" type="text" defaultValue="Legado Familiar" {...register("historiaEyebrow")} />
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Título</label>
                <input className="admin-form__input" type="text" defaultValue="Nuestra Historia" {...register("historiaTitle")} />
              </div>
              <div className="admin-form__group admin-form__group--full">
                <label className="admin-form__label">Pie de foto (Caption de la imagen)</label>
                <input className="admin-form__input" type="text" defaultValue="El refugio familiar que se transformó en un tributo a Michoacán." {...register("historiaCaption")} />
              </div>
              
              <div className="admin-form__group admin-form__group--full">
                <label className="admin-form__label">Párrafo Introductorio (Lead)</label>
                <textarea className="admin-form__input" rows="2" defaultValue="Quinta Dalam nace en Quencio, un pueblito pintoresco de Michoacán con un hermoso nacimiento de agua." {...register("historiaP1")}></textarea>
              </div>
              
              <div className="admin-form__group admin-form__group--full">
                <label className="admin-form__label">Párrafo 2</label>
                <textarea className="admin-form__input" rows="3" defaultValue="Originalmente concebido por Daniel, un joven visionario, y su padre Roberto, el proyecto comenzó como un hogar familiar destinado a dejar una huella positiva..." {...register("historiaP2")}></textarea>
              </div>
            </div>
            <div className="admin-editor-actions">
              <button type="button" className="admin-btn admin-btn--ghost">Descartar</button>
              <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Guardar Historia</button>
            </div>
          </form>
        </section>

        {/* ── 3. MISIÓN Y VISIÓN ── */}
        <section className="admin-card admin-editor-section" aria-labelledby="h2-mision">
          <div className="admin-card__header">
            <h2 className="admin-card__title" id="h2-mision"><i className="fa-solid fa-eye"></i> Misión & Visión</h2>
          </div>
          <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form-grid">
              {/* Bloque Misión */}
              <div className="admin-form__group admin-form__group--full" style={{ borderBottom: '1px dashed rgba(201,151,58,0.3)', paddingBottom: '1rem' }}>
                <h3 style={{ color: '#C9973A', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Nuestra Misión</h3>
                <div className="admin-form-grid">
                  <div className="admin-form__group">
                    <label className="admin-form__label">Título Misión</label>
                    <input className="admin-form__input" type="text" defaultValue="Nuestra Misión" {...register("misionTitle")} />
                  </div>
                  <div className="admin-form__group admin-form__group--full">
                    <label className="admin-form__label">Texto Misión</label>
                    <textarea className="admin-form__input" rows="3" defaultValue="Brindar una experiencia de hospitalidad auténtica que celebre la riqueza cultural de los Pueblos Mágicos de Michoacán..." {...register("misionText")}></textarea>
                  </div>
                </div>
              </div>

              {/* Bloque Visión */}
              <div className="admin-form__group admin-form__group--full" style={{ paddingTop: '0.5rem' }}>
                <h3 style={{ color: '#C9973A', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Nuestra Visión</h3>
                <div className="admin-form-grid">
                  <div className="admin-form__group">
                    <label className="admin-form__label">Título Visión</label>
                    <input className="admin-form__input" type="text" defaultValue="Nuestra Visión" {...register("visionTitle")} />
                  </div>
                  <div className="admin-form__group admin-form__group--full">
                    <label className="admin-form__label">Texto Visión</label>
                    <textarea className="admin-form__input" rows="3" defaultValue="Ser el referente de hospitalidad boutique en Michoacán, reconocidos por preservar el patrimonio cultural..." {...register("visionText")}></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-editor-actions">
              <button type="button" className="admin-btn admin-btn--ghost">Descartar</button>
              <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Guardar Textos</button>
            </div>
          </form>
        </section>

        {/* ── 4. VALORES DINÁMICOS ── */}
        <section className="admin-card admin-editor-section">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-gem"></i> Valores</h2>
            <button type="button" className="admin-btn admin-btn--primary admin-btn--sm" onClick={() => setIsModalOpen(true)}>
              <i className="fa-solid fa-plus"></i> Nuevo valor
            </button>
          </div>
          
          <div className="admin-valores-list" style={{ padding: '1.5rem' }}>
            {valores.map((valor) => (
              <div key={valor.id} className={`admin-valor-item ${editingId === valor.id ? 'admin-valor-item--editing' : ''}`} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid rgba(201,151,58,0.1)', marginBottom: '1rem' }}>
                <div className="admin-valor-item__icon" style={{ fontSize: '1.5rem', color: '#C9973A', paddingTop: '0.2rem' }}>
                  <i className={`fa-solid ${valor.icono}`}></i>
                </div>
                
                {editingId !== valor.id && (
                  <>
                    <div className="admin-valor-item__read" style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ display: 'block', color: '#EDE8DE', marginBottom: '0.2rem' }}>{valor.titulo}</strong>
                      <span style={{ color: 'rgba(237,232,222,0.6)', fontSize: '0.85rem' }}>{valor.descripcion}</span>
                    </div>
                    <div className="admin-valor-item__actions-read" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" className="admin-icon-btn admin-icon-btn--edit" onClick={() => handleEditClick(valor.id)}><i className="fa-solid fa-pen"></i></button>
                      <button type="button" className="admin-icon-btn admin-icon-btn--delete" onClick={() => setIsDeleteModalOpen(true)}><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </>
                )}

                {/* Modo Edición Inline */}
                {editingId === valor.id && (
                  <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="admin-valor-item__edit admin-form-grid" style={{ flex: 1, gap: '0.75rem 1.5rem' }}>
                      <div className="admin-form__group"><label className="admin-form__label">Título</label><input className="admin-form__input" type="text" defaultValue={valor.titulo} /></div>
                      <div className="admin-form__group"><label className="admin-form__label">Ícono FA</label><input className="admin-form__input" type="text" defaultValue={`fa-solid ${valor.icono}`} /></div>
                      <div className="admin-form__group admin-form__group--full"><label className="admin-form__label">Descripción</label><input className="admin-form__input" type="text" defaultValue={valor.descripcion} /></div>
                    </div>
                    <div className="admin-valor-item__actions-edit" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button type="button" className="admin-btn admin-btn--primary admin-btn--sm" onClick={handleCancelEdit}><i className="fa-solid fa-check"></i></button>
                      <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={handleCancelEdit}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── MODAL VALIDADO: NUEVO VALOR ── */}
      <div className={`admin-modal-backdrop ${isModalOpen ? 'is-open' : ''}`}>
        <div className="admin-modal admin-modal--sm">
          <div className="admin-modal__header">
            <h3 className="admin-modal__title"><i className="fa-solid fa-plus"></i> Nuevo valor</h3>
            <button type="button" className="admin-modal__close" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
          </div>
          
          <form className="admin-modal__form" onSubmit={handleSubmit(onSubmitValor)} noValidate>
            <div className="admin-form__group">
              <label className="admin-form__label">Título *</label>
              <input 
                className={`admin-form__input ${errors.titulo ? 'input-error' : ''}`} 
                type="text" 
                {...register("titulo", { required: "El título es obligatorio" })} 
              />
              {errors.titulo && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.titulo.message}</span>}
            </div>

            <div className="admin-form__group">
              <label className="admin-form__label">Ícono FA *</label>
              <div className="admin-icono-preview-wrap" style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  className={`admin-form__input ${errors.icono ? 'input-error' : ''}`} 
                  type="text" 
                  placeholder="fa-solid fa-star"
                  {...register("icono", { 
                    required: "El ícono es obligatorio",
                    onChange: (e) => setIconPreview(e.target.value)
                  })} 
                />
                <span style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,151,58,0.2)', borderRadius: '6px', color: '#C9973A' }}>
                  <i className={iconPreview}></i>
                </span>
              </div>
              {errors.icono && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.icono.message}</span>}
            </div>

            <div className="admin-form__group">
              <label className="admin-form__label">Descripción *</label>
              <input 
                className={`admin-form__input ${errors.descripcion ? 'input-error' : ''}`} 
                type="text" 
                {...register("descripcion", { required: "La descripción es obligatoria" })} 
              />
              {errors.descripcion && <span style={{color: '#d9534f', fontSize: '12px'}}>{errors.descripcion.message}</span>}
            </div>

            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Crear valor</button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => setIsDeleteModalOpen(false)} itemName="este valor" />
    </>
  );
}