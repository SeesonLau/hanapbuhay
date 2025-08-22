'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth-services';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsConfirmation(false);
    setResendSuccess(false);

    const result = await AuthService.login(email, password);
    
    if (result.success) {
      router.push(ROUTES.DASHBOARD);
    } else {
      if (result.needsConfirmation) {
        setNeedsConfirmation(true);
      }
      setError(result.message || 'Login failed');
    }
    
    setLoading(false);
  };

  const handleResendConfirmation = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    
    const result = await AuthService.resendConfirmationEmail(email);
    
    if (result.success) {
      setResendSuccess(true);
      setError('');
    } else {
      setError(result.message || 'Failed to resend confirmation email');
    }
    
    setResendLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {resendSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Confirmation email sent! Please check your inbox.
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      {needsConfirmation && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="mb-2">Your email needs to be confirmed before you can sign in.</p>
          <button
            type="button"
            onClick={handleResendConfirmation}
            disabled={resendLoading}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 text-sm"
          >
            {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
          </button>
        </div>
      )}

      <div className="text-center">
        <a
          href={ROUTES.FORGOT_PASSWORD}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Forgot your password?
        </a>
      </div>
    </form>
  );
};
