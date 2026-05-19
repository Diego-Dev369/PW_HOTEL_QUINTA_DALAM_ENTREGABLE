import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
import { useLanguage } from '../context/LanguageContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { getAvailability, getPublicRooms } from '../services/roomService.js';
import { createReservation } from '../services/reservationService.js';

const roomVisualMap = {
  uruapan: { image: roomUruapan, tagline: 'Naturaleza & Tradicion', bedType: '1 King Size' },
  patzcuaro: { image: roomPatzcuaro, tagline: 'Historia & Elegancia', bedType: '1 King Size' },
  paracho: { image: roomParacho, tagline: 'Sofisticacion & Cultura', bedType: '2 matrimoniales' },
  yunuen: { image: roomYunuen, tagline: 'Lago & Serenidad', bedType: '1 Queen Size' },
  tlalpujagua: { image: roomTlalpujagua, tagline: 'Color & Artesania', bedType: '1 Queen Size' },
  cuanajo: { image: roomCuanajo, tagline: 'Madera & Calidez', bedType: '2 matrimoniales' }
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
    .replace(/[^a-z0-9]/g, ' ') || '';
}

function findVisual(room) {
  const key = normalizeKey(`${room.code} ${room.name}`);
  if (key.includes('uruapan')) return roomVisualMap.uruapan;
  if (key.includes('patzcuaro')) return roomVisualMap.patzcuaro;
  if (key.includes('paracho')) return roomVisualMap.paracho;
  if (key.includes('yunuen')) return roomVisualMap.yunuen;
  if (key.includes('tlalpujagua')) return roomVisualMap.tlalpujagua;
  if (key.includes('cuanajo')) return roomVisualMap.cuanajo;
  return { image: roomUruapan, tagline: room.category || 'Suite Quinta Dalam', bedType: room.bedType || 'Por confirmar' };
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
  if (status === 409) return 'Las fechas seleccionadas ya no estan disponibles.';
  if (status === 401) return 'Tu sesion expiro. Inicia sesion nuevamente.';
  if (status === 403) return 'No tienes permisos para esta accion.';
  return error?.response?.data?.message || 'No se pudo completar la operacion.';
}

function enrichRoom(room) {
  const visual = findVisual(room);
  return {
    ...room,
    ...visual,
    description: room.description || room.subtitle || 'Habitacion disponible para tu estancia.',
    priceLabel: formatPrice(room.nightlyRateAmount, room.currency),
    capacityLabel: `${room.capacity} personas`,
    sizeLabel: room.sizeM2 ? `${room.sizeM2} m2` : '28 m2',
    amenities: defaultAmenities,
    bedType: room.bedType || visual.bedType
  };
}

