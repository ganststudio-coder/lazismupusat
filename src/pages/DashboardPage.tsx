import { Heart, ArrowRight, Target, Users, HandHeart, TrendingUp } from 'lucide-react';
import { useRouter } from '../lib/router';
import { useSlides, usePrograms } from '../lib/data';
import { SlideCarousel } from '../components/SlideCarousel';
import { ZakatCalculator } from '../components/ZakatCalculator';
import { AIChat } from '../components/AIChat';
import { formatRupiah, pct } from '../lib/utils';
import type { Program } from '../lib/types';

export function DashboardPage({ onDonate }: { onDonate: () => void }) {
  const { navigate } = useRouter();
  const { data: slides } = useSlides();
  const { data: programs, loading } = usePrograms();

  const top = (programs ?? []).slice(0, 3);
  const totalRaised = (programs ?? []).reduce((s, p) => s + p.dana_terkumpul, 0);

  return (
    <div>
      {/* Hero + Carousel */}
      <section className="relative overflow-hidden bg-lazismu-cream">
        <div className="absolute inset-0 -z-10 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0F5C3F 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="container-px grid gap-8 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
          <div className="animate-fadeIn">
            <span className="section-eyebrow">
              <span className="h-px w-8 bg-lazismu-orange" /> Lembaga Amil Zakat resmi
            </span>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-lazismu-green sm:text-5xl lg:text-6xl">
              Salurkan Zakat, <span className="text-lazismu-orange">Tebar Kebaikan</span> Bersama LAZISMU
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              LAZISMU Jakarta Pusat mengelola zakat, infaq, dan wakaf secara amanah dan
              transparan untuk kesejahteraan umat di wilayah Jakarta Pusat.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={onDonate} className="btn-primary">
                <Heart className="h-4 w-4" /> Donasi Sekarang
              </button>
              <button onClick={() => navigate('/program')} className="btn-outline">
                Lihat Program <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-9 grid grid-cols-3 gap-3">
              <Stat icon={<HandHeart className="h-4 w-4" />} value={formatRupiah(totalRaised)} label="Dana tersalurkan" />
              <Stat icon={<Target className="h-4 w-4" />} value={`${programs?.length ?? 0}`} label="Program aktif" />
              <Stat icon={<Users className="h-4 w-4" />} value="100+" label="Penerima manfaat" />
            </div>
          </div>

          <div className="animate-slideFade">
            <SlideCarousel slides={slides ?? []} />
          </div>
        </div>
      </section>

      {/* Program Unggulan */}
      <section className="container-px py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="section-eyebrow"><span className="h-px w-8 bg-lazismu-orange" /> Program unggulan</span>
            <h2 className="section-title">Wujudkan Kebaikan Bersama</h2>
          </div>
          <button onClick={() => navigate('/program')} className="btn-ghost hidden sm:inline-flex">
            Semua program <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-neutral-100" />)}
          </div>
        ) : top.length === 0 ? (
          <p className="text-sm text-neutral-500">Belum ada program aktif.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((p) => (
              <ProgramCard key={p.id} program={p} onClick={() => navigate('/program')} />
            ))}
          </div>
        )}
      </section>

      {/* Calculator + AI Chat */}
      <section className="bg-lazismu-cream-dark/40 py-14">
        <div className="container-px">
          <div className="mb-8 text-center">
            <span className="section-eyebrow"><span className="h-px w-8 bg-lazismu-orange" /> Layanan</span>
            <h2 className="section-title">Hitung Zakat & Tanya AI</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600">
              Gunakan kalkulator zakat untuk mengetahui kewajiban Anda, atau tanyakan langsung
              kepada asisten AI kami seputar zakat, infaq, dan wakaf.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ZakatCalculator />
            <AIChat />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-px py-14">
        <div className="relative overflow-hidden rounded-3xl bg-lazismu-green px-6 py-12 text-center text-white shadow-lift sm:px-12">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-lazismu-orange/20" />
          <div className="absolute -bottom-16 -left-8 h-56 w-56 rounded-full bg-lazismu-orange/10" />
          <div className="relative">
            <span className="badge bg-white/15 text-white"><TrendingUp className="h-3 w-3" /> Transparan & amanah</span>
            <h2 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">Setiap Rupiah Anda Menjadi Berkah</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Salurkan zakat, infaq, dan wakaf Anda melalui kanal resmi LAZISMU Jakarta Pusat.
              Setiap penyaluran dilaporkan secara terbuka.
            </p>
            <button onClick={onDonate} className="mt-6 inline-flex items-center gap-2 rounded-full bg-lazismu-orange px-7 py-3.5 text-sm font-semibold text-white shadow-lift transition hover:bg-lazismu-orange-dark">
              <Heart className="h-4 w-4" /> Donasi Sekarang
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-lazismu-green/5">
      <div className="inline-flex rounded-lg bg-lazismu-orange/10 p-1.5 text-lazismu-orange-dark">{icon}</div>
      <p className="mt-2 text-sm font-semibold text-lazismu-green sm:text-base">{value}</p>
      <p className="text-[11px] text-neutral-500">{label}</p>
    </div>
  );
}

export function ProgramCard({ program, onClick }: { program: Program; onClick?: () => void }) {
  const progress = pct(program.dana_terkumpul, program.target_dana);
  return (
    <button onClick={onClick} className="group card overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {program.foto ? (
          <img src={program.foto} alt={program.nama} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-300"><HandHeart className="h-10 w-10" /></div>
        )}
        {program.kategori && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-lazismu-green backdrop-blur">
            {program.kategori}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-lazismu-green">{program.nama}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{program.deskripsi}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-lazismu-orange-dark">{formatRupiah(program.dana_terkumpul)}</span>
            <span className="text-neutral-400">dari {formatRupiah(program.target_dana)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-gradient-to-r from-lazismu-orange to-lazismu-orange-light transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-1.5 text-right text-[11px] font-semibold text-lazismu-green">{progress}% tercapai</div>
        </div>
      </div>
    </button>
  );
}
