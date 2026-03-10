import HtmlPage from '../../components/HtmlPage.jsx';
import html from '../../../pages/admin/admin_usuarios.html?raw';

export default function AdminUsuarios() {
  return <HtmlPage html={html} bodyClass="admin-body" />;
}
