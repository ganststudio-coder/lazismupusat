import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Landmark, QrCode, Wallet, CreditCard, Building2 } from 'lucide-react';
import { useAdminList } from '../../lib/useAdminList';
import { useToast } from '../../components/Toast';
import { Modal, ConfirmDialog } from '../../components/Modal';
import type { DonasiMetode, DonasiTipe } from '../../lib/types';

const TIPE_OPTIONS: { value: DonasiTipe; label: string; icon: typeof Landmark }[] = [
  { value: 'rekening', label: 'No. Rekening', icon: Landmark },
  { value: 'qris', label: 'QRIS', icon: QrCode },
  { value: 'gopay', label: 'GoPay', icon: Wallet },
  { value: 'debit', label: 'Kartu Debit', icon: CreditCard },
  { value: 'va', label: 'Virtual Account', icon: Building2 },
];

const empty: Partial<DonasiMetode> = { tipe: 'rekening', label: '', nilai: '', catatan: '', urutan: 0, is_active: true };

export function AdminDonasi() {
  const { items, loading, save, remove } = useAdminList<DonasiMetode>('donasi');
  const notify = useToast();
  const [editing, setEditing] = useState<Partial<DonasiMetode> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const submit = async () => {
    if (!editing?.label || !editing.nilai) { notify('Label dan nilai wajib diisi', 'error'); return; }
    setSaving(true);
    try {
      await save(editing.id ? 'PUT' : 'POST', { ...editing, urutan: Number(editing.urutan) || 0 }, editing.id);
      notify(editing.id ? 'Metode diperbarui' : 'Metode ditambahkan');
      setEditing(null);
    } catch (e) { notify((e as Error).message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await remove(deleteId); notify('Metode dihapus'); setDeleteId(null); }
    catch (e) { notify((e as Error).message, 'error'); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-neutral-600">Kelola metode donasi yang muncul di modal Donasi.</p>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Metode</button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-neutral-400">Belum ada metode donasi.</div>
      ) : (
        <div className="space-y-3">
          {items.map((m) => {
            const opt = TIPE_OPTIONS.find((t) => t.value === m.tipe);
            const Icon = opt?.icon ?? Landmark;
            return (
              <div key={m.id} className="card flex items-center gap-4 p-4">
                <div className="inline-flex rounded-xl bg-lazismu-orange/10 p-2.5 text-lazismu-orange-dark"><Icon className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-semibold text-lazismu-green">{m.label}</h3>
                    {!m.is_active && <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">Nonaktif</span>}
                  </div>
                  <p className="mt-0.5 font-mono text-sm text-neutral-800 break-all">{m.nilai}</p>
                  {m.catatan && <p className="text-xs text-neutral-500">{m.catatan}</p>}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button onClick={() => setEditing({ ...m })} className="rounded-lg p-2 text-neutral-500 transition hover:bg-lazismu-cream-dark hover:text-lazismu-green"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(m.id)} className="rounded-lg p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Metode' : 'Tambah Metode'}
        footer={<><button onClick={() => setEditing(null)} className="btn-ghost">Batal</button><button onClick={submit} disabled={saving} className="btn-green">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}</button></>}
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="label">Tipe Metode</label>
              <select className="input" value={editing.tipe || 'rekening'} onChange={(e) => setEditing({ ...editing, tipe: e.target.value as DonasiTipe })}>
                {TIPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div><label className="label">Label (mis. Bank Muamalat)</label><input className="input" value={editing.label || ''} onChange={(e) => setEditing({ ...editing, label: e.target.value })} /></div>
            <div><label className="label">Nilai (no. rekening / nomor / link)</label><input className="input font-mono" value={editing.nilai || ''} onChange={(e) => setEditing({ ...editing, nilai: e.target.value })} /></div>
            <div><label className="label">Catatan</label><input className="input" value={editing.catatan || ''} onChange={(e) => setEditing({ ...editing, catatan: e.target.value })} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Urutan</label><input type="number" className="input" value={editing.urutan ?? 0} onChange={(e) => setEditing({ ...editing, urutan: Number(e.target.value) })} /></div>
              <label className="flex items-end gap-2 pb-2 text-sm font-medium text-neutral-700">
                <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 text-lazismu-green focus:ring-lazismu-green" />
                Aktif
              </label>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Hapus Metode?" message="Metode donasi akan dihapus." onConfirm={confirmDelete} onClose={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
