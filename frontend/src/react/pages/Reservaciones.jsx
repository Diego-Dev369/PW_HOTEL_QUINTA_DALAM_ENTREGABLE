import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import roomUruapan from '../../assets/images/rooms/204-uruapan.jpeg';
import roomPatzcuaro from '../../assets/images/rooms/104-patzcuaro.jpeg';
import roomParacho from '../../assets/images/rooms/102-paracho.jpeg';
import roomYunuen from '../../assets/images/rooms/103-yunuen.jpeg';
import roomCuanajo from '../../assets/images/rooms/207-cuanajo.jpeg';
import roomTlalpujagua from '../../assets/images/rooms/205-tlalpujagua.jpeg';

import CheckoutWizard from '../components/CheckoutWizard.jsx';
import DateRangePicker from '../components/DateRangePicker.jsx';
import ToastStack from '../components/ToastStack.jsx';
import { useBookingDates } from '../context/BookingDateContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { getAvailability } from '../services/roomService.js';
import { createReservation } from '../services/reservationService.js';

const roomVisualMap = {
  uruapan: {
    image: roomUruapan,
    tagline: 'Naturaleza & Tradición',
    description: 'Frescura, armonía y descanso entre ecos de bosque y artesanía local.',
    bedType: '1 King Size'
  },
  patzcuaro: {
    image: roomPatzcuaro,
    tagline: 'Historia & Elegancia',
    description: 'Elegancia clásica y serenidad a orillas del lago más místico de México.',
    bedType: '1 King Size'
  },
  paracho: {
    image: roomParacho,
    tagline: 'Sofisticación & Cultura',
    description: 'Diseño cálido y materiales locales para una estancia íntima y relajante.',
    bedType: '2 matrimoniales'
  },
  yunuen: {
    image: roomYunuen,
    tagline: 'Lago & Serenidad',
    description: 'Inspirada en la tranquilidad lacustre, con atmósfera de descanso total.',
    bedType: '1 King Size'
  },
  tlalpujagua: {
    image: roomTlalpujagua,
    tagline: 'Color & Artesanía',
    description: 'Una suite luminosa y artesanal con identidad michoacana.',
    bedType: '1 Queen Size'
  },
  cuanajo: {
    image: roomCuanajo,
    tagline: 'Madera & Calidez',
    description: 'Acabados en madera tallada y descanso profundo entre tonos tierra.',
    bedType: '2 matrimoniales'
  }
};

const defaultAmenities = [
  { icon: 'fa-solid fa-wifi', label: 'Wi-Fi' },
  { icon: 'fa-solid fa-snowflake', label: 'Aire acondicionado' },
  { icon: 'fa-solid fa-mug-hot', label: 'Desayuno incluido' }
];

function normalizeKey(value) {
  return value
    ?.toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ');
}

function findVisual(room) {
  const key = normalizeKey(`${room.code} ${room.name}`);
  if (key.includes('uruapan')) return roomVisualMap.uruapan;
  if (key.includes('patzcuaro')) return roomVisualMap.patzcuaro;
  if (key.includes('paracho')) return roomVisualMap.paracho;
  if (key.includes('yunuen')) return roomVisualMap.yunuen;
  if (key.includes('tlalpujagua')) return roomVisualMap.tlalpujagua;
  if (key.includes('cuanajo')) return roomVisualMap.cuanajo;
  return {
    image: roomUruapan,
    tagline: room.category || 'Suite Quinta Dalam',
    description: room.subtitle || 'Habitación disponible para tus fechas seleccionadas.',
    bedType: 'Por confirmar'
  };
}

function formatPrice(amount, currency) {
  if (amount == null) return 'Tarifa por confirmar';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency || 'MXN',
    maximumFractionDigits: 0
  }).format(amount);
}

