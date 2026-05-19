import axios from 'axios';

const isProd = import.meta.env.PROD;
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').trim();
const TOKEN_KEY = 'qd_access_token';

if (isProd && !API_BASE_URL.startsWith('https://')) {
  throw new Error('VITE_API_BASE_URL debe usar HTTPS en produccion.');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 20000),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('qd_auth_user');
      window.dispatchEvent(new CustomEvent('qd:auth-expired'));
    }
    return Promise.reject(error);
  }
);

export { TOKEN_KEY };
export default api;
