import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form'; // Importamos la librería de validación

// ── Animaciones de Framer Motion (intactas) ──
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
  
  // Inicializamos React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset // Lo usaremos para limpiar el formulario después de enviar
  } = useForm();

  // Función que se ejecuta al pasar las validaciones
  const onSubmit = (data) => {
    alert("¡Mensaje enviado correctamente!\n\nDatos:\n" + JSON.stringify(data, null, 2));
    console.log("Mensaje de contacto:", data);
    reset(); // Limpia los campos del formulario tras enviarlo
  };

  return (
    <>
      {/* PAGE HERO */}
      <div className="page-hero">
        <span className="page-hero__eyebrow">Estamos aquí para ti</span>
        <h1 className="page-hero__title">Contacto</h1>
        <p className="page-hero__subtitle">
          Escríbenos o visítanos en el corazón de Michoacán
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
                  Envíanos un <em>Mensaje</em>
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
                      <label className="form__label" htmlFor="nombre">Nombre</label>
                      <input
                        type="text"
                        id="nombre"
                        className={`form__input ${errors.nombre ? 'input-error' : ''}`}
                        placeholder="Tu nombre"
                        {...register("nombre", { required: "El nombre es obligatorio" })}
                      />
                      {errors.nombre && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.nombre.message}</span>}
                    </div>
                    
                    <div className="form__group">
                      <label className="form__label" htmlFor="apellido">Apellido</label>
                      <input
                        type="text"
                        id="apellido"
                        className="form__input"
                        placeholder="Tu apellido"
                        {...register("apellido")} // Campo opcional, no lleva validación
                      />
                    </div>
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="email">Correo electrónico</label>
                    <input
                      type="email"
                      id="email"
                      className={`form__input ${errors.email ? 'input-error' : ''}`}
                      placeholder="tu@email.com"
                      {...register("email", { 
                        required: "El correo es obligatorio",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Ingresa un correo válido"
                        }
                      })}
                    />
                    {errors.email && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.email.message}</span>}
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="telefono">Teléfono (opcional)</label>
                    <input
                      type="tel"
                      id="telefono"
                      className={`form__input ${errors.telefono ? 'input-error' : ''}`}
                      placeholder="+52 443 000 0000"
                      {...register("telefono", {
                        pattern: {
                          value: /^[0-9+\-\s()]{10,15}$/,
                          message: "Si ingresas un teléfono, debe ser válido"
                        }
                      })}
                    />
                    {errors.telefono && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.telefono.message}</span>}
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="asunto">Asunto</label>
                    <input
                      type="text"
                      id="asunto"
                      className={`form__input ${errors.asunto ? 'input-error' : ''}`}
                      placeholder="¿En qué podemos ayudarte?"
                      {...register("asunto", { required: "El asunto es obligatorio" })}
                    />
                    {errors.asunto && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.asunto.message}</span>}
                  </div>

                  <div className="form__group">
                    <label className="form__label" htmlFor="mensaje">Mensaje</label>
                    <textarea
                      id="mensaje"
                      className={`form__textarea ${errors.mensaje ? 'input-error' : ''}`}
                      placeholder="Cuéntanos más..."
                      rows="4"
                      {...register("mensaje", { 
                        required: "El mensaje no puede estar vacío",
                        minLength: { value: 10, message: "Escribe al menos 10 caracteres" }
                      })}
                    ></textarea>
                    {errors.mensaje && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.mensaje.message}</span>}
                  </div>

                  <button type="submit" className="btn btn--primary">
                    <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
                    Enviar mensaje
                  </button>
                </motion.form>
              </motion.div>

              {/* ── Info de contacto (intacta) ── */}
              <motion.div className="contacto__info" variants={fadeUp}>
                <h2 className="contacto__title">Visítanos en <em>Michoacán</em></h2>

                <ul className="contacto__info-list">
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true"><i className="fa-solid fa-location-dot"></i></span>
                    <div><strong>Dirección</strong><p>Morelia, Michoacán, México</p></div>
                  </li>
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true"><i className="fa-solid fa-phone"></i></span>
                    <div><strong>Teléfono</strong><p><a href="tel:+524430000000">+52 443 000 0000</a></p></div>
                  </li>
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true"><i className="fa-solid fa-envelope"></i></span>
                    <div><strong>Correo</strong><p><a href="mailto:reservas@quintadalam.mx">reservas@quintadalam.mx</a></p></div>
                  </li>
                  <li className="contacto__info-item">
                    <span className="contacto__info-icon" aria-hidden="true"><i className="fa-solid fa-clock"></i></span>
                    <div><strong>Horario de atención</strong><p>Lunes a domingo · 8:00 – 20:00 hrs</p></div>
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
      </motion.main>
    </>
  );
}