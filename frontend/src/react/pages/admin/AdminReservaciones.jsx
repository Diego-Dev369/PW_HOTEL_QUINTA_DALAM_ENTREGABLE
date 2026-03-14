import { Link } from 'react-router-dom';
import MetricCard from '../../components/admin/MetricCard';

export default function AdminReservaciones() {
  return (
    <main className="admin-main">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gestión de <em>Reservaciones</em></h1>
          <p className="admin-page-subtitle">Administra, filtra y confirma las estancias de los huéspedes.</p>
        </div>
        <button className="admin-btn admin-btn--primary">
          <i className="fa-solid fa-plus"></i> Nueva Reserva
        </button>
      </div>

      <div className="admin-metrics">
        <MetricCard title="Total Reservas" value="1" icon="fa-list-check" colorClass="metric-card__icon--gold" />
        <MetricCard title="Pendientes" value="0" icon="fa-clock" colorClass="metric-card__icon--adobe" />
        <MetricCard title="Confirmadas" value="1" icon="fa-circle-check" colorClass="metric-card__icon--forest" />
      </div>

      <section className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">
            <i className="fa-solid fa-calendar-days"></i> Listado Maestro
          </h2>
          <div className="admin-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="search" placeholder="Buscar por huésped o folio..." className="admin-search__input" />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Huésped</th>
                <th>Suite</th>
                <th>Estancia (Entrada - Salida)</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* ── RESERVA DE PRUEBA ── */}
              <tr>
                <td className="admin-table__id">#RES-8042</td>
                <td>
                  <div className="admin-table__guest">
                    <div className="admin-table__avatar">JV</div>
                    <div>
                      <strong>Javier Villanueva</strong>
                      <small>javier.v@email.com</small>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>Pátzcuaro</strong>
                  <small style={{color: 'var(--admin-text-muted)'}}>2 huéspedes</small>
                </td>
                <td>
                  <strong>24 Mar 2026</strong>
                  <small style={{color: 'var(--admin-text-muted)'}}>→ 28 Mar 2026 (4 noches)</small>
                </td>
                <td><span className="admin-badge admin-badge--confirmed">Confirmada</span></td>
                <td>
                  <div className="admin-table__actions">
                    <button className="admin-icon-btn admin-icon-btn--view" title="Ver detalles">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="admin-icon-btn admin-icon-btn--edit" title="Editar">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button className="admin-icon-btn admin-icon-btn--delete" title="Cancelar Reserva">
                      <i className="fa-solid fa-ban"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}