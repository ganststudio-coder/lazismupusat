import { useCallback, useEffect, useState } from 'react';
import { getSupabaseFunctionUrl } from './env';

const API_BASE = getSupabaseFunctionUrl('admin-api');

export function useAdminList<T>(resource: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${resource}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Gagal memuat data');
      setItems(json.data ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => { refresh(); }, [refresh]);

  const save = async (method: 'POST' | 'PUT', body: Partial<T>, id?: string) => {
    const url = `${API_BASE}/${resource}${id ? `/${id}` : ''}`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || 'Gagal menyimpan');
    await refresh();
    return json.data as T;
  };

  const remove = async (id: string) => {
    const res = await fetch(`${API_BASE}/${resource}/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || 'Gagal menghapus');
    await refresh();
  };

  return { items, loading, error, refresh, save, remove };
}
