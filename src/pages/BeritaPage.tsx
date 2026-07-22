import { useState } from 'react';
import { Calendar, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useBerita, useBeritaDetail } from '../lib/data';
import { formatDate } from '../lib/utils';
import { useRouter } from '../lib/router';
import type { Berita } from '../lib/types';

export function BeritaPage() {
  const { data: berita, loading } = useBerita();
  const { navigate } = useRouter();
  const [q, setQ] = useState('');

  const filtered = (berita ?? []).filter(
    (b) => b.judul.toLowerCase().includes(q.toLowerCase()) || (b.ringkasan ?? '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container-px py-12">
      <span className="section-eyebrow"><span className="h-px w-8 bg-lazismu-orange" /> Kabar terbaru</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="section-title">Berita & Kegiatan</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari berita..." className="input pl-9" />
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-neutral-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-neutral-500">Tidak ada berita yang cocok.</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <BeritaCard key={b.id} berita={b} onClick={() => navigate(`/berita/${b.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

export function BeritaCard({ berita, onClick }: { berita: Berita; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group card overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {berita.foto ? (
          <img src={berita.foto} alt={berita.judul} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center bg-lazismu-cream text-neutral-300"><Calendar className="h-10 w-10" /></div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(berita.tanggal)}
        </div>
        <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-lazismu-green">{berita.judul}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-neutral-600">{berita.ringkasan}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-lazismu-orange transition group-hover:gap-2">
          Baca selengkapnya <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
}

export function BeritaDetailPage({ id }: { id: string }) {
  const { data: berita, loading } = useBeritaDetail(id);
  const { navigate } = useRouter();

  if (loading) return <div className="container-px py-20"><div className="mx-auto h-80 max-w-3xl animate-pulse rounded-2xl bg-neutral-100" /></div>;
  if (!berita) return <div className="container-px py-20 text-center text-sm text-neutral-500">Berita tidak ditemukan. <button onClick={() => navigate('/berita')} className="text-lazismu-orange underline">Kembali</button></div>;

  return (
    <article className="container-px py-12">
      <button onClick={() => navigate('/berita')} className="btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" /> Kembali ke berita
      </button>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Calendar className="h-3.5 w-3.5" /> {formatDate(berita.tanggal)}
        </div>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-lazismu-green sm:text-4xl">{berita.judul}</h1>
        {berita.foto && (
          <div className="mt-6 overflow-hidden rounded-2xl bg-neutral-100">
            <img src={berita.foto} alt={berita.judul} className="aspect-[16/9] w-full object-cover" />
          </div>
        )}
        {berita.ringkasan && <p className="mt-6 border-l-3 border-lazismu-orange pl-4 text-lg font-medium leading-relaxed text-neutral-700">{berita.ringkasan}</p>}
        {berita.isi && (
          <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-700 whitespace-pre-line">
            {berita.isi}
          </div>
        )}
      </div>
    </article>
  );
}
