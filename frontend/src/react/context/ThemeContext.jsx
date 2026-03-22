// src/react/context/ThemeContext.jsx
import { createContext, useContext, useLayoutEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Leer preferencia guardada
    const saved = localStorage.getItem('quinta-dalam-theme');
    if (saved) return saved;
    // 2. Respetar preferencia del sistema operativo
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Sincronizar el atributo del <html> y persistir
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('quinta-dalam-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook de conveniencia */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
      throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  }
  return ctx;
}