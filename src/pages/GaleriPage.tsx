import { useState } from 'react';
import { Images } from 'lucide-react';
import { useGaleri } from '../lib/data';

export function GaleriPage() {
  const { data: galeri, loading } = useGaleri();
  const [lightbox, setLightbox] = useState<string | null>(null);

  const categories = ['Semua', ...Array.from(new Set((galeri ?? []).map((g) => g.kategori).filter(Boolean))) as string[]];
  const [cat, setCat] = useState('Semua');
  const items = (galeri ?? []).filter((g) => cat === 'Semua' || g.kategori === cat);

  return (
    <div className="container-px py-12">
      <span className="section-eyebrow"><span className="h-px w-8 bg-lazismu-orange" /> Dokumentasi</span>
      <h1 className="section-title">Galeri Kegiatan</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">Dokumentasi penyaluran program dan kegiatan LAZISMU Jakarta Pusat.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              cat === c ? 'bg-lazismu-green text-white' : 'bg-white text-neutral-600 ring-1 ring-neutral-200 hover:bg-lazismu-cream-dark'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-neutral-100" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-lazismu-cream p-10 text-center">
          <Images className="mx-auto h-10 w-10 text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">Belum ada foto galeri.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g) => (
            <button
              key={g.id}
              onClick={() => setLightbox(g.image_url)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 transition hover:shadow-lift"
            >
              <img src={g.image_url} alt={g.caption || ''} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-lazismu-green-dark/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              {g.caption && (
                <p className="absolute inset-x-0 bottom-0 p-3 text-left text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                  {g.caption}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-lazismu-green-dark/80 p-4 backdrop-blur-sm animate-fadeIn" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-h-[88vh] max-w-4xl rounded-2xl object-contain shadow-lift animate-scaleIn" />
        </div>
      )}
    </div>
  );
}
