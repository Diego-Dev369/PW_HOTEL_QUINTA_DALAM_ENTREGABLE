import { useState } from 'react';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

export default function AdminNosotros() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [iconPreview, setIconPreview] = useState('fa-solid fa-star');
  const [editingId, setEditingId] = useState(null);

  const handleEditClick = (id) => setEditingId(id);
  const handleCancelEdit = () => setEditingId(null);
  
  const handleDeleteConfirm = () => {
    console.log("Valor eliminado");
    setIsDeleteModalOpen(false);
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

        {/* ── HERO ── */}
        <section className="admin-card admin-editor-section" aria-labelledby="h2-nos-hero">
          <div className="admin-card__header">
            <h2 className="admin-card__title" id="h2-nos-hero"><i className="fa-solid fa-image"></i> Hero de la página</h2>
          </div>
          <form className="admin-editor-form" noValidate>
            <div className="admin-form-grid">
              <div className="admin-form__group">
                <label className="admin-form__label">Eyebrow</label>
                <input className="admin-form__input" type="text" defaultValue="Quiénes somos" />
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">Título</label>
                <input className="admin-form__input" type="text" defaultValue="Nuestra Historia" />
              </div>
              <div className="admin-form__group admin-form__group--full">
                <label className="admin-form__label">Subtítulo</label>
                <input className="admin-form__input" type="text" defaultValue="Tradición, hospitalidad y amor por Michoacán desde nuestra fundación." />
              </div>
            </div>
            <div className="admin-editor-actions">
              <button type="button" className="admin-btn admin-btn--ghost">Descartar</button>
              <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Guardar Hero</button>
            </div>
          </form>
        </section>

        {/* ── MISIÓN Y VISIÓN ── */}
        <section className="admin-card admin-editor-section" aria-labelledby="h2-mision">
          <div className="admin-card__header">
            <h2 className="admin-card__title" id="h2-mision"><i className="fa-solid fa-eye"></i> Misión & Visión</h2>
          </div>
          <form className="admin-editor-form" noValidate>
            <div className="admin-form-grid">
              {/* Bloque Misión */}
              <div className="admin-form__group admin-form__group--full" style={{ borderBottom: '1px dashed rgba(201,151,58,0.3)', paddingBottom: '1rem' }}>
                <h3 style={{ color: '#C9973A', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Nuestra Misión</h3>
                <div className="admin-form-grid">
                  <div className="admin-form__group">
                    <label className="admin-form__label">Título Misión</label>
                    <input className="admin-form__input" type="text" defaultValue="Nuestra Misión" />
                  </div>
                  <div className="admin-form__group admin-form__group--full">
                    <label className="admin-form__label">Texto Misión</label>
                    <textarea className="admin-form__input" rows="3" defaultValue="Brindar una experiencia de hospitalidad auténtica que celebre la riqueza cultural de los Pueblos Mágicos de Michoacán. Cada detalle de nuestra casa refleja el compromiso con la tradición, el arte local y el bienestar de cada huésped."></textarea>
                  </div>
                </div>
              </div>

              {/* Bloque Visión */}
              <div className="admin-form__group admin-form__group--full" style={{ paddingTop: '0.5rem' }}>
                <h3 style={{ color: '#C9973A', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Nuestra Visión</h3>
                <div className="admin-form-grid">
                  <div className="admin-form__group">
                    <label className="admin-form__label">Título Visión</label>
                    <input className="admin-form__input" type="text" defaultValue="Nuestra Visión" />
                  </div>
                  <div className="admin-form__group admin-form__group--full">
                    <label className="admin-form__label">Texto Visión</label>
                    <textarea className="admin-form__input" rows="3" defaultValue="Ser el referente de hospitalidad boutique en Michoacán, reconocidos por preservar el patrimonio cultural mientras ofrecemos experiencias que conectan a nuestros huéspedes con la esencia profunda de esta tierra mágica."></textarea>
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

        {/* ── VALORES ── */}
        <section className="admin-card admin-editor-section">
          <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-gem"></i> Valores</h2>
            <button type="button" className="admin-btn admin-btn--primary admin-btn--sm" onClick={() => setIsModalOpen(true)}>
              <i className="fa-solid fa-plus"></i> Nuevo valor
            </button>
          </div>
          <div className="admin-valores-list" style={{ padding: '1.5rem' }}>
            <div className={`admin-valor-item ${editingId === 1 ? 'admin-valor-item--editing' : ''}`} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid rgba(201,151,58,0.1)' }}>
              <div className="admin-valor-item__icon" style={{ fontSize: '1.5rem', color: '#C9973A', paddingTop: '0.2rem' }}><i className="fa-solid fa-handshake"></i></div>
              
              {editingId !== 1 && (
                <>
                  <div className="admin-valor-item__read" style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', color: '#EDE8DE', marginBottom: '0.2rem' }}>Hospitalidad</strong>
                    <span style={{ color: 'rgba(237,232,222,0.6)', fontSize: '0.85rem' }}>Cada huésped es parte de nuestra familia. El calor michoacano en cada gesto.</span>
                  </div>
                  <div className="admin-valor-item__actions-read" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className="admin-icon-btn admin-icon-btn--edit" onClick={() => handleEditClick(1)}><i className="fa-solid fa-pen"></i></button>
                    <button type="button" className="admin-icon-btn admin-icon-btn--delete" onClick={() => setIsDeleteModalOpen(true)}><i className="fa-solid fa-trash"></i></button>
                  </div>
                </>
              )}

              {editingId === 1 && (
                <>
                  <div className="admin-valor-item__edit admin-form-grid" style={{ flex: 1, gap: '0.75rem 1.5rem' }}>
                    <div className="admin-form__group"><label className="admin-form__label">Título</label><input className="admin-form__input" type="text" defaultValue="Hospitalidad" /></div>
                    <div className="admin-form__group"><label className="admin-form__label">Ícono FA</label><input className="admin-form__input" type="text" defaultValue="fa-solid fa-handshake" /></div>
                    <div className="admin-form__group admin-form__group--full"><label className="admin-form__label">Descripción</label><input className="admin-form__input" type="text" defaultValue="Cada huésped es parte de nuestra familia. El calor michoacano en cada gesto." /></div>
                  </div>
                  <div className="admin-valor-item__actions-edit" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button type="button" className="admin-btn admin-btn--primary admin-btn--sm" onClick={handleCancelEdit}><i className="fa-solid fa-check"></i> Guardar</button>
                    <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={handleCancelEdit}>Cancelar</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Modales */}
      <div className={`admin-modal-backdrop ${isModalOpen ? 'is-open' : ''}`}>
        <div className="admin-modal admin-modal--sm">
          <div className="admin-modal__header">
            <h3 className="admin-modal__title"><i className="fa-solid fa-plus"></i> Nuevo valor</h3>
            <button type="button" className="admin-modal__close" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
          </div>
          <form className="admin-modal__form" noValidate>
            <div className="admin-form__group"><label className="admin-form__label">Título *</label><input className="admin-form__input" type="text" required /></div>
            <div className="admin-form__group">
              <label className="admin-form__label">Ícono FA *</label>
              <div className="admin-icono-preview-wrap" style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="admin-form__input" type="text" onChange={(e) => setIconPreview(e.target.value)} required />
                <span style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,151,58,0.2)', borderRadius: '6px', color: '#C9973A' }}><i className={iconPreview}></i></span>
              </div>
            </div>
            <div className="admin-form__group"><label className="admin-form__label">Descripción *</label><input className="admin-form__input" type="text" required /></div>
            <div className="admin-modal__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Crear valor</button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => setIsDeleteModalOpen(false)} itemName="este valor" />
    </>
  );
}