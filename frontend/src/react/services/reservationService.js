import api from './api';

function unwrap(response) {
  return response?.data?.data;
}

export async function createReservation(payload) {
  const response = await api.post('/api/v1/reservations', payload);
  return unwrap(response);
}

export async function getGuestReservations(guestUserId) {
  const response = await api.get(`/api/v1/reservations/guest/${guestUserId}`);
  return unwrap(response) || [];
}

export async function getMyReservations() {
  const response = await api.get('/api/v1/reservations/me');
  return unwrap(response) || [];
}
