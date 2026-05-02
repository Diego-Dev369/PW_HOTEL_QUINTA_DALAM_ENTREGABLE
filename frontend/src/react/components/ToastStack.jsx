export default function ToastStack({ toasts, onClose }) {
  if (!toasts?.length) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <article key={toast.id} className={`toast toast--${toast.type}`}>
          <p>{toast.message}</p>
          <button type="button" onClick={() => onClose(toast.id)} aria-label="Cerrar mensaje">
            ×
          </button>
        </article>
      ))}
    </div>
  );
}
