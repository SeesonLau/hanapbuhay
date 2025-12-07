// app/signup/page.tsx
'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/auth/SignupForm';
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';

const FloatingLines = dynamic(() => import('../login/FloatingLines'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
  ),
});

function SignupContent() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${theme.banner.gradientStart} 0%, ${theme.banner.gradientMid} 50%, ${theme.banner.gradientEnd} 100%)`
      }}
    >
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

      {/* Centered Signup Form */}
      <div className="w-full flex items-center justify-center p-6 relative z-10">
        <div 
          className="w-full max-w-md rounded-2xl px-8 py-6 shadow-2xl mobile-S: px-6 py-4 mobile-M: px-7 py-5 mobile-L: px-8 py-6"
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
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors text-small sm:text-small"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          <SignupForm onSignInClick={handleSignIn} onLoadingChange={setLoading} />
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}