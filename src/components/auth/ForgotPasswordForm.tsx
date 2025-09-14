'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth-services';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { SignUpButton, ApplyNowButton } from '@/components';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.forgotPassword(email);  
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <SignUpButton
        type="submit"      
        disabled={loading}
        className="w-full justify-center"
      >
        {loading ? 'Sending...' : 'Send Reset Instructions'}
      </SignUpButton>

      <ApplyNowButton
        type="button"
        onClick={handleBackToLogin}
        className="w-full justify-center bg-gray-600 hover:bg-gray-700"
      >
        Back to Login
      </ApplyNowButton>
    </form>
  );
};
