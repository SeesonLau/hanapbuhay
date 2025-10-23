'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth-services';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface LoginFormProps {
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNeedsConfirmation(false);
    setError('');

    try {
      const result = await AuthService.login(email, password);

      if (result.success) {
        router.push(ROUTES.FINDJOBS);
      } else if (result.needsConfirmation) {
        setNeedsConfirmation(true);
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setResendLoading(true);
    try {
      await AuthService.resendConfirmationEmail(email);
      setNeedsConfirmation(false);
      setError('Confirmation email sent. Please check your inbox.');
    } catch (err) {
      setError('Failed to resend confirmation email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div className="p-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full justify-center"
        isLoading={loading}
        variant="primary"
        size="lg"
        fullRounded={true}
        useCustomHover={true}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      {needsConfirmation && (
        <div className="border border-yellow-200 rounded-md text-sm px-4 py-3 bg-yellow-50 text-yellow-800">
          <p className="font-medium mb-2">Email Verification Required</p>
          <p className="mb-3">Your email needs to be confirmed before you can sign in.</p>
          <Button
            type="button"
            onClick={handleResendConfirmation}
            disabled={resendLoading}
            className="w-full justify-center"
            isLoading={resendLoading}
            style={{
              backgroundColor: '#CA8A04',
              color: 'white'
            }}
            onMouseOver={(e) => {
              if (!resendLoading) {
                e.currentTarget.style.backgroundColor = '#A16207';
              }
            }}
            onMouseOut={(e) => {
              if (!resendLoading) {
                e.currentTarget.style.backgroundColor = '#CA8A04';
              }
            }}
          >
            {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
          </Button>
        </div>
      )}

      <div className="text-center">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-medium text-blue-600 hover:underline cursor-pointer bg-none border-none"
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};
