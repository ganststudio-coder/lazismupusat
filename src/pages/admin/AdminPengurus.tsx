import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, UserCircle2 } from 'lucide-react';
import { useAdminList } from '../../lib/useAdminList';
import { useToast } from '../../components/Toast';
import { Modal, ConfirmDialog } from '../../components/Modal';
import { ImageUpload } from '../../components/ImageUpload';
import type { Pengurus } from '../../lib/types';

const empty: Partial<Pengurus> = { nama: '', jabatan: '', masa_jabatan: '2024-2028', foto: '', urutan: 0 };

export function AdminPengurus() {
  const { items, loading, save, remove } = useAdminList<Pengurus>('pengurus');
  const notify = useToast();
  const [editing, setEditing] = useState<Partial<Pengurus> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const submit = async () => {
    if (!editing?.nama || !editing.jabatan) { notify('Nama dan jabatan wajib diisi', 'error'); return; }
    setSaving(true);
    try {
      await save(editing.id ? 'PUT' : 'POST', { ...editing, urutan: Number(editing.urutan) || 0 }, editing.id);
      notify(editing.id ? 'Pengurus diperbarui' : 'Pengurus ditambahkan');
      setEditing(null);
    } catch (e) { notify((e as Error).message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await remove(deleteId); notify('Pengurus dihapus'); setDeleteId(null); }
    catch (e) { notify((e as Error).message, 'error'); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-neutral-600">Kelola daftar pengurus LAZISMU Jakarta Pusat.</p>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Pengurus</button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-white" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-neutral-400">Belum ada pengurus.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="relative aspect-[4/3] bg-lazismu-cream">
                {p.foto ? <img src={p.foto} alt={p.nama} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-lazismu-green/30"><UserCircle2 className="h-14 w-14" /></div>}
              </div>
              <div className="p-4">
                <h3 className="font-serif font-semibold text-lazismu-green">{p.nama}</h3>
                <p className="text-sm font-medium text-lazismu-orange-dark">{p.jabatan}</p>
                {p.masa_jabatan && <p className="mt-0.5 text-xs text-neutral-400">Periode {p.masa_jabatan}</p>}
                <div className="mt-3 flex gap-1.5">
                  <button onClick={() => setEditing({ ...p })} className="flex-1 rounded-lg bg-lazismu-cream-dark py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-lazismu-green hover:text-white"><Pencil className="mx-auto h-3.5 w-3.5" /></button>
                  <button onClick={() => setDeleteId(p.id)} className="flex-1 rounded-lg bg-lazismu-cream-dark py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-red-500 hover:text-white"><Trash2 className="mx-auto h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Pengurus' : 'Tambah Pengurus'}
        footer={<><button onClick={() => setEditing(null)} className="btn-ghost">Batal</button><button onClick={submit} disabled={saving} className="btn-green">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}</button></>}
      >
        {editing && (
          <div className="space-y-4">
            <div><label className="label">Nama</label><input className="input" value={editing.nama || ''} onChange={(e) => setEditing({ ...editing, nama: e.target.value })} /></div>
            <div><label className="label">Jabatan</label><input className="input" value={editing.jabatan || ''} onChange={(e) => setEditing({ ...editing, jabatan: e.target.value })} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Masa Jabatan</label><input className="input" value={editing.masa_jabatan || ''} onChange={(e) => setEditing({ ...editing, masa_jabatan: e.target.value })} /></div>
              <div><label className="label">Urutan</label><input type="number" className="input" value={editing.urutan ?? 0} onChange={(e) => setEditing({ ...editing, urutan: Number(e.target.value) })} /></div>
            </div>
            <ImageUpload value={editing.foto || ''} onChange={(foto) => setEditing({ ...editing, foto })} folder="pengurus" />
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Hapus Pengurus?" message="Data pengurus akan dihapus permanen." onConfirm={confirmDelete} onClose={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
