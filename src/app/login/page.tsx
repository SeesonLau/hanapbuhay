// app/login/page.tsx
'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const error = searchParams.get('error');

  const handleForgotPassword = () => {
    router.push(ROUTES.FORGOT_PASSWORD);
  };

  const handleSignUp = () => {
    router.push(ROUTES.SIGNUP);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#141515' }}>
      {/* Left side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-transparent p-8">
        <div className="relative w-full max-w-lg h-[32rem] flex items-center justify-center">
          <Image
            src="/image/login-illustration.svg"
            alt="Login illustration"
            width={500}
            height={500}
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
          {/* Back to Home */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-neutral600 hover:text-gray-neutral800 mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          {/* Messages */}
          {message && (
            <div className="mb-6 p-3 rounded-lg bg-success-50 text-success-700 border border-success-200">
              {decodeURIComponent(message)}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-error-50 text-error-700 border border-error-200">
              {decodeURIComponent(error)}
            </div>
          )}

          <LoginForm 
            onForgotPassword={handleForgotPassword}
            onSignUpClick={handleSignUp}
          />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#141515' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}