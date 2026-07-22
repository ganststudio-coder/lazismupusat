import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Calendar } from 'lucide-react';
import { useAdminList } from '../../lib/useAdminList';
import { useToast } from '../../components/Toast';
import { Modal, ConfirmDialog } from '../../components/Modal';
import { ImageUpload } from '../../components/ImageUpload';
import { formatDate } from '../../lib/utils';
import type { Berita } from '../../lib/types';

const today = new Date().toISOString().slice(0, 10);
const empty: Partial<Berita> = { judul: '', tanggal: today, ringkasan: '', isi: '', foto: '' };

export function AdminBerita() {
  const { items, loading, save, remove } = useAdminList<Berita>('berita');
  const notify = useToast();
  const [editing, setEditing] = useState<Partial<Berita> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const submit = async () => {
    if (!editing?.judul) { notify('Judul wajib diisi', 'error'); return; }
    setSaving(true);
    try {
      await save(editing.id ? 'PUT' : 'POST', editing, editing.id);
      notify(editing.id ? 'Berita diperbarui' : 'Berita ditambahkan');
      setEditing(null);
    } catch (e) { notify((e as Error).message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await remove(deleteId); notify('Berita dihapus'); setDeleteId(null); }
    catch (e) { notify((e as Error).message, 'error'); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-neutral-600">Kelola berita & kabar terbaru.</p>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Berita</button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-neutral-400">Belum ada berita.</div>
      ) : (
        <div className="space-y-3">
          {items.map((b) => (
            <div key={b.id} className="card flex items-center gap-4 p-4">
              <div className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:block">
                {b.foto && <img src={b.foto} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-serif font-semibold text-lazismu-green">{b.judul}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-neutral-500">{b.ringkasan}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-neutral-400"><Calendar className="h-3 w-3" /> {formatDate(b.tanggal)}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button onClick={() => setEditing({ ...b })} className="rounded-lg p-2 text-neutral-500 transition hover:bg-lazismu-cream-dark hover:text-lazismu-green"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(b.id)} className="rounded-lg p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Berita' : 'Tambah Berita'}
        size="lg"
        footer={<><button onClick={() => setEditing(null)} className="btn-ghost">Batal</button><button onClick={submit} disabled={saving} className="btn-green">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}</button></>}
      >
        {editing && (
          <div className="space-y-4">
            <div><label className="label">Judul</label><input className="input" value={editing.judul || ''} onChange={(e) => setEditing({ ...editing, judul: e.target.value })} /></div>
            <div><label className="label">Tanggal</label><input type="date" className="input" value={editing.tanggal || today} onChange={(e) => setEditing({ ...editing, tanggal: e.target.value })} /></div>
            <div><label className="label">Ringkasan</label><textarea rows={2} className="input resize-none" value={editing.ringkasan || ''} onChange={(e) => setEditing({ ...editing, ringkasan: e.target.value })} /></div>
            <div><label className="label">Isi Berita</label><textarea rows={7} className="input resize-none" value={editing.isi || ''} onChange={(e) => setEditing({ ...editing, isi: e.target.value })} /></div>
            <ImageUpload value={editing.foto || ''} onChange={(foto) => setEditing({ ...editing, foto })} folder="berita" />
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Hapus Berita?" message="Berita akan dihapus permanen." onConfirm={confirmDelete} onClose={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
