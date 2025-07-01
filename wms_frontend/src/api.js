// ✅ แก้ไขแบบ X: api.js (Axios Config)
import axios from 'axios';

// ตรวจสอบว่าอยู่ dev หรือ production
const isLocalhost = window.location.hostname === 'localhost';

// ✅ กำหนด baseURL โดยไม่มี / ท้าย
const envBaseURL = import.meta.env.VITE_API_BASE_URL;
const baseURL = (envBaseURL && envBaseURL.trim()) || (
  isLocalhost
    ? 'http://localhost:8000'
    : 'https://wms-backend-api-c3arbje9hhbkb0fh.southeastasia-01.azurewebsites.net'
);

// ✅ log เพื่อตรวจใน DevTools
console.log('Axios BaseURL =', baseURL);

const API = axios.create({
  baseURL,
  maxRedirects: 5,
});

// ✅ Interceptor แนบ Token ให้ทุก request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const pathname = window.location.pathname;

  if (!token && pathname !== '/login') {
    console.warn('⚠️ Token not found in localStorage');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(`➡️ [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`, config.data || '');
  return config;
});

// ✅ Interceptor ดัก error จาก response
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = !error.response;
    const message = isNetworkError
      ? 'Network error - Server unreachable'
      : error.response?.data?.detail || error.message;

    console.error('API Error:', message);

    const status = error.response?.status;
    const pathname = window.location.pathname;

    if (status === 401 && pathname !== '/login' && pathname !== '/register') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default API;
