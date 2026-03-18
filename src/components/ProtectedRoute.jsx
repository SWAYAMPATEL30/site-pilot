import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_LEVEL } from '../lib/constants';

/**
 * ProtectedRoute
 * - Redirects unauthenticated users to /login
 * - Optional `minRole` prop: 'admin' | 'editor' | 'viewer'
 *   If the logged-in user's role is below the minimum, renders `fallback` or a
 *   friendly "Access Denied" screen instead of the children.
 */
export default function ProtectedRoute({ children, minRole = null, fallback = null }) {
  const { authToken, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  if (minRole && user) {
    const userLevel = ROLE_LEVEL[user?.role] ?? 0;
    const required  = ROLE_LEVEL[minRole]    ?? 0;
    if (userLevel < required) {
      if (fallback) return fallback;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 40 }}>🔒</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Access Denied</h2>
          <p className="mono" style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase' }}>
            This page requires <strong>{minRole}</strong> role or above.
          </p>
          <p className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Your current role: <strong style={{ color: 'var(--text-high)' }}>{user?.role ?? 'unknown'}</strong>
          </p>
        </div>
      );
    }
  }

  return children;
}

