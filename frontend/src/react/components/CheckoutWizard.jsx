import { useMemo, useState } from 'react';

import { useBookingDates } from '../context/BookingDateContext.jsx';

const STEPS = [
  { id: 1, title: 'Huésped' },
  { id: 2, title: 'Facturación' },
  { id: 3, title: 'Agregar Tarjeta' },
  { id: 4, title: 'Resumen' },
  { id: 5, title: 'Confirmación' }
];

export default function CheckoutWizard({ selectedRoom }) {
  const { checkInLabel, checkOutLabel, nights } = useBookingDates();
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    rfc: '',
    numeroTarjeta: '',
    titularTarjeta: '',
    expiracion: '',
    cvv: '',
    metodoPago: 'tarjeta',
    comentarios: ''
  });

  const canGoBack = step > 1;
  const canGoNext = step < STEPS.length;

  const reservationSummary = useMemo(() => ({
    habitacion: selectedRoom?.nombre || 'Suite sin seleccionar',
    precio: selectedRoom?.precio || '$0 MXN',
    fechas: checkInLabel && checkOutLabel ? `${checkInLabel} - ${checkOutLabel}` : 'Sin definir',
    noches: nights || 0
  }), [selectedRoom, checkInLabel, checkOutLabel, nights]);

  const updatePayload = (event) => {
    const { name, value } = event.target;
    setPayload((current) => ({ ...current, [name]: value }));
  };

  const nextStep = () => setStep((current) => Math.min(current + 1, STEPS.length));
  const prevStep = () => setStep((current) => Math.max(current - 1, 1));
  const restart = () => setStep(1);

  return (
    <section className="checkout-wizard" aria-label="Flujo visual de pago en cinco pasos">
      <header className="checkout-wizard__header">
        <span className="section__eyebrow">Checkout Visual</span>
        <h2 className="checkout-wizard__title">
          Completa tu <em>Reserva</em>
        </h2>
      </header>

      <ol className="checkout-wizard__progress" aria-label="Progreso del checkout">
        {STEPS.map((item) => {
          const isActive = item.id === step;
          const isDone = item.id < step;

          return (
            <li
              key={item.id}
              className={`checkout-wizard__progress-item${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
            >
              <span className="checkout-wizard__progress-dot">{item.id}</span>
              <span className="checkout-wizard__progress-label">Paso {item.id}</span>
            </li>
          );
        })}
      </ol>

      <div className="checkout-wizard__panel">
        {step === 1 && (
          <div className="checkout-wizard__step-body">
            <h3 className="checkout-wizard__step-title">Paso 1. Datos del huésped</h3>
            <div className="checkout-wizard__grid">
              <div className="form-group">
                <label className="form-label" htmlFor="wizard-nombre">Nombre completo</label>
                <input id="wizard-nombre" name="nombre" className="form-input" value={payload.nombre} onChange={updatePayload} placeholder="Ej. Juan Pérez" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wizard-correo">Correo electrónico</label>
                <input id="wizard-correo" name="correo" type="email" className="form-input" value={payload.correo} onChange={updatePayload} placeholder="correo@dominio.com" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wizard-telefono">Teléfono</label>
                <input id="wizard-telefono" name="telefono" className="form-input" value={payload.telefono} onChange={updatePayload} placeholder="+52 443 000 0000" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-wizard__step-body">
            <h3 className="checkout-wizard__step-title">Paso 2. Datos de facturación</h3>
            <div className="checkout-wizard__grid">
              <div className="form-group">
                <label className="form-label" htmlFor="wizard-direccion">Dirección</label>
                <input id="wizard-direccion" name="direccion" className="form-input" value={payload.direccion} onChange={updatePayload} placeholder="Calle, número y colonia" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wizard-ciudad">Ciudad</label>
                <input id="wizard-ciudad" name="ciudad" className="form-input" value={payload.ciudad} onChange={updatePayload} placeholder="Morelia" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wizard-rfc">RFC (opcional)</label>
                <input id="wizard-rfc" name="rfc" className="form-input" value={payload.rfc} onChange={updatePayload} placeholder="AAAA010101AAA" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wizard-metodo">Método de pago</label>
                <select id="wizard-metodo" name="metodoPago" className="form-select" value={payload.metodoPago} onChange={updatePayload}>
                  <option value="tarjeta">Tarjeta de crédito/débito</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="efectivo">Pago en recepción</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-wizard__step-body">
            <h3 className="checkout-wizard__step-title">Paso 3. Agregar Tarjeta</h3>
            <div className="checkout-wizard__grid">
              <div className="form-group">
                <label className="form-label" htmlFor="wizard-card-number">Número de tarjeta</label>
                <input id="wizard-card-number" name="numeroTarjeta" className="form-input" value={payload.numeroTarjeta} onChange={updatePayload} placeholder="0000 0000 0000 0000" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wizard-card-holder">Titular</label>
                <input id="wizard-card-holder" name="titularTarjeta" className="form-input" value={payload.titularTarjeta} onChange={updatePayload} placeholder="Nombre como aparece en la tarjeta" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wizard-card-expiry">Vencimiento</label>
                <input id="wizard-card-expiry" name="expiracion" className="form-input" value={payload.expiracion} onChange={updatePayload} placeholder="MM / AA" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wizard-card-cvv">CVV</label>
                <input id="wizard-card-cvv" name="cvv" className="form-input" value={payload.cvv} onChange={updatePayload} placeholder="123" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="checkout-wizard__step-body">
            <h3 className="checkout-wizard__step-title">Paso 4. Resumen de reserva</h3>
            <ul className="checkout-wizard__summary">
              <li><strong>Habitación:</strong> {reservationSummary.habitacion}</li>
              <li><strong>Fechas:</strong> {reservationSummary.fechas}</li>
              <li><strong>Noches:</strong> {reservationSummary.noches}</li>
              <li><strong>Tarifa:</strong> {reservationSummary.precio}</li>
            </ul>
            <div className="form-group">
              <label className="form-label" htmlFor="wizard-comments">Comentarios para recepción</label>
              <textarea
                id="wizard-comments"
                name="comentarios"
                className="form-textarea"
                rows="4"
                value={payload.comentarios}
                onChange={updatePayload}
                placeholder="Ej. Llegaré después de las 20:00"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="checkout-wizard__step-body checkout-wizard__step-body--success">
            <h3 className="checkout-wizard__step-title">Paso 5. Confirmación simulada</h3>
            <p className="checkout-wizard__success-copy">
              Tu checkout visual está completo. Este paso es demostrativo y no ejecuta cargos reales.
            </p>
            <button type="button" className="btn btn--outline" onClick={restart}>
              Reiniciar flujo
            </button>
          </div>
        )}
      </div>

      <footer className="checkout-wizard__actions">
        <button type="button" className="btn btn--ghost" onClick={prevStep} disabled={!canGoBack}>
          Anterior
        </button>
        {canGoNext && (
          <button type="button" className="btn btn--primary" onClick={nextStep}>
            Siguiente
          </button>
        )}
      </footer>
    </section>
  );
}
