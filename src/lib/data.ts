import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type {
  Program, Pengurus, Galeri, Berita, DashboardSlide,
  KontakSettings, ZakatSettings, DonasiMetode,
} from './types';

type QueryResult<T> = { data: T | null; error: { message: string } | null };
export function useQuery<T>(fetcher: () => PromiseLike<QueryResult<T>>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.resolve(fetcher())
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setError(error.message);
        else setData(data);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading };
}

export function usePrograms() {
  return useQuery<Program[]>(() =>
    supabase.from('programs').select('*').eq('is_active', true).order('urutan', { ascending: true })
  );
}

export function useAllPrograms() {
  return useQuery<Program[]>(() =>
    supabase.from('programs').select('*').order('urutan', { ascending: true })
  );
}

export function usePengurus() {
  return useQuery<Pengurus[]>(() =>
    supabase.from('pengurus').select('*').order('urutan', { ascending: true })
  );
}

export function useGaleri() {
  return useQuery<Galeri[]>(() =>
    supabase.from('galeri').select('*').order('urutan', { ascending: true })
  );
}

export function useBerita() {
  return useQuery<Berita[]>(() =>
    supabase.from('berita').select('*').order('tanggal', { ascending: false })
  );
}

export function useBeritaDetail(id: string | null) {
  return useQuery<Berita>(() =>
    supabase.from('berita').select('*').eq('id', id).maybeSingle()
  , [id]);
}

export function useSlides() {
  return useQuery<DashboardSlide[]>(() =>
    supabase.from('dashboard_slides').select('*').eq('is_active', true).order('urutan', { ascending: true }).limit(5)
  );
}

export function useKontak() {
  const { data, error, loading } = useQuery<KontakSettings>(() =>
    supabase.from('kontak_settings').select('*').eq('id', 1).maybeSingle()
  );
  return { kontak: data, error, loading };
}

export function useZakatSettings() {
  const { data, error, loading } = useQuery<ZakatSettings>(() =>
    supabase.from('zakat_settings').select('*').eq('id', 1).maybeSingle()
  );
  return { zakat: data, error, loading };
}

export function useDonasiMetode() {
  return useQuery<DonasiMetode[]>(() =>
    supabase.from('donasi_metode').select('*').eq('is_active', true).order('urutan', { ascending: true })
  );
}
