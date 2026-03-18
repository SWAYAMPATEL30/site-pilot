import apiClient from './apiClient';

// ── User management (admin-only) ─────────────────────────────────────────────
// Usage: listUsers(tenantId) → GET /api/tenants/:tenantId/users

export const listUsers   = (tenantId)           => apiClient.get(`/tenants/${tenantId}/users`);
export const createUser  = (tenantId, data)     => apiClient.post(`/tenants/${tenantId}/users`, data);
export const updateUser  = (tenantId, userId, data) => apiClient.put(`/tenants/${tenantId}/users/${userId}`, data);
export const deleteUser  = (tenantId, userId)   => apiClient.delete(`/tenants/${tenantId}/users/${userId}`);

/**
 * Create a new user in the tenant
 * Body: { name, email, password, role: 'editor' | 'admin' }
 */
export const inviteUser = (tenantId, name, email, password, role = 'editor') =>
  createUser(tenantId, { name, email, password, role });