export default function Reservaciones() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const requestedRoomCode = searchParams.get('room');
  const { isAuthenticated, user } = useAuth();
  const { checkInISO, checkOutISO, checkInLabel, checkOutLabel, nights, hasValidRange } = useBookingDates();
  const { toasts, removeToast, pushError, pushSuccess, pushInfo } = useToast();
  const [dateError, setDateError] = useState('');
  const [publicRooms, setPublicRooms] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
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

  const publicRoomCards = useMemo(() => publicRooms.map(enrichRoom), [publicRooms]);
  const availabilityCards = useMemo(() => availability.map(enrichRoom), [availability]);
  const roomOptions = hasValidRange ? availabilityCards : publicRoomCards;

  const selectedRoom = useMemo(() => {
    return roomOptions.find((room) => room.id === selectedRoomId)
      || publicRoomCards.find((room) => room.id === selectedRoomId)
      || roomOptions[0]
      || null;
  }, [roomOptions, publicRoomCards, selectedRoomId]);

  useEffect(() => {
    let alive = true;
    async function loadPublicRooms() {
      setRoomsLoading(true);
      try {
        const rooms = await getPublicRooms();
        if (!alive) return;
        setPublicRooms(rooms || []);

        const currentValue = getValues('habitacion');
        if (!currentValue && rooms?.length) {
          const requested = requestedRoomCode
            ? rooms.find((room) => room.code === requestedRoomCode)
            : null;
          setValue('habitacion', (requested || rooms[0]).id);
        }
      } catch (error) {
        if (alive) setAvailabilityError(formatError(error));
      } finally {
        if (alive) setRoomsLoading(false);
      }
    }

    loadPublicRooms();
    return () => { alive = false; };
  }, [getValues, requestedRoomCode, setValue]);

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
      const response = await getAvailability({ checkIn: checkInISO, checkOut: checkOutISO, guests });
      const rooms = response?.data?.data || [];
      setAvailability(rooms);

      if (rooms.length > 0) {
        const currentValue = getValues('habitacion');
        const requested = requestedRoomCode ? rooms.find((room) => room.code === requestedRoomCode) : null;
        const hasCurrent = rooms.some((room) => room.id === currentValue);
        setValue('habitacion', (requested || (hasCurrent ? rooms.find((room) => room.id === currentValue) : rooms[0])).id);
      } else {
        setValue('habitacion', '');
        setAvailabilityError('No hay habitaciones disponibles para ese rango');
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      setAvailability([]);
      setAvailabilityError(formatError(error));
    } finally {
      setAvailabilityLoading(false);
    }
  }, [hasValidRange, checkInISO, checkOutISO, guests, getValues, requestedRoomCode, setValue]);

  useEffect(() => {
    if (!hasValidRange || !checkInISO || !checkOutISO || !guests) {
      setAvailability([]);
      setAvailabilityError('');
      return;
    }
    loadAvailableRooms();
  }, [hasValidRange, checkInISO, checkOutISO, guests, loadAvailableRooms]);

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      pushInfo('Primero inicia sesion para crear tu reservacion.');
      navigate('/login');
      return;
    }

    if (!checkInISO || !checkOutISO) {
      setDateError('Selecciona un rango de fechas para continuar.');
      return;
    }

    const availableSelectedRoom = availabilityCards.find((room) => room.id === data.habitacion);
    if (!availableSelectedRoom?.id) {
      pushError('La habitacion seleccionada debe estar disponible para las fechas elegidas.');
      return;
    }

    setDateError('');
    setReservationLoading(true);
    try {
      const reservation = await createReservation({
        roomId: availableSelectedRoom.id,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        guestsCount: Number(data.personas),
        guestFullName: data.nombre,
        guestEmail: data.correo,
        guestPhone: data.telefono,
        specialRequests: data.comentarios || null
      });
      setCreatedReservation(reservation);
      pushSuccess(`Reservacion creada: ${reservation.reservationCode}. Continua al checkout.`);
    } catch (error) {
      pushError(formatError(error));
    } finally {
      setReservationLoading(false);
    }
  };

  const hasRoomOptions = roomOptions.length > 0;

  return (
    <main>
      <section className="section section--cream reserva-page">
        <div className="container">
          <div className="reserva-wrapper">
            <div className="reserva__layout">
              <div className="reserva__main">
                <header className="reserva__header">
                  <span className="section__eyebrow">{t.reservationsPage.eyebrow}</span>
                  <h1 className="section__title">{t.reservationsPage.title} <em>{t.reservationsPage.titleEm}</em></h1>
                  <span className="section__ornament">* - - *</span>
                </header>

                <form className="form reserva__form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="form__grid">
                    <div className="form__group">
                      <label className="form__label" htmlFor="nombre">{t.reservationsPage.fullName}</label>
                      <input
                        className={`form__input ${errors.nombre ? 'input-error' : ''}`}
                        type="text"
                        id="nombre"
                        placeholder="Ej. Juan Perez"
                        {...register('nombre', { required: 'El nombre es obligatorio', minLength: { value: 3, message: 'Minimo 3 caracteres' } })}
                        readOnly={isAuthenticated}
                      />
                      {errors.nombre && <span className="form-error">{errors.nombre.message}</span>}
                    </div>

                    <div className="form__group">
                      <label className="form__label" htmlFor="correo">{t.reservationsPage.email}</label>
                      <input
                        className={`form__input ${errors.correo ? 'input-error' : ''}`}
                        type="email"
                        id="correo"
                        placeholder="tu@correo.com"
                        {...register('correo', {
                          required: 'El correo es obligatorio',
                          pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Ingresa un correo valido' }
                        })}
                        readOnly={isAuthenticated}
                      />
                      {errors.correo && <span className="form-error">{errors.correo.message}</span>}
                    </div>

                    <div className="form__group form__group--full">
                      <label className="form__label" htmlFor="telefono">{t.reservationsPage.phone}</label>
                      <input
                        className={`form__input ${errors.telefono ? 'input-error' : ''}`}
                        type="tel"
                        id="telefono"
                        placeholder="+52 443 000 0000"
                        {...register('telefono', {
                          required: 'El telefono es obligatorio',
                          pattern: { value: /^[0-9+\-\s()]{10,15}$/, message: 'Ingresa un telefono valido' }
                        })}
                        readOnly={isAuthenticated}
                      />
                      {errors.telefono && <span className="form-error">{errors.telefono.message}</span>}
                    </div>

                    <div className="form__group form__group--full">
                      <DateRangePicker label={t.reservationsPage.stayDates} />
                      {dateError && <span className="form-error">{dateError}</span>}
                      {checkInLabel && checkOutLabel && (
                        <p className="reserva__date-meta">
                          <i className="fa-solid fa-moon" aria-hidden="true"></i>
                          {`${nights} ${t.reservationsPage.nightsSelected}: ${checkInLabel} - ${checkOutLabel}`}
                        </p>
                      )}
                    </div>

                    <div className="form__group">
                      <label className="form__label" htmlFor="personas">{t.reservationsPage.guestCount}</label>
                      <input
                        className={`form__input ${errors.personas ? 'input-error' : ''}`}
                        type="number"
                        id="personas"
                        min="1"
                        max="10"
                        {...register('personas', {
                          required: 'Indica el numero de personas',
                          min: { value: 1, message: 'Minimo 1 persona' },
                          max: { value: 10, message: 'Maximo 10 personas' }
                        })}
                      />
                      {errors.personas && <span className="form-error">{errors.personas.message}</span>}
                    </div>

                    <div className="form__group">
                      <label className="form__label" htmlFor="habitacion">{t.reservationsPage.availableRoom}</label>
                      {roomsLoading || availabilityLoading ? (
                        <div className="skeleton" style={{ height: '46px' }}></div>
                      ) : (
                        <select
                          className={`form__input ${errors.habitacion ? 'input-error' : ''}`}
                          id="habitacion"
                          {...register('habitacion', { required: 'Selecciona una habitacion' })}
                          disabled={!hasRoomOptions}
                        >
                          {!hasRoomOptions && <option value="">{t.reservationsPage.noRooms}</option>}
                          {roomOptions.map((room) => (
                            <option key={room.id} value={room.id}>
                              {room.name} - {room.priceLabel}{hasValidRange ? '' : ` (${t.reservationsPage.chooseDates})`}
                            </option>
                          ))}
                        </select>
                      )}
                      {!hasValidRange && hasRoomOptions && <span className="form-help">{t.reservationsPage.chooseDates}</span>}
                      {availabilityError && <span className="form-error">{availabilityError}</span>}
                      {errors.habitacion && <span className="form-error">{errors.habitacion.message}</span>}
                    </div>

                    <div className="form__group form__group--full">
                      <label className="form__label" htmlFor="comentarios">{t.reservationsPage.comments}</label>
                      <textarea className="form-textarea" id="comentarios" rows="4" placeholder={t.reservationsPage.commentsPlaceholder} {...register('comentarios')} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn--primary reserva__submit" disabled={reservationLoading || !hasRoomOptions}>
                    {reservationLoading ? <span className="btn__spinner" aria-hidden="true" /> : null}
                    {reservationLoading ? t.reservationsPage.creating : t.reservationsPage.submit}
                  </button>
                </form>

                <p className="reserva__notice">
                  <i className="fa-solid fa-code"></i>
                  {createdReservation?.reservationCode
                    ? t.reservationsPage.noticeCreated.replace('{code}', createdReservation.reservationCode)
                    : t.reservationsPage.noticeEmpty}
                </p>
              </div>

              <aside className="reserva__summary" aria-label={t.reservationsPage.roomSummary}>
                <article className="room-card reserva-room-card">
                  {selectedRoom ? (
                    <>
                      <div className="room-card__img-wrap">
                        <img src={selectedRoom.image} alt={selectedRoom.name} className="room-card__img" loading="lazy" />
                        <span className="room-card__badge">{selectedRoom.category || 'Suite'}</span>
                      </div>

                      <div className="room-card__body">
                        <h2 className="room-card__title">{selectedRoom.name}</h2>
                        <em className="room-card__sub">{selectedRoom.tagline || selectedRoom.subtitle || 'Quinta Dalam'}</em>
                        <p className="room-card__desc">{selectedRoom.description || t.reservationsPage.defaultDesc}</p>

                        <ul className="room-card__amenities" aria-label="Amenidades">
                          {(selectedRoom.amenities || defaultAmenities).map((item) => (
                            <li key={item.label} className="room-card__amenity" title={item.label}>
                              <i className={item.icon} aria-hidden="true"></i>
                            </li>
                          ))}
                        </ul>

                        <div className="reserva-room-card__price">
                          <small>{t.common.perNight}</small>
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
                      <h2 className="room-card__title">{t.reservationsPage.noSuitesTitle}</h2>
                      <p className="room-card__desc">{t.reservationsPage.noSuitesDesc}</p>
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
