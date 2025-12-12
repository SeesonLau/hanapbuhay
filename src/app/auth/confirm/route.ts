import { NextRequest, NextResponse } from 'next/server';
import { AuthServiceServer } from '@/lib/services/auth-services-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token_hash');
    const type = searchParams.get('type');

    console.log('Email verification attempt:', { token, type });

    if (type === 'signup' && token) {
      const result = await AuthServiceServer.verifyEmail(token);
      
      if (result.success) {
        return NextResponse.redirect(
          new URL('/login?message=Email+verified+successfully!+You+can+now+sign+in.', request.url)
        );
      } else {
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(result.message || 'Verification failed')}`, request.url)
        );
      }
    }

    return NextResponse.redirect(
      new URL('/login?error=Invalid+verification+link', request.url)
    );
  } catch (error) {
    console.error('Unexpected error in auth confirm route:', error);
    return NextResponse.redirect(
      new URL('/login?error=An+unexpected+error+occurred+during+verification', request.url)
    );
  }
}