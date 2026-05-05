import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [reservationCode, setReservationCode] = useState(null);

  useEffect(() => {
    // Intentar obtener el código de reservación de los parámetros URL
    const code = searchParams.get('reservation_code');
    if (code) {
      setReservationCode(code);
    }
  }, [searchParams]);

  return (
    <main>
      <section className="section section--cream payment-page">
        <div className="container">
          <article className="account-card payment-page__card">
            <div className="payment-page__icon payment-page__icon--success">
              <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
            </div>
            <span className="section__eyebrow">Pago Exitoso</span>
            <h1 className="section__title">Pago <em>Confirmado</em></h1>
            
            {reservationCode && (
              <div className="payment-page__reservation-code">
                <p>Reservación confirmada:</p>
                <code>{reservationCode}</code>
              </div>
            )}
            
            <p className="payment-page__message">
              ¡Gracias por tu pago! Hemos recibido tu confirmación de Stripe y tu reservación ha sido actualizada.
              Recibirás un correo electrónico con los detalles de tu estancia.
            </p>
            
            <div className="payment-page__next-steps">
              <h3>¿Qué sigue?</h3>
              <ul>
                <li>Recibirás un correo de confirmación con los detalles de tu reservación</li>
                <li>Presenta tu código de reservación al hacer check-in</li>
                <li>Consulta nuestras políticas de cancelación en caso de necesitar modificar tu estancia</li>
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
