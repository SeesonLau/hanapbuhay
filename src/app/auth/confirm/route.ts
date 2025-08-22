import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth-services';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (type === 'signup' && token) {
    const result = await AuthService.verifyEmail(token);
    
    if (result.success) {
      return NextResponse.redirect(new URL('/login?message=email_verified', request.url));
    } else {
      return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
    }
  }

  return NextResponse.redirect(new URL('/login', request.url));
}
