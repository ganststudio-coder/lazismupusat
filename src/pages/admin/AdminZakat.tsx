import { useEffect, useState } from 'react';
import { Loader2, Save, Calculator } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { formatRupiah } from '../../lib/utils';
import type { ZakatSettings } from '../../lib/types';
import { getSupabaseFunctionUrl } from '../../lib/env';

const API = getSupabaseFunctionUrl('admin-api', 'zakat');

export function AdminZakat() {
  const notify = useToast();
  const [data, setData] = useState<Partial<ZakatSettings>>({ harga_emas_per_gram: 1350000, harga_beras_per_kg: 15000 });
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
      notify('Pengaturan zakat disimpan');
      setData(json.data);
    } catch (e) { notify((e as Error).message, 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-lazismu-green" /></div>;

  const nisabMaal = 85 * (data.harga_emas_per_gram || 0);
  const nisabBulanan = Math.round((653 * (data.harga_beras_per_kg || 0)) / 12);

  return (
    <div className="max-w-2xl">
      <div className="mb-5 flex items-center gap-2">
        <Calculator className="h-4 w-4 text-lazismu-orange" />
        <p className="text-sm text-neutral-600">Harga acuan untuk kalkulator zakat di Dashboard.</p>
      </div>
      <div className="card space-y-4 p-6">
        <div>
          <label className="label">Harga Emas per Gram (Rp)</label>
          <input type="number" className="input" value={data.harga_emas_per_gram ?? 0} onChange={(e) => setData({ ...data, harga_emas_per_gram: Number(e.target.value) })} />
          <p className="mt-1.5 text-xs text-neutral-500">Nisab Zakat Maal (85 gram) = <strong className="text-lazismu-green">{formatRupiah(nisabMaal)}</strong></p>
        </div>
        <div>
          <label className="label">Harga Beras per Kg (Rp)</label>
          <input type="number" className="input" value={data.harga_beras_per_kg ?? 0} onChange={(e) => setData({ ...data, harga_beras_per_kg: Number(e.target.value) })} />
          <p className="mt-1.5 text-xs text-neutral-500">Nisab bulanan Zakat Profesi = <strong className="text-lazismu-green">{formatRupiah(nisabBulanan)}</strong></p>
        </div>
        <div className="flex justify-end pt-2">
          <button onClick={submit} disabled={saving} className="btn-green">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Simpan</>}
          </button>
        </div>
      </div>
    </div>
  );
}
