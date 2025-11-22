// app/signup/page.tsx
'use client';

import { Suspense } from 'react';
import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';
import Image from 'next/image';

function SignupContent() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#141515' }}>
      {/* Left side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl px-8 py-6 shadow-xl">
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

          <SignupForm />
        </div>
      </div>
      
      {/* Right side - Signup Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-transparent p-8">
        <div className="relative w-full max-w-lg h-[32rem] flex items-center justify-center">
          <Image
            src="/image/signup-illustration.svg"
            alt="Sign up illustration"
            width={500}
            height={500}
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#141515' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}