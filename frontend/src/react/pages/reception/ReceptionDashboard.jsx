import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MetricCard from '../../components/admin/MetricCard';
import { fetchReceptionDashboard } from '../../services/staffApi';

export default function ReceptionDashboard() {
  const [dash, setDash] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReceptionDashboard()
      .then(setDash)
      .catch((e) => setError(e?.response?.data?.message || 'No fue posible cargar operación.'));
  }, []);

  return (
    <main className="admin-main">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Recepción · <em>Hoy</em></h1>
          <p className="admin-page-subtitle">
            Dashboard operativo (UTC). Ejecutá walk-ins y cobros manuales vía API (UI extendida siguiente iteración).
          </p>
        </div>
        <span className="admin-page-ornament" aria-hidden="true">✦ ─── ✦</span>
      </div>

      {error && <p className="admin-card" style={{ color: '#a33', padding: '1rem' }}>{error}</p>}

      <div className="admin-metrics">
        <MetricCard
          title={`Llegadas`}
          value={dash ? String(dash.arrivals) : '—'}
          icon="fa-plane-arrival"
          colorClass="metric-card__icon--adobe"
        />
        <MetricCard
          title="Salidas"
          value={dash ? String(dash.departures) : '—'}
          icon="fa-plane-departure"
          colorClass="metric-card__icon--forest"
        />
        <MetricCard
          title="In-house"
          value={dash ? String(dash.inHouseBlocking) : '—'}
          icon="fa-bed"
          colorClass="metric-card__icon--gold"
        />
        <MetricCard
          title="Pipeline abierto"
          value={dash ? String(dash.monthOpenReservationsApprox) : '—'}
          icon="fa-list-ul"
          colorClass="metric-card__icon--adobe"
        />
      </div>

      <section className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">
            <i className="fa-solid fa-route"></i> Acciones rápidas
          </h2>
        </div>
        <div className="admin-quick-actions__grid">
          <Link className="admin-quick-btn" to="/reception/reservations">
            <i className="fa-solid fa-list"></i><span>Listado vivo</span>
          </Link>
          <Link className="admin-quick-btn" to="/mis-reservaciones">
            <i className="fa-solid fa-user"></i><span>Vista cliente (test)</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
