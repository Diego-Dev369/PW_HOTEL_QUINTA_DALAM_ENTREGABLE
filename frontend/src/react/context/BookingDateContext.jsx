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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function BookingDateProvider({ children }) {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

  const value = useMemo(() => {
    const fromTime = dateRange.from ? dateRange.from.getTime() : null;
    const toTime = dateRange.to ? dateRange.to.getTime() : null;
    const nights = fromTime && toTime ? Math.max(Math.round((toTime - fromTime) / 86400000), 0) : 0;
    const hasValidRange = Boolean(fromTime && toTime && toTime > fromTime);

    return {
      dateRange,
      setDateRange,
      clearDateRange: () => setDateRange({ from: undefined, to: undefined }),
      checkInLabel: formatShortDate(dateRange.from),
      checkOutLabel: formatShortDate(dateRange.to),
      checkInISO: hasValidRange ? toIsoDate(dateRange.from) : '',
      checkOutISO: hasValidRange ? toIsoDate(dateRange.to) : '',
      hasValidRange,
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
