import api from './api';

function unwrap(response) {
  return response?.data?.data;
}

export async function createCheckoutSession(payload) {
  const response = await api.post('/api/v1/payments/checkout-session', payload);
  return unwrap(response);
}
