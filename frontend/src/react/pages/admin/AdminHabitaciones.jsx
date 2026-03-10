import HtmlPage from '../../components/HtmlPage.jsx';
import html from '../../../pages/admin/admin_habitaciones.html?raw';

export default function AdminHabitaciones() {
  return <HtmlPage html={html} bodyClass="admin-body" />;
}
