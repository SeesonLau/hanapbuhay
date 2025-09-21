'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth-services';
import Button from '@/components/ui/Button';

interface ForgotPasswordFormProps {
  onBackToLogin?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await AuthService.forgotPassword(email);
      if (result.success) {
        setMessage('Password reset instructions have been sent to your email.');
      } else {
        setMessage(result.message || 'Failed to send reset instructions. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email address"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('sent') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
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
        {loading ? 'Sending...' : 'Send Reset Instructions'}
      </Button>

      {onBackToLogin && (
        <Button
          type="button"
          onClick={onBackToLogin}
          className="w-full justify-center"
          variant="ghost"
          style={{
            outlineColor: '#1D4ED8',
            color: '#1D4ED8',
            backgroundColor: 'transparent',
            outline: '2px solid',
            outlineOffset: '-2px'
          }}
          onMouseOver={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = '#9CA3AF';
            }
          }}
          onMouseOut={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          Back to Login
        </Button>
      )}
    </form>
  );
};

export default ForgotPasswordForm;
