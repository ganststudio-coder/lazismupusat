import { Plus, UserCircle2 } from 'lucide-react';
import { usePengurus } from '../lib/data';
import { useAuth } from '../lib/auth';
import { useRouter } from '../lib/router';

export function PengurusPage() {
  const { data: pengurus, loading } = usePengurus();
  const { admin } = useAuth();
  const { navigate } = useRouter();

  return (
    <div className="container-px py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="section-eyebrow"><span className="h-px w-8 bg-lazismu-orange" /> Struktur</span>
          <h1 className="section-title">Pengurus LAZISMU</h1>
          <p className="mt-3 max-w-2xl text-sm text-neutral-600">Tim pengurus LAZISMU Jakarta Pusat periode 2024-2028.</p>
        </div>
        {admin && (
          <button onClick={() => navigate('/admin/pengurus')} className="btn-primary hidden sm:inline-flex">
            <Plus className="h-4 w-4" /> Tambah Pengurus
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-neutral-100" />)}
        </div>
      ) : (pengurus ?? []).length === 0 ? (
        <p className="mt-10 text-center text-sm text-neutral-500">Belum ada data pengurus.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(pengurus ?? []).map((p) => (
            <div key={p.id} className="card group overflow-hidden text-center transition hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-square overflow-hidden bg-lazismu-cream">
                {p.foto ? (
                  <img src={p.foto} alt={p.nama} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-lazismu-green/30">
                    <UserCircle2 className="h-20 w-20" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-lazismu-green/30 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base font-semibold leading-snug text-lazismu-green">{p.nama}</h3>
                <p className="mt-1 text-sm font-medium text-lazismu-orange-dark">{p.jabatan}</p>
                {p.masa_jabatan && <p className="mt-1 text-xs text-neutral-400">Periode {p.masa_jabatan}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {admin && (
        <div className="mt-8 sm:hidden">
          <button onClick={() => navigate('/admin/pengurus')} className="btn-primary w-full">
            <Plus className="h-4 w-4" /> Tambah Pengurus
          </button>
        </div>
      )}
    </div>
  );
}
