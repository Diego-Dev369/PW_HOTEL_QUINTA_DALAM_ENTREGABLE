import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteEffects() {
  const location = useLocation();

  useEffect(() => {
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
      navToggle.checked = false;
    }

    const handleScroll = () => {
      if (location.hash) {
        const target = document.querySelector(location.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const raf = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(raf);
  }, [location.pathname, location.hash]);

  return null;
}