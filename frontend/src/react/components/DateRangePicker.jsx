import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

import { useBookingDates } from '../context/BookingDateContext.jsx';

export default function DateRangePicker({ label = 'Fechas de estancia' }) {
  const { dateRange, setDateRange, checkInLabel, checkOutLabel, clearDateRange } = useBookingDates();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const handleViewport = (event) => {
      setIsMobile(event.matches);
    };

    handleViewport(mediaQuery);
    mediaQuery.addEventListener('change', handleViewport);

    return () => mediaQuery.removeEventListener('change', handleViewport);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (range) => {
    setDateRange(range || { from: undefined, to: undefined });

    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  const triggerText = checkInLabel && checkOutLabel
    ? `${checkInLabel} - ${checkOutLabel}`
    : 'Selecciona check-in y check-out';

  return (
    <div className="date-range" ref={rootRef}>
      <label className="form-label date-range__label">{label}</label>

      <div className="date-range__trigger-wrap">
        <button
          type="button"
          className="form-input date-range__trigger"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label="Abrir selector de fechas"
        >
          <span>{triggerText}</span>
          <i className="fa-regular fa-calendar-days" aria-hidden="true"></i>
        </button>

        {(dateRange.from || dateRange.to) && (
          <button type="button" className="date-range__clear" onClick={clearDateRange}>
            Limpiar
          </button>
        )}
      </div>

      {open && (
        <div className="date-range__panel">
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={isMobile ? 1 : 2}
            pagedNavigation
            showOutsideDays
            disabled={{ before: new Date() }}
            className="date-range__calendar"
          />
        </div>
      )}
    </div>
  );
}
