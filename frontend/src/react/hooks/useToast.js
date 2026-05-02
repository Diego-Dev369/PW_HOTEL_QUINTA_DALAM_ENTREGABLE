import { useCallback, useMemo, useState } from 'react';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((type, message) => {
    const id = ++toastId;
    setToasts((current) => [...current, { id, type, message }]);
    setTimeout(() => removeToast(id), 4500);
  }, [removeToast]);

  const pushSuccess = useCallback((message) => pushToast('success', message), [pushToast]);
  const pushError = useCallback((message) => pushToast('error', message), [pushToast]);
  const pushInfo = useCallback((message) => pushToast('info', message), [pushToast]);

  return useMemo(() => ({
    toasts,
    removeToast,
    pushToast,
    pushSuccess,
    pushError,
    pushInfo
  }), [toasts, removeToast, pushToast, pushSuccess, pushError, pushInfo]);
}
