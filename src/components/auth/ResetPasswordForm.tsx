// components/auth/ResetPasswordForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth-services';
import { ROUTES } from '@/lib/constants';
import Button from '@/components/ui/Button';
import TextBox from '@/components/ui/TextBox';
import Image from 'next/image';
import { passwordRequirements } from '@/lib/constants';
import { validatePassword } from '@/lib/utils/validation';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is authenticated (they should be after clicking email link)
    const checkAuth = async () => {
      const user = await AuthService.getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
      } else {
        setError('Session expired. Please request a new password reset link.');
      }
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      setError('Please fix the password requirements below');
      return;
    }

    setLoading(true);

    try {
      const result = await AuthService.updatePassword(password);
      
      if (result.success) {
        router.push(`${ROUTES.LOGIN}?message=${encodeURIComponent('Password reset successful! Please sign in with your new password.')}`);
      } else {
        setError(result.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordRequirements = (pwd: string) => {
    const errors = validatePassword(pwd);
    setPasswordErrors(errors);
  };

  const getRequirementStatus = (requirement: { re: RegExp; label: string }) => {
    const isMet = requirement.re.test(password);
    const isError = passwordErrors.includes(requirement.label);

    return {
      isMet,
      isError,
    };
  };

  if (checkingAuth) {
    return (
      <div className="w-full max-w-md mx-auto px-1 sm:px-2">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-300 text-small">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto px-1 sm:px-2">
        <div className="flex justify-center mb-4">
          <Image
            src="/image/hanapbuhay-logo-notext.svg"
            alt="HanapBuhay Logo"
            width={60}
            height={60}
            priority
            className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px]"
          />
        </div>

        <div className="text-center mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-h4 sm:text-h3 font-bold mb-2 font-alexandria text-white">Session Expired</h1>
          <p className="text-gray-300 text-small sm:text-body mb-6 font-alexandria">
            {error || 'This password reset link has expired or is invalid.'}
          </p>
        </div>

        <Button
          onClick={() => router.push(ROUTES.FORGOT_PASSWORD)}
          className="w-full justify-center"
          variant="primary"
          fullRounded={true}
        >
          Request New Link
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-1 sm:px-2">
      {/* Logo */}
      <div className="flex justify-center mb-1 sm:mb-4">
        <Image
          src="/image/hanapbuhay-logo-notext.svg"
          alt="HanapBuhay Logo"
          width={60}
          height={60}
          priority
          className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px]"
        />
      </div>

      {/* Title */}
      <h1 className="text-h3 tablet:text-h2 font-bold text-white text-center mb-2 font-alexandria">
        Reset Password
      </h1>
      <p className="text-gray-neutral100 font-light text-small sm:text-body text-center mb-2 sm:mb-4 font-alexandria">
        Enter a new password to change your password
      </p>

      {error && (
        <div 
          className="mb-6 p-3 rounded-lg border text-small text-red-100"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(239, 68, 68, 0.3)'
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password */}
        <div>
          <TextBox
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkPasswordRequirements(e.target.value);
            }}
            placeholder="Password"
            enableValidation={false}
            variant="glassmorphism"
          />

          {/* Password Requirements List */}
          {password.length > 0 && (
            <div 
              className="mt-3 p-3 rounded-lg border"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <p className="text-small font-medium text-white mb-2 font-inter">
                Password must contain:
              </p>
              <ul className="space-y-1 text-small font-inter">
                {passwordRequirements.map((requirement, index) => {
                  const status = getRequirementStatus(requirement);
                  return (
                    <li
                      key={index}
                      className="flex items-center"
                      style={{
                        color: status.isMet ? '#46BB27' : status.isError ? '#EE4546' : '#6A706F'
                      }}
                    >
                      <span
                        className="mr-2"
                        style={{
                          color: status.isMet ? '#46BB27' : '#6A706F'
                        }}
                      >
                        {status.isMet ? '✓' : '•'}
                      </span>
                      {requirement.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <TextBox
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Password"
            enableValidation={false}
            variant="glassmorphism"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full justify-center text-body font-semibold mt-6"
          isLoading={loading}
          variant="primary"
          size="md"
          fullRounded={true}
          useCustomHover={true}
        >
          {loading ? 'Resetting password...' : 'Reset Password'}
        </Button>

        {/* Back to Login */}
        <p className="text-center text-small sm:text-body text-gray-300 mt-4 font-alexandria">
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => router.push(ROUTES.LOGIN)}
            className="text-blue-300 hover:text-blue-200 hover:underline"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}