import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMyReservations } from '../services/reservationService.js';
import { createCheckoutSession } from '../services/paymentService.js';
import { useToast } from '../hooks/useToast.js';
import ToastStack from '../components/ToastStack.jsx';

// ── Imágenes locales mapeadas por room code ──────────────────────────
import roomUruapan    from '../../assets/images/rooms/204-uruapan.jpeg';
import roomPatzcuaro  from '../../assets/images/rooms/104-patzcuaro.jpeg';
import roomParacho    from '../../assets/images/rooms/102-paracho.jpeg';
import roomYunuen     from '../../assets/images/rooms/103-yunuen.jpeg';
import roomCuanajo    from '../../assets/images/rooms/207-cuanajo.jpeg';
import roomTlalpujagua from '../../assets/images/rooms/205-tlalpujagua.jpeg';

const ROOM_IMAGE_MAP = {
  'suite-uruapan':     roomUruapan,
  'suite-patzcuaro':   roomPatzcuaro,
  'suite-paracho':     roomParacho,
  'suite-yunuen':      roomYunuen,
  'suite-cuanajo':     roomCuanajo,
  'suite-tlalpujagua': roomTlalpujagua,
};

function getRoomImage(code) {
  if (!code) return roomUruapan;
  const key = code.toLowerCase();
  return ROOM_IMAGE_MAP[key] ?? roomUruapan;
}

// ── Helpers de formato ───────────────────────────────────────────────
function fDate(dateStr) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(new Date(dateStr + 'T12:00:00'));
}

function fMoney(amount, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency, maximumFractionDigits: 0
  }).format(amount ?? 0);
}

function fDatetime(instant) {
  if (!instant) return '—';
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium', timeStyle: 'short'
  }).format(new Date(instant));
}

// ── Badge de estado ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING_PAYMENT: { label: 'Pendiente de pago', cls: 'res-badge--pending',   icon: 'fa-solid fa-clock' },
  CONFIRMED:       { label: 'Confirmada',         cls: 'res-badge--confirmed', icon: 'fa-solid fa-circle-check' },
  CHECKED_IN:      { label: 'En curso',           cls: 'res-badge--active',    icon: 'fa-solid fa-door-open' },
  CHECKED_OUT:     { label: 'Completada',         cls: 'res-badge--done',      icon: 'fa-solid fa-flag-checkered' },
  CANCELLED:       { label: 'Cancelada',          cls: 'res-badge--cancelled', icon: 'fa-solid fa-ban' },
  NO_SHOW:         { label: 'No Show',            cls: 'res-badge--cancelled', icon: 'fa-solid fa-circle-xmark' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, cls: 'res-badge--pending', icon: 'fa-solid fa-question' };
  return (
    <span className={`res-badge ${cfg.cls}`}>
      <i className={cfg.icon} aria-hidden="true"></i>
      {cfg.label}
    </span>
  );
}

// ── Desglose financiero ──────────────────────────────────────────────
function FinancialBreakdown({ row }) {
  return (
    <div className="res-breakdown">
      <div className="res-breakdown__row">
        <span>{row.nights} noche{row.nights !== 1 ? 's' : ''} × {fMoney(row.nightlyRateAmount, row.currency)}</span>
        <span>{fMoney(row.subtotalAmount, row.currency)}</span>
      </div>
      <div className="res-breakdown__row">
        <span>Impuestos incluidos</span>
        <span className="res-breakdown__incl">Incluido</span>
      </div>
      <div className="res-breakdown__row res-breakdown__row--total">
        <strong>Total</strong>
        <strong>{fMoney(row.totalAmount, row.currency)}</strong>
      </div>
      {row.paymentStatus === 'SUCCEEDED' && (
        <div className="res-breakdown__payment-info">
          <i className="fa-solid fa-shield-check" aria-hidden="true"></i>
          Pago procesado el {fDatetime(row.paidAt)}
        </div>
      )}
    </div>
  );
}

