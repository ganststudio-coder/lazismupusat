import { useState } from 'react';
import { Lock, User, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useRouter } from '../../lib/router';
import { LogoFull } from '../../components/Logo';

export function AdminLogin() {
  const { login } = useAuth();
  const { navigate } = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(username.trim(), password);
    setLoading(false);
    if (res.ok) navigate('/admin');
    else setError(res.error || 'Login gagal');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-lazismu-green px-4">
      <div className="absolute inset-0 -z-10 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }} />

      <div className="w-full max-w-md">
        <button onClick={() => navigate('/')} className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Kembali ke situs
        </button>

        <div className="card overflow-hidden">
          <div className="bg-lazismu-cream px-6 py-6 text-center">
            <div className="flex justify-center"><LogoFull /></div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-lazismu-orange/10 px-3 py-1 text-xs font-semibold text-lazismu-orange-dark">
              <ShieldCheck className="h-3.5 w-3.5" /> Panel Admin
            </div>
            <h1 className="mt-3 font-serif text-2xl font-semibold text-lazismu-green">Masuk Admin</h1>
            <p className="mt-1 text-xs text-neutral-500">Silakan masuk dengan akun admin Anda.</p>
          </div>

          <form onSubmit={submit} className="space-y-4 p-6">
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-9"
                  placeholder="admin"
                  autoComplete="username"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-9"
                  placeholder="••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-green w-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</> : <>Masuk</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
