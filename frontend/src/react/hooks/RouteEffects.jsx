import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Scroll hacia arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 2. Lógica para animaciones al hacer scroll (Reveal)
    const REVEAL_SELECTORS = [
      '.section', '.section__header', '.room-card', '.room-row', 
      '.exp-card', '.service-card', '.about__media', '.cta-band', 
      '.page-hero', '.booking__card', '.contact-card'
    ];

    const targets = document.querySelectorAll(REVEAL_SELECTORS.join(','));
    targets.forEach(target => target.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });

      targets.forEach(target => {
        const rect = target.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          target.classList.add('is-visible'); // Si ya está en pantalla
        } else {
          observer.observe(target); // Si está más abajo
        }
      });

      return () => observer.disconnect();
    } else {
      // Si el navegador no soporta el observer
      targets.forEach(target => target.classList.add('is-visible'));
    }
  }, [pathname]); // Se vuelve a ejecutar cada vez que cambia la ruta

  return null;
}