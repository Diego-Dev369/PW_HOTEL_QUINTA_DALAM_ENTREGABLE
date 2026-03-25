import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function AdminContacto() {
  const [mapPreviewUrl, setMapPreviewUrl] = useState('about:blank');
  const [showPreview, setShowPreview] = useState(false);

  // Valores originales simulando los que llegarían de la BD
  const defaultContactData = {
    ctcEyebrow: "Estamos aquí para ti",
    ctcHeroTitulo: "Contáctanos",
    ctcHeroSub: "¿Tienes dudas o deseas una reservación personalizada? Escríbenos.",
    ctcTelefono: "+52 443 000 0000",
    ctcEmail: "reservas@quintadalam.mx",
    ctcDireccion: "Calle Ejemplo 123, Centro Histórico, Morelia, Michoacán",
    ctcFacebook: "https://www.facebook.com/profile.php?id=61584681841684",
    ctcInstagram: "https://www.instagram.com/quintadalam",
    ctcTiktok: "https://www.tiktok.com/@quintadalam",
    ctcMapEmbed: ""
  };

  // Configuración de React Hook Form
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    defaultValues: defaultContactData
  });

  // pra observar el input del mapa en tiempo real
  const mapInputUrl = watch("ctcMapEmbed");

  const handlePreviewMap = () => {
    if (mapInputUrl && mapInputUrl.trim() !== '') {
      setMapPreviewUrl(mapInputUrl);
      setShowPreview(true);
    }
  };

  // Guardar en la BD
  const onSubmitData = (data) => {
    console.log("Datos de contacto actualizados:", data);
    alert("¡Información actualizada con éxito!");
  };

  // Restaurar los valores originales si el usuario cancel
  const handleDiscard = () => {
    if(window.confirm("¿Seguro que deseas descartar los cambios?")) {
      reset(defaultContactData);
    }
  };

  return (
    <main className="admin-main">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editor — <em>Contacto</em></h1>
          <p className="admin-page-subtitle">Actualiza la información de contacto, redes sociales y textos de la página.</p>
        </div>
      </div>

      {/* ── SECCIÓN 1: Hero ── */}
      <section className="admin-card admin-editor-section">
        <div className="admin-card__header">
          <h2 className="admin-card__title"><i className="fa-solid fa-image"></i> Hero de la página</h2>
        </div>
        <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
          <div className="admin-form-grid">
            <div className="admin-form__group">
              <label className="admin-form__label">Eyebrow</label>
              <input className={`admin-form__input ${errors.ctcEyebrow ? 'input-error' : ''}`} type="text" {...register("ctcEyebrow", { required: "Requerido" })} />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Título</label>
              <input className={`admin-form__input ${errors.ctcHeroTitulo ? 'input-error' : ''}`} type="text" {...register("ctcHeroTitulo", { required: "Requerido" })} />
            </div>
            <div className="admin-form__group admin-form__group--full">
              <label className="admin-form__label">Subtítulo</label>
              <input className={`admin-form__input ${errors.ctcHeroSub ? 'input-error' : ''}`} type="text" {...register("ctcHeroSub", { required: "Requerido" })} />
            </div>
          </div>
          <div className="admin-editor-actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={handleDiscard}>Descartar</button>
            <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Guardar Hero</button>
          </div>
        </form>
      </section>

      {/* ── SECCIÓN 2: Datos de contacto ── */}
      <section className="admin-card admin-editor-section">
        <div className="admin-card__header">
          <h2 className="admin-card__title"><i className="fa-solid fa-address-card"></i> Datos de contacto</h2>
        </div>
        <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
          <div className="admin-form-grid">
            <div className="admin-form__group">
              <label className="admin-form__label">Teléfono principal</label>
              <input className={`admin-form__input ${errors.ctcTelefono ? 'input-error' : ''}`} type="tel" {...register("ctcTelefono", { required: "Requerido" })} />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Correo electrónico</label>
              <input className={`admin-form__input ${errors.ctcEmail ? 'input-error' : ''}`} type="email" {...register("ctcEmail", { required: "Requerido", pattern: /^\S+@\S+$/i })} />
            </div>
            <div className="admin-form__group admin-form__group--full">
              <label className="admin-form__label">Dirección completa</label>
              <input className={`admin-form__input ${errors.ctcDireccion ? 'input-error' : ''}`} type="text" {...register("ctcDireccion", { required: "Requerido" })} />
            </div>
          </div>
          <div className="admin-editor-actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={handleDiscard}>Descartar</button>
            <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Guardar datos</button>
          </div>
        </form>
      </section>

      {/* ── SECCIÓN 3: Redes sociales ── */}
      <section className="admin-card admin-editor-section">
        <div className="admin-card__header">
          <h2 className="admin-card__title"><i className="fa-solid fa-share-nodes"></i> Redes sociales</h2>
        </div>
        <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
          <div className="admin-form-grid">
            <div className="admin-form__group">
              <label className="admin-form__label"><i className="fa-brands fa-facebook" style={{ color: '#c9973a' }}></i> Facebook URL</label>
              <input className={`admin-form__input ${errors.ctcFacebook ? 'input-error' : ''}`} type="url" {...register("ctcFacebook", { required: "Requerido" })} />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label"><i className="fa-brands fa-instagram" style={{ color: '#c9973a' }}></i> Instagram URL</label>
              <input className={`admin-form__input ${errors.ctcInstagram ? 'input-error' : ''}`} type="url" {...register("ctcInstagram", { required: "Requerido" })} />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label"><i className="fa-brands fa-tiktok" style={{ color: '#c9973a' }}></i> Tik Tok URL</label>
              <input className={`admin-form__input ${errors.ctcTiktok ? 'input-error' : ''}`} type="url" {...register("ctcTiktok", { required: "Requerido" })} />
            </div>
          </div>
          <div className="admin-editor-actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={handleDiscard}>Descartar</button>
            <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Guardar redes</button>
          </div>
        </form>
      </section>

      {/* ── SECCIÓN 4: Mapa ── */}
      <section className="admin-card admin-editor-section">
        <div className="admin-card__header">
          <h2 className="admin-card__title"><i className="fa-solid fa-map"></i> Mapa de Google Maps</h2>
        </div>
        <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
          <div className="admin-form__group admin-form__group--full">
            <label className="admin-form__label">URL del embed de Google Maps</label>
            <input 
              className={`admin-form__input ${errors.ctcMapEmbed ? 'input-error' : ''}`} 
              type="url" 
              placeholder="http://googleusercontent.com/maps..." 
              {...register("ctcMapEmbed", { required: "Requerido" })}
            />
          </div>

          <div className="admin-form__group admin-form__group--full" style={{ display: showPreview ? 'block' : 'none' }}>
            <label className="admin-form__label">Vista previa</label>
            <iframe title="Vista previa del mapa" src={mapPreviewUrl} width="100" height="300" style={{ width: '100%', border: '1px solid rgba(201, 151, 58, 0.22)', borderRadius: '8px', display: 'block' }} allowFullScreen loading="lazy"></iframe>
          </div>

          <div className="admin-editor-actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={handlePreviewMap}><i className="fa-solid fa-eye"></i> Previsualizar</button>
            <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Guardar mapa</button>
          </div>
        </form>
      </section>
    </main>
  );
}