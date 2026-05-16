import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getMyReservations } from '../services/reservationService.js';

// Máximo intentos de polling para detectar webhook de Stripe
const MAX_POLLS = 8;
const POLL_INTERVAL_MS = 2500;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [pollStatus, setPollStatus] = useState('polling'); // 'polling' | 'confirmed' | 'timeout'
  const [confirmedCode, setConfirmedCode] = useState(null);
  const pollCount = useRef(0);
  const timerRef = useRef(null);

  // El folio puede venir en URL si se pasó como query param desde el checkout
  const reservationCodeFromUrl = searchParams.get('reservation_code');

  const checkConfirmation = useCallback(async () => {
    try {
      const reservations = await getMyReservations();
      // Buscar la reserva más reciente que haya pasado a CONFIRMED / PARTIALLY_PAID
      const justPaid = reservations.find(
        (r) => r.status === 'CONFIRMED' || r.status === 'PARTIALLY_PAID'
      );
      if (justPaid) {
        setConfirmedCode(justPaid.reservationCode);
        setPollStatus('confirmed');
        return true; // Detener polling
      }
      return false;
    } catch {
      return false; // Error no bloquea, sigue intentando
    }
  }, []);

  useEffect(() => {
    // Si el usuario no está logueado, skip polling (reserva anónima)
    const token = localStorage.getItem('qd_access_token');
    if (!token) {
      setPollStatus('timeout');
      setConfirmedCode(reservationCodeFromUrl);
      return;
    }

    let cancelled = false;

    const runPoll = async () => {
      if (cancelled) return;
      const found = await checkConfirmation();
      if (found || cancelled) return;

      pollCount.current += 1;
      if (pollCount.current >= MAX_POLLS) {
        if (!cancelled) setPollStatus('timeout');
        return;
      }
      timerRef.current = setTimeout(runPoll, POLL_INTERVAL_MS);
    };

    // Primer check inmediato, luego intervalos
    timerRef.current = setTimeout(runPoll, 1500);

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, [checkConfirmation, reservationCodeFromUrl]);

  const displayCode = confirmedCode || reservationCodeFromUrl;

  return (
    <main>
      <section className="section section--cream payment-page">
        <div className="container">
          <article className="account-card payment-page__card">

            {/* ── Ícono dinámico según estado ── */}
            <div className={`payment-page__icon ${pollStatus === 'confirmed' ? 'payment-page__icon--success' : 'payment-page__icon--polling'}`}>
              {pollStatus === 'polling' ? (
                <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" style={{ color: 'var(--color-gold)' }}></i>
              ) : (
                <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
              )}
            </div>

            <span className="section__eyebrow">Pago Exitoso</span>
            <h1 className="section__title">Pago <em>Confirmado</em></h1>

            {/* ── Estado de sincronización ── */}
            {pollStatus === 'polling' && (
              <div className="payment-page__status-info" style={{ justifyContent: 'center', textAlign: 'center' }}>
                <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
                <p>Sincronizando confirmación con el servidor… <small>(esto toma solo unos segundos)</small></p>
              </div>
            )}

            {/* ── Código de reservación confirmada ── */}
            {displayCode && (
              <div className="payment-page__reservation-code">
                <p>Reservación confirmada:</p>
                <code>{displayCode}</code>
              </div>
            )}

            {pollStatus === 'confirmed' && (
              <div className="payment-page__status-info" style={{ background: 'rgba(46,204,113,0.08)', borderColor: 'rgba(46,204,113,0.3)' }}>
                <i className="fa-solid fa-shield-check" aria-hidden="true" style={{ color: '#2ECC71' }}></i>
                <p><strong>¡Reservación confirmada!</strong> Tu estancia está asegurada. Recibirás un correo electrónico con los detalles.</p>
              </div>
            )}

            {pollStatus === 'timeout' && (
              <>
                <div className="payment-page__status-info">
                  <i className="fa-solid fa-circle-check" aria-hidden="true" style={{ color: '#2ECC71' }}></i>
                  <p>
                    Tu pago fue procesado correctamente por Stripe. La confirmación de tu reservación se actualizará
                    en los próximos minutos. <strong>Puedes consultar el estado en "Mis Reservaciones".</strong>
                  </p>
                </div>
              </>
            )}

            <p className="payment-page__message">
              ¡Gracias por elegir Hotel Quinta Dalam! Presentarás tu código de reservación al hacer check-in.
            </p>

            <div className="payment-page__next-steps">
              <h3>¿Qué sigue?</h3>
              <ul>
                <li>Recibirás un correo de confirmación con los detalles de tu estancia</li>
                <li>Presenta tu código de reservación al hacer check-in</li>
                <li>Consulta nuestras políticas de cancelación si necesitas modificar tu estancia</li>
              </ul>
            </div>

            <div className="payment-page__actions">
              <Link to="/mis-reservaciones" className="btn btn--primary">
                <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
                Ver mis reservaciones
              </Link>
              <Link to="/reservaciones" className="btn btn--outline">
                Nueva reservación
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
