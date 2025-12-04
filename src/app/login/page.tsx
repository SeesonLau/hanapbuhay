// app/login/page.tsx
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';
import FloatingLines from './FloatingLines';

function LoginContent() {
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      <Preloader isVisible={loading} message={PreloaderMessages.PROCESSING} variant="default" />
      {/* Floating Lines Background */}
      <div className="absolute inset-0 z-0">
        <FloatingLines 
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[3, 4, 3]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      {/* Centered Login Form */}
      <div className="w-full flex items-center justify-center p-4 relative z-10">
        <div 
          className="w-full max-w-md rounded-2xl p-2 shadow-2xl mobile-S: p-2 mobile-M: p-4 mobile-L: p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}
        >
          {/* Back to Home */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-small text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          {/* Messages */}
          {message && (
            <div 
              className="mb-6 p-3 rounded-lg text-green-100 border"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(16, 185, 129, 0.3)'
              }}
            >
              {decodeURIComponent(message)}
            </div>
          )}
          
          {error && (
            <div 
              className="mb-6 p-3 rounded-lg text-red-100 border"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
            >
              {decodeURIComponent(error)}
            </div>
          )}

          <LoginForm 
            onForgotPassword={handleForgotPassword}
            onSignUpClick={handleSignUp}
            onLoadingChange={(v) => setLoading(v)}
          />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
