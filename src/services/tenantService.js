import apiClient from './apiClient';

// ── Get tenant details ───────────────────────────────────────────────────────
export const getTenant = (tenantId) => apiClient.get(`/tenants/${tenantId}`);

// ── Update tenant (admin-only) ───────────────────────────────────────────────
export const updateTenant = (tenantId, data) => apiClient.put(`/tenants/${tenantId}`, data);
