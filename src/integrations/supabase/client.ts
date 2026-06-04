import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://fiuoxztizdbttjkjektk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpdW94enRpemRidHRqa2pla3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjQxNjgsImV4cCI6MjA5NTQ0MDE2OH0.8HxVJjQLswb4f_YzNRMfCt8w37oWLFUaLgkSbw7oCwI";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
