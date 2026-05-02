import { useMemo, useState } from 'react';
import { useBookingDates } from '../context/BookingDateContext.jsx';
import { createCheckoutSession } from '../services/paymentService.js';
import { useToast } from '../hooks/useToast.js';
import ToastStack from './ToastStack.jsx';

function fMoney(amount, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency, maximumFractionDigits: 0
  }).format(amount ?? 0);
}

function getErrorMessage(error) {
  const status = error?.response?.status;
  if (status === 401) return 'Debes iniciar sesión para continuar al pago.';
  if (status === 409) return 'La reservación ya no está disponible para pago.';
  if (status === 503) return 'Stripe no está configurado todavía en el backend.';
  return error?.response?.data?.message || 'No se pudo iniciar checkout.';
}

export default function CheckoutWizard({ selectedRoom, reservation }) {
  const { checkInLabel, checkOutLabel, nights } = useBookingDates();
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const { toasts, removeToast, pushError, pushInfo } = useToast();

  // ── Desglose financiero calculado desde los datos reales ────────────
  const breakdown = useMemo(() => {
    // Preferir datos del backend (reservation) > calcular desde selectedRoom
    const nightsCount = reservation?.nights ?? nights ?? 0;
    const rate        = reservation?.nightlyRateAmount ?? selectedRoom?.nightlyRateAmount ?? 0;
    const subtotal    = reservation?.subtotalAmount    ?? (rate * nightsCount);
    const taxes       = reservation?.taxesAmount       ?? 0;
    const total       = reservation?.totalAmount       ?? subtotal + taxes;
    const currency    = reservation?.currency          ?? selectedRoom?.currency ?? 'MXN';

    return { nightsCount, rate, subtotal, taxes, total, currency };
  }, [reservation, selectedRoom, nights]);

  const summary = useMemo(() => ({
    room:            reservation?.roomName  || selectedRoom?.name || 'Sin suite seleccionada',
    category:        reservation?.roomCategory || selectedRoom?.category || '',
    checkInLabel:    checkInLabel  || (reservation?.checkIn  ? new Date(reservation.checkIn  + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'),
    checkOutLabel:   checkOutLabel || (reservation?.checkOut ? new Date(reservation.checkOut + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'),
    reservationCode: reservation?.reservationCode || null,
    status:          reservation?.status          || null,
    canPay:          reservation?.status === 'PENDING_PAYMENT',
    isPaid:          reservation?.status === 'CONFIRMED',
  }), [selectedRoom, checkInLabel, checkOutLabel, reservation]);

  const startCheckout = async () => {
    if (!reservation?.id) {
      pushInfo('Primero crea tu reservación para habilitar el checkout.');
      return;
    }
    setIsCreatingSession(true);
    try {
      const baseUrl = window.location.origin;
      const session = await createCheckoutSession({
        reservationId:  reservation.id,
        successUrl:     `${baseUrl}/pago/exitoso`,
        cancelUrl:      `${baseUrl}/pago/cancelado`,
        idempotencyKey: crypto.randomUUID(),
      });
      if (!session?.checkoutUrl) {
        pushError('Stripe respondió sin URL de checkout.');
        return;
      }
      window.location.href = session.checkoutUrl;
    } catch (error) {
      pushError(getErrorMessage(error));
    } finally {
      setIsCreatingSession(false);
    }
  };

  // No renderizar si no hay suite seleccionada aún
  if (!selectedRoom && !reservation) return null;

  return (
    <section className="checkout-wizard" aria-label="Resumen y checkout">
      <header className="checkout-wizard__header">
        <span className="section__eyebrow">Pago Seguro</span>
        <h2 className="checkout-wizard__title">
          Resumen de <em>Reservación</em>
        </h2>
      </header>

      <div className="checkout-wizard__panel">
        {/* ── Datos de la suite ── */}
        <div className="checkout-wizard__suite-row">
          <div>
            <p className="checkout-wizard__suite-name">{summary.room}</p>
            {summary.category && (
              <p className="checkout-wizard__suite-category">{summary.category}</p>
            )}
          </div>
          {summary.reservationCode && (
            <code className="checkout-wizard__folio">{summary.reservationCode}</code>
          )}
        </div>

        {/* ── Fechas ── */}
        <div className="checkout-wizard__dates">
          <span>
            <i className="fa-regular fa-calendar" aria-hidden="true"></i>
            {summary.checkInLabel}
          </span>
          <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          <span>{summary.checkOutLabel}</span>
        </div>

        {/* ── Desglose financiero ── */}
        {breakdown.nightsCount > 0 && (
          <div className="checkout-wizard__breakdown">
            <div className="checkout-wizard__breakdown-row">
              <span>{breakdown.nightsCount} noche{breakdown.nightsCount !== 1 ? 's' : ''} × {fMoney(breakdown.rate, breakdown.currency)}</span>
              <span>{fMoney(breakdown.subtotal, breakdown.currency)}</span>
            </div>
            <div className="checkout-wizard__breakdown-row checkout-wizard__breakdown-row--taxes">
              <span>
                <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
                Impuestos incluidos
              </span>
              <span className="checkout-wizard__incl">Incluido</span>
            </div>
            <div className="checkout-wizard__breakdown-row checkout-wizard__breakdown-row--total">
              <strong>Total a pagar</strong>
              <strong className="checkout-wizard__total-amount">
                {fMoney(breakdown.total, breakdown.currency)}
              </strong>
            </div>
          </div>
        )}

        {/* ── Estado ── */}
        {summary.isPaid && (
          <div className="checkout-wizard__paid-notice">
            <i className="fa-solid fa-shield-check" aria-hidden="true"></i>
            Pago confirmado por Stripe
          </div>
        )}
      </div>

      {/* ── Acción ── */}
      {!summary.isPaid && (
        <footer className="checkout-wizard__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={startCheckout}
            disabled={isCreatingSession || !reservation?.id || !summary.canPay}
          >
            {isCreatingSession
              ? <><span className="btn__spinner" aria-hidden="true" /> Abriendo Stripe...</>
              : <><i className="fa-solid fa-lock" aria-hidden="true"></i> Proceder al pago seguro</>
            }
          </button>
          {!reservation?.id && (
            <p className="checkout-wizard__hint">
              Completa el formulario de reservación para habilitar el pago.
            </p>
          )}
        </footer>
      )}

      <ToastStack toasts={toasts} onClose={removeToast} />
    </section>
  );
}
