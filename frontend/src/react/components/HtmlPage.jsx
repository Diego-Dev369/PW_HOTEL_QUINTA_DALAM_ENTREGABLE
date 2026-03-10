import { useEffect, useMemo, useRef } from 'react';

const ROUTE_MAP = {
  'index.html': '/',
  'home.html': '/',
  'habitaciones.html': '/habitaciones',
  'nosotros.html': '/nosotros',
  'contacto.html': '/contacto',
  'login.html': '/login',
  'reservaciones.html': '/reservaciones',
  'modal_demo.html': '/modal-demo',
  'admin_index.html': '/admin',
  'admin_dashboard.html': '/admin/dashboard',
  'admin_reservaciones.html': '/admin/reservaciones',
  'admin_habitaciones.html': '/admin/habitaciones',
  'admin_nosotros.html': '/admin/nosotros',
  'admin_contacto.html': '/admin/contacto',
  'admin_usuarios.html': '/admin/usuarios'
};

const normalizeHref = (href) => {
  if (!href) return href;
  const trimmed = href.trim();

  if (
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('javascript:')
  ) {
    return trimmed;
  }

  const [pathWithQuery, hash] = trimmed.split('#');
  const [path, search] = pathWithQuery.split('?');
  const baseName = path.split('/').pop();
  const mapped = ROUTE_MAP[baseName] || ROUTE_MAP[path] || null;

  if (!mapped) return trimmed;

  let next = mapped;
  if (search) next += `?${search}`;
  if (hash) next += `#${hash}`;
  return next;
};

const normalizeSrc = (src) => {
  if (!src) return src;
  const trimmed = src.trim();

  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//')
  ) {
    return trimmed;
  }

  const assetsIndex = trimmed.indexOf('/assets/');
  if (assetsIndex !== -1) {
    return `/src${trimmed.slice(assetsIndex)}`;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return trimmed;
};

const normalizeSrcset = (srcset) => {
  if (!srcset) return srcset;
  return srcset
    .split(',')
    .map((item) => {
      const [url, descriptor] = item.trim().split(/\s+/);
      const normalizedUrl = normalizeSrc(url);
      return descriptor ? `${normalizedUrl} ${descriptor}` : normalizedUrl;
    })
    .join(', ');
};

const extractPage = (html) => {
  if (!html) {
    return { bodyHtml: '', styles: [], title: '' };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.querySelectorAll('a[href]').forEach((anchor) => {
    anchor.setAttribute('href', normalizeHref(anchor.getAttribute('href')));
  });

  doc.querySelectorAll('[src]').forEach((node) => {
    const normalized = normalizeSrc(node.getAttribute('src'));
    node.setAttribute('src', normalized);
  });

  doc.querySelectorAll('[srcset]').forEach((node) => {
    const normalized = normalizeSrcset(node.getAttribute('srcset'));
    node.setAttribute('srcset', normalized);
  });

  const styles = Array.from(doc.head.querySelectorAll('style'))
    .map((style) => style.textContent)
    .filter(Boolean);
  const title = doc.querySelector('title')?.textContent?.trim() || '';
  const bodyClassFromHtml = doc.body.getAttribute('class')?.trim() || '';

  return {
    bodyHtml: doc.body.innerHTML,
    styles,
    title,
    bodyClass: bodyClassFromHtml
  };
};

const REVEAL_SELECTORS = [
  '.section',
  '.section__header',
  '.room-card',
  '.room-row',
  '.exp-card',
  '.service-card',
  '.about__media',
  '.cta-band',
  '.page-hero',
  '.booking__card',
  '.contact-card',
  '.login-card',
  '.admin-card',
  '.admin-metrics',
  '.metric-card',
  '.admin-table'
];

export default function HtmlPage({ html, bodyClass }) {
  const containerRef = useRef(null);
  const { bodyHtml, styles, title, bodyClass: htmlBodyClass } = useMemo(() => extractPage(html), [html]);

  useEffect(() => {
    const previous = document.body.className;
    const activeBodyClass = bodyClass || htmlBodyClass || '';
    document.body.className = activeBodyClass;
    return () => {
      if (document.body.className === activeBodyClass) {
        document.body.className = previous || '';
      }
    };
  }, [bodyClass, htmlBodyClass]);

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const header = container.querySelector('.header');
    const updateHeader = () => {
      if (!header) return;
      header.classList.toggle('header--scrolled', window.scrollY > 10);
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const targets = container.querySelectorAll(REVEAL_SELECTORS.join(','));
    targets.forEach((target) => target.classList.add('reveal'));

    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
      );

      targets.forEach((target) => observer.observe(target));
    } else {
      targets.forEach((target) => target.classList.add('is-visible'));
    }

    return () => {
      window.removeEventListener('scroll', updateHeader);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [bodyHtml]);

  return (
    <>
      {styles.length > 0 && (
        <style dangerouslySetInnerHTML={{ __html: styles.join('\n') }} />
      )}
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}




