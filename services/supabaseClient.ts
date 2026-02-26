import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fvenyoflxkcyubtdymdt.supabase.co';
const supabaseAnonKey = 'sb_publishable__Q1cRd2acybK4hfRuBdklg_buvxU8Du';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const handleSupabaseError = (error: any) => {
  console.error('Supabase Error:', error.message);
  return error.message;
};