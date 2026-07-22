import { useEffect, useState } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { LogoFull } from './Logo';
import { useRouter } from '../lib/router';

const NAV = [
  { label: 'Beranda', to: '/' },
  { label: 'Program', to: '/program' },
  { label: 'Pengurus', to: '/pengurus' },
  { label: 'Galeri', to: '/galeri' },
  { label: 'Berita', to: '/berita' },
  { label: 'Tentang', to: '/tentang' },
  { label: 'Kontak', to: '/kontak' },
];

export function Navbar({ onDonate }: { onDonate: () => void }) {
  const { path, navigate } = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  const isActive = (to: string) => (to === '/' ? path === '/' : path.startsWith(to));

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-soft backdrop-blur' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-px flex h-16 items-center justify-between gap-4 lg:h-20">
        <button onClick={() => navigate('/')} className="transition hover:opacity-80" aria-label="Beranda">
          <LogoFull />
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition ${
                isActive(item.to)
                  ? 'text-lazismu-green'
                  : 'text-neutral-600 hover:text-lazismu-green'
              }`}
            >
              {item.label}
              {isActive(item.to) && (
                <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-lazismu-orange" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={onDonate} className="btn-primary hidden sm:inline-flex">
            <Heart className="h-4 w-4" />
            Donasi Sekarang
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-lazismu-green transition hover:bg-lazismu-cream-dark lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-lazismu-cream-dark bg-white lg:hidden">
          <nav className="container-px flex flex-col py-3">
            {NAV.map((item) => (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  isActive(item.to)
                    ? 'bg-lazismu-cream-dark text-lazismu-green'
                    : 'text-neutral-700 hover:bg-lazismu-cream-dark/60'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button onClick={onDonate} className="btn-primary mt-3 w-full">
              <Heart className="h-4 w-4" />
              Donasi Sekarang
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
