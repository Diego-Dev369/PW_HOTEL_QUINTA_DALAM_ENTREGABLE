import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Página no encontrada | Hotel Quinta Dalam';
  }, []);

  return (
    <main style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>404</h1>
      <p style={{ marginBottom: '1.5rem' }}>
        No encontramos esta página. Vuelve al inicio para seguir explorando.
      </p>
      <a href="/" className="btn btn--primary">
        Volver al inicio
      </a>
    </main>
  );
}