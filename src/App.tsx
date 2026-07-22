import { useEffect, useState, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/auth';
import { ToastProvider } from './components/Toast';
import { RouterProvider, useRouter } from './lib/router';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { DonationModal } from './components/DonationModal';

import { DashboardPage } from './pages/DashboardPage';
import { BeritaPage, BeritaDetailPage } from './pages/BeritaPage';
import { TentangPage } from './pages/TentangPage';
import { ProgramPage } from './pages/ProgramPage';
import { PengurusPage } from './pages/PengurusPage';
import { GaleriPage } from './pages/GaleriPage';
import { KontakPage } from './pages/KontakPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPrograms } from './pages/admin/AdminPrograms';
import { AdminPengurus } from './pages/admin/AdminPengurus';
import { AdminGaleri } from './pages/admin/AdminGaleri';
import { AdminBerita } from './pages/admin/AdminBerita';
import { AdminSlides } from './pages/admin/AdminSlides';
import { AdminKontak } from './pages/admin/AdminKontak';
import { AdminZakat } from './pages/admin/AdminZakat';
import { AdminDonasi } from './pages/admin/AdminDonasi';
import { AdminAdmins } from './pages/admin/AdminAdmins';

function NotFound({ onHome }: { onHome: () => void }) {
  return (
    <div className="container-px py-24 text-center">
      <p className="font-serif text-6xl font-semibold text-lazismu-orange">404</p>
      <p className="mt-3 text-neutral-600">Halaman yang Anda cari tidak ditemukan.</p>
      <button onClick={onHome} className="btn-green mt-6">Kembali ke Beranda</button>
    </div>
  );
}

function AdminGuard({ active, children }: { active: string; children: ReactNode }) {
  const { admin, loading } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!loading && admin && active === '/admin/admins' && admin.role !== 'master') {
      navigate('/admin');
    }
  }, [loading, admin, active, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-lazismu-cream">
        <Loader2 className="h-6 w-6 animate-spin text-lazismu-green" />
      </div>
    );
  }
  if (!admin) return <AdminLogin />;
  return <AdminLayout active={active}>{children}</AdminLayout>;
}

function DonationBridge() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-donasi', handler);
    return () => window.removeEventListener('open-donasi', handler);
  }, []);
  return <DonationModal open={open} onClose={() => setOpen(false)} />;
}

function Routes() {
  const { path, navigate } = useRouter();

  if (path === '/admin' || path.startsWith('/admin/')) {
    const adminPages: Record<string, ReactNode> = {
      '/admin': <AdminDashboard />,
      '/admin/programs': <AdminPrograms />,
      '/admin/pengurus': <AdminPengurus />,
      '/admin/galeri': <AdminGaleri />,
      '/admin/berita': <AdminBerita />,
      '/admin/slides': <AdminSlides />,
      '/admin/kontak': <AdminKontak />,
      '/admin/zakat': <AdminZakat />,
      '/admin/donasi': <AdminDonasi />,
      '/admin/admins': <AdminAdmins />,
    };
    return <AdminGuard active={path}>{adminPages[path] ?? <NotFound onHome={() => navigate('/admin')} />}</AdminGuard>;
  }

  const wrap = (node: ReactNode) => <PublicLayout>{node}</PublicLayout>;

  if (path === '/') return wrap(<DashboardPage onDonate={() => window.dispatchEvent(new CustomEvent('open-donasi'))} />);
  if (path === '/berita') return wrap(<BeritaPage />);
  if (path.startsWith('/berita/')) return wrap(<BeritaDetailPage id={path.split('/')[2] || ''} />);
  if (path === '/tentang') return wrap(<TentangPage />);
  if (path === '/program') return wrap(<ProgramPage />);
  if (path === '/pengurus') return wrap(<PengurusPage />);
  if (path === '/galeri') return wrap(<GaleriPage />);
  if (path === '/kontak') return wrap(<KontakPage />);

  return wrap(<NotFound onHome={() => navigate('/')} />);
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <ToastProvider>
          <DonationBridge />
          <Routes />
        </ToastProvider>
      </RouterProvider>
    </AuthProvider>
  );
}
