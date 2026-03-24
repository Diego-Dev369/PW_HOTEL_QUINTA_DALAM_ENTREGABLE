import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 - Página no encontrada | Hotel Quinta Dalam';
  }, []);

  return (
    <main className="not-found">
      <div className="not-found__content">
        
        <div className="not-found__icon">
          <i className="fa-regular fa-compass"></i>
        </div>

        <span className="not-found__eyebrow">Error 404</span>
        
        <h1 className="not-found__title">
          Ruta no <em>Encontrada</em>
        </h1>
        
        <span className="not-found__ornament" aria-hidden="true">
          ✦ ─── ✦ ─── ✦
        </span>

        <p className="not-found__text">
          Parece que te has alejado de nuestro sendero. La página que buscas no existe o ha cambiado de lugar. Te invitamos a regresar y seguir descubriendo la magia de Michoacán.
        </p>

        {/* Botones de acción */}
        <div className="not-found__actions">
          <Link to="/" className="btn btn--primary">
            Volver al inicio
          </Link>
          <Link to="/habitaciones" className="btn btn--ghost">
            Ver habitaciones
          </Link>
        </div>

      </div>
    </main>
  );
}