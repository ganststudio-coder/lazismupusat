import { useEffect, useState } from 'react';
import { Loader2, Save, Phone } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { ImageUpload } from '../../components/ImageUpload';
import type { KontakSettings } from '../../lib/types';

const API = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api/kontak`;

export function AdminKontak() {
  const notify = useToast();
  const [data, setData] = useState<Partial<KontakSettings>>({ telepon: '', email: '', alamat: '', qris_image: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API);
        const json = await res.json();
        if (json.data) setData(json.data);
      } catch (e) { notify((e as Error).message, 'error'); }
      finally { setLoading(false); }
    })();
  }, [notify]);

  const submit = async () => {
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Gagal menyimpan');
      notify('Pengaturan kontak disimpan');
      setData(json.data);
    } catch (e) { notify((e as Error).message, 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-lazismu-green" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-5 flex items-center gap-2">
        <Phone className="h-4 w-4 text-lazismu-orange" />
        <p className="text-sm text-neutral-600">Informasi kontak yang ditampilkan di situs publik.</p>
      </div>
      <div className="card space-y-4 p-6">
        <div><label className="label">Telepon</label><input className="input" value={data.telepon || ''} onChange={(e) => setData({ ...data, telepon: e.target.value })} /></div>
        <div><label className="label">Email</label><input type="email" className="input" value={data.email || ''} onChange={(e) => setData({ ...data, email: e.target.value })} /></div>
        <div><label className="label">Alamat</label><textarea rows={2} className="input resize-none" value={data.alamat || ''} onChange={(e) => setData({ ...data, alamat: e.target.value })} /></div>
        <ImageUpload value={data.qris_image || ''} onChange={(qris_image) => setData({ ...data, qris_image })} folder="kontak" label="Gambar QRIS" />
        <div className="flex justify-end pt-2">
          <button onClick={submit} disabled={saving} className="btn-green">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Simpan</>}
          </button>
        </div>
      </div>
    </div>
  );
}
