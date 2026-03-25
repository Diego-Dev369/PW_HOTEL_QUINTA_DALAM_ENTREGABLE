import { useForm } from 'react-hook-form';

export default function AdminGlobal() {
    const defaultGlobalData = {
        // ── Identidad y Cabecera (Header & Footer) ──
        hotelName: "Hotel Quinta Dalam",
        hotelTagline: "Hotel Boutique",
        headerBtnLogin: "Iniciar Sesión",
        headerBtnReserve: "Reservar Ahora",

        // ── Pie de Página (Footer) ──
        footerDesc: "Un refugio colonial donde la tradición y el lujo se encuentran en el corazón de Michoacán.",
        footerCopyright: "© 2026 Hotel Quinta Dalam. Todos los derechos reservados.",

        // ── CTA Global ──
        ctaEyebrow: "Ven a conocernos",
        ctaTitle: "Reserva tu experiencia",
        ctaDesc: "Descubre de cerca lo que nos hace únicos en Michoacán.",
        ctaBtn1: "Reservar ahora",
        ctaBtn2: "Contáctanos"
    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: defaultGlobalData
    });

    // Guardar en la BD
    const onSubmitData = (data) => {
        console.log("Ajustes globales listos para BD:", data);
        alert("¡Ajustes globales guardados con éxito!");
    };

    const handleDiscard = () => {
        if(window.confirm("¿Seguro que deseas descartar los cambios?")) {
        reset(defaultGlobalData);
        }
    };

    return (
        <main className="admin-main">
        <div className="admin-page-header">
            <div>
            <h1 className="admin-page-title">Editor — <em>Ajustes Globales</em></h1>
            <p className="admin-page-subtitle">Modifica la identidad de marca y los elementos que se repiten en toda la web.</p>
            </div>
        </div>

        {/* ── SECCIÓN 1: IDENTIDAD Y CABECERA (HEADER) ── */}
        <section className="admin-card admin-editor-section">
            <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-bars"></i> Cabecera (Header)</h2>
            </div>
            <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form-grid">
                <div className="admin-form__group">
                <label className="admin-form__label">Nombre del Hotel (Texto del Logo)</label>
                <input 
                    className={`admin-form__input ${errors.hotelName ? 'input-error' : ''}`} 
                    type="text" 
                    {...register("hotelName", { required: "Requerido" })} 
                />
                </div>
                <div className="admin-form__group">
                <label className="admin-form__label">Lema (Tagline)</label>
                <input 
                    className={`admin-form__input ${errors.hotelTagline ? 'input-error' : ''}`} 
                    type="text" 
                    {...register("hotelTagline", { required: "Requerido" })} 
                />
                </div>
                <div className="admin-form__group">
                <label className="admin-form__label">Texto: Botón de Acceso</label>
                <input 
                    className={`admin-form__input ${errors.headerBtnLogin ? 'input-error' : ''}`} 
                    type="text" 
                    {...register("headerBtnLogin", { required: "Requerido" })} 
                />
                </div>
                <div className="admin-form__group">
                <label className="admin-form__label">Texto: Botón de Reserva</label>
                <input 
                    className={`admin-form__input ${errors.headerBtnReserve ? 'input-error' : ''}`} 
                    type="text" 
                    {...register("headerBtnReserve", { required: "Requerido" })} 
                />
                </div>
            </div>
            <div className="admin-editor-actions">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={handleDiscard}>Descartar</button>
                <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Guardar Header</button>
            </div>
            </form>
        </section>

        {/* ── SECCIÓN 2: CTA GLOBAL ── */}
        <section className="admin-card admin-editor-section">
            <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-bullhorn"></i> Componente CTA (Llamada a la Acción)</h2>
            </div>
            <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form-grid">
                <div className="admin-form__group">
                <label className="admin-form__label">Eyebrow</label>
                <input 
                    className={`admin-form__input ${errors.ctaEyebrow ? 'input-error' : ''}`} 
                    type="text" 
                    {...register("ctaEyebrow", { required: "Requerido" })} 
                />
                </div>
                <div className="admin-form__group">
                <label className="admin-form__label">Título Principal</label>
                <input 
                    className={`admin-form__input ${errors.ctaTitle ? 'input-error' : ''}`} 
                    type="text" 
                    {...register("ctaTitle", { required: "Requerido" })} 
                />
                </div>
                <div className="admin-form__group admin-form__group--full">
                <label className="admin-form__label">Descripción</label>
                <textarea 
                    className={`admin-form__input ${errors.ctaDesc ? 'input-error' : ''}`} 
                    rows="2"
                    {...register("ctaDesc", { required: "Requerido" })} 
                ></textarea>
                </div>
                <div className="admin-form__group">
                <label className="admin-form__label">Texto: Botón Primario</label>
                <input 
                    className={`admin-form__input ${errors.ctaBtn1 ? 'input-error' : ''}`} 
                    type="text" 
                    {...register("ctaBtn1", { required: "Requerido" })} 
                />
                </div>
                <div className="admin-form__group">
                <label className="admin-form__label">Texto: Botón Secundario</label>
                <input 
                    className={`admin-form__input ${errors.ctaBtn2 ? 'input-error' : ''}`} 
                    type="text" 
                    {...register("ctaBtn2", { required: "Requerido" })} 
                />
                </div>
            </div>
            <div className="admin-editor-actions">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={handleDiscard}>Descartar</button>
                <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Guardar CTA</button>
            </div>
            </form>
        </section>

        {/* ── SECCIÓN 3: PIE DE PÁGINA (FOOTER) ── */}
        <section className="admin-card admin-editor-section">
            <div className="admin-card__header">
            <h2 className="admin-card__title"><i className="fa-solid fa-shoe-prints"></i> Pie de Página (Footer)</h2>
            </div>
            <form className="admin-editor-form" onSubmit={handleSubmit(onSubmitData)} noValidate>
            <div className="admin-form-grid">
                <div className="admin-form__group admin-form__group--full">
                <label className="admin-form__label">Breve Descripción del Hotel</label>
                <textarea 
                    className={`admin-form__input ${errors.footerDesc ? 'input-error' : ''}`} 
                    rows="2"
                    {...register("footerDesc", { required: "Requerido" })} 
                ></textarea>
                </div>
                <div className="admin-form__group admin-form__group--full">
                <label className="admin-form__label">Texto Legal (Copyright)</label>
                <input 
                    className={`admin-form__input ${errors.footerCopyright ? 'input-error' : ''}`} 
                    type="text" 
                    {...register("footerCopyright", { required: "Requerido" })} 
                />
                </div>
            </div>
            <div className="admin-editor-actions">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={handleDiscard}>Descartar</button>
                <button type="submit" className="admin-btn admin-btn--primary"><i className="fa-solid fa-floppy-disk"></i> Guardar Footer</button>
            </div>
            </form>
        </section>
        </main>
    );
}