import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { LogoFull } from './Logo';
import { useRouter } from '../lib/router';
import { useKontak } from '../lib/data';

export function Footer() {
  const { navigate } = useRouter();
  const { kontak } = useKontak();

  return (
    <footer className="mt-20 bg-lazismu-green text-white/90">
      <div className="container-px grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur w-fit">
            <LogoFull className="[&_*]:!text-white" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Lembaga Amil Zakat resmi Muhammadiyah Jakarta Pusat. Mengelola zakat, infaq, dan
            wakaf untuk kesejahteraan umat.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-base font-semibold text-white">Navigasi</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {[
              ['Beranda', '/'],
              ['Program', '/program'],
              ['Pengurus', '/pengurus'],
              ['Galeri', '/galeri'],
              ['Berita', '/berita'],
              ['Tentang', '/tentang'],
              ['Kontak', '/kontak'],
            ].map(([l, to]) => (
              <li key={to}>
                <button onClick={() => navigate(to)} className="transition hover:text-lazismu-orange-light">
                  {l}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-base font-semibold text-white">Kontak</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {kontak?.telepon && (
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 text-lazismu-orange-light" />
                <span>{kontak.telepon}</span>
              </li>
            )}
            {kontak?.email && (
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 text-lazismu-orange-light" />
                <span>{kontak.email}</span>
              </li>
            )}
            {kontak?.alamat && (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 text-lazismu-orange-light" />
                <span>{kontak.alamat}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-base font-semibold text-white">Tentang Zakat</h4>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Zakat adalah rukun Islam ketiga. Salurkan zakat, infaq, dan wakaf melalui lembaga
            amil yang amanah dan transparan.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} LAZISMU Jakarta Pusat. Seluruh hak cipta dilindungi.</p>
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-white/40 transition hover:bg-white/10 hover:text-white/70"
          >
            <ShieldCheck className="h-3 w-3" />
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
}
