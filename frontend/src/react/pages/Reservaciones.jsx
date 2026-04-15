import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import roomUruapan from '../../assets/images/rooms/204-uruapan.jpeg';
import roomPatzcuaro from '../../assets/images/rooms/104-patzcuaro.jpeg';
import roomParacho from '../../assets/images/rooms/102-paracho.jpeg';
import roomYunuen from '../../assets/images/rooms/103-yunuen.jpeg';
import roomCuanajo from '../../assets/images/rooms/207-cuanajo.jpeg';
import roomTlalpujagua from '../../assets/images/rooms/205-tlalpujagua.jpeg';

import CheckoutWizard from '../components/CheckoutWizard.jsx';
import DateRangePicker from '../components/DateRangePicker.jsx';
import { useBookingDates } from '../context/BookingDateContext.jsx';

const roomCatalog = [
  {
    id: 'uruapan',
    nombre: 'Suite Uruapan',
    tipo: 'Suite Deluxe',
    precio: '$2,500 MXN',
    capacidad: '2 personas',
    superficie: '28 m²',
    cama: '1 King Size',
    tagline: 'Naturaleza & Tradición',
    descripcion: 'Frescura, armonía y descanso entre ecos de bosque y artesanía local.',
    imagen: roomUruapan,
    amenidades: [
      { icon: 'fa-solid fa-wifi', label: 'Wi-Fi' },
      { icon: 'fa-solid fa-snowflake', label: 'Aire acondicionado' },
      { icon: 'fa-solid fa-mug-hot', label: 'Desayuno incluido' }
    ]
  },
  {
    id: 'patzcuaro',
    nombre: 'Suite Pátzcuaro',
    tipo: 'Suite Superior',
    precio: '$3,200 MXN',
    capacidad: '2 personas',
    superficie: '35 m²',
    cama: '1 King Size',
    tagline: 'Historia & Elegancia',
    descripcion: 'Elegancia clásica y serenidad a orillas del lago más místico de México.',
    imagen: roomPatzcuaro,
    amenidades: [
      { icon: 'fa-solid fa-wifi', label: 'Wi-Fi' },
      { icon: 'fa-solid fa-bath', label: 'Tina' },
      { icon: 'fa-solid fa-mug-hot', label: 'Desayuno incluido' }
    ]
  },
  {
    id: 'paracho',
    nombre: 'Suite Paracho',
    tipo: 'Suite Deluxe',
    precio: '$3,100 MXN',
    capacidad: '4 personas',
    superficie: '28 m²',
    cama: '2 matrimoniales',
    tagline: 'Sofisticación & Cultura',
    descripcion: 'Diseño cálido y materiales locales para una estancia íntima y relajante.',
    imagen: roomParacho,
    amenidades: [
      { icon: 'fa-solid fa-wifi', label: 'Wi-Fi' },
      { icon: 'fa-solid fa-snowflake', label: 'Aire acondicionado' },
      { icon: 'fa-solid fa-mug-hot', label: 'Desayuno incluido' }
    ]
  },
  {
    id: 'yunuen',
    nombre: 'Suite Yunuen',
    tipo: 'Suite Deluxe',
    precio: '$2,700 MXN',
    capacidad: '2 personas',
    superficie: '30 m²',
    cama: '1 King Size',
    tagline: 'Lago & Serenidad',
    descripcion: 'Inspirada en la tranquilidad lacustre, con atmósfera de descanso total.',
    imagen: roomYunuen,
    amenidades: [
      { icon: 'fa-solid fa-wifi', label: 'Wi-Fi' },
      { icon: 'fa-solid fa-snowflake', label: 'Aire acondicionado' },
      { icon: 'fa-solid fa-mug-hot', label: 'Desayuno incluido' }
    ]
  },
  {
    id: 'tlalpujagua',
    nombre: 'Suite Tlalpujagua',
    tipo: 'Suite Estudio',
    precio: '$2,500 MXN',
    capacidad: '2 personas',
    superficie: '26 m²',
    cama: '1 Queen Size',
    tagline: 'Color & Artesanía',
    descripcion: 'Una suite luminosa y artesanal con identidad michoacana.',
    imagen: roomTlalpujagua,
    amenidades: [
      { icon: 'fa-solid fa-wifi', label: 'Wi-Fi' },
      { icon: 'fa-solid fa-snowflake', label: 'Aire acondicionado' },
      { icon: 'fa-solid fa-mug-hot', label: 'Desayuno incluido' }
    ]
  },
  {
    id: 'cuanajo',
    nombre: 'Suite Cuanajo',
    tipo: 'Suite Deluxe',
    precio: '$1,700 MXN',
    capacidad: '4 personas',
    superficie: '28 m²',
    cama: '2 matrimoniales',
    tagline: 'Madera & Calidez',
    descripcion: 'Acabados en madera tallada y descanso profundo entre tonos tierra.',
    imagen: roomCuanajo,
    amenidades: [
      { icon: 'fa-solid fa-wifi', label: 'Wi-Fi' },
      { icon: 'fa-solid fa-snowflake', label: 'Aire acondicionado' },
      { icon: 'fa-solid fa-mug-hot', label: 'Desayuno incluido' }
    ]
  }
];

