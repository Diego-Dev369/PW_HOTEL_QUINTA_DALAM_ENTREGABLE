import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

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
          target.classList.add('is-visible'); 
        } else {
          observer.observe(target); 
        }
      });

      return () => observer.disconnect();
    } else {
      targets.forEach(target => target.classList.add('is-visible'));
    }
  }, [pathname]); 
  return null;
}