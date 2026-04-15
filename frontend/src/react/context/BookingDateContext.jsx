import { createContext, useContext, useMemo, useState } from 'react';

const BookingDateContext = createContext(null);

function formatShortDate(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function toIsoDate(date) {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

export function BookingDateProvider({ children }) {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

  const value = useMemo(() => {
    const fromTime = dateRange.from ? dateRange.from.getTime() : null;
    const toTime = dateRange.to ? dateRange.to.getTime() : null;
    const nights = fromTime && toTime ? Math.max(Math.round((toTime - fromTime) / 86400000), 0) : 0;

    return {
      dateRange,
      setDateRange,
      clearDateRange: () => setDateRange({ from: undefined, to: undefined }),
      checkInLabel: formatShortDate(dateRange.from),
      checkOutLabel: formatShortDate(dateRange.to),
      checkInISO: toIsoDate(dateRange.from),
      checkOutISO: toIsoDate(dateRange.to),
      nights
    };
  }, [dateRange]);

  return (
    <BookingDateContext.Provider value={value}>
      {children}
    </BookingDateContext.Provider>
  );
}

export function useBookingDates() {
  const context = useContext(BookingDateContext);

  if (!context) {
    throw new Error('useBookingDates debe usarse dentro de BookingDateProvider');
  }

  return context;
}
