// app/reset-password/page.tsx
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/services/supabase/client';
import { toast } from 'react-hot-toast';
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

function ResetPasswordContent() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        console.log('Reset password - checking session:', { 
          hasSession: !!session, 
          verified: searchParams.get('verified'),
          error: sessionError?.message 
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Session expired. Please request a new password reset link.');
          setLoading(false);
          return;
        }

        if (!session) {
          console.error('No active session found');
          setError('No active session. Please click the reset link in your email again.');
          setLoading(false);
          return;
        }

        // Check if this is a recovery session
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('Invalid session. Please request a new password reset link.');
          setLoading(false);
          return;
        }

        console.log('✅ Valid recovery session found for user:', user.email);
        setLoading(false);
      } catch (err: any) {
        console.error('Error checking session:', err);
        setError('An error occurred. Please try again.');
        setLoading(false);
      }
    };

    checkSession();
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password update error:', error);
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully!');
        
        // Sign out and redirect to login
        await supabase.auth.signOut();
        setTimeout(() => {
          router.push('/login?message=Password+updated!+Please+sign+in+with+your+new+password.');
        }, 1000);
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          background: `linear-gradient(135deg, ${theme.banner.gradientStart} 0%, ${theme.banner.gradientMid} 50%, ${theme.banner.gradientEnd} 100%)`
        }}
      >
        <Preloader isVisible={true} message="Verifying reset link..." variant="default" />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          background: `linear-gradient(135deg, ${theme.banner.gradientStart} 0%, ${theme.banner.gradientMid} 50%, ${theme.banner.gradientEnd} 100%)`
        }}
      >
        <div 
          className="w-full max-w-md rounded-2xl p-8 shadow-2xl text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h2>
            <p className="text-gray-300 mb-6">{error}</p>
          </div>
          <button
            onClick={() => router.push('/forgot-password')}
            className="w-full px-4 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: `linear-gradient(135deg, ${theme.banner.gradientStart} 0%, ${theme.banner.gradientMid} 50%, ${theme.banner.gradientEnd} 100%)`
      }}
    >
      <div 
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Reset Your Password
        </h2>
        <p className="text-gray-300 text-sm text-center mb-6">
          Enter your new password below
        </p>

        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter new password (min. 8 characters)"
              required
              minLength={8}
              disabled={isUpdating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Confirm new password"
              required
              minLength={8}
              disabled={isUpdating}
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full px-4 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: theme.colors.primary }}
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating Password...
              </span>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}