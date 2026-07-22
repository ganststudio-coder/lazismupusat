import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface RouteState {
  path: string;
  query: URLSearchParams;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouteState | undefined>(undefined);

function currentLocation() {
  return window.location.pathname + window.location.search;
}

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(currentLocation);

  useEffect(() => {
    const onPop = () => setLocation(currentLocation());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin);
    const next = url.pathname + url.search;
    if (next === currentLocation()) return;

    window.history.pushState({}, '', next);
    setLocation(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = useMemo<RouteState>(() => {
    const [rawPath, searchStr] = location.split('?');
    return {
      path: normalizePath(rawPath),
      query: new URLSearchParams(searchStr || ''),
      navigate,
    };
  }, [location, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouteState {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
