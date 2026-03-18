import { getUserByEmail, getUser, getTenant } from './store';

// Client-side session management using localStorage
const SESSION_KEY = 'tenantflow_session';
const SESSIONS = {};

export function createSession(userId) {
  const token = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  SESSIONS[token] = { userId, createdAt: Date.now() };
  localStorage.setItem(SESSION_KEY, token);
  return token;
}

export function deleteSession() {
  const token = localStorage.getItem(SESSION_KEY);
  if (token) delete SESSIONS[token];
  localStorage.removeItem(SESSION_KEY);
}

export function getSessionUser() {
  const token = localStorage.getItem(SESSION_KEY);
  if (!token) return null;
  const session = SESSIONS[token];
  if (!session) return null;
  return getUser(session.userId);
}

export function getCurrentUser() {
  const user = getSessionUser();
  if (!user) return null;
  const tenant = getTenant(user.tenantId);
  return { ...user, tenant, password: undefined };
}

export function authenticateUser(email, password) {
  const user = getUserByEmail(email);
  if (!user) return null;
  if (user.password !== password) return null;
  return user;
}
