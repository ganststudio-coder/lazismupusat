import { useState } from 'react';
import { Plus, Trash2, Loader2, Pencil } from 'lucide-react';
import { useAdminList } from '../../lib/useAdminList';
import { useToast } from '../../components/Toast';
import { Modal, ConfirmDialog } from '../../components/Modal';
import { ImageUpload } from '../../components/ImageUpload';
import type { Galeri } from '../../lib/types';

const empty: Partial<Galeri> = { image_url: '', caption: '', kategori: 'Umum', urutan: 0 };

export function AdminGaleri() {
  const { items, loading, save, remove } = useAdminList<Galeri>('galeri');
  const notify = useToast();
  const [editing, setEditing] = useState<Partial<Galeri> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const submit = async () => {
    if (!editing?.image_url) { notify('Foto wajib diunggah', 'error'); return; }
    setSaving(true);
    try {
      await save(editing.id ? 'PUT' : 'POST', { ...editing, urutan: Number(editing.urutan) || 0 }, editing.id);
      notify(editing.id ? 'Galeri diperbarui' : 'Foto ditambahkan');
      setEditing(null);
    } catch (e) { notify((e as Error).message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await remove(deleteId); notify('Foto dihapus'); setDeleteId(null); }
    catch (e) { notify((e as Error).message, 'error'); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-neutral-600">Kelola foto galeri kegiatan.</p>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Foto</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-white" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-neutral-400">Belum ada foto galeri.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g) => (
            <div key={g.id} className="card group overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <img src={g.image_url} alt={g.caption || ''} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-lazismu-green-dark/60 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => setEditing({ ...g })} className="rounded-lg bg-white/90 p-2 text-lazismu-green transition hover:bg-white"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(g.id)} className="rounded-lg bg-white/90 p-2 text-red-500 transition hover:bg-white"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-xs font-medium text-neutral-700">{g.caption || 'Tanpa caption'}</p>
                <p className="mt-0.5 text-[10px] text-neutral-400">{g.kategori}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Foto' : 'Tambah Foto'}
        footer={<><button onClick={() => setEditing(null)} className="btn-ghost">Batal</button><button onClick={submit} disabled={saving} className="btn-green">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}</button></>}
      >
        {editing && (
          <div className="space-y-4">
            <ImageUpload value={editing.image_url || ''} onChange={(image_url) => setEditing({ ...editing, image_url })} folder="galeri" label="Foto Galeri" />
            <div><label className="label">Caption</label><input className="input" value={editing.caption || ''} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Kategori</label><input className="input" value={editing.kategori || ''} onChange={(e) => setEditing({ ...editing, kategori: e.target.value })} /></div>
              <div><label className="label">Urutan</label><input type="number" className="input" value={editing.urutan ?? 0} onChange={(e) => setEditing({ ...editing, urutan: Number(e.target.value) })} /></div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Hapus Foto?" message="Foto akan dihapus dari galeri." onConfirm={confirmDelete} onClose={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
