import { Link } from 'react-router-dom';

export default function PaymentCancel() {
  return (
    <main>
      <section className="section section--cream payment-page">
        <div className="container">
          <article className="account-card payment-page__card">
            <span className="section__eyebrow">Pago</span>
            <h1 className="section__title">Pago <em>Cancelado</em></h1>
            <p>No se completó el cobro. Tu reservación sigue en estado pendiente de pago.</p>
            <div className="payment-page__actions">
              <Link to="/reservaciones" className="btn btn--primary">Intentar nuevamente</Link>
              <Link to="/mis-reservaciones" className="btn btn--outline">Ver mis reservaciones</Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
