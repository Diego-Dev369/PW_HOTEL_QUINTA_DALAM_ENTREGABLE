import { useMemo, useState, useCallback } from 'react';
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
  const message = error?.response?.data?.message;
  const errorCode = error?.response?.data?.error;
  
  if (status === 401) return 'Debes iniciar sesión para continuar al pago.';
  if (status === 409) return message || 'La reservación ya no está disponible para pago.';
  if (status === 503) return 'El sistema de pagos no está disponible. Por favor, inténtalo más tarde.';
  if (status === 400) return message || 'Datos inválidos para el pago.';
  if (errorCode === 'STRIPE_NOT_CONFIGURED') return 'El sistema de pagos no está configurado. Contacta al administrador.';
  if (errorCode === 'INVALID_PAYMENT_AMOUNT') return 'El monto de la reservación no es válido.';
  return message || 'No se pudo iniciar el proceso de pago. Por favor, inténtalo de nuevo.';
}

// Generar UUID compatible con todos los navegadores
function generateIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para navegadores antiguos
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function CheckoutWizard({ selectedRoom, reservation }) {
  const { checkInLabel, checkOutLabel, nights } = useBookingDates();
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const { toasts, removeToast, pushError, pushInfo, pushSuccess } = useToast();

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

  const startCheckout = useCallback(async () => {
    // Validar que existe la reservación
    if (!reservation?.id) {
      pushInfo('Primero crea tu reservación para habilitar el checkout.');
      return;
    }

    // Validar que el ID sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reservation.id)) {
      pushError('ID de reservación inválido. Por favor, intenta crear una nueva reservación.');
      return;
    }

    // Prevenir múltiples clicks
    if (isCreatingSession) {
      return;
    }

    setCheckoutError(null);
    setIsCreatingSession(true);

    try {
      const baseUrl = window.location.origin;
      const idempotencyKey = generateIdempotencyKey();

      console.log('[CheckoutWizard] Iniciando checkout:', {
        reservationId: reservation.id,
        reservationCode: reservation.reservationCode,
        successUrl: `${baseUrl}/pago/exitoso`,
        cancelUrl: `${baseUrl}/pago/cancelado`
      });

      const session = await createCheckoutSession({
        reservationId: reservation.id,
        successUrl: `${baseUrl}/pago/exitoso`,
        cancelUrl: `${baseUrl}/pago/cancelado`,
        idempotencyKey: idempotencyKey,
      });

      console.log('[CheckoutWizard] Sesión creada:', session);

      // Validar que la respuesta tenga checkoutUrl
      if (!session?.checkoutUrl) {
        const errorMsg = 'Stripe respondió sin URL de checkout. Por favor, inténtalo de nuevo.';
        setCheckoutError(errorMsg);
        pushError(errorMsg);
        return;
      }

      // Redireccionar a Stripe Checkout
      console.log('[CheckoutWizard] Redireccionando a:', session.checkoutUrl);
      window.location.href = session.checkoutUrl;

    } catch (error) {
      console.error('[CheckoutWizard] Error en checkout:', error);
      const errorMsg = getErrorMessage(error);
      setCheckoutError(errorMsg);
      pushError(errorMsg);
    } finally {
      setIsCreatingSession(false);
    }
  }, [reservation, isCreatingSession, pushError, pushInfo]);

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
