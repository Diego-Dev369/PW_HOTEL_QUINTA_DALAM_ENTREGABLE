import api, { TOKEN_KEY } from './api';

const USER_KEY = 'qd_auth_user';

function unwrap(response) {
  return response?.data?.data;
}

export async function registerUser(payload) {
  const response = await api.post('/api/v1/auth/register', payload);
  const authData = unwrap(response);
  if (authData?.accessToken) {
    localStorage.setItem(TOKEN_KEY, authData.accessToken);
  }
  return authData;
}

export async function loginUser(payload) {
  const response = await api.post('/api/v1/auth/login', payload);
  const authData = unwrap(response);
  if (authData?.accessToken) {
    localStorage.setItem(TOKEN_KEY, authData.accessToken);
  }
  return authData;
}

export async function fetchCurrentUser() {
  const response = await api.get('/api/v1/users/me');
  const user = unwrap(response);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  return user;
}

export async function updateCurrentUser(payload) {
  const response = await api.put('/api/v1/users/me', payload);
  const user = unwrap(response);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  return user;
}

export async function changePassword(payload) {
  const response = await api.put('/api/v1/users/me/password', payload);
  return unwrap(response);
}

export async function forgotPassword(payload) {
  const response = await api.post('/api/v1/auth/forgot-password', payload);
  return unwrap(response);
}

export async function resetPassword(payload) {
  const response = await api.post('/api/v1/auth/reset-password', payload);
  return unwrap(response);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
