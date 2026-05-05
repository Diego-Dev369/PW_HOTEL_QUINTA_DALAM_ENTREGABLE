import api from './api';

function unwrap(response) {
  return response?.data?.data;
}

export async function fetchAdminReservations(page = 0, size = 20) {
  const response = await api.get('/api/v1/admin/reservations', { params: { page, size } });
  return unwrap(response);
}

export async function fetchAdminDashboard(date) {
  const response = await api.get('/api/v1/admin/reservations/dashboard', {
    params: date ? { date } : {},
  });
  return unwrap(response);
}

export async function fetchReceptionReservations(page = 0, size = 20) {
  const response = await api.get('/api/v1/reception/reservations', { params: { page, size } });
  return unwrap(response);
}

export async function fetchReceptionDashboard(date) {
  const response = await api.get('/api/v1/reception/dashboard', {
    params: date ? { date } : {},
  });
  return unwrap(response);
}
