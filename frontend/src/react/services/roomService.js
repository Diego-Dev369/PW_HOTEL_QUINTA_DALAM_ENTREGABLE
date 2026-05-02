import api from './api';

export async function getAvailability({ checkIn, checkOut, guests }) {
  return api.get('/api/v1/rooms/availability', {
    params: {
      checkIn,
      checkOut,
      guests
    }
  });
}

export async function searchAvailability({ checkIn, checkOut, guests }) {
  const response = await getAvailability({ checkIn, checkOut, guests });
  return response?.data?.data || [];
}
