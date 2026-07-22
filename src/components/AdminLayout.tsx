import { useEffect, useState, type ReactNode } from 'react';
import { LayoutDashboard, FolderKanban, Users, Images, Newspaper, SlidersHorizontal, Phone, Calculator, Wallet, UserCog, LogOut, Menu, X, Home } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useRouter } from '../lib/router';
import { Logo } from './Logo';

const MENU = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/programs', label: 'Program', icon: FolderKanban },
  { to: '/admin/pengurus', label: 'Pengurus', icon: Users },
  { to: '/admin/galeri', label: 'Galeri', icon: Images },
  { to: '/admin/berita', label: 'Berita', icon: Newspaper },
  { to: '/admin/slides', label: 'Slide Dashboard', icon: SlidersHorizontal },
  { to: '/admin/kontak', label: 'Pengaturan Kontak', icon: Phone },
  { to: '/admin/zakat', label: 'Pengaturan Zakat', icon: Calculator },
  { to: '/admin/donasi', label: 'Metode Donasi', icon: Wallet },
  { to: '/admin/admins', label: 'Manajemen Admin', icon: UserCog, masterOnly: true },
];

export function AdminLayout({ children, active }: { children: ReactNode; active: string }) {
  const { admin, logout, isMaster } = useAuth();
  const { navigate } = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [active]);

  const menu = MENU.filter((m) => !m.masterOnly || isMaster);

  return (
    <div className="min-h-screen bg-lazismu-cream">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-lazismu-green text-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-5">
              <div className="flex items-center gap-2.5">
                <Logo className="h-9 w-9" />
                <div className="leading-tight">
                  <div className="font-serif text-base font-semibold">LAZISMU</div>
                  <div className="text-[10px] uppercase tracking-wider text-lazismu-orange-light">Admin Panel</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {menu.map((m) => {
                const Icon = m.icon;
                const isActive = active === m.to;
                return (
                  <button
                    key={m.to}
                    onClick={() => navigate(m.to)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                      isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {m.label}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-3">
              <div className="rounded-xl bg-white/10 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lazismu-orange text-sm font-bold uppercase">
                    {admin?.username.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{admin?.username}</p>
                    <p className="text-[10px] uppercase tracking-wider text-lazismu-orange-light">{admin?.role}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => navigate('/')} className="flex-1 rounded-lg bg-white/10 px-2 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/20">
                    <Home className="mx-auto h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => { logout(); navigate('/'); }} className="flex-1 rounded-lg bg-white/10 px-2 py-1.5 text-xs font-medium text-white/80 transition hover:bg-red-500/80">
                    <LogOut className="mx-auto h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

        {/* Main */}
        <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur lg:px-6">
            <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-lazismu-green hover:bg-lazismu-cream-dark lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-serif text-lg font-semibold text-lazismu-green">
              {MENU.find((m) => m.to === active)?.label ?? 'Admin'}
            </h1>
          </header>
          <div className="flex-1 p-4 lg:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
