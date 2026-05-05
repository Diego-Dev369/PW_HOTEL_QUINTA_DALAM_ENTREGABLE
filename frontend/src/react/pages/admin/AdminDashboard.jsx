import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MetricCard from '../../components/admin/MetricCard';
import { fetchAdminDashboard } from '../../services/staffApi';

export default function AdminDashboard() {
  const [dash, setDash] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminDashboard()
      .then(setDash)
      .catch((e) => setError(e?.response?.data?.message || 'No fue posible cargar el dashboard operativo.'));
  }, []);

  return (
    <main className="admin-main">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Operación hotelera · <em>Admin</em></h1>
          <p className="admin-page-subtitle">
            KPIs vivos desde la API (UTC). Recepción usa el mismo motor en `/reception`.
          </p>
        </div>
        <span className="admin-page-ornament" aria-hidden="true">✦ ─── ✦</span>
      </div>

      {error && (
        <p className="admin-card" style={{ color: '#a33', padding: '1rem' }}>
          {error}
        </p>
      )}

      <div className="admin-metrics">
        <MetricCard
          title={`Llegadas (${dash?.pivotDateUtc ?? '…'})`}
          value={dash ? String(dash.arrivals) : '—'}
          icon="fa-plane-arrival"
          colorClass="metric-card__icon--adobe"
        />
        <MetricCard
          title="Salidas hoy"
          value={dash ? String(dash.departures) : '—'}
          icon="fa-plane-departure"
          colorClass="metric-card__icon--forest"
        />
        <MetricCard
          title="In-house bloqueante"
          value={dash ? String(dash.inHouseBlocking) : '—'}
          icon="fa-bed"
          colorClass="metric-card__icon--gold"
          trendText="Reservas que bloquean inventario en la fecha pivote."
        />
        <MetricCard
          title="Pipeline activo"
          value={dash ? String(dash.monthOpenReservationsApprox) : '—'}
          icon="fa-list-check"
          colorClass="metric-card__icon--adobe"
          trendText="Reservaciones no cerradas/no-show/canceladas (aprox.)."
        />
      </div>

      <div className="admin-tables-grid">
        <section className="admin-card" aria-labelledby="h2-accesos">
          <div className="admin-card__header">
            <h2 className="admin-card__title" id="h2-accesos">
              <i className="fa-solid fa-bolt"></i> Accesos rápidos
            </h2>
          </div>
          <div className="admin-quick-actions__grid">
            <Link to="/admin/reservaciones" className="admin-quick-btn">
              <i className="fa-solid fa-calendar-check"></i><span>Maestro reservas</span>
            </Link>
            <Link to="/reception/reservations" className="admin-quick-btn">
              <i className="fa-solid fa-bell-concierge"></i><span>Vista recepción</span>
            </Link>
            <Link to="/admin/usuarios" className="admin-quick-btn">
              <i className="fa-solid fa-users-gear"></i><span>Usuarios</span>
            </Link>
            <a
              className="admin-quick-btn"
              href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/public/ical/export`}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-solid fa-calendar-days"></i><span>iCal público (.ics)</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
