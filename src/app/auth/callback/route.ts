// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/findJobs';
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  // Handle errors from Supabase
  if (error) {
    console.error('Auth callback error:', error, error_description);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error_description || error)}`, request.url)
    );
  }

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              console.error('Error setting cookies:', error);
            }
          },
        },
      }
    );

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Session exchange error:', exchangeError);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
      );
    }

    if (data?.session) {
      // Successful authentication
      const redirectUrl = new URL(next, request.url);
      
      // Add success message for certain flows
      if (next === '/findJobs') {
        redirectUrl.searchParams.set('message', 'Successfully signed in!');
      } else if (next === '/reset-password') {
        redirectUrl.searchParams.set('message', 'You can now reset your password');
      }

      return NextResponse.redirect(redirectUrl);
    }
  }

  // No code provided or session creation failed
  return NextResponse.redirect(
    new URL('/login?error=Could not authenticate user', request.url)
  );
}