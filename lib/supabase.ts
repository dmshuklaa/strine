import { createClient } from '@supabase/supabase-js';
import { Config } from '@/constants/Config';

export const supabase = createClient(Config.supabaseUrl, Config.supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
