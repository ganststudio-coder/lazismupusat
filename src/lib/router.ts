import { useEffect, useState, useCallback } from 'react';

export interface RouteState {
  path: string;
  query: URLSearchParams;
  navigate: (to: string) => void;
}

export function useRouter(): RouteState {
  const [path, setPath] = useState(() => window.location.pathname + window.location.search);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname + window.location.search);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to === window.location.pathname + window.location.search) return;
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [purePath, searchStr] = path.split('?');
  return {
    path: purePath,
    query: new URLSearchParams(searchStr || ''),
    navigate,
  };
}
