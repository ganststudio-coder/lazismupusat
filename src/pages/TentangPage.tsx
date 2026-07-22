import { Target, Eye, Heart, ShieldCheck, HandHeart, Users, BookOpen, Sparkles } from 'lucide-react';
import { useRouter } from '../lib/router';

export function TentangPage() {
  const { navigate } = useRouter();

  return (
    <div>
      <section className="relative overflow-hidden bg-lazismu-green py-16 text-white">
        <div className="absolute inset-0 -z-10 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="container-px">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Tentang kami
          </span>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
            Lembaga Amil Zakat resmi Muhammadiyah Jakarta Pusat
          </h1>
          <p className="mt-5 max-w-2xl text-white/80">
            LAZISMU Jakarta Pusat hadir untuk mengelola dana zakat, infaq, dan wakaf umat secara
            profesional, amanah, dan transparan, demi mewujudkan kesejahteraan umat di wilayah
            Jakarta Pusat.
          </p>
        </div>
      </section>

      <section className="container-px py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: <Eye className="h-5 w-5" />, title: 'Visi', text: 'Menjadi lembaga amil zakat profesional yang mewujudkan kemandirian dan kesejahteraan umat di Jakarta Pusat.' },
            { icon: <Target className="h-5 w-5" />, title: 'Misi', text: 'Mengelola dana ZISWAF secara amanah, transparan, dan tepat sasaran untuk pemberdayaan umat.' },
            { icon: <Heart className="h-5 w-5" />, title: 'Nilai', text: 'Amanah, profesional, transparan, dan berorientasi pada pemberdayaan masyarakat.' },
          ].map((v) => (
            <div key={v.title} className="card p-6">
              <div className="inline-flex rounded-xl bg-lazismu-orange/10 p-2.5 text-lazismu-orange-dark">{v.icon}</div>
              <h3 className="mt-4 font-serif text-xl font-semibold text-lazismu-green">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-lazismu-cream-dark/40 py-14">
        <div className="container-px grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="section-eyebrow"><span className="h-px w-8 bg-lazismu-orange" /> Profil</span>
            <h2 className="section-title">Sejarah Singkat</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-700">
              <p>LAZISMU (Lembaga Amil Zakat Muhammadiyah) adalah lembaga amil zakat resmi yang dikelola oleh Persyarikatan Muhammadiyah. LAZISMU Jakarta Pusat merupakan unit wilayah yang melayani umat di Jakarta Pusat.</p>
              <p>Berdiri dengan komitmen mengelola dana zakat, infaq, dan wakaf secara profesional, LAZISMU Jakarta Pusat telah menyalurkan bantuan kepada ribuan penerima manfaat melalui berbagai program pendidikan, sosial, dan kemanusiaan.</p>
              <p>Setiap penyaluran dilaporkan secara terbuka kepada muzakki dan donatur sebagai bentuk akuntabilitas dan transparansi pengelolaan dana umat.</p>
            </div>
            <button onClick={() => navigate('/program')} className="btn-green mt-6">Lihat program kami</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <ShieldCheck className="h-5 w-5" />, value: 'Resmi', label: 'Lembaga amil berizin' },
              { icon: <HandHeart className="h-5 w-5" />, value: '100+', label: 'Penerima manfaat' },
              { icon: <Users className="h-5 w-5" />, value: 'Amanah', label: 'Pengelolaan transparan' },
              { icon: <BookOpen className="h-5 w-5" />, value: 'Syariah', label: 'Sesuai syariat Islam' },
            ].map((s, i) => (
              <div key={i} className={`card p-5 ${i % 2 === 1 ? 'mt-6' : ''}`}>
                <div className="inline-flex rounded-xl bg-lazismu-green/10 p-2 text-lazismu-green">{s.icon}</div>
                <p className="mt-3 font-serif text-xl font-semibold text-lazismu-green">{s.value}</p>
                <p className="text-xs text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
