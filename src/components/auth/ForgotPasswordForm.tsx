'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth-services';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const result = await AuthService.forgotPassword(email);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message || 'Failed to send reset instructions');
    }
    
    setLoading(false);
  };

  const handleBackToLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-semibold">Instructions Sent!</p>
          <p className="mt-1">Check your email for password reset instructions.</p>
          <button
            type="button"
            onClick={handleBackToLogin}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
          >
            Back to Login
          </button>
        </div>
      )}

      {!success && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </>
      )}
    </form>
  );
};
