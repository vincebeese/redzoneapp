import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext(null);

const SESSION_EXPIRED_MESSAGE = 'Session expired, please sign in again';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const handlingExpiry = useRef(false);

  const handleSessionExpired = useCallback(() => {
    if (handlingExpiry.current) return;
    handlingExpiry.current = true;
    setUser(null);
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      .catch(() => {})
      .finally(() => { window.location.href = '/login'; });
  }, []);

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async function interceptedFetch(input, init) {
      const res = await originalFetch(input, init);
      const url = typeof input === 'string' ? input : input?.url ?? '';
      if (url.includes('/api/') && !url.includes('/api/auth/login')) {
        if (res.status === 401) {
          try {
            const data = await res.clone().json();
            if (data?.error === SESSION_EXPIRED_MESSAGE) {
              handleSessionExpired();
            }
          } catch { /* ignore parse errors */ }
        } else if (res.status === 403) {
          try {
            const data = await res.clone().json();
            if (data?.error === 'access_expired') {
              if (handlingExpiry.current) return res;
              handlingExpiry.current = true;
              setUser(null);
              fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
              window.location.href = '/login?reason=access_expired';
            }
          } catch { /* ignore parse errors */ }
        }
      }
      return res;
    };
    return () => { window.fetch = originalFetch; };
  }, [handleSessionExpired]);

  useEffect(() => {
    fetchMe();
  }, []);

  async function fetchMe() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }

    const data = await res.json();
    setUser(data);
    handlingExpiry.current = false;
    return data;
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  }

  async function refreshUser() {
    await fetchMe();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
