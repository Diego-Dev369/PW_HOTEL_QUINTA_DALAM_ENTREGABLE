import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <main>
      <section className="section section--cream payment-page">
        <div className="container">
          <article className="account-card payment-page__card">
            <span className="section__eyebrow">Pago</span>
            <h1 className="section__title">Pago <em>Confirmado</em></h1>
            <p>Gracias por tu pago. Estamos validando y confirmando tu reservación.</p>
            <div className="payment-page__actions">
              <Link to="/mis-reservaciones" className="btn btn--primary">Ver mis reservaciones</Link>
              <Link to="/reservaciones" className="btn btn--outline">Nueva reservación</Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
