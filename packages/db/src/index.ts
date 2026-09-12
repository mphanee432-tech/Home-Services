import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = (
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
) => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createClient(supabaseUrl, supabaseKey);
};

export * from '@repo/types';