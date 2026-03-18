import apiClient from './apiClient';

// ── Register new tenant & owner account ──────────────────────────────────────
export const registerTenant = (tenantName, tenantSlug, ownerName, ownerEmail, password) =>
  apiClient.post('/auth/register', {
    tenantName,
    tenantSlug,
    ownerName,
    ownerEmail,
    password,
  });

// ── Login ────────────────────────────────────────────────────────────────────
export const loginUser = (email, password) =>
  apiClient.post('/auth/login', { email, password });

// ── Get current user profile (includes tenant info) ──────────────────────────
export const getMe = () => apiClient.get('/auth/me');