function formatError(error) {
  const status = error?.response?.status;
  if (status === 409) return 'Las fechas seleccionadas ya no están disponibles.';
  if (status === 401) return 'Tu sesión expiró. Inicia sesión nuevamente.';
  if (status === 403) return 'No tienes permisos para esta acción.';
  return error?.response?.data?.message || 'No se pudo completar la operación.';
}

export default function Reservaciones() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { checkInISO, checkOutISO, checkInLabel, checkOutLabel, nights, hasValidRange } = useBookingDates();
  const { toasts, removeToast, pushError, pushSuccess, pushInfo } = useToast();
  const [dateError, setDateError] = useState('');
  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [reservationLoading, setReservationLoading] = useState(false);
  const [createdReservation, setCreatedReservation] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      personas: 2,
      habitacion: ''
    }
  });

  const guests = Number(watch('personas') || 1);
  const selectedRoomId = watch('habitacion');

  const availabilityCards = useMemo(
    () =>
      availability.map((room) => {
        const visual = findVisual(room);
        return {
          ...room,
          ...visual,
          priceLabel: formatPrice(room.nightlyRateAmount, room.currency),
          capacityLabel: `${room.capacity} personas`,
          sizeLabel: '28 m²',
          amenities: defaultAmenities
        };
      }),
    [availability]
  );

  const selectedRoom = useMemo(() => {
    return availabilityCards.find((room) => room.id === selectedRoomId) || availabilityCards[0] || null;
  }, [availabilityCards, selectedRoomId]);

  useEffect(() => {
    if (!user) return;
    setValue('nombre', `${user.firstName || ''} ${user.lastName || ''}`.trim());
    setValue('correo', user.email || '');
    setValue('telefono', user.phone || '');
  }, [user, setValue]);

  const loadAvailableRooms = useCallback(async () => {
    if (!hasValidRange || !checkInISO || !checkOutISO || !guests) return;

    setAvailabilityLoading(true);
    setAvailabilityError('');
    try {
      const response = await getAvailability({
        checkIn: checkInISO,
        checkOut: checkOutISO,
        guests
      });

      const rooms = response?.data?.data || [];
      setAvailability(rooms);

      if (rooms.length > 0) {
        const currentValue = getValues('habitacion');
        const hasCurrent = rooms.some((room) => room.id === currentValue);
        if (!hasCurrent) setValue('habitacion', rooms[0].id);
      } else {
        setValue('habitacion', '');
        setAvailabilityError('No hay habitaciones disponibles para ese rango');
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      setAvailability([]);
      setValue('habitacion', '');
      setAvailabilityError(formatError(error));
    } finally {
      setAvailabilityLoading(false);
    }
  }, [hasValidRange, checkInISO, checkOutISO, guests, getValues, setValue]);

  useEffect(() => {
    if (!hasValidRange || !checkInISO || !checkOutISO || !guests) {
      setAvailability([]);
      setAvailabilityError('');
      setValue('habitacion', '');
      return;
    }

    loadAvailableRooms();
  }, [hasValidRange, checkInISO, checkOutISO, guests, loadAvailableRooms, setValue]);

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      pushInfo('Primero inicia sesión para crear tu reservación.');
      navigate('/login');
      return;
    }

    if (!checkInISO || !checkOutISO) {
      setDateError('Selecciona un rango de fechas para continuar.');
      return;
    }

    if (!selectedRoom?.id) {
      pushError('Selecciona una habitación disponible antes de continuar.');
      return;
    }

    setDateError('');
    setReservationLoading(true);
    try {
      const reservation = await createReservation({
        roomId: selectedRoom.id,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        guestsCount: Number(data.personas),
        guestFullName: data.nombre,
        guestEmail: data.correo,
        guestPhone: data.telefono,
        specialRequests: data.comentarios || null
      });
      setCreatedReservation(reservation);
      pushSuccess(`Reservación creada: ${reservation.reservationCode}. Continúa al checkout.`);
    } catch (error) {
      pushError(formatError(error));
    } finally {
      setReservationLoading(false);
    }
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
                        readOnly={isAuthenticated}
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
                        readOnly={isAuthenticated}
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
                        readOnly={isAuthenticated}
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
                      <label className="form__label" htmlFor="habitacion">Habitación disponible</label>
                      {availabilityLoading ? (
                        <div className="skeleton" style={{ height: '46px' }}></div>
                      ) : (
                        <select
                          className={`form__input ${errors.habitacion ? 'input-error' : ''}`}
                          id="habitacion"
                          {...register('habitacion', {
                            required: 'Selecciona una habitación'
                          })}
                          disabled={!hasValidRange || availabilityLoading}
                        >
                          {!hasValidRange && <option value="">Selecciona fechas para ver disponibilidad</option>}
                          {hasValidRange && !availabilityCards.length && <option value="">No hay habitaciones disponibles para ese rango</option>}
                          {availabilityCards.map((room) => (
                            <option key={room.id} value={room.id}>
                              {room.name} - {room.priceLabel}
                            </option>
                          ))}
                        </select>
                      )}
                      {availabilityError && <span className="form-error">{availabilityError}</span>}
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

                  <button type="submit" className="btn btn--primary reserva__submit" disabled={reservationLoading || !availabilityCards.length}>
                    {reservationLoading ? <span className="btn__spinner" aria-hidden="true" /> : null}
                    {reservationLoading ? 'Creando reservación...' : 'Completar Reservación'}
                  </button>
                </form>

                <p className="reserva__notice">
                  <i className="fa-solid fa-code"></i>
                  {createdReservation?.reservationCode
                    ? `Reservación ${createdReservation.reservationCode} creada en PENDING_PAYMENT.`
                    : 'Flujo conectado al backend. Completa el formulario para crear tu reservación real.'}
                </p>
              </div>

              <aside className="reserva__summary" aria-label="Resumen de habitación seleccionada">
                <article className="room-card reserva-room-card">
                  {selectedRoom ? (
                    <>
                      <div className="room-card__img-wrap">
                        <img
                          src={selectedRoom.image}
                          alt={selectedRoom.name}
                          className="room-card__img"
                          loading="lazy"
                        />
                        <span className="room-card__badge">{selectedRoom.category || 'Suite'}</span>
                      </div>

                      <div className="room-card__body">
                        <h2 className="room-card__title">{selectedRoom.name}</h2>
                        <em className="room-card__sub">{selectedRoom.tagline || 'Quinta Dalam'}</em>
                        <p className="room-card__desc">{selectedRoom.description || 'Suite disponible para tu estancia.'}</p>

                        <ul className="room-card__amenities" aria-label="Amenidades">
                          {(selectedRoom.amenities || defaultAmenities).map((item) => (
                            <li key={item.label} className="room-card__amenity" title={item.label}>
                              <i className={item.icon} aria-hidden="true"></i>
                            </li>
                          ))}
                        </ul>

                        <div className="reserva-room-card__price">
                          <small>Tarifa por noche</small>
                          <strong>{selectedRoom.priceLabel}</strong>
                        </div>

                        <ul className="reserva-room-card__meta">
                          <li><i className="fa-solid fa-user-group" aria-hidden="true"></i>{selectedRoom.capacityLabel}</li>
                          <li><i className="fa-solid fa-bed" aria-hidden="true"></i>{selectedRoom.bedType}</li>
                          <li><i className="fa-solid fa-expand" aria-hidden="true"></i>{selectedRoom.sizeLabel}</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="room-card__body room-card__body--empty">
                      <h2 className="room-card__title">Sin suites para este rango</h2>
                      <p className="room-card__desc">
                        Ajusta tus fechas o número de huéspedes para consultar disponibilidad real.
                      </p>
                    </div>
                  )}
                </article>
              </aside>
            </div>

            <CheckoutWizard selectedRoom={selectedRoom} reservation={createdReservation} />
          </div>
        </div>
      </section>
      <ToastStack toasts={toasts} onClose={removeToast} />
    </main>
  );
}
