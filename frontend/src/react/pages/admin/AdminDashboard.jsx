import HtmlPage from '../../components/HtmlPage.jsx';
import html from '../../../pages/admin/admin_dashboard.html?raw';

export default function AdminDashboard() {
  return <HtmlPage html={html} bodyClass="admin-body" />;
}
