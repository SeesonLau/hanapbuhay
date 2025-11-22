// THIS IS forgot-password page

'use client';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#141515' }}>
      {/* Left side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-transparent p-8">
        <div className="relative w-full max-w-lg h-[32rem] flex items-center justify-center">
          <Image
            src="/image/login-illustration.svg"
            alt="Password reset illustration"
            width={500}
            height={500}
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Right side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
          {/* Back to Login */}
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 text-gray-neutral600 hover:text-gray-neutral800 mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>

          <ForgotPasswordForm 
            onBackToLogin={() => window.location.href = '/login'}
          />
        </div>
      </div>
    </div>
  );
}