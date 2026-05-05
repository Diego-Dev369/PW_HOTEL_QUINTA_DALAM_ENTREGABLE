import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'cancelado_por_usuario';

  const getReasonMessage = (reasonCode) => {
    switch (reasonCode) {
      case 'payment_failed':
        return 'El pago no pudo ser procesado. Verifica que tu tarjeta tenga fondos suficientes e inténtalo de nuevo.';
      case 'expired_card':
        return 'La tarjeta ingresada está vencida. Por favor, usa una tarjeta válida.';
      case 'insufficient_funds':
        return 'Fondos insuficientes en la tarjeta. Verifica tu saldo o usa otro método de pago.';
      case 'declined':
        return 'La tarjeta fue rechazada por el banco emisor. Contacta a tu banco o usa otra tarjeta.';
      case 'timeout':
        return 'La sesión de pago expiró por inactividad. Por seguridad, debes iniciar un nuevo proceso.';
      default:
        return 'No se completó el proceso de pago. Tu reservación sigue pendiente y puedes intentar nuevamente.';
    }
  };

  return (
    <main>
      <section className="section section--cream payment-page">
        <div className="container">
          <article className="account-card payment-page__card">
            <div className="payment-page__icon payment-page__icon--warning">
              <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
            </div>
            <span className="section__eyebrow">Pago No Completado</span>
            <h1 className="section__title">Pago <em>Cancelado</em></h1>
            
            <div className="payment-page__reason">
              <p className="payment-page__reason-text">
                {getReasonMessage(reason)}
              </p>
            </div>
            
            <div className="payment-page__status-info">
              <i className="fa-solid fa-info-circle" aria-hidden="true"></i>
              <p>
                Tu reservación sigue en estado <strong>pendiente de pago</strong>. 
                Los habitaciones no están bloqueadas, por lo que te recomendamos completar el pago lo antes posible 
                para asegurar tu estancia.
              </p>
            </div>
            
            <div className="payment-page__help">
              <h3>¿Necesitas ayuda?</h3>
              <ul>
                <li>Verifica que los datos de tu tarjeta sean correctos</li>
                <li>Asegúrate de tener fondos suficientes</li>
                <li>Intenta con otra tarjeta de crédito o débito</li>
                <li>Contacta a tu banco si el problema persiste</li>
              </ul>
            </div>
            
            <div className="payment-page__actions">
              <Link to="/reservaciones" className="btn btn--primary">
                <i className="fa-solid fa-rotate-right" aria-hidden="true"></i>
                Intentar nuevamente
              </Link>
              <Link to="/mis-reservaciones" className="btn btn--outline">
                Ver mis reservaciones
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
