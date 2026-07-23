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

// --- Upload gambar via Cloudinary (unsigned upload) ---
const CLOUDINARY_CLOUD_NAME = 'iov76arj';
const CLOUDINARY_UPLOAD_PRESET = 'jlc1q3ay';

export async function uploadAsset(file: File, folder: string): Promise<{ url: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `lazismu/${folder}`);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    const data = await res.json();

    if (!res.ok) {
      return { url: '', error: data?.error?.message || 'Gagal mengunggah gambar ke Cloudinary' };
    }

    return { url: data.secure_url as string };
  } catch (err) {
    return { url: '', error: (err as Error).message || 'Gagal mengunggah gambar' };
  }
}