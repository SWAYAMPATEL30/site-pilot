import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchCurrentUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading]     = useState(true);

  /**
   * On mount: read token from storage, then verify it with the backend.
   * This ensures stale / expired tokens are cleared automatically.
   */
  useEffect(() => {
    async function init() {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      // If a token is stored, validate it with the backend to avoid
      // trusting stale data that can cause 403 responses.
      if (!storedToken) { setLoading(false); return; }

      // Optimistically set token and cached user while we validate.
      setAuthToken(storedToken);
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
      }

      // Always verify token with backend and refresh stored user.
      const { user: freshUser } = await fetchCurrentUser();
      if (freshUser) {
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } else {
        // Token invalid / expired — clear session
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setAuthToken(null);
        setUser(null);
      }
      setLoading(false);
    }
    init();
  }, []);

  /** Called after a successful login or registration. */
  function login(userData, token) {
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  /** Clear the session locally (JWT is stateless — no server call needed). */
  const logout = useCallback(() => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, authToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
