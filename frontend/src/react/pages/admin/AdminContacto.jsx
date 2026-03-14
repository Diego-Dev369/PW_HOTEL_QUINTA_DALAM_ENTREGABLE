import { useState } from 'react';

export default function AdminContacto() {
  const [mapInputUrl, setMapInputUrl] = useState('');
  const [mapPreviewUrl, setMapPreviewUrl] = useState('about:blank');
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewMap = () => {
    if (mapInputUrl.trim() !== '') {
      setMapPreviewUrl(mapInputUrl);
      setShowPreview(true);
    }
  };

  return (
    <main className="admin-main">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editor — <em>Contacto</em></h1>
          <p className="admin-page-subtitle">
            Actualiza la información de contacto, redes sociales y textos de la página.
          </p>
        </div>
      </div>

      {/* ── SECCIÓN 1: Hero ── */}
      <section className="admin-card admin-editor-section" aria-labelledby="h2-ctc-hero">
        <div className="admin-card__header">
          <h2 className="admin-card__title" id="h2-ctc-hero">
            <i className="fa-solid fa-image"></i> Hero de la página
          </h2>
        </div>
        <form className="admin-editor-form" noValidate>
          <div className="admin-form-grid">
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-eyebrow">Eyebrow</label>
              <input className="admin-form__input" type="text" id="ctc-eyebrow" defaultValue="Estamos aquí para ti" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-hero-titulo">Título</label>
              <input className="admin-form__input" type="text" id="ctc-hero-titulo" defaultValue="Contáctanos" />
            </div>
            <div className="admin-form__group admin-form__group--full">
              <label className="admin-form__label" htmlFor="ctc-hero-sub">Subtítulo</label>
              <input className="admin-form__input" type="text" id="ctc-hero-sub" defaultValue="¿Tienes dudas o deseas una reservación personalizada? Escríbenos." />
            </div>
          </div>
          <div className="admin-editor-actions">
            <button type="button" className="admin-btn admin-btn--ghost">Descartar</button>
            <button type="submit" className="admin-btn admin-btn--primary">
              <i className="fa-solid fa-floppy-disk"></i> Guardar Hero
            </button>
          </div>
        </form>
      </section>

      {/* ── SECCIÓN 2: Datos de contacto ── */}
      <section className="admin-card admin-editor-section" aria-labelledby="h2-datos">
        <div className="admin-card__header">
          <h2 className="admin-card__title" id="h2-datos">
            <i className="fa-solid fa-address-card"></i> Datos de contacto
          </h2>
        </div>
        <form className="admin-editor-form" noValidate>
          <div className="admin-form-grid">
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-telefono">Teléfono principal</label>
              <input className="admin-form__input" type="tel" id="ctc-telefono" defaultValue="+52 443 000 0000" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-telefono2">
                Teléfono secundario <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
              </label>
              <input className="admin-form__input" type="tel" id="ctc-telefono2" placeholder="+52 443 000 0001" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-email">Correo electrónico</label>
              <input className="admin-form__input" type="email" id="ctc-email" defaultValue="reservas@quintadalam.mx" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-email2">
                Correo alternativo <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
              </label>
              <input className="admin-form__input" type="email" id="ctc-email2" placeholder="contacto@quintadalam.mx" />
            </div>
            <div className="admin-form__group admin-form__group--full">
              <label className="admin-form__label" htmlFor="ctc-direccion">Dirección completa</label>
              <input className="admin-form__input" type="text" id="ctc-direccion" defaultValue="Calle Ejemplo 123, Centro Histórico, Morelia, Michoacán, México, C.P. 58000" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-horario">Horario de atención</label>
              <input className="admin-form__input" type="text" id="ctc-horario" defaultValue="Lunes a Domingo, 8:00 – 22:00 hrs" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-checkin">Horario Check-in / Check-out</label>
              <input className="admin-form__input" type="text" id="ctc-checkin" defaultValue="Check-in 15:00 · Check-out 12:00" />
            </div>
          </div>
          <div className="admin-editor-actions">
            <button type="button" className="admin-btn admin-btn--ghost">Descartar</button>
            <button type="submit" className="admin-btn admin-btn--primary">
              <i className="fa-solid fa-floppy-disk"></i> Guardar datos
            </button>
          </div>
        </form>
      </section>

      {/* ── SECCIÓN 3: Redes sociales ── */}
      <section className="admin-card admin-editor-section" aria-labelledby="h2-redes">
        <div className="admin-card__header">
          <h2 className="admin-card__title" id="h2-redes">
            <i className="fa-solid fa-share-nodes"></i> Redes sociales
          </h2>
        </div>
        <form className="admin-editor-form" noValidate>
          <div className="admin-form-grid">
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-facebook">
                <i className="fa-brands fa-facebook" style={{ color: '#c9973a' }}></i> Facebook URL
              </label>
              <input className="admin-form__input" type="url" id="ctc-facebook" defaultValue="https://www.facebook.com/profile.php?id=61584681841684" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-instagram">
                <i className="fa-brands fa-instagram" style={{ color: '#c9973a' }}></i> Instagram URL
              </label>
              <input className="admin-form__input" type="url" id="ctc-instagram" defaultValue="https://www.instagram.com/quintadalam" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-tiktok">
                <i className="fa-brands fa-tiktok" style={{ color: '#c9973a' }}></i> TikTok URL
              </label>
              <input className="admin-form__input" type="url" id="ctc-tiktok" defaultValue="https://www.tiktok.com/@quintadalam" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label" htmlFor="ctc-whatsapp">
                <i className="fa-brands fa-whatsapp" style={{ color: '#c9973a' }}></i> WhatsApp (número con código)
              </label>
              <input className="admin-form__input" type="text" id="ctc-whatsapp" placeholder="5214430000000" />
            </div>
          </div>
          <div className="admin-editor-actions">
            <button type="button" className="admin-btn admin-btn--ghost">Descartar</button>
            <button type="submit" className="admin-btn admin-btn--primary">
              <i className="fa-solid fa-floppy-disk"></i> Guardar redes
            </button>
          </div>
        </form>
      </section>

      {/* ── SECCIÓN 4: Mapa ── */}
      <section className="admin-card admin-editor-section" aria-labelledby="h2-mapa">
        <div className="admin-card__header">
          <h2 className="admin-card__title" id="h2-mapa">
            <i className="fa-solid fa-map"></i> Mapa de Google Maps
          </h2>
        </div>
        <form className="admin-editor-form" noValidate>
          <div className="admin-form__group admin-form__group--full">
            <label className="admin-form__label" htmlFor="ctc-maps-embed">URL del embed de Google Maps</label>
            <input 
              className="admin-form__input" 
              type="url" 
              id="ctc-maps-embed" 
              placeholder="https://www.google.com/maps/embed?pb=..." 
              value={mapInputUrl}
              onChange={(e) => setMapInputUrl(e.target.value)}
            />
            <small style={{ color: 'rgba(234, 228, 216, 0.4)', fontSize: '0.72rem', marginTop: '0.4rem', display: 'block' }}>
              En Google Maps: Compartir → Insertar un mapa → copia solo la URL del atributo <code style={{ background: 'rgba(255, 255, 255, 0.07)', padding: '1px 5px', borderRadius: '3px' }}>src</code> del iframe.
            </small>
          </div>

          <div className="admin-form__group admin-form__group--full" style={{ display: showPreview ? 'block' : 'none' }}>
            <label className="admin-form__label">Vista previa</label>
            <iframe
              title="Vista previa del mapa"
              src={mapPreviewUrl}
              width="100"
              height="300"
              style={{ width: '100%', border: '1px solid rgba(201, 151, 58, 0.22)', borderRadius: '8px', display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="admin-editor-actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={handlePreviewMap}>
              <i className="fa-solid fa-eye"></i> Previsualizar
            </button>
            <button type="submit" className="admin-btn admin-btn--primary">
              <i className="fa-solid fa-floppy-disk"></i> Guardar mapa
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}