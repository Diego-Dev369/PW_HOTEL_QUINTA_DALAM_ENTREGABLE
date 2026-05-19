import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form'; 
import CTA from '../components/CTA';
import { useLanguage } from '../context/LanguageContext.jsx';

// ── Animaciones de Framer Motion ──
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const mapReveal = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const inView = { viewport: { once: true, margin: '-80px' } };

export default function Contacto() {
  const { t } = useLanguage();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm();

  // Función que se ejecuta al pasar las validaciones
  const onSubmit = (data) => {
    alert(`${t.contactPage.validations.sent}\n\nDatos:\n` + JSON.stringify(data, null, 2));
    console.log("Mensaje de contacto:", data);
    reset();
  };

  return (
    <>
      {/* PAGE HERO */}
      <div className="page-hero">
        <span className="page-hero__eyebrow">{t.contactPage.eyebrow}</span>
        <h1 className="page-hero__title">{t.contactPage.title}</h1>
        <p className="page-hero__subtitle">
          {t.contactPage.subtitle}
        </p>
        <span className="page-hero__ornament" aria-hidden="true">✦ ─── ✦ ─── ✦</span>
      </div>

      {/* MAIN */}
      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <motion.section
          className="section"
          aria-labelledby="h2-contacto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          {...inView}
        >
          <div className="container">
            <motion.div className="contacto__grid" variants={staggerContainer}>
              
              {/* ── Formulario ── */}
              <motion.div className="contacto__form-wrap" variants={fadeUp}>
                <h2 className="contacto__title" id="h2-contacto">
                  {t.contactPage.formTitle} <em>{t.contactPage.formTitleEm}</em>
                </h2>

                {/* Conectamos el formulario con handleSubmit */}
                <motion.form 
                  className="form" 
                  onSubmit={handleSubmit(onSubmit)} 
                  noValidate 
                  variants={staggerContainer}
                >
                  <div className="form__row">
                    <div className="form__group">
                      <label className="form__label" htmlFor="nombre">{t.contactPage.firstName}</label>
                      <input
                        type="text"
                        id="nombre"
                        className={`form__input ${errors.nombre ? 'input-error' : ''}`}
                        placeholder={t.contactPage.placeholders.firstName}
                        {...register("nombre", { required: t.contactPage.validations.nameRequired })}
                      />
                      {errors.nombre && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.nombre.message}</span>}
                    </div>
                    
                    <div className="form__group">
                      <label className="form__label" htmlFor="apellido">{t.contactPage.lastName}</label>
                      <input
                        type="text"
                        id="apellido"
                        className="form__input"
                        placeholder={t.contactPage.placeholders.lastName}
                        {...register("apellido")}
                      />
                    </div>
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="email">{t.contactPage.email}</label>
                    <input
                      type="email"
                      id="email"
                      className={`form__input ${errors.email ? 'input-error' : ''}`}
                      placeholder="tu@email.com"
                      {...register("email", { 
                        required: t.contactPage.validations.emailRequired,
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t.contactPage.validations.emailInvalid
                        }
                      })}
                    />
                    {errors.email && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.email.message}</span>}
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="telefono">{t.contactPage.phone}</label>
                    <input
                      type="tel"
                      id="telefono"
                      className={`form__input ${errors.telefono ? 'input-error' : ''}`}
                      placeholder="+52 443 000 0000"
                      {...register("telefono", {
                        pattern: {
                          value: /^[0-9+\-\s()]{10,15}$/,
                          message: t.contactPage.validations.phoneInvalid
                        }
                      })}
                    />
                    {errors.telefono && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.telefono.message}</span>}
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="asunto">{t.contactPage.subject}</label>
                    <input
                      type="text"
                      id="asunto"
                      className={`form__input ${errors.asunto ? 'input-error' : ''}`}
                      placeholder={t.contactPage.placeholders.subject}
                      {...register("asunto", { required: t.contactPage.validations.subjectRequired })}
                    />
                    {errors.asunto && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.asunto.message}</span>}
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="mensaje">{t.contactPage.message}</label>
                    <textarea
                      id="mensaje"
                      className={`form__textarea ${errors.mensaje ? 'input-error' : ''}`}
                      placeholder={t.contactPage.placeholders.message}
                      rows="4"
                      {...register("mensaje", { 
                        required: t.contactPage.validations.messageRequired,
                        minLength: { value: 10, message: t.contactPage.validations.messageMin }
                      })}
                    ></textarea>
                    {errors.mensaje && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.mensaje.message}</span>}
                  </div>

                  <button type="submit" className="btn btn--primary">
                    <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
                    {t.contactPage.send}
                  </button>
                </motion.form>
              </motion.div>

              {/* ── Info de contacto (intacta) ── */}
              <motion.div className="contacto__info" variants={fadeUp}>
                <h2 className="contacto__title">{t.contactPage.visitTitle} <em>Michoacan</em></h2>

                <ul className="contacto__info-list">
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true"><i className="fa-solid fa-location-dot"></i></span>
                    <div><strong>{t.contactPage.address}</strong><p>Morelia, Michoacan, Mexico</p></div>
                  </li>
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true"><i className="fa-solid fa-phone"></i></span>
                    <div><strong>{t.contactPage.phoneLabel}</strong><p><a href="tel:+524430000000">+52 443 000 0000</a></p></div>
                  </li>
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true"><i className="fa-solid fa-envelope"></i></span>
                    <div><strong>{t.contactPage.emailLabel}</strong><p><a href="mailto:reservas@quintadalam.mx">reservas@quintadalam.mx</a></p></div>
                  </li>
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true"><i className="fa-solid fa-clock"></i></span>
                    <div><strong>{t.contactPage.hours}</strong><p>{t.contactPage.hoursText}</p></div>
                  </li>
                </ul>

                <motion.div className="contacto__map" variants={mapReveal} initial="hidden" whileInView="show" {...inView}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60358.93085988832!2d-101.22441!3d19.7059504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842d0e0cb4da6b29%3A0x82c1c42f9c3a44c5!2sMorelia%2C%20Michoac%C3%A1n!5e0!3m2!1ses!2smx!4v1700000000000"
                    style={{ border: 0, width: '100%', height: '300px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación del Hotel Quinta Dalam"
                  ></iframe>
                </motion.div>
              </motion.div>

            </motion.div>
          </div>
        </motion.section>

        <CTA />
      </motion.main>
    </>
  );
}
