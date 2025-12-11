// app/auth/confirm/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as 'signup' | 'email' | 'recovery' | 'invite' | 'email_change' | 'magiclink' | null;

    console.log('Auth confirm - params:', { token_hash: !!token_hash, type });

    if (!token_hash || !type) {
      return NextResponse.redirect(
        new URL('/login?error=Invalid+verification+link', request.url)
      );
    }

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

    // Verify the OTP token and establish session
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (error) {
      console.error('Token verification error:', error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message || 'Verification failed')}`, request.url)
      );
    }

    console.log('✅ Token verified successfully', { hasSession: !!data.session, type });

    // Handle different verification types
    if (type === 'recovery') {
      // For password recovery, redirect to reset password page
      // Session is already established by verifyOtp
      return NextResponse.redirect(
        new URL('/reset-password?verified=true', request.url)
      );
    }

    // For signup/email verification
    return NextResponse.redirect(
      new URL('/login?message=Email+verified+successfully!+You+can+now+sign+in.', request.url)
    );
  } catch (error) {
    console.error('Unexpected error in auth confirm route:', error);
    return NextResponse.redirect(
      new URL('/login?error=An+unexpected+error+occurred+during+verification', request.url)
    );
  }
}