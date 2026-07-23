import { HandHeart, ArrowRight } from 'lucide-react';
import { usePrograms } from '../lib/data';
import { ProgramCard } from './DashboardPage';
import { useDonationModal } from '../components/PublicLayout';
import { DonationModal } from '../components/DonationModal';

export function ProgramPage() {
  const { data: programs, loading } = usePrograms();
  const { open, openDonation, closeDonation } = useDonationModal();

  const categories = ['Semua', ...Array.from(new Set((programs ?? []).map((p) => p.kategori).filter(Boolean))) as string[]];
  const groups = categories.map((c) => ({
    kategori: c,
    items: (programs ?? []).filter((p) => c === 'Semua' || p.kategori === c),
  }));

  return (
    <div className="container-px py-12">
      <span className="section-eyebrow"><span className="h-px w-8 bg-lazismu-orange" /> Program LAZISMU</span>
      <h1 className="section-title">Program & Penyaluran Dana</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">
        Beragam program pemberdayaan umat yang dijalankan LAZISMU Jakarta Pusat. Dukung program
        pilihan Anda dengan berdonasi.
      </p>

      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-neutral-100" />)}
        </div>
      ) : (programs ?? []).length === 0 ? (
        <div className="mt-10 rounded-2xl bg-lazismu-cream p-10 text-center">
          <HandHeart className="mx-auto h-10 w-10 text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">Belum ada program aktif.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.filter((g) => g.items.length > 0).map((g) => (
            <div key={g.kategori}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold text-lazismu-green">{g.kategori}</h2>
                <span className="text-xs text-neutral-400">{g.items.length} program</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((p) => (
                  <ProgramCard key={p.id} program={p} onClick={openDonation} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-14 rounded-3xl bg-lazismu-green px-6 py-10 text-center text-white">
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Ingin berkontribusi langsung?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">Salurkan donasi untuk program pilihan Anda melalui kanal resmi kami.</p>
        <button onClick={openDonation} className="mt-5 inline-flex items-center gap-2 rounded-full bg-lazismu-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-lazismu-orange-dark">
          Donasi Sekarang <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <DonationModal open={open} onClose={closeDonation} />
    </div>
  );
}
