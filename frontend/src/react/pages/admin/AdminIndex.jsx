import HtmlPage from '../../components/HtmlPage.jsx';
import html from '../../../pages/admin/admin_index.html?raw';

export default function AdminIndex() {
  return <HtmlPage html={html} bodyClass="admin-body" />;
}
