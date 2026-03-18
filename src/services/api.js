/**
 * api.js — Frontend service layer that calls the real Node/Express backend.
 * All functions are async and return { ok, ...data } or { ok: false, error }.
 * Pages that previously called these synchronously must now await them.
 */

import http from '../lib/http';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Read the stored user object (includes tenantId). */
function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Read the stored auth token. */
function getStoredToken() {
  return localStorage.getItem('authToken');
}

/** Decode JWT payload (base64url). */
function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4 || 4)), '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Get the tenant ID for the current user. Prefer the JWT payload to avoid mismatches. */
export function getTenantId() {
  const tokenPayload = decodeJwtPayload(getStoredToken());
  if (tokenPayload?.tenantId) return String(tokenPayload.tenantId);
  return getStoredUser()?.tenantId || null;
}

// ─── Branding cache helpers ────────────────────────────────────────────────
const BRANDING_CACHE_PREFIX = 'brandingCache:';

function readBrandingCache(tenantId) {
  if (!tenantId) return null;
  try {
    const raw = localStorage.getItem(`${BRANDING_CACHE_PREFIX}${tenantId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeBrandingCache(tenantId, branding) {
  if (!tenantId || !branding) return;
  try {
    localStorage.setItem(`${BRANDING_CACHE_PREFIX}${tenantId}`, JSON.stringify(branding));
  } catch {
    // ignore storage errors
  }
}

function patchBrandingCache(tenantId, partial) {
  if (!tenantId || !partial) return;
  const current = readBrandingCache(tenantId) || {};
  writeBrandingCache(tenantId, { ...current, ...partial });
}

/**
 * Normalise a backend Project document into the shape the existing UI expects
 * (which uses "website" terminology).
 */
function normalizeProject(proj) {
  if (!proj) return null;
  const id = String(proj._id || proj.id);
  const slug = proj.name?.toLowerCase().replace(/\s+/g, '-') || id;
  // If we have generatedHTML, construct a fake activeVersion to match Builder's expectations
  const hasHTML = proj.generatedHTML && proj.generatedHTML.length > 0;
  return {
    id,
    _id: id,
    name: proj.name || 'Untitled',
    description: proj.description || '',
    status: proj.status || 'draft',
    slug,
    domain: {
      subdomain: `${slug}.sitepilot.app`,
      custom: null,
      verified: false,
      ssl: false,
    },
    settings: {
      favicon: '',
      seo: { title: proj.name, description: proj.description || '' },
    },
    pageCount: hasHTML ? 1 : 0,
    createdAt: proj.createdAt,
    updatedAt: proj.updatedAt,
    publishedAt: proj.publishedAt || null,
    activeVersionId: hasHTML ? proj.currentVersion : null,
    activeVersion: hasHTML ? {
      versionNumber: proj.currentVersion || 1,
      htmlCode: proj.generatedHTML
    } : null,
  };
}


// ─── Authentication ──────────────────────────────────────────────────────────

/**
 * Login with email + password.
 * Returns { ok, user, tenant, token } or { ok: false, error }.
 */
export async function loginUser(email, password) {
  if (!email || !password) return { ok: false, error: 'Email and password are required' };
  try {
    const { data: resData } = await http.post('/auth/login', { email, password });
    const user = {
      ...resData.data.user,
      tenantId: String(resData.data.tenant?._id || resData.data.tenant?.id),
      tenant: resData.data.tenant
    };
    return { ok: true, user, tenant: resData.data.tenant, token: resData.data.token };
  } catch (err) {
    return { ok: false, error: err.response?.data?.error || 'Login failed' };
  }
}

/**
 * Register a new tenant + owner account.
 * Returns { ok, user, tenant, token } or { ok: false, error }.
 */
export async function registerTenant({ name, email, password, tenantName, slug, plan }) {
  try {
    const { data: resData } = await http.post('/auth/register', {
      tenantName,
      tenantSlug: slug || tenantName.toLowerCase().replace(/\s+/g, '-'),
      name,
      email,
      password: password || 'demo123',
      plan: plan || 'free',
    });
    const user = {
      ...resData.data.user,
      tenantId: String(resData.data.tenant?._id || resData.data.tenant?.id),
      tenant: resData.data.tenant
    };
    return { ok: true, user, tenant: resData.data.tenant, token: resData.data.token };
  } catch (err) {
    return { ok: false, error: err.response?.data?.error || 'Registration failed' };
  }
}

/** Clear local session — no backend call required for JWT. */
export function logoutUser() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  return { ok: true };
}

/**
 * Verify the stored token and fetch the current user + tenant.
 * Returns { user } where user has a .tenant property, or { user: null }.
 */
export async function fetchCurrentUser() {
  try {
    const { data: resData } = await http.get('/auth/me');
    // Attach tenant data onto user so existing pages can read user.tenant
    const user = {
      ...resData.data.user,
      id: String(resData.data.user.id || resData.data.user._id),
      tenantId: String(resData.data.tenant?._id || resData.data.tenant?.id),
      tenant: {
        ...resData.data.tenant,
        id: String(resData.data.tenant?.id || resData.data.tenant?._id),
        // Provide sensible defaults for fields used by Dashboard.jsx
        planLimits: { websites: 10, pages: 50, storage: 1024, ai: 100, domains: 5 },
        usage: { aiGenerations: 0, storage: 0, bandwidth: 0 },
        members: [],
      },
    };
    return { user };
  } catch {
    return { user: null };
  }
}

// ─── Projects (mapped to "websites" in the UI) ────────────────────────────────

/** List all projects belonging to the current user. */
export async function fetchWebsites() {
  const tenantId = getTenantId();
  if (!tenantId) return { websites: [], error: 'Unauthorized' };
  try {
    const { data: resData } = await http.get(`/websites`);
    return { websites: (resData.data || []).map(normalizeProject) };
  } catch (err) {
    return { websites: [], error: err.response?.data?.error || 'Failed to load websites' };
  }
}

/** Fetch a single project by ID. */
export async function fetchWebsite(projectId) {
  const tenantId = getTenantId();
  if (!tenantId) return { website: null };
  try {
    const { data: resData } = await http.get(`/websites/${projectId}`);
    return { website: normalizeProject(resData.data) };
  } catch {
    return { website: null };
  }
}

/** Create a new project (returns normalised "website" object). */
export async function createWebsite({ name, description = '' }) {
  const tenantId = getTenantId();
  if (!tenantId) return { ok: false, error: 'Not authenticated' };
  try {
    const { data: resData } = await http.post(`/websites`, { name, description, businessType: 'general' });
    return { ok: true, website: normalizeProject(resData.data) };
  } catch (err) {
    return { ok: false, error: err.response?.data?.error || 'Failed to create website' };
  }
}

/** Update project metadata (name, description, status). */
export async function modifyWebsite(id, updates) {
  const tenantId = getTenantId();
  if (!tenantId) return { ok: false, error: 'Not authenticated' };
  try {
    const { data: resData } = await http.put(`/websites/${id}`, updates);
    return { ok: true, website: normalizeProject(resData.data) };
  } catch (err) {
    return { ok: false, error: err.response?.data?.error || 'Update failed' };
  }
}

/** Publish a project (set status = published). */
export async function deployWebsite(id) {
  return modifyWebsite(id, { status: 'published' });
}

/** Permanently delete a project and all its versions. */
export async function removeWebsiteById(id) {
  const tenantId = getTenantId();
  if (!tenantId) return { ok: false, error: 'Not authenticated' };
  try {
    await http.delete(`/websites/${id}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.response?.data?.error || 'Delete failed' };
  }
}

