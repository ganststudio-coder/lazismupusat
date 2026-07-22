import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, ShieldCheck, UserCog, Crown } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../components/Toast';
import { Modal, ConfirmDialog } from '../../components/Modal';
import { supabase } from '../../lib/supabase';
import type { AdminUser, AdminRole } from '../../lib/types';
import { getSupabaseFunctionUrl } from '../../lib/env';

const LOGIN_URL = getSupabaseFunctionUrl('admin-login');

export function AdminAdmins() {
  const { admin, isMaster } = useAuth();
  const notify = useToast();
  const [list, setList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ new_username: '', new_email: '', new_password: '', new_role: 'regular' as AdminRole });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase.from('admin_users_public').select('*').order('created_at', { ascending: true });
    setList((data as AdminUser[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const addAdmin = async () => {
    if (!form.new_username || !form.new_email || !form.new_password) { notify('Semua field wajib diisi', 'error'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${LOGIN_URL}/create-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ master_username: admin?.username, ...form }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Gagal menambah admin');
      notify('Admin baru ditambahkan');
      setShowAdd(false);
      setForm({ new_username: '', new_email: '', new_password: '', new_role: 'regular' });
      refresh();
    } catch (e) { notify((e as Error).message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${LOGIN_URL}/delete-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ master_username: admin?.username, target_id: deleteTarget.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Gagal menghapus');
      notify('Admin dihapus');
      setDeleteTarget(null);
      refresh();
    } catch (e) { notify((e as Error).message, 'error'); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600">Kelola akun admin ({list.length}/4).</p>
          {!isMaster && <p className="mt-1 text-xs text-neutral-400">Hanya master yang dapat menambah/menghapus admin.</p>}
        </div>
        {isMaster && list.length < 4 && (
          <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Admin</button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />)}</div>
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a.id} className="card flex items-center gap-4 p-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold uppercase ${a.role === 'master' ? 'bg-lazismu-orange text-white' : 'bg-lazismu-green/10 text-lazismu-green'}`}>
                {a.username.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-semibold text-lazismu-green">{a.username}</h3>
                  {a.role === 'master' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-lazismu-orange/10 px-2 py-0.5 text-[10px] font-semibold text-lazismu-orange-dark"><Crown className="h-3 w-3" /> Master</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-lazismu-green/10 px-2 py-0.5 text-[10px] font-semibold text-lazismu-green"><UserCog className="h-3 w-3" /> Regular</span>
                  )}
                  {a.username === admin?.username && <span className="text-[10px] text-neutral-400">(Anda)</span>}
                </div>
                <p className="mt-0.5 truncate text-sm text-neutral-500">{a.email}</p>
              </div>
              {isMaster && a.role !== 'master' && (
                <button onClick={() => setDeleteTarget(a)} className="rounded-lg p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Tambah Admin Baru"
        footer={<><button onClick={() => setShowAdd(false)} className="btn-ghost">Batal</button><button onClick={addAdmin} disabled={saving} className="btn-green">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tambah'}</button></>}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-xl bg-lazismu-orange/5 p-3 text-xs text-neutral-600">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lazismu-orange" />
            <p>Total akun admin maksimal 4. Master tidak dapat dihapus.</p>
          </div>
          <div><label className="label">Username</label><input className="input" value={form.new_username} onChange={(e) => setForm({ ...form, new_username: e.target.value })} /></div>
          <div><label className="label">Email</label><input type="email" className="input" value={form.new_email} onChange={(e) => setForm({ ...form, new_email: e.target.value })} /></div>
          <div><label className="label">Password</label><input type="password" className="input" value={form.new_password} onChange={(e) => setForm({ ...form, new_password: e.target.value })} /></div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.new_role} onChange={(e) => setForm({ ...form, new_role: e.target.value as AdminRole })}>
              <option value="regular">Regular</option>
              <option value="master">Master</option>
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Admin?"
        message={`Hapus akun "${deleteTarget?.username}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
