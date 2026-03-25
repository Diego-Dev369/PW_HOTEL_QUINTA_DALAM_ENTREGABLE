import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

const mockExperiencias = [
  { id: 1, titulo: 'Artesanía Tradicional', imagen: '/images/interiores/decoracion1.jpeg' },
  { id: 2, titulo: 'Naturaleza Asombrosa', imagen: '/images/exteriores/vista_manantial.jpeg' }
];

const mockServicios = [
  { id: 1, titulo: 'Habitaciones Premium', descripcion: 'Diseño boutique con máximo confort...', icono: 'fa-bed' },
  { id: 2, titulo: 'Entorno Natural', descripcion: 'Tranquilidad y conexión profunda...', icono: 'fa-tree' }
];

const mockGaleria = [
  { id: 1, imagen: '/images/interiores/decoracion1.jpeg' },
  { id: 2, imagen: '/images/exteriores/vista_manantial.jpeg' }
];

export default function AdminIndex() {
  const [experiencias] = useState(mockExperiencias);
  const [servicios] = useState(mockServicios);
  const [galeria] = useState(mockGaleria);

  const [modalType, setModalType] = useState(null); 
  const [iconPreview, setIconPreview] = useState('fa-solid fa-bed');

  // Hook Form para los Modales y Formularios
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const closeModal = () => {
    setModalType(null);
    reset();
  };

  // Función genérica al enviar cualquier formulario o modal
  const onSubmitData = (data) => {
    console.log(`Datos guardados/actualizados listos para BD:`, data);
    alert(`¡Cambios guardados con éxito!`);
    if(modalType) closeModal();
  };

  return (
    <>
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Editor — <em>Página de Inicio</em></h1>
            <p className="admin-page-subtitle">Edita, crea y elimina el contenido visible en la página principal.</p>
          </div>
          <Link to="/" target="_blank" className="admin-btn admin-btn--ghost">
            <i className="fa-solid fa-eye"></i> Ver index
          </Link>
        </div>

        {/* ── MAPA DE SECCIONES ── */}
        <nav className="admin-index-map" aria-label="Secciones del index">
          <p className="admin-index-map__label"><i className="fa-solid fa-map"></i> Secciones</p>
          <div className="admin-index-map__list">
            <a href="#sec-hero" className="admin-index-map__item"><i className="fa-solid fa-image"></i> Hero</a>
            <i className="fa-solid fa-chevron-right admin-index-map__sep"></i>
            <a href="#sec-experiencias" className="admin-index-map__item"><i className="fa-solid fa-camera"></i> Experiencias</a>
            <i className="fa-solid fa-chevron-right admin-index-map__sep"></i>
            <a href="#sec-servicios" className="admin-index-map__item"><i className="fa-solid fa-concierge-bell"></i> Servicios</a>
            <i className="fa-solid fa-chevron-right admin-index-map__sep"></i>
            <a href="#sec-galeria" className="admin-index-map__item"><i className="fa-solid fa-images"></i> Galería</a>
            <i className="fa-solid fa-chevron-right admin-index-map__sep"></i>
            <a href="#sec-about" className="admin-index-map__item"><i className="fa-solid fa-heart"></i> Nosotros</a>
            <i className="fa-solid fa-chevron-right admin-index-map__sep"></i>
            <a href="#sec-cta" className="admin-index-map__item"><i className="fa-solid fa-bullhorn"></i> CTA</a>
          </div>
        </nav>

        {/* ── 1. HERO PRINCIPAL ── */}
        <section className="admin-card" id="sec-hero">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-image"></i> Hero principal</h2>
          </div>
          <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form-grid">
              <div className="admin-form__group">
                <label className="admin-form__label">Título</label>
                <input className={`admin-form__input ${errors.heroTitulo ? 'input-error' : ''}`} type="text" defaultValue="Vive la Magia de Michoacán" {...register("heroTitulo", { required: "Requerido" })} />
              </div>
              <div className="admin-form__group admin-form__group--full">
                <label className="admin-form__label">Subtítulo</label>
                <input className={`admin-form__input ${errors.heroSubtitulo ? 'input-error' : ''}`} type="text" defaultValue="Descubre la hospitalidad, artesanía y cultura de los Pueblos Mágicos." {...register("heroSubtitulo", { required: "Requerido" })} />
              </div>
            </div>
            <div className="admin-editor-actions">
              <button type="button" className="admin-btn admin-btn--ghost">Descartar</button>
              <button type="submit" className="admin-btn admin-btn--primary">Guardar Hero</button>
            </div>
          </form>
        </section>

        {/* ── 2. EXPERIENCIAS DINÁMICAS ── */}
        <section className="admin-card" id="sec-experiencias">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-camera"></i> Experiencias</h2>
            <button type="button" className="admin-btn admin-btn--primary admin-btn--sm" onClick={() => setModalType('experiencia')}>
              <i className="fa-solid fa-plus"></i> Nueva experiencia
            </button>
          </div>
          <div className="admin-editor-subsection">
            <div className="admin-crud-list">
              {experiencias.map(exp => (
                <div key={exp.id} className="admin-crud-item">
                  <div className="admin-crud-item__icon-wrap" style={{ background: `url("${exp.imagen}") center/cover` }}></div>
                  <div className="admin-crud-item__info"><strong>{exp.titulo}</strong></div>
                  <div className="admin-crud-item__actions">
                    <button className="admin-icon-btn admin-icon-btn--edit" onClick={() => setModalType('experiencia')}><i className="fa-solid fa-pen"></i></button>
                    <button className="admin-icon-btn admin-icon-btn--delete" onClick={() => setModalType('delete')}><i className="fa-solid fa-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. SERVICIOS DINÁMICOS ── */}
        <section className="admin-card" id="sec-servicios">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-concierge-bell"></i> Servicios de Distinción</h2>
            <button type="button" className="admin-btn admin-btn--primary admin-btn--sm" onClick={() => setModalType('servicio')}>
              <i className="fa-solid fa-plus"></i> Nuevo servicio
            </button>
          </div>
          
          <div className="admin-editor-subsection">
            <div className="admin-crud-list">
              {servicios.map(serv => (
                <div key={serv.id} className="admin-crud-item">
                  <div className="admin-crud-item__icon-wrap"><i className={`fa-solid ${serv.icono}`}></i></div>
                  <div className="admin-crud-item__info"><strong>{serv.titulo}</strong><small>{serv.descripcion}</small></div>
                  <div className="admin-crud-item__actions">
                    <button className="admin-icon-btn admin-icon-btn--edit" onClick={() => setModalType('servicio')}><i className="fa-solid fa-pen"></i></button>
                    <button className="admin-icon-btn admin-icon-btn--delete" onClick={() => setModalType('delete')}><i className="fa-solid fa-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. GALERÍA DINÁMICA ── */}
        <section className="admin-card" id="sec-galeria">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-images"></i> Galería (Atmósfera)</h2>
            <button type="button" className="admin-btn admin-btn--primary admin-btn--sm" onClick={() => setModalType('galeria')}>
              <i className="fa-solid fa-plus"></i> Nueva imagen
            </button>
          </div>

          <div className="admin-editor-subsection">
            <div className="admin-crud-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', padding: '1.5rem' }}>
              {galeria.map(img => (
                <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(201,151,58,0.2)', aspectRatio: '1/1' }}>
                  <div style={{ width: '100%', height: '100%', background: `url("${img.imagen}") center/cover` }}></div>
                  <button 
                    type="button" 
                    className="admin-icon-btn admin-icon-btn--delete" 
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
                    onClick={() => setModalType('delete')}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. NOSOTROS (PREVIEW) ── */}
        <section className="admin-card" id="sec-about">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-heart"></i> Sobre Nosotros (Resumen)</h2>
          </div>
          <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form-grid">
              <div className="admin-form__group">
                <label className="admin-form__label">Eyebrow</label>
                <input className="admin-form__input" type="text" defaultValue="Nuestra Historia" {...register("aboutEyebrow")} />
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Título</label>
                <input className={`admin-form__input ${errors.aboutTitulo ? 'input-error' : ''}`} type="text" defaultValue="Una Experiencia Boutique sin igual" {...register("aboutTitulo", { required: "Requerido" })} />
              </div>
              <div className="admin-form__group admin-form__group--full">
                <label className="admin-form__label">Descripción</label>
                <textarea className={`admin-form__input ${errors.aboutDesc ? 'input-error' : ''}`} rows="3" defaultValue="Hotel Quinta Dalam nació del amor por la cultura michoacana..." {...register("aboutDesc", { required: "Requerido" })}></textarea>
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Insignia: Número</label>
                <input className="admin-form__input" type="number" defaultValue="2" {...register("aboutNum")} />
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Insignia: Texto</label>
                <input className="admin-form__input" type="text" defaultValue="años de hospitalidad" {...register("aboutNumText")} />
              </div>
            </div>
            <div className="admin-editor-actions">
              <button type="button" className="admin-btn admin-btn--ghost">Descartar</button>
              <button type="submit" className="admin-btn admin-btn--primary">Guardar Resumen</button>
            </div>
          </form>
        </section>

        {/* ── 6. CTA FINAL ── */}
        <section className="admin-card" id="sec-cta">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-bullhorn"></i> Llamada a la acción (Final)</h2>
          </div>
          <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form-grid">
              <div className="admin-form__group">
                <label className="admin-form__label">Eyebrow</label>
                <input className="admin-form__input" type="text" defaultValue="¿Listo para tu escapada?" {...register("ctaEyebrow")} />
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Título</label>
                <input className={`admin-form__input ${errors.ctaTitulo ? 'input-error' : ''}`} type="text" defaultValue="Reserva tu estancia perfecta" {...register("ctaTitulo", { required: "Requerido" })} />
              </div>
              <div className="admin-form__group admin-form__group--full">
                <label className="admin-form__label">Descripción</label>
                <input className="admin-form__input" type="text" defaultValue="Vive una experiencia inolvidable en el corazón de Michoacán." {...register("ctaDesc")} />
              </div>
            </div>
            <div className="admin-editor-actions">
              <button type="button" className="admin-btn admin-btn--ghost">Descartar</button>
              <button type="submit" className="admin-btn admin-btn--primary">Guardar CTA</button>
            </div>
          </form>
        </section>

      </main>

      {/* ── MODALES DINAMICOS VALIDADOS ── */}
      
      {/* Modal: Experiencia */}
      <div className={`admin-modal-backdrop ${modalType === 'experiencia' ? 'is-open' : ''}`}>
        <div className="admin-modal admin-modal--sm">
          <div className="admin-modal__header">
            <h2 className="admin-modal__title"><i className="fa-solid fa-camera"></i> Tarjeta de experiencia</h2>
            <button type="button" className="admin-modal__close" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
          </div>
          <form className="admin-modal__form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form__group">
              <label className="admin-form__label">Título</label>
              <input 
                className={`admin-form__input ${errors.tituloExp ? 'input-error' : ''}`} 
                type="text" 
                {...register("tituloExp", { required: "Requerido" })} 
              />
            </div>
            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn--primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal: Servicio */}
      <div className={`admin-modal-backdrop ${modalType === 'servicio' ? 'is-open' : ''}`}>
        <div className="admin-modal admin-modal--sm">
          <div className="admin-modal__header">
            <h2 className="admin-modal__title"><i className="fa-solid fa-concierge-bell"></i> Tarjeta de servicio</h2>
            <button type="button" className="admin-modal__close" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
          </div>
          <form className="admin-modal__form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form__group">
              <label className="admin-form__label">Ícono Font Awesome</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  className={`admin-form__input ${errors.iconoServ ? 'input-error' : ''}`} 
                  type="text" 
                  {...register("iconoServ", { 
                    required: "Requerido",
                    onChange: (e) => setIconPreview(e.target.value)
                  })} 
                />
                <span style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,151,58,0.2)', borderRadius: '6px', color: '#C9973A' }}><i className={iconPreview}></i></span>
              </div>
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Título</label>
              <input className={`admin-form__input ${errors.tituloServ ? 'input-error' : ''}`} type="text" {...register("tituloServ", { required: "Requerido" })} />
            </div>
            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn--primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal: Nueva Imagen de Galería */}
      <div className={`admin-modal-backdrop ${modalType === 'galeria' ? 'is-open' : ''}`}>
        <div className="admin-modal admin-modal--sm">
          <div className="admin-modal__header">
            <h2 className="admin-modal__title"><i className="fa-solid fa-images"></i> Nueva imagen de galería</h2>
            <button type="button" className="admin-modal__close" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
          </div>
          <form className="admin-modal__form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form__group">
              <label className="admin-form__label">Texto alternativo (Para SEO y accesibilidad)</label>
              <input 
                className={`admin-form__input ${errors.altImagen ? 'input-error' : ''}`} 
                type="text" 
                placeholder="Ej. Detalle de artesanía..."
                {...register("altImagen", { required: "Requerido" })} 
              />
            </div>

            <div className="admin-form__group">
              <span className="admin-form__label">Subir Imagen</span>
              <label 
                style={{ display: 'block', padding: '1.5rem', border: '1px dashed rgba(201,151,58,0.3)', textAlign: 'center', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s' }} 
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,151,58,0.05)'} 
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} {...register("archivoImagen", { required: "Sube una imagen" })} />
                <i className="fa-solid fa-cloud-arrow-up" style={{ color: '#C9973A', fontSize: '2rem' }}></i>
                <p style={{ fontSize: '0.8rem', color: 'rgba(237,232,222,0.8)', marginTop: '0.8rem', marginBottom: '0.2rem' }}>Haz clic para seleccionar</p>
                <p style={{ fontSize: '0.65rem', color: 'rgba(237,232,222,0.4)', margin: 0 }}>JPG o PNG. Máximo 2MB.</p>
              </label>
              {errors.archivoImagen && <span style={{color: '#d9534f', fontSize: '12px', display: 'block', marginTop: '0.5rem', textAlign: 'center'}}>{errors.archivoImagen.message}</span>}
            </div>
            
            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn--primary">Guardar imagen</button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Eliminar Reutilizable */}
      <ConfirmDeleteModal isOpen={modalType === 'delete'} onClose={closeModal} onConfirm={closeModal} itemName="este elemento" />
    </>
  );
}