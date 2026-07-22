import { supabase, ASSETS_BUCKET } from './supabase';

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('id-ID').format(n || 0);
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function pct(collected: number, target: number): number {
  if (!target) return 0;
  return Math.min(100, Math.round((collected / target) * 100));
}

export async function uploadAsset(file: File, folder: string): Promise<{ url: string; error?: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(ASSETS_BUCKET).upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) return { url: '', error: error.message };
  const { data } = supabase.storage.from(ASSETS_BUCKET).getPublicUrl(filename);
  return { url: data.publicUrl };
}
