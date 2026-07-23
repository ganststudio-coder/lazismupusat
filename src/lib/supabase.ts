import { createClient } from '@supabase/supabase-js';
import { requireSupabaseConfig } from './env';

const { supabaseUrl, supabaseAnonKey } = requireSupabaseConfig();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_ANON_KEY = supabaseAnonKey;
export const ASSETS_BUCKET = 'lazismu-assets';
