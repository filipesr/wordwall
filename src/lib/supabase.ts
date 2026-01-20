import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support multiple env variable naming conventions (Vercel integration uses VITE_PUBLIC_ prefix)
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
                        import.meta.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
                        import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Online features will be disabled.');
  console.warn('Expected: VITE_PUBLIC_SUPABASE_URL and VITE_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isOnline = () => {
  return supabase !== null && navigator.onLine;
};
