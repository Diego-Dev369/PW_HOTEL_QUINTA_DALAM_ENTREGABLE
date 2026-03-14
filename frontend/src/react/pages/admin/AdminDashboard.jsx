import { Link } from 'react-router-dom';
import MetricCard from '../../components/admin/MetricCard';

export default function AdminDashboard() {
  return (
    <main className="admin-main">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bienvenido, <em>Administrador</em></h1>
          <p className="admin-page-subtitle">Resumen general y accesos rápidos al sistema.</p>
        </div>
        <span className="admin-page-ornament" aria-hidden="true">✦ ─── ✦</span>
      </div>

      <div className="admin-metrics">
        <MetricCard title="Reservas este mes" value="0" icon="fa-calendar-check" colorClass="metric-card__icon--adobe" />
        <MetricCard title="Suites activas" value="6" icon="fa-bed" colorClass="metric-card__icon--forest" trendText="Todas disponibles" />
        <MetricCard title="Usuarios" value="4" icon="fa-users-gear" colorClass="metric-card__icon--gold" />
      </div>

      <div className="admin-tables-grid">
        {/* Accesos rápidos: Indispensables en un Dashboard */}
        <section className="admin-card" aria-labelledby="h2-accesos">
          <div className="admin-card__header">
            <h2 className="admin-card__title" id="h2-accesos">
              <i className="fa-solid fa-bolt"></i> Accesos rápidos
            </h2>
          </div>
          <div className="admin-quick-actions__grid">
            <Link to="/admin/reservaciones" className="admin-quick-btn">
              <i className="fa-solid fa-calendar-check"></i><span>Reservas</span>
            </Link>
            <Link to="/admin/habitaciones" className="admin-quick-btn">
              <i className="fa-solid fa-bed"></i><span>Habitaciones</span>
            </Link>
            <Link to="/admin/inicio" className="admin-quick-btn">
              <i className="fa-solid fa-house"></i><span>Editar Inicio</span>
            </Link>
            <Link to="/admin/usuarios" className="admin-quick-btn">
              <i className="fa-solid fa-users-gear"></i><span>Usuarios</span>
            </Link>
          </div>
        </section>

        {/* Vista previa de reservas: Solo las más recientes */}
        <section className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title">
              <i className="fa-solid fa-clock-rotate-left"></i> Actividad Reciente
            </h2>
            <Link to="/admin/reservaciones" className="admin-card__link">Ver historial →</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                    No hay actividad reciente para mostrar.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}