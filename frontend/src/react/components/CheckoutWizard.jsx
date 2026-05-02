import { useMemo, useState } from 'react';
import { useBookingDates } from '../context/BookingDateContext.jsx';
import { createCheckoutSession } from '../services/paymentService.js';
import { useToast } from '../hooks/useToast.js';
import ToastStack from './ToastStack.jsx';

function getErrorMessage(error) {
  if (error?.response?.status === 401) return 'Debes iniciar sesión para continuar al pago.';
  if (error?.response?.status === 409) return 'La reservación ya no está disponible para pago.';
  if (error?.response?.status === 503) return 'Stripe no está configurado todavía en el backend.';
  return error?.response?.data?.message || 'No se pudo iniciar checkout.';
}

export default function CheckoutWizard({ selectedRoom, reservation }) {
  const { checkInLabel, checkOutLabel, nights } = useBookingDates();
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const { toasts, removeToast, pushError, pushInfo } = useToast();

  const summary = useMemo(() => ({
    room: selectedRoom?.name || 'Sin suite seleccionada',
    dates: checkInLabel && checkOutLabel ? `${checkInLabel} - ${checkOutLabel}` : 'Sin definir',
    nights: nights || 0,
    rate: selectedRoom?.priceLabel || 'Tarifa por confirmar',
    reservationCode: reservation?.reservationCode || null,
    status: reservation?.status || 'PENDING_PAYMENT'
  }), [selectedRoom, checkInLabel, checkOutLabel, nights, reservation]);

  const startCheckout = async () => {
    if (!reservation?.id) {
      pushInfo('Primero crea tu reservación para habilitar el checkout.');
      return;
    }

    setIsCreatingSession(true);
    try {
      const baseUrl = window.location.origin;
      const session = await createCheckoutSession({
        reservationId: reservation.id,
        successUrl: `${baseUrl}/pago/exitoso`,
        cancelUrl: `${baseUrl}/pago/cancelado`,
        idempotencyKey: crypto.randomUUID()
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

  return (
    <section className="checkout-wizard" aria-label="Checkout Stripe">
      <header className="checkout-wizard__header">
        <span className="section__eyebrow">Pago Seguro</span>
        <h2 className="checkout-wizard__title">
          Checkout <em>Stripe</em>
        </h2>
      </header>

      <div className="checkout-wizard__panel">
        <div className="checkout-wizard__step-body">
          <h3 className="checkout-wizard__step-title">Resumen para pago</h3>
          <ul className="checkout-wizard__summary">
            <li><strong>Reservación:</strong> {summary.reservationCode || 'Pendiente de creación'}</li>
            <li><strong>Habitación:</strong> {summary.room}</li>
            <li><strong>Fechas:</strong> {summary.dates}</li>
            <li><strong>Noches:</strong> {summary.nights}</li>
            <li><strong>Tarifa:</strong> {summary.rate}</li>
            <li><strong>Estado:</strong> {summary.status}</li>
          </ul>
        </div>
      </div>

      <footer className="checkout-wizard__actions">
        <button type="button" className="btn btn--primary" onClick={startCheckout} disabled={isCreatingSession || !reservation?.id}>
          {isCreatingSession ? <span className="btn__spinner" aria-hidden="true" /> : null}
          {isCreatingSession ? 'Abriendo Stripe...' : 'Proceder al pago'}
        </button>
      </footer>

      <ToastStack toasts={toasts} onClose={removeToast} />
    </section>
  );
}