const roomById = roomCatalog.reduce((acc, room) => ({ ...acc, [room.id]: room }), {});

export default function Reservaciones() {
  const { checkInISO, checkOutISO, checkInLabel, checkOutLabel, nights } = useBookingDates();
  const [dateError, setDateError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      personas: 2,
      habitacion: roomCatalog[0].id
    }
  });

  const selectedRoomId = watch('habitacion');
  const selectedRoom = useMemo(
    () => roomById[selectedRoomId] || roomCatalog[0],
    [selectedRoomId]
  );

  const onSubmit = (data) => {
    if (!checkInISO || !checkOutISO) {
      setDateError('Selecciona un rango de fechas para continuar.');
      return;
    }

    setDateError('');

    const payload = {
      ...data,
      entrada: checkInISO,
      salida: checkOutISO,
      noches: nights
    };

    alert(`UI validada. Datos listos para integración:\n${JSON.stringify(payload, null, 2)}`);
  };

  return (
    <main>
      <section className="section section--cream reserva-page">
        <div className="container">
          <div className="reserva-wrapper">
            <div className="reserva__layout">
              <div className="reserva__main">
                <header className="reserva__header">
                  <span className="section__eyebrow">Reservaciones</span>
                  <h1 className="section__title">
                    Nueva <em>Reservación</em>
                  </h1>
                  <span className="section__ornament">✦ — — ✦</span>
                </header>

                <form className="form reserva__form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="form__grid">
                    <div className="form__group">
                      <label className="form__label" htmlFor="nombre">Nombre completo</label>
                      <input
                        className={`form__input ${errors.nombre ? 'input-error' : ''}`}
                        type="text"
                        id="nombre"
                        placeholder="Ej. Juan Pérez"
                        {...register('nombre', {
                          required: 'El nombre es obligatorio',
                          minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                        })}
                      />
                      {errors.nombre && <span className="form-error">{errors.nombre.message}</span>}
                    </div>

                    <div className="form__group">
                      <label className="form__label" htmlFor="correo">Correo electrónico</label>
                      <input
                        className={`form__input ${errors.correo ? 'input-error' : ''}`}
                        type="email"
                        id="correo"
                        placeholder="tu@correo.com"
                        {...register('correo', {
                          required: 'El correo es obligatorio',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Ingresa un correo válido'
                          }
                        })}
                      />
                      {errors.correo && <span className="form-error">{errors.correo.message}</span>}
                    </div>

                    <div className="form__group form__group--full">
                      <label className="form__label" htmlFor="telefono">Teléfono</label>
                      <input
                        className={`form__input ${errors.telefono ? 'input-error' : ''}`}
                        type="tel"
                        id="telefono"
                        placeholder="+52 443 000 0000"
                        {...register('telefono', {
                          required: 'El teléfono es obligatorio',
                          pattern: {
                            value: /^[0-9+\-\s()]{10,15}$/,
                            message: 'Ingresa un teléfono válido'
                          }
                        })}
                      />
                      {errors.telefono && <span className="form-error">{errors.telefono.message}</span>}
                    </div>

                    <div className="form__group form__group--full">
                      <DateRangePicker label="Fechas de estancia (check-in / check-out)" />
                      {dateError && <span className="form-error">{dateError}</span>}
                      {checkInLabel && checkOutLabel && (
                        <p className="reserva__date-meta">
                          <i className="fa-solid fa-moon" aria-hidden="true"></i>
                          {`${nights} noche(s) seleccionada(s): ${checkInLabel} - ${checkOutLabel}`}
                        </p>
                      )}
                    </div>

                    <div className="form__group">
                      <label className="form__label" htmlFor="personas">Número de personas</label>
                      <input
                        className={`form__input ${errors.personas ? 'input-error' : ''}`}
                        type="number"
                        id="personas"
                        min="1"
                        max="10"
                        {...register('personas', {
                          required: 'Indica el número de personas',
                          min: { value: 1, message: 'Mínimo 1 persona' },
                          max: { value: 10, message: 'Máximo 10 personas' }
                        })}
                      />
                      {errors.personas && <span className="form-error">{errors.personas.message}</span>}
                    </div>

                    <div className="form__group">
                      <label className="form__label" htmlFor="habitacion">Tipo de habitación</label>
                      <select
                        className={`form__input ${errors.habitacion ? 'input-error' : ''}`}
                        id="habitacion"
                        {...register('habitacion', {
                          required: 'Selecciona una habitación'
                        })}
                      >
                        {roomCatalog.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.habitacion && <span className="form-error">{errors.habitacion.message}</span>}
                    </div>

                    <div className="form__group form__group--full">
                      <label className="form__label" htmlFor="comentarios">Comentarios adicionales</label>
                      <textarea
                        className="form-textarea"
                        id="comentarios"
                        rows="4"
                        placeholder="Escribe aquí alguna solicitud especial..."
                        {...register('comentarios')}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn--primary reserva__submit">
                    Completar Reservación
                  </button>
                </form>

                <p className="reserva__notice">
                  <i className="fa-solid fa-code"></i>
                  Este módulo está en modo visual. La pasarela de pago real se conectará en la etapa final.
                </p>
              </div>

              <aside className="reserva__summary" aria-label="Resumen de habitación seleccionada">
                <article className="room-card reserva-room-card">
                  <div className="room-card__img-wrap">
                    <img
                      src={selectedRoom.imagen}
                      alt={selectedRoom.nombre}
                      className="room-card__img"
                      loading="lazy"
                    />
                    <span className="room-card__badge">{selectedRoom.tipo}</span>
                  </div>

                  <div className="room-card__body">
                    <h2 className="room-card__title">{selectedRoom.nombre}</h2>
                    <em className="room-card__sub">{selectedRoom.tagline}</em>
                    <p className="room-card__desc">{selectedRoom.descripcion}</p>

                    <ul className="room-card__amenities" aria-label="Amenidades">
                      {selectedRoom.amenidades.map((item) => (
                        <li key={item.label} className="room-card__amenity" title={item.label}>
                          <i className={item.icon} aria-hidden="true"></i>
                        </li>
                      ))}
                    </ul>

                    <div className="reserva-room-card__price">
                      <small>Tarifa por noche</small>
                      <strong>{selectedRoom.precio}</strong>
                    </div>

                    <ul className="reserva-room-card__meta">
                      <li><i className="fa-solid fa-user-group" aria-hidden="true"></i>{selectedRoom.capacidad}</li>
                      <li><i className="fa-solid fa-bed" aria-hidden="true"></i>{selectedRoom.cama}</li>
                      <li><i className="fa-solid fa-expand" aria-hidden="true"></i>{selectedRoom.superficie}</li>
                    </ul>
                  </div>
                </article>
              </aside>
            </div>

            <CheckoutWizard selectedRoom={selectedRoom} />
          </div>
        </div>
      </section>
    </main>
  );
}