// ─── Pages (stub — backend stores HTML in VersionHistory, not as separate pages) ─

export function fetchPages() { return { pages: [] }; }
export function createPage() { return { ok: true }; }
export function modifyPage() { return { ok: true }; }
export function removePageById() { return { ok: true }; }

// ─── AI Website Generation ────────────────────────────────────────────────────

/**
 * Generate a website via Gemini on the backend and save as a new version.
 * @param {string} prompt - User's generation/modification prompt
 * @param {array} history - Edit history (unused in backend currently)
 * @param {string} projectId - Project ID
 * @param {string} previousHtml - Previous version's HTML for styling consistency
 * Returns { ok, html, versionNumber, usage } or { ok: false, error }.
 */
export async function generateAIWebsite(prompt, history = [], projectId, previousHtml = '') {
  const tenantId = getTenantId();
  if (!tenantId) return { ok: false, error: 'Not authenticated' };
  if (!projectId) return { ok: false, error: 'Project ID is required for generation' };

  try {
    const { data: resData } = await http.post(
      `/ai/generate`,
      { prompt, previousHtml, websiteId: projectId },
    );

    // Backend returns { ok: true, version: { versionNumber, htmlCode } }
    const version = resData.version;
    return {
      ok: true,
      html: version.htmlCode || '',
      versionNumber: version.versionNumber,
      businessType: 'ai-generated',
      businessName: '',
      usage: { used: version.versionNumber, limit: 100 },
    };
  } catch (err) {
    return { ok: false, error: err.response?.data?.error || 'AI generation failed' };
  }
}

// ─── Version History ──────────────────────────────────────────────────────────

