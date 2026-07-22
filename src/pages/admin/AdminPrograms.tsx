import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react';
import { useAdminList } from '../../lib/useAdminList';
import { useToast } from '../../components/Toast';
import { Modal, ConfirmDialog } from '../../components/Modal';
import { ImageUpload } from '../../components/ImageUpload';
import { formatRupiah, pct } from '../../lib/utils';
import type { Program } from '../../lib/types';

const empty: Partial<Program> = {
  nama: '', deskripsi: '', target_dana: 0, dana_terkumpul: 0, kategori: 'Umum', foto: '', urutan: 0, is_active: true,
};

export function AdminPrograms() {
  const { items, loading, save, remove } = useAdminList<Program>('programs');
  const notify = useToast();
  const [editing, setEditing] = useState<Partial<Program> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openNew = () => setEditing({ ...empty });
  const openEdit = (p: Program) => setEditing({ ...p });
  const submit = async () => {
    if (!editing?.nama) { notify('Nama program wajib diisi', 'error'); return; }
    setSaving(true);
    try {
      await save(editing.id ? 'PUT' : 'POST', {
        ...editing,
        target_dana: Number(editing.target_dana) || 0,
        dana_terkumpul: Number(editing.dana_terkumpul) || 0,
        urutan: Number(editing.urutan) || 0,
      }, editing.id);
      notify(editing.id ? 'Program diperbarui' : 'Program ditambahkan');
      setEditing(null);
    } catch (e) {
      notify((e as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await remove(deleteId);
      notify('Program dihapus');
      setDeleteId(null);
    } catch (e) {
      notify((e as Error).message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-neutral-600">Kelola program unggulan LAZISMU Jakarta Pusat.</p>
        <button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Program</button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-neutral-400">Belum ada program. Klik "Tambah Program" untuk mulai.</div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="card flex items-center gap-4 p-4">
              <div className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:block">
                {p.foto && <img src={p.foto} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="hidden text-neutral-300 sm:inline"><GripVertical className="h-4 w-4" /></span>
                  <h3 className="truncate font-serif font-semibold text-lazismu-green">{p.nama}</h3>
                  {p.kategori && <span className="badge">{p.kategori}</span>}
                  {!p.is_active && <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">Nonaktif</span>}
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-neutral-500">{p.deskripsi}</p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="font-semibold text-lazismu-orange-dark">{formatRupiah(p.dana_terkumpul)}</span>
                  <span className="text-neutral-400">/ {formatRupiah(p.target_dana)}</span>
                  <span className="font-medium text-lazismu-green">{pct(p.dana_terkumpul, p.target_dana)}%</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-neutral-500 transition hover:bg-lazismu-cream-dark hover:text-lazismu-green"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(p.id)} className="rounded-lg p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Program' : 'Tambah Program'}
        size="lg"
        footer={
          <>
            <button onClick={() => setEditing(null)} className="btn-ghost">Batal</button>
            <button onClick={submit} disabled={saving} className="btn-green">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}
            </button>
          </>
        }
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="label">Nama Program</label>
              <input className="input" value={editing.nama || ''} onChange={(e) => setEditing({ ...editing, nama: e.target.value })} />
            </div>
            <div>
              <label className="label">Deskripsi</label>
              <textarea rows={3} className="input resize-none" value={editing.deskripsi || ''} onChange={(e) => setEditing({ ...editing, deskripsi: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Kategori</label>
                <input className="input" value={editing.kategori || ''} onChange={(e) => setEditing({ ...editing, kategori: e.target.value })} />
              </div>
              <div>
                <label className="label">Urutan</label>
                <input type="number" className="input" value={editing.urutan ?? 0} onChange={(e) => setEditing({ ...editing, urutan: Number(e.target.value) })} />
              </div>
              <div>
                <label className="label">Target Dana (Rp)</label>
                <input type="number" className="input" value={editing.target_dana ?? 0} onChange={(e) => setEditing({ ...editing, target_dana: Number(e.target.value) })} />
              </div>
              <div>
                <label className="label">Dana Terkumpul (Rp)</label>
                <input type="number" className="input" value={editing.dana_terkumpul ?? 0} onChange={(e) => setEditing({ ...editing, dana_terkumpul: Number(e.target.value) })} />
              </div>
            </div>
            <ImageUpload value={editing.foto || ''} onChange={(foto) => setEditing({ ...editing, foto })} folder="programs" />
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 text-lazismu-green focus:ring-lazismu-green" />
              Tampilkan di situs publik
            </label>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Hapus Program?"
        message="Program akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
