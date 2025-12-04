//components/auth/LoginForm.tsx

'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth-services';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import TextBox from '@/components/ui/TextBox';
import Image from 'next/image';
import { IoArrowBack } from "react-icons/io5";
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';

interface LoginFormProps {
  onForgotPassword: () => void;
  onBackClick?: () => void;
  onSignUpClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onBackClick, onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous states
    setLoading(true);
    setNeedsConfirmation(false);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);

    try {
      const result = await AuthService.login(email, password);

      // CRITICAL: Only navigate if BOTH success is true AND we have user data
      if (result.success === true && result.data) {
        console.log('✅ Login successful');
        
        // Check if there's a pending job application from landing page
        const pendingJobId = sessionStorage.getItem('pendingJobApplication');
        if (pendingJobId) {
          console.log('📋 Pending job application found:', pendingJobId);
          sessionStorage.removeItem('pendingJobApplication');
          // Redirect to findJobs with the job ID to trigger application modal
          router.push(`${ROUTES.FINDJOBS}?applyJobId=${pendingJobId}`);
        } else {
          console.log('➡️ Redirecting to findJobs');
          router.push(ROUTES.FINDJOBS);
        }
      } else if (result.needsConfirmation) {
        console.log('⚠️ Email confirmation needed');
        setNeedsConfirmation(true);
        setError(''); // Clear any previous errors
      } else {
        // Login failed - show error and stay on page
        console.log('❌ Login failed:', result.message);
        setError(result.message || 'Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      console.error('❌ Login exception:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
      console.log('===================');
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setResendLoading(true);
    setError('');

    try {
      const result = await AuthService.resendConfirmationEmail(email);
      
      if (result.success) {
        setNeedsConfirmation(false);
        setError('Confirmation email sent. Please check your inbox.');
      } else {
        setError(result.message || 'Failed to resend confirmation email. Please try again.');
      }
    } catch (err: any) {
      setError('Failed to resend confirmation email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-2 sm:px-2 px-1">
      {/* Back Button */}
      {onBackClick && (
        <button
          onClick={onBackClick}
          className="mb-1 hover:bg-gray-neutral100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <IoArrowBack className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Logo */}
      <div className="flex justify-center mb-1">
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
      <h2 className="text-h4 tablet: text-h3 font-bold text-white text-center mb-4 font-alexandria">
        Sign In
      </h2>

      <Preloader
        isVisible={loading}
        message={PreloaderMessages.PROCESSING}
        variant="default"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div 
            className="p-3 rounded-lg text-small text-red-100 border"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(239, 68, 68, 0.3)'
            }}
          >
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <TextBox
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Email"
            disabled={loading}
            variant="glassmorphism"
          />
        </div>

        {/* Password */}
        <div>
          <TextBox
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Password"
            enableValidation={false}
            disabled={loading}
            variant="glassmorphism"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            disabled={loading}
            className="font-alexandria font-light text-mini sm:text-small text-primary-primary400 hover:text-primary-primary500 hover:underline disabled:opacity-50"
          >
            Forgot Password?
          </button>
        </div>

        {/* Log In Button */}
        <Button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full justify-center text-body font-semibold mt-6 py-2 rounded-full"
          isLoading={loading}
          variant="primary"
          size="md"
          fullRounded={true}
          useCustomHover={true}
        >
          {loading ? 'Signing in...' : 'Log In'}
        </Button>

        {needsConfirmation && (
          <div 
            className="border rounded-lg text-small px-4 py-3 text-yellow-100"
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(245, 158, 11, 0.3)'
            }}
          >
            <p className="font-medium mb-2">Email Verification Required</p>
            <p className="mb-3">Your email needs to be confirmed before you can sign in.</p>
            <Button
              type="button"
              onClick={handleResendConfirmation}
              disabled={resendLoading}
              className="w-full justify-center"
              isLoading={resendLoading}
              style={{
                backgroundColor: '#EF8F11',
                color: 'white'
              }}
              onMouseOver={(e) => {
                if (!resendLoading) {
                  e.currentTarget.style.backgroundColor = '#D46B0B';
                }
              }}
              onMouseOut={(e) => {
                if (!resendLoading) {
                  e.currentTarget.style.backgroundColor = '#EF8F11';
                }
              }}
            >
              {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
            </Button>
          </div>
        )}

        {/* Sign Up Link */}
        <p className="text-center text-mini sm:text-small text-gray-300 mt-4 font-alexandria font-light">
          Don't have an account? Sign up {' '}
          <button
            type="button"
            onClick={onSignUpClick}
            disabled={loading}
            className="font-alexandria font-light text-mini sm:text-small text-primary-primary400 hover:text-primary-primary500 hover:underline disabled:opacity-50"
          >
            here
          </button>
        </p>
      </form>
    </div>
  );
};