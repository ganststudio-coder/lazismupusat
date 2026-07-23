const env = import.meta.env;

export const SUPABASE_URL = (env.VITE_SUPABASE_URL || env.SUPABASE_URL) as string | undefined;
export const SUPABASE_ANON_KEY = (env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY) as string | undefined;

export function requireSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY locally).');
  }

  return {
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
  };
}

export function getSupabaseFunctionUrl(functionName: string, path = '') {
  if (!SUPABASE_URL) {
    throw new Error('Missing Supabase URL. Set SUPABASE_URL (or VITE_SUPABASE_URL locally).');
  }

  const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : '';
  return `${SUPABASE_URL}/functions/v1/${functionName}${normalizedPath}`;
}