export async function fetchVersions(projectId) {
  const tenantId = getTenantId();
  if (!tenantId || !projectId) return { versions: [] };
  try {
    const { data: resData } = await http.get(`/websites/${projectId}/versions`);
    return { versions: resData.data || [] };
  } catch {
    return { versions: [] };
  }
}

export async function rollbackVersion(projectId, versionId) {
  const tenantId = getTenantId();
  if (!tenantId) return { ok: false, error: 'Not authenticated' };
  try {
    const { data: resData } = await http.post(
      `/websites/${projectId}/versions/${versionId}/restore`,
    );
    return { ok: true, version: resData.data };
  } catch (err) {
    return { ok: false, error: err.response?.data?.error || 'Rollback failed' };
  }
}

// ─── Branding ─────────────────────────────────────────────────────────────────

/** Fetch branding for the current tenant. */
export async function fetchBranding() {
  const tenantId = getTenantId();
  if (!tenantId) return { branding: null };
  const cached = readBrandingCache(tenantId);
  try {
    const { data } = await http.get(`/branding/${tenantId}`);
    writeBrandingCache(tenantId, data.branding);
    return { branding: data.branding };
  } catch {
    return { branding: cached };
  }
}

/**
 * Update branding fields.
 * Accepts a flat object or an object with a `branding` sub-key.
 */
export async function modifyTenant(updates) {
  const tenantId = getTenantId();
  if (!tenantId) return { ok: false, error: 'Not authenticated' };

  // All fields that the Branding page can send
  const BRANDING_KEYS = [
    'brandName', 'brandDescription',
    'companyName', 'companyDescription',
    'primaryColor', 'secondaryColor', 'accentColor',
    'backgroundColor', 'bgColor', 'textColor',
    'fontHeading', 'fontBody',
    'logo', 'services',
  ];

  const payload = {};
  for (const key of BRANDING_KEYS) {
    if (updates[key] !== undefined) payload[key] = updates[key];
    if (updates.branding?.[key] !== undefined) payload[key] = updates.branding[key];
  }

  try {
    const { data } = await http.put(`/branding/${tenantId}`, payload);
    writeBrandingCache(tenantId, data.branding);
    return { ok: true, branding: data.branding };
  } catch (err) {
    return { ok: false, error: err.response?.data?.error || 'Update failed' };
  }
}

/** Upload a logo image. Returns { ok, logo } where logo is the Cloudinary URL. */
export async function uploadLogo(file) {
  const tenantId = getTenantId();
  if (!tenantId) return { ok: false, error: 'Not authenticated' };
  const formData = new FormData();
  formData.append('file', file);
  try {
    const { data } = await http.post(`/branding/${tenantId}/upload-logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    patchBrandingCache(tenantId, { logo: data.logo });
    return { ok: true, logo: data.logo };
  } catch (err) {
    return { ok: false, error: err.response?.data?.error || 'Logo upload failed' };
  }
}

/** Upload a gallery/content image. */
export async function uploadImage(file, alt = '') {
  const tenantId = getTenantId();
  if (!tenantId) return { ok: false, error: 'Not authenticated' };
  const formData = new FormData();
  formData.append('file', file);
  if (alt) formData.append('alt', alt);
  try {
    const { data } = await http.post(`/branding/${tenantId}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { ok: true, image: data.image };
  } catch (err) {
    return { ok: false, error: err.response?.data?.error || 'Image upload failed' };
  }
}

// ─── Team Management ──────────────────────────────────────────────────────────

export async function fetchTeam() {
  const tenantId = getTenantId();
  if (!tenantId) return { users: [] };
  try {
    const { data } = await http.get(`/tenants/${tenantId}/users`);
    return { users: data.users || [] };
  } catch {
    return { users: [] };
  }
}

export async function inviteUser({ name, email, password, role = 'editor' }) {
  const tenantId = getTenantId();
  if (!tenantId) return { ok: false, error: 'Not authenticated' };
  try {
    const { data } = await http.post(`/tenants/${tenantId}/users`, { name, email, password, role });
    return { ok: true, user: data.user };
  } catch (err) {
    return { ok: false, error: err.response?.data?.error || 'Failed to invite user' };
  }
}

// ─── Billing (stubs — no payment backend yet) ─────────────────────────────────

export function fetchBilling() { return { subscription: null }; }
export function changePlan() { return { ok: true }; }

// ─── Legacy AI helper stubs (keep imports working) ────────────────────────────

export function generateAILayout() { return { ok: true, result: null }; }
export function generateAIComponent() { return { ok: true, result: null }; }
export function suggestAISEO() { return { ok: true, result: null }; }
export function checkAIAccessibility() { return { ok: true, result: null }; }