// ── Tarjeta individual de reserva ────────────────────────────────────
function ReservationCard({ row }) {
  const [expanded, setExpanded]   = useState(false);
  const [paying, setPaying]       = useState(false);
  const { pushError }             = useToast();

  const isPending    = row.status === 'PENDING_PAYMENT';
  const isConfirmed  = row.status === 'CONFIRMED';
  const roomImg      = getRoomImage(row.roomCode);

  const handlePay = useCallback(async () => {
    setPaying(true);
    try {
      const baseUrl = window.location.origin;
      const session = await createCheckoutSession({
        reservationId:  row.id,
        successUrl:     `${baseUrl}/pago/exitoso`,
        cancelUrl:      `${baseUrl}/pago/cancelado`,
        idempotencyKey: crypto.randomUUID(),
      });
      if (!session?.checkoutUrl) {
        pushError('Stripe respondió sin URL de checkout.');
        return;
      }
      window.location.href = session.checkoutUrl;
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) pushError('Esta reservación ya no está disponible para pago.');
      else if (status === 503) pushError('Stripe no está configurado todavía en el servidor.');
      else pushError(err?.response?.data?.message || 'No se pudo iniciar el pago.');
    } finally {
      setPaying(false);
    }
  }, [row.id, pushError]);

  return (
    <article className={`res-card ${isPending ? 'res-card--pending' : ''} ${isConfirmed ? 'res-card--confirmed' : ''}`}>

      {/* ── Imagen de la suite ── */}
      <div className="res-card__img-wrap">
        <img src={roomImg} alt={row.roomName} className="res-card__img" loading="lazy" />
        <StatusBadge status={row.status} />
      </div>

      {/* ── Cuerpo ── */}
      <div className="res-card__body">
        <header className="res-card__header">
          <div>
            <p className="res-card__code">{row.reservationCode}</p>
            <h3 className="res-card__room-name">{row.roomName}</h3>
            <p className="res-card__category">{row.roomCategory}</p>
          </div>
          <p className="res-card__total">{fMoney(row.totalAmount, row.currency)}</p>
        </header>

        {/* Fechas y meta */}
        <div className="res-card__meta">
          <span><i className="fa-regular fa-calendar-check" aria-hidden="true"></i> {fDate(row.checkIn)}</span>
          <i className="fa-solid fa-arrow-right res-card__arrow" aria-hidden="true"></i>
          <span>{fDate(row.checkOut)}</span>
          <span className="res-card__nights">{row.nights} noche{row.nights !== 1 ? 's' : ''}</span>
          <span><i className="fa-solid fa-user-group" aria-hidden="true"></i> {row.guestsCount} huésped{row.guestsCount !== 1 ? 'es' : ''}</span>
          {row.roomBedType && (
            <span><i className="fa-solid fa-bed" aria-hidden="true"></i> {row.roomBedType}</span>
          )}
        </div>

        {/* Acciones */}
        <footer className="res-card__actions">
          <button
            type="button"
            className="btn btn--ghost res-card__detail-btn"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            <i className={`fa-solid ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true"></i>
            {expanded ? 'Ocultar detalles' : 'Ver detalles'}
          </button>

          {isPending && (
            <button
              type="button"
              className="btn btn--primary res-card__pay-btn"
              onClick={handlePay}
              disabled={paying}
            >
              {paying
                ? <><span className="btn__spinner" aria-hidden="true" /> Abriendo Stripe...</>
                : <><i className="fa-solid fa-credit-card" aria-hidden="true"></i> Pagar ahora</>
              }
            </button>
          )}

          {isConfirmed && (
            <span className="res-card__paid-label">
              <i className="fa-solid fa-shield-check" aria-hidden="true"></i> Pagado
            </span>
          )}
        </footer>

        {/* Panel expandible */}
        {expanded && (
          <div className="res-card__detail-panel">
            <FinancialBreakdown row={row} />
            <div className="res-card__guest-info">
              <p><strong>Huésped:</strong> {row.guestFullName}</p>
              <p><strong>Correo:</strong> {row.guestEmail}</p>
              <p><strong>Reserva creada:</strong> {fDatetime(row.createdAt)}</p>
              {row.stripeSessionId && (
                <p className="res-card__stripe-id">
                  <strong>Session ID:</strong>
                  <code>{row.stripeSessionId}</code>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

// ── Componente principal ─────────────────────────────────────────────
export default function MyReservations() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows]       = useState([]);
  const { toasts, removeToast, pushError } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getMyReservations();
        if (!cancelled) setRows(data);
      } catch (err) {
        if (!cancelled)
          pushError(err?.response?.data?.message || 'No se pudieron cargar tus reservaciones.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [pushError]);

  const now      = useMemo(() => new Date(), []);
  const upcoming = rows.filter((r) => new Date(r.checkIn + 'T12:00:00') >= now || r.status === 'PENDING_PAYMENT');
  const past     = rows.filter((r) => new Date(r.checkIn + 'T12:00:00') < now  && r.status !== 'PENDING_PAYMENT');

  const renderSection = (items, title, emptyMsg) => (
    <section className="res-section">
      <h2 className="res-section__title">{title}</h2>
      {items.length === 0
        ? <p className="res-section__empty">{emptyMsg}</p>
        : <div className="res-grid">{items.map((r) => <ReservationCard key={r.id} row={r} />)}</div>
      }
    </section>
  );

  return (
    <main>
      <section className="section section--cream account-page">
        <div className="container">

          <header className="account-page__header">
            <span className="section__eyebrow">Historial</span>
            <h1 className="section__title">Mis <em>Reservaciones</em></h1>
            <span className="section__ornament">✦ ─── ✦ ─── ✦</span>
          </header>

          {loading ? (
            <div className="res-skeleton-grid">
              {[1, 2, 3].map((i) => <div key={i} className="res-skeleton" />)}
            </div>
          ) : rows.length === 0 ? (
            <div className="res-empty">
              <i className="fa-regular fa-calendar-xmark res-empty__icon" aria-hidden="true"></i>
              <h2 className="res-empty__title">Sin reservaciones todavía</h2>
              <p className="res-empty__text">Cuando hagas una reservación, aparecerá aquí con todos sus detalles.</p>
              <Link to="/reservaciones" className="btn btn--primary">Hacer una reservación</Link>
            </div>
          ) : (
            <div className="account-page__stack">
              {renderSection(upcoming, 'Próximas & Pendientes', 'No tienes reservaciones próximas o pendientes de pago.')}
              {renderSection(past,     'Historial',             'Aún no tienes estancias anteriores.')}
            </div>
          )}

        </div>
      </section>
      <ToastStack toasts={toasts} onClose={removeToast} />
    </main>
  );
}
