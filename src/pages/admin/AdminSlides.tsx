import { useState } from 'react';
import { Plus, Trash2, Loader2, Pencil, SlidersHorizontal } from 'lucide-react';
import { useAdminList } from '../../lib/useAdminList';
import { useToast } from '../../components/Toast';
import { Modal, ConfirmDialog } from '../../components/Modal';
import { ImageUpload } from '../../components/ImageUpload';
import type { DashboardSlide } from '../../lib/types';

const empty: Partial<DashboardSlide> = { image_url: '', caption: '', urutan: 0, is_active: true };

export function AdminSlides() {
  const { items, loading, save, remove } = useAdminList<DashboardSlide>('slides');
  const notify = useToast();
  const [editing, setEditing] = useState<Partial<DashboardSlide> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const activeCount = items.filter((s) => s.is_active).length;

  const submit = async () => {
    if (!editing?.image_url) { notify('Foto slide wajib diunggah', 'error'); return; }
    if (!editing.id && editing.is_active && activeCount >= 5) {
      notify('Maksimal 5 slide aktif. Nonaktifkan salah satu terlebih dahulu.', 'error');
      return;
    }
    setSaving(true);
    try {
      await save(editing.id ? 'PUT' : 'POST', { ...editing, urutan: Number(editing.urutan) || 0 }, editing.id);
      notify(editing.id ? 'Slide diperbarui' : 'Slide ditambahkan');
      setEditing(null);
    } catch (e) { notify((e as Error).message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await remove(deleteId); notify('Slide dihapus'); setDeleteId(null); }
    catch (e) { notify((e as Error).message, 'error'); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600">Kelola slideshow di Dashboard publik.</p>
          <p className="mt-1 text-xs text-neutral-400">Maksimal 5 slide aktif — saat ini {activeCount} aktif.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Slide</button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-neutral-400">Belum ada slide.</div>
      ) : (
        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="card flex items-center gap-4 p-4">
              <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                <img src={s.image_url} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-lazismu-orange" />
                  <h3 className="truncate font-serif font-semibold text-lazismu-green">Slide #{s.urutan}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.is_active ? 'bg-lazismu-green/10 text-lazismu-green' : 'bg-neutral-100 text-neutral-500'}`}>
                    {s.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-neutral-600">{s.caption || 'Tanpa caption'}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button onClick={() => setEditing({ ...s })} className="rounded-lg p-2 text-neutral-500 transition hover:bg-lazismu-cream-dark hover:text-lazismu-green"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(s.id)} className="rounded-lg p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Slide' : 'Tambah Slide'}
        footer={<><button onClick={() => setEditing(null)} className="btn-ghost">Batal</button><button onClick={submit} disabled={saving} className="btn-green">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}</button></>}
      >
        {editing && (
          <div className="space-y-4">
            <ImageUpload value={editing.image_url || ''} onChange={(image_url) => setEditing({ ...editing, image_url })} folder="slides" label="Foto Slide (16:9 / 21:9 disarankan)" />
            <div><label className="label">Caption</label><input className="input" value={editing.caption || ''} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Urutan</label><input type="number" className="input" value={editing.urutan ?? 0} onChange={(e) => setEditing({ ...editing, urutan: Number(e.target.value) })} /></div>
              <label className="flex items-end gap-2 pb-2 text-sm font-medium text-neutral-700">
                <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 text-lazismu-green focus:ring-lazismu-green" />
                Tampilkan (aktif)
              </label>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Hapus Slide?" message="Slide akan dihapus dari carousel." onConfirm={confirmDelete} onClose={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
