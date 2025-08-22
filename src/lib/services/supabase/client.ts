import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public' // Explicitly specify the schema
  },
  global: {
    // This helps with schema cache issues
    fetch: (...args) => fetch(...args),
  }
});