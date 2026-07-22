import { useEffect, useState } from 'react';
import { FolderKanban, Users, Images, Newspaper, TrendingUp, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { formatRupiah, formatDate } from '../../lib/utils';
import { useRouter } from '../../lib/router';

export function AdminDashboard() {
  const { admin } = useAuth();
  const { navigate } = useRouter();
  const [counts, setCounts] = useState({ programs: 0, pengurus: 0, galeri: 0, berita: 0 });
  const [raised, setRaised] = useState(0);
  const [chats, setChats] = useState<{ pertanyaan: string; status: string; created_at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const [p, pg, g, b] = await Promise.all([
        supabase.from('programs').select('*', { count: 'exact', head: true }),
        supabase.from('pengurus').select('*', { count: 'exact', head: true }),
        supabase.from('galeri').select('*', { count: 'exact', head: true }),
        supabase.from('berita').select('*', { count: 'exact', head: true }),
      ]);
      setCounts({
        programs: p.count ?? 0,
        pengurus: pg.count ?? 0,
        galeri: g.count ?? 0,
        berita: b.count ?? 0,
      });
      const { data: progs } = await supabase.from('programs').select('dana_terkumpul');
      setRaised((progs ?? []).reduce((s, x) => s + (x.dana_terkumpul || 0), 0));
      const { data: logs } = await supabase
        .from('zakat_chat_logs')
        .select('pertanyaan, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      setChats(logs ?? []);
    })();
  }, []);

  const cards = [
    { label: 'Program', value: counts.programs, icon: FolderKanban, to: '/admin/programs' },
    { label: 'Pengurus', value: counts.pengurus, icon: Users, to: '/admin/pengurus' },
    { label: 'Galeri', value: counts.galeri, icon: Images, to: '/admin/galeri' },
    { label: 'Berita', value: counts.berita, icon: Newspaper, to: '/admin/berita' },
  ];

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-lazismu-green to-lazismu-green-light p-6 text-white">
          <div>
            <p className="text-sm text-white/70">Selamat datang kembali,</p>
            <h2 className="font-serif text-2xl font-semibold">{admin?.username}</h2>
            <p className="mt-1 text-xs text-white/60 capitalize">Role: {admin?.role}</p>
          </div>
          <div className="hidden rounded-2xl bg-white/15 p-4 text-right backdrop-blur sm:block">
            <p className="text-xs text-white/70">Total dana terkumpul</p>
            <p className="font-serif text-xl font-semibold">{formatRupiah(raised)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button key={c.label} onClick={() => navigate(c.to)} className="card group flex items-center gap-4 p-5 text-left transition hover:-translate-y-1 hover:shadow-lift">
              <div className="inline-flex rounded-xl bg-lazismu-orange/10 p-3 text-lazismu-orange-dark transition group-hover:bg-lazismu-orange group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-2xl font-semibold text-lazismu-green">{c.value}</p>
                <p className="text-xs text-neutral-500">{c.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-lazismu-orange" />
            <h3 className="font-serif text-lg font-semibold text-lazismu-green">Pertanyaan AI Terbaru</h3>
          </div>
          {chats.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-400">Belum ada pertanyaan masuk.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {chats.map((c, i) => (
                <div key={i} className="rounded-xl border border-neutral-100 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`rounded-full px-2 py-0.5 font-medium ${c.status === 'ok' ? 'bg-lazismu-green/10 text-lazismu-green' : c.status === 'inactive' ? 'bg-neutral-100 text-neutral-500' : 'bg-red-50 text-red-500'}`}>
                      {c.status === 'ok' ? 'Aktif' : c.status === 'inactive' ? 'AI nonaktif' : 'Error'}
                    </span>
                    <span className="text-neutral-400">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-neutral-700 line-clamp-2">{c.pertanyaan}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-lazismu-orange" />
            <h3 className="font-serif text-lg font-semibold text-lazismu-green">Aksi Cepat</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Tambah Program', to: '/admin/programs' },
              { label: 'Tambah Berita', to: '/admin/berita' },
              { label: 'Tambah Pengurus', to: '/admin/pengurus' },
              { label: 'Kelola Slide', to: '/admin/slides' },
              { label: 'Pengaturan Zakat', to: '/admin/zakat' },
              { label: 'Metode Donasi', to: '/admin/donasi' },
            ].map((q) => (
              <button key={q.to} onClick={() => navigate(q.to)} className="rounded-xl border border-neutral-200 p-3 text-left text-sm font-medium text-neutral-700 transition hover:border-lazismu-green/30 hover:bg-lazismu-cream">
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
