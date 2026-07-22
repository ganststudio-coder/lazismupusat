import { useMemo, useState } from 'react';
import { Calculator, Coins, Briefcase, Wheat, Sparkles } from 'lucide-react';
import { useZakatSettings } from '../lib/data';
import { formatRupiah } from '../lib/utils';

type Tab = 'maal' | 'profesi' | 'fitrah';

export function ZakatCalculator() {
  const { zakat } = useZakatSettings();
  const [tab, setTab] = useState<Tab>('maal');

  const [harta, setHarta] = useState('');
  const [gaji, setGaji] = useState('');
  const [jiwa, setJiwa] = useState('1');

  const hargaEmas = zakat?.harga_emas_per_gram ?? 1350000;
  const hargaBeras = zakat?.harga_beras_per_kg ?? 15000;

  const result = useMemo(() => {
    if (tab === 'maal') {
      const h = Number(harta) || 0;
      const nisab = 85 * hargaEmas;
      const wajib = h >= nisab;
      const zakat = wajib ? Math.round(0.025 * h) : 0;
      return { nisab, wajib, zakat };
    }
    if (tab === 'profesi') {
      const g = Number(gaji) || 0;
      const nisabTahunan = 653 * hargaBeras;
      const nisabBulanan = Math.round(nisabTahunan / 12);
      const wajib = g >= nisabBulanan;
      const zakat = wajib ? Math.round(0.025 * g) : 0;
      return { nisab: nisabBulanan, wajib, zakat };
    }
    const j = Math.max(1, Number(jiwa) || 0);
    const zakat = Math.round(j * 2.5 * hargaBeras);
    return { nisab: 2.5 * hargaBeras, wajib: true, zakat };
  }, [tab, harta, gaji, jiwa, hargaEmas, hargaBeras]);

  const tabs: { id: Tab; label: string; icon: typeof Coins }[] = [
    { id: 'maal', label: 'Zakat Maal', icon: Coins },
    { id: 'profesi', label: 'Zakat Profesi', icon: Briefcase },
    { id: 'fitrah', label: 'Zakat Fitrah', icon: Wheat },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-neutral-100 bg-lazismu-cream px-5 py-4">
        <div className="rounded-xl bg-lazismu-orange/15 p-2">
          <Calculator className="h-5 w-5 text-lazismu-orange-dark" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-lazismu-green">Kalkulator Zakat</h3>
          <p className="text-xs text-neutral-500">Hitung kewajiban zakat Anda secara akurat.</p>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-lazismu-cream-dark/60 p-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-semibold transition ${
                  isActive ? 'bg-white text-lazismu-green shadow-soft' : 'text-neutral-600 hover:text-lazismu-green'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.replace('Zakat ', '')}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-4">
          {tab === 'maal' && (
            <Field label="Total harta (tabungan, emas, investasi)" value={harta} onChange={setHarta} />
          )}
          {tab === 'profesi' && (
            <Field label="Penghasilan per bulan" value={gaji} onChange={setGaji} />
          )}
          {tab === 'fitrah' && (
            <Field label="Jumlah jiwa dalam keluarga" value={jiwa} onChange={setJiwa} />
          )}

          <div className="rounded-2xl bg-lazismu-cream p-4 text-xs text-neutral-600">
            {tab === 'maal' && (
              <>Nisab Zakat Maal = 85 gram × harga emas ({formatRupiah(hargaEmas)}/g) = <strong className="text-lazismu-green">{formatRupiah(result.nisab)}</strong></>
            )}
            {tab === 'profesi' && (
              <>Nisab bulanan = (653 kg × harga beras) ÷ 12 = <strong className="text-lazismu-green">{formatRupiah(result.nisab)}</strong></>
            )}
            {tab === 'fitrah' && (
              <>Zakat Fitrah = jumlah jiwa × 2,5 kg × harga beras ({formatRupiah(hargaBeras)}/kg)</>
            )}
          </div>

          <div className={`rounded-2xl p-4 text-center transition ${result.wajib && result.zakat > 0 ? 'bg-lazismu-green text-white' : 'bg-neutral-100 text-neutral-600'}`}>
            <p className="text-xs uppercase tracking-wider opacity-80">
              {tab === 'fitrah' ? 'Zakat Fitrah' : result.wajib ? 'Zakat Wajib Dibayar' : 'Belum Mencapai Nisab'}
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
              {formatRupiah(result.zakat)}
            </p>
            {tab !== 'fitrah' && !result.wajib && (
              <p className="mt-1 text-xs opacity-80">Harta/penghasilan belum mencapai batas nisab.</p>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-lazismu-orange/5 p-3 text-xs text-neutral-600">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lazismu-orange" />
            <p>Perhitungan menggunakan harga emas & beras yang ditetapkan admin LAZISMU Jakarta Pusat. Hasil bersifat estimasi — silakan konsultasi untuk perhitungan final.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-400">Rp</span>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="input pl-9 text-right font-mono"
        />
      </div>
    </div>
  );
}
