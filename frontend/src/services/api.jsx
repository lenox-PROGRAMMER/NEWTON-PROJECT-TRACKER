import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 🔐 Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🚫 Handle unauthorized (401) or forbidden (403)
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      console.warn(`⚠️ Auth error (${status}) — Logging out.`);
      localStorage.removeItem('token');
      window.location.href = '/'; // fallback to login page
    }

    return Promise.reject(error);
  }
);

export default api;
