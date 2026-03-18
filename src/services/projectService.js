import apiClient from './apiClient';

// ── All routes now require tenantId as the first param ─────────────────────
// Usage: getProjects(tenantId) → GET /api/projects/:tenantId

// ── CRUD ─────────────────────────────────────────────────────────────────────
export const getProjects    = (tenantId)                   => apiClient.get(`/projects/${tenantId}`);
export const getProject     = (tenantId, id)               => apiClient.get(`/projects/${tenantId}/${id}`);
export const createProject  = (tenantId, name, description) => apiClient.post(`/projects/${tenantId}`, { name, description });
export const updateProject  = (tenantId, id, data)         => apiClient.put(`/projects/${tenantId}/${id}`, data);
export const deleteProject  = (tenantId, id)               => apiClient.delete(`/projects/${tenantId}/${id}`);

// ── AI Generation ────────────────────────────────────────────────────────────
export const generateWebsite = (tenantId, projectId, prompt) => apiClient.post(`/projects/${tenantId}/${projectId}/generate`, { prompt });

// ── Version History ──────────────────────────────────────────────────────────
export const getVersions     = (tenantId, projectId)           => apiClient.get(`/projects/${tenantId}/${projectId}/versions`);
export const rollbackVersion = (tenantId, projectId, versionId) => apiClient.put(`/projects/${tenantId}/${projectId}/versions/${versionId}/rollback`);
