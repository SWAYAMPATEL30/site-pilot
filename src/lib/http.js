/**
 * Axios HTTP client – shared singleton for all backend requests.
 * • In development: uses the Vite proxy (/api → http://localhost:5000/api).
 * • In production: uses VITE_API_URL env variable.
 * • Automatically attaches Bearer JWT from localStorage.
 * • Redirects to /login on 401 (expired / invalid token).
 */

import axios from 'axios';

// In dev mode the Vite proxy forwards /api → Express, so baseURL is just /api.
// In production set VITE_API_URL to your deployed backend URL.
const BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  : '/api';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000,          // 60 s – Gemini can be slow
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: attach JWT ──────────────────────────────────────────────────────
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response: handle 401 globally ───────────────────────────────────────────
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid – clear session and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Only redirect if not already on an auth page
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register')) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  },
);

export default http;
