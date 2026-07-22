import { useEffect, useState } from 'react';
import { X, Copy, Check, Landmark, QrCode, Wallet, CreditCard, Building2, Heart } from 'lucide-react';
import { useDonasiMetode } from '../lib/data';
import type { DonasiTipe } from '../lib/types';

const TABS: { tipe: DonasiTipe; label: string; icon: typeof Landmark }[] = [
  { tipe: 'rekening', label: 'No. Rekening', icon: Landmark },
  { tipe: 'qris', label: 'QRIS', icon: QrCode },
  { tipe: 'gopay', label: 'GoPay', icon: Wallet },
  { tipe: 'debit', label: 'Kartu Debit', icon: CreditCard },
  { tipe: 'va', label: 'Virtual Account', icon: Building2 },
];

export function DonationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: metode, loading } = useDonasiMetode();
  const [active, setActive] = useState<DonasiTipe>('rekening');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setActive('rekening');
      setCopied(null);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const list = metode?.filter((m) => m.tipe === active) ?? [];
  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-lazismu-green-dark/60 p-0 backdrop-blur-sm animate-fadeIn sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-lift animate-scaleIn sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-lazismu-green px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-2">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold">Donasi Sekarang</h3>
              <p className="text-xs text-white/70">Pilih metode donasi yang paling mudah untuk Anda.</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-neutral-100 px-3 py-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.tipe;
            return (
              <button
                key={t.tipe}
                onClick={() => setActive(t.tipe)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
                  isActive ? 'bg-lazismu-orange text-white' : 'text-neutral-600 hover:bg-lazismu-cream-dark'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-5">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-neutral-100" />)}
            </div>
          ) : list.length === 0 ? (
            <div className="rounded-2xl bg-lazismu-cream p-6 text-center text-sm text-neutral-500">
              Metode ini belum tersedia. Silakan hubungi admin LAZISMU.
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((m) => (
                <div key={m.id} className="rounded-2xl border border-neutral-200 p-4 transition hover:border-lazismu-green/30 hover:shadow-soft">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-lazismu-orange">{m.label}</p>
                      <p className="mt-1 font-mono text-base font-semibold text-neutral-900 break-all">{m.nilai}</p>
                      {m.catatan && <p className="mt-1 text-xs text-neutral-500">{m.catatan}</p>}
                    </div>
                    <button
                      onClick={() => copy(m.nilai, m.id)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-lazismu-green/10 px-3 py-2 text-xs font-semibold text-lazismu-green transition hover:bg-lazismu-green hover:text-white"
                    >
                      {copied === m.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied === m.id ? 'Disalin' : 'Salin'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 rounded-2xl bg-lazismu-cream p-4 text-center text-xs text-neutral-500">
            Konfirmasi donasi Anda dengan mengirim bukti transfer ke kontak resmi LAZISMU Jakarta Pusat. Jazakumullah khairan.
          </div>
        </div>
      </div>
    </div>
  );
}
