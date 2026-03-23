import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from './api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'edubridge-auth-token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(STORAGE_KEY) || '';
  });
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMe() {
      if (!token) {
        if (active) {
          setUser(null);
          setReady(true);
        }
        return;
      }

      try {
        const data = await apiRequest('/auth/me', { token });
        if (active) {
          setUser(data.user);
        }
      } catch {
        if (active) {
          setToken('');
          setUser(null);
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        }
      } finally {
        if (active) {
          setReady(true);
        }
      }
    }

    loadMe();
    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    ready,
    isAuthenticated: Boolean(token && user),
    async login(email, password) {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      setToken(data.token);
      setUser(data.user);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, data.token);
      }
      return data;
    },
    async register({ fullName, email, password, role }) {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: { fullName, email, password, role }
      });
      setToken(data.token);
      setUser(data.user);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, data.token);
      }
      return data;
    },
    logout() {
      setToken('');
      setUser(null);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }), [ready, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
