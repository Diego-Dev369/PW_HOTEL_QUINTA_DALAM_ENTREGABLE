import { useEffect, useMemo, useState } from 'react';
import MetricCard from '../../components/admin/MetricCard';
import { fetchReceptionDashboard, fetchReceptionReservations } from '../../services/staffApi';

function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '—';
}

export default function ReceptionReservations() {
  const [page, setPage] = useState(0);
  const [payload, setPayload] = useState(null);
  const [dash, setDash] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const size = 25;

  useEffect(() => {
    fetchReceptionDashboard().then(setDash).catch(() => {});
  }, []);

  useEffect(() => {
    setError(null);
    fetchReceptionReservations(page, size)
      .then(setPayload)
      .catch((e) => setError(e?.response?.data?.message || 'No fue posible cargar reservaciones (recepción).'));
  }, [page, size]);

  const rows = payload?.content || [];

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const code = r.reservationCode?.toLowerCase() || '';
      const name = r.guestFullName?.toLowerCase() || '';
      const email = r.guestEmail?.toLowerCase() || '';
      return code.includes(q) || name.includes(q) || email.includes(q);
    });
  }, [rows, searchTerm]);

  return (
    <main className="admin-main">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            Recepción · <em>Reservaciones vivas</em>
          </h1>
          <p className="admin-page-subtitle">
            Consumiendo `GET /api/v1/reception/reservations` (misma carga útil fiscal + ledger que admin).
          </p>
        </div>
      </div>

      <div className="admin-metrics">
        <MetricCard title="Llegadas hoy (UTC pivote dashboard)" value={dash ? String(dash.arrivals) : '—'} icon="fa-plane-arrival" colorClass="metric-card__icon--adobe" />
        <MetricCard title="Salidas hoy" value={dash ? String(dash.departures) : '—'} icon="fa-plane-departure" colorClass="metric-card__icon--forest" />
        <MetricCard title="Pipeline activo" value={dash ? String(dash.monthOpenReservationsApprox) : '—'} icon="fa-list-check" colorClass="metric-card__icon--gold" />
      </div>

      {error && <p className="admin-card" style={{ color: '#a33', padding: '1rem' }}>{error}</p>}

      <section className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">
            <i className="fa-solid fa-calendar-days"></i> Listado operativo
          </h2>
          <div className="admin-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="search"
              placeholder="Filtrar cliente / código…"
              className="admin-search__input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Huésped</th>
                <th>Suite</th>
                <th>Estancia</th>
                <th>Estado</th>
                <th>Total / ledger / saldo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                    Sin registros para la página solicitada.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="admin-table__id">{r.reservationCode}</td>
                    <td>
                      <div className="admin-table__guest">
                        <div className="admin-table__avatar">{initials(r.guestFullName || '')}</div>
                        <div>
                          <strong>{r.guestFullName}</strong>
                          <small>{r.guestEmail}</small>
                        </div>
                      </div>
                    </td>
                    <td>{r.roomName}</td>
                    <td>
                      {r.checkIn} → {r.checkOut}{' '}
                      <small style={{ display: 'block', color: '#777' }}>({r.nights} noche{r.nights === 1 ? '' : 's'})</small>
                    </td>
                    <td>{r.status}</td>
                    <td>
                      <small style={{ display: 'block' }}>
                        Total {Number(r.totalAmount).toLocaleString(undefined, { style: 'currency', currency: r.currency })}
                      </small>
                      <small style={{ display: 'block' }}>
                        Cobrado {Number(r.ledgerNetPaid ?? 0).toLocaleString(undefined, { style: 'currency', currency: r.currency })}
                      </small>
                      <small style={{ display: 'block', color: r.balanceDue > 0 ? '#a44' : '#2a7' }}>
                        Saldo {Number(r.balanceDue ?? 0).toLocaleString(undefined, { style: 'currency', currency: r.currency })}
                      </small>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: '12px', padding: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" className="admin-quick-btn" disabled={page <= 0} onClick={() => setPage((p) => Math.max(p - 1, 0))}>
            ← Anterior
          </button>
          <button
            type="button"
            className="admin-quick-btn"
            disabled={payload && page + 1 >= (payload.totalPages || 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      </section>
    </main>
  );
}
