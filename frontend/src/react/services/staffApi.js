import api from './api';

function unwrap(response) {
  return response?.data?.data;
}

// â”€â”€ Admin: Dashboard operativo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function fetchAdminDashboard(date) {
  const response = await api.get('/api/v1/admin/reservations/dashboard', {
    params: date ? { date } : {},
  });
  return unwrap(response);
}

// â”€â”€ Admin: Reservaciones paginadas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function fetchAdminReservations(page = 0, size = 20) {
  const response = await api.get('/api/v1/admin/reservations', { params: { page, size } });
  return unwrap(response);
}

// â”€â”€ Admin: Habitaciones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Obtiene todas las habitaciones con su tarifa bruta actual.
 * @returns {Promise<Array>} Lista de RoomAdminResponse
 */
export async function fetchRooms() {
  const response = await api.get('/api/v1/rooms/admin');
  return unwrap(response);
}

/**
 * Actualiza una habitaciÃ³n (campos + precio bruto opcional).
 * @param {string} id  UUID de la habitaciÃ³n
 * @param {Object} data  { name, subtitle, category, description, capacity, bedType, status, featured, nightlyRateGross, currency }
 * @returns {Promise<Object>} RoomAdminResponse actualizado
 */
export async function updateRoom(id, data) {
  const response = await api.put(`/api/v1/rooms/admin/${id}`, data);
  return unwrap(response);
}

// â”€â”€ Admin: Usuarios â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Obtiene todos los usuarios del sistema.
 * @returns {Promise<Array>} Lista de UserResponse
 */
export async function fetchUsers() {
  const response = await api.get('/api/v1/admin/users');
  return unwrap(response);
}

export async function createUser(data) {
  const response = await api.post('/api/v1/admin/users', data);
  return unwrap(response);
}

/**
 * Actualiza datos de un usuario (nombre, email, telÃ©fono).
 * @param {string} id  UUID del usuario
 * @param {Object} data  { email, firstName, lastName, phone }
 */
export async function updateUser(id, data) {
  const response = await api.put(`/api/v1/admin/users/${id}`, data);
  return unwrap(response);
}

/**
 * Desactiva (soft-delete) un usuario.
 * @param {string} id  UUID del usuario
 */
export async function deactivateUser(id) {
  await api.delete(`/api/v1/admin/users/${id}`);
}

export async function activateUser(id) {
  const response = await api.post(`/api/v1/admin/users/${id}/activate`);
  return unwrap(response);
}

// â”€â”€ RecepciÃ³n: Reservaciones paginadas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function fetchReceptionReservations(page = 0, size = 20) {
  const response = await api.get('/api/v1/reception/reservations', { params: { page, size } });
  return unwrap(response);
}

// â”€â”€ RecepciÃ³n: Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function fetchReceptionDashboard(date) {
  const response = await api.get('/api/v1/reception/dashboard', {
    params: date ? { date } : {},
  });
  return unwrap(response);
}



