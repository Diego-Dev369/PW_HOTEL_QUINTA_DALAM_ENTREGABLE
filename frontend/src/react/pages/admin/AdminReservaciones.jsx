import HtmlPage from '../../components/HtmlPage.jsx';
import html from '../../../pages/admin/admin_reservaciones.html?raw';

export default function AdminReservaciones() {
  return <HtmlPage html={html} bodyClass="admin-body" />;
}
