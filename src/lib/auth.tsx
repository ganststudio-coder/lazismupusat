import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AdminUser } from './types';

const STORAGE_KEY = 'lazismu_admin_session';
const LOGIN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-login`;

interface AdminSession {
  admin: AdminUser;
  ts: number;
}

interface AuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isMaster: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const session: AdminSession = JSON.parse(raw);
        // session valid for 12 hours
        if (Date.now() - session.ts < 12 * 60 * 60 * 1000) {
          setAdmin(session.admin);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    admin,
    loading,
    isMaster: admin?.role === 'master',
    login: async (username, password) => {
      try {
        const res = await fetch(`${LOGIN_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) return { ok: false, error: data?.error || 'Login gagal' };
        const session: AdminSession = { admin: data.admin, ts: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        setAdmin(data.admin);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: (e as Error).message || 'Network error' };
      }
    },
    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
      setAdmin(null);
    },
  }), [admin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
