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
      <div className="w-full max-w-md mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-primary600 mx-auto"></div>
          <p className="mt-4 text-gray-neutral600">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="flex justify-center mb-4">
          <Image
            src="/image/hanapbuhay-logo-notext.svg"
            alt="HanapBuhay Logo"
            width={80}
            height={80}
            priority
          />
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-h3 font-bold mb-2 font-alexandria">Session Expired</h1>
          <p className="text-gray-neutral600 mb-6 font-alexandria">
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
    <div className="w-full max-w-md mx-auto p-6">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image
          src="/image/hanapbuhay-logo-notext.svg"
          alt="HanapBuhay Logo"
          width={80}
          height={80}
          priority
        />
      </div>

      {/* Title */}
      <h1 className="text-h3 font-bold text-gray-neutral900 text-center mb-2 font-alexandria">
        Reset Password
      </h1>
      <p className="text-gray-neutral600 text-center mb-8 font-alexandria">
        Enter your new password below.
      </p>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-error-50 text-error-700 border border-error-200 text-small">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            required
            placeholder="••••••••"
            enableValidation={false}
          />

          {/* Password Requirements List */}
          {password.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-gray-neutral50 border border-gray-neutral200">
              <p className="text-small font-medium text-gray-neutral700 mb-2 font-inter">
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
            required
            placeholder="••••••••"
            enableValidation={false}
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
        <p className="text-center text-small text-gray-neutral600 mt-4 font-alexandria">
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => router.push(ROUTES.LOGIN)}
            className="text-primary-primary500 hover:text-primary-primary600 hover:underline"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}