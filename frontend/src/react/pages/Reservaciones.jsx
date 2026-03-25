import { useForm } from 'react-hook-form';

const mockHabitaciones = [
  { id: 'uruapan', nombre: 'Suite Uruapan' },
  { id: 'patzcuaro', nombre: 'Suite Pátzcuaro' },
  { id: 'paracho', nombre: 'Suite Paracho' },
  { id: 'yunuen', nombre: 'Suite Yunuen' },
  { id: 'tlalpujagua', nombre: 'Suite Tlalpujagua' },
  { id: 'cuanajo', nombre: 'Suite Cuanajo' }
];

export default function Reservaciones() {
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const onSubmit = (data) => {
    alert("¡Validación exitosa! Datos listos para la BD:\n" + JSON.stringify(data, null, 2));
    console.log("Datos de la reserva:", data);
    // Aquí iría el fetch()
  };

  return (
    <main>
      <section className="section section--cream reserva-page">
        <div className="container">
          <div className="reserva-wrapper">
            <div className="reserva__header">
              <span className="section__eyebrow">Formulario</span>
              <h1 className="section__title">Nueva <em>Reservación</em></h1>
              <span className="section__ornament">✦ — — ✦</span>
            </div>

            <form className="form reserva__form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form__grid">
                
                {/* ── CAMPO: NOMBRE ── */}
                <div className="form__group">
                  <label className="form__label" htmlFor="nombre">Nombre completo</label>
                  <input
                    className={`form__input ${errors.nombre ? 'input-error' : ''}`}
                    type="text"
                    id="nombre"
                    placeholder="Ej. Juan Pérez"
                    {...register("nombre", { 
                      required: "El nombre es obligatorio",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" }
                    })}
                  />
                  {errors.nombre && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.nombre.message}</span>}
                </div>

                {/* ── CAMPO: CORREO ── */}
                <div className="form__group">
                  <label className="form__label" htmlFor="correo">Correo electrónico</label>
                  <input
                    className={`form__input ${errors.correo ? 'input-error' : ''}`}
                    type="email"
                    id="correo"
                    placeholder="tu@correo.com"
                    {...register("correo", { 
                      required: "El correo es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Ingresa un correo válido"
                      }
                    })}
                  />
                  {errors.correo && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.correo.message}</span>}
                </div>

                {/* ── CAMPO: TELÉFONO ── */}
                <div className="form__group form__group--full">
                  <label className="form__label" htmlFor="telefono">Teléfono</label>
                  <input
                    className={`form__input ${errors.telefono ? 'input-error' : ''}`}
                    type="tel"
                    id="telefono"
                    placeholder="+52 443 000 0000"
                    {...register("telefono", {
                      required: "El teléfono es obligatorio",
                      pattern: {
                        value: /^[0-9+\-\s()]{10,15}$/,
                        message: "Ingresa un teléfono válido"
                      }
                    })}
                  />
                  {errors.telefono && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.telefono.message}</span>}
                </div>

                {/* ── CAMPO: ENTRADA ── */}
                <div className="form__group">
                  <label className="form__label" htmlFor="entrada">Fecha de entrada</label>
                  <input
                    className={`form__input ${errors.entrada ? 'input-error' : ''}`}
                    type="date"
                    id="entrada"
                    {...register("entrada", { required: "Selecciona una fecha" })}
                  />
                  {errors.entrada && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.entrada.message}</span>}
                </div>

                {/* ── CAMPO: SALIDA ── */}
                <div className="form__group">
                  <label className="form__label" htmlFor="salida">Fecha de salida</label>
                  <input 
                    className={`form__input ${errors.salida ? 'input-error' : ''}`} 
                    type="date" 
                    id="salida" 
                    {...register("salida", { required: "Selecciona una fecha" })} 
                  />
                  {errors.salida && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.salida.message}</span>}
                </div>

                {/* ── CAMPO: PERSONAS ── */}
                <div className="form__group">
                  <label className="form__label" htmlFor="personas">Número de personas</label>
                  <input
                    className={`form__input ${errors.personas ? 'input-error' : ''}`}
                    type="number"
                    id="personas"
                    min="1"
                    max="10"
                    placeholder="2"
                    {...register("personas", { 
                      required: "Indica el número",
                      min: { value: 1, message: "Mínimo 1" },
                      max: { value: 10, message: "Máximo 10" }
                    })}
                  />
                  {errors.personas && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.personas.message}</span>}
                </div>
                
                {/* ── CAMPO: HABITACIÓN ── */}
                <div className="form__group">
                  <label className="form__label" htmlFor="habitacion">Tipo de habitación</label>
                  <select 
                    className={`form__input ${errors.habitacion ? 'input-error' : ''}`} 
                    id="habitacion" 
                    defaultValue="" 
                    {...register("habitacion", { required: "Selecciona una suite" })}
                  >
                    <option value="" disabled>Selecciona una suite</option>
                    {/* Aqui se iteran las habitaciones */}
                    {mockHabitaciones.map(hab => (
                      <option key={hab.id} value={hab.id}>{hab.nombre}</option>
                    ))}
                  </select>
                  {errors.habitacion && <span style={{color: '#d9534f', fontSize: '13px'}}>{errors.habitacion.message}</span>}
                </div>

                {/* ── CAMPO: COMENTARIOS ── */}
                <div className="form__group form__group--full">
                  <label className="form__label" htmlFor="comentarios">Comentarios adicionales</label>
                  <textarea
                    className="form-textarea"
                    id="comentarios"
                    rows="4"
                    placeholder="Escriba aquí alguna solicitud especial..."
                    {...register("comentarios")}
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="btn btn--primary reserva__submit">
                Completar Reservación
              </button>
            </form>

            <p className="reserva__notice">
              <i className="fa-solid fa-code pull-left"></i>
              Este módulo se encuentra en desarrollo. Próximamente contará con
              sistema de pagos y validación automática.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}