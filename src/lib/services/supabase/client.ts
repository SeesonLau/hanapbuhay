// src/lib/services/supabase/client.ts

// NOTE: Since this is a client-side Supabase client, we use @supabase/supabase-js
// (If you were using Next.js App Router SSR/Middleware, you'd use @supabase/ssr)
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Add detailed logging
/* console.log('🔧 Supabase Config Check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlLength: supabaseUrl?.length,
  keyLength: supabaseAnonKey?.length,
  urlStart: supabaseUrl?.substring(0, 20) + '...',
  keyStart: supabaseAnonKey?.substring(0, 10) + '...'
}); */

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  throw new Error('Missing Supabase configuration');
}
// Export the INSTANCE of the Supabase client
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public' // Explicitly specify the schema
  },
  global: {
    // This helps with schema cache issues
    fetch: (...args) => fetch(...args),
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Since the hook expects a function named 'createClient', 
// we'll export a function with that name that returns the instance.
// This matches the common pattern used by shadcn/ui and Supabase blocks.
export function createClient() {
    return supabase;
}