// app/forgot-password/page.tsx
'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';
import FloatingLines from '../login/FloatingLines';

function ForgotPasswordContent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      <Preloader isVisible={loading} message={PreloaderMessages.PROCESSING} variant="default" />
      {/* Floating Lines Background */}
      <div className="absolute inset-0 z-0">
        <FloatingLines 
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[5, 5, 5]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      {/* Centered Forgot Password Form */}
      <div className="w-full flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div 
          className="w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}
        >
          {/* Back to Login */}
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>

          <ForgotPasswordForm 
            onBackToLogin={handleBackToLogin}
            onLoadingChange={setLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      }>
        <ForgotPasswordContent />
      </Suspense>
  );
}
