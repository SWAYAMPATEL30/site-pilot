import apiClient from './apiClient';

// ── All routes now require tenantId as the first param ─────────────────────
// Branding is now TENANT-LEVEL (not per-project)
// Only ADMIN users can modify branding
// Usage: getBranding(tenantId) → GET /api/branding/:tenantId

// ── Get / Update branding (admin-only for updates) ────────────────────────────
export const getBranding    = (tenantId)        => apiClient.get(`/branding/${tenantId}`);
export const updateBranding = (tenantId, data)  => apiClient.put(`/branding/${tenantId}`, data);

// ── Logo upload (admin-only) ─────────────────────────────────────────────────
export const uploadLogo = (tenantId, file) => {
  const fd = new FormData();
  fd.append('file', file);
  return apiClient.post(`/branding/${tenantId}/upload-logo`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ── Gallery image upload / delete (admin-only) ───────────────────────────────
export const uploadImage = (tenantId, file, alt = 'Image') => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('alt', alt);
  return apiClient.post(`/branding/${tenantId}/upload-image`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteImage = (tenantId, imageId) =>
  apiClient.delete(`/branding/${tenantId}/images/${imageId}`);

// ── Services CRUD (admin-only) ───────────────────────────────────────────────
export const addService    = (tenantId, data)            => apiClient.post(`/branding/${tenantId}/services`, data);
export const updateService = (tenantId, serviceId, data) => apiClient.put(`/branding/${tenantId}/services/${serviceId}`, data);
export const deleteService = (tenantId, serviceId)       => apiClient.delete(`/branding/${tenantId}/services/${serviceId}`);
