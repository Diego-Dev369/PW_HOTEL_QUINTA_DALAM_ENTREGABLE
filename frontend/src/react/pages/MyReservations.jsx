import { useEffect, useMemo, useState } from 'react';
import { getMyReservations } from '../services/reservationService.js';
import { useToast } from '../hooks/useToast.js';
import ToastStack from '../components/ToastStack.jsx';

function formatDate(date) {
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
}

function formatMoney(amount, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount || 0);
}

export default function MyReservations() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const { toasts, removeToast, pushError } = useToast();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const data = await getMyReservations();
        if (!cancelled) setRows(data);
      } catch (error) {
        if (!cancelled) pushError(error?.response?.data?.message || 'No se pudieron cargar tus reservaciones.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [pushError]);

  const now = useMemo(() => new Date(), []);
  const upcoming = rows.filter((item) => new Date(item.checkIn) >= now);
  const past = rows.filter((item) => new Date(item.checkIn) < now);

  const renderTable = (items, emptyMessage) => (
    <div className="account-card account-card--table">
      {items.length === 0 ? (
        <p className="account-card__empty">{emptyMessage}</p>
      ) : (
        <table className="account-table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td>{row.reservationCode}</td>
                <td>{formatDate(row.checkIn)}</td>
                <td>{formatDate(row.checkOut)}</td>
                <td>{row.status}</td>
                <td>{formatMoney(row.totalAmount, row.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <main>
      <section className="section section--cream account-page">
        <div className="container">
          <div className="account-page__header">
            <span className="section__eyebrow">Historial</span>
            <h1 className="section__title">Mis <em>Reservaciones</em></h1>
            <span className="section__ornament">✦ — — ✦</span>
          </div>

          {loading ? (
            <div className="account-card"><p>Cargando reservaciones...</p></div>
          ) : (
            <div className="account-page__stack">
              <h2 className="account-page__subheading">Próximas</h2>
              {renderTable(upcoming, 'No tienes reservaciones próximas.')}
              <h2 className="account-page__subheading">Pasadas</h2>
              {renderTable(past, 'No tienes reservaciones históricas todavía.')}
            </div>
          )}
        </div>
      </section>
      <ToastStack toasts={toasts} onClose={removeToast} />
    </main>
  );
}
