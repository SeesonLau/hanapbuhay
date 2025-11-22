//components/auth/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth-services';
import Button from '@/components/ui/Button';
import TextBox from '@/components/ui/TextBox';
import { IoArrowBack } from "react-icons/io5";

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
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Title */}
      <h2 className="text-h3 font-bold text-gray-neutral900 text-center mb-4 font-alexandria">
        Forgot Password?
      </h2>

      {/* Subtitle */}
      <p className="text-body text-gray-neutral600 text-center mb-8 font-alexandria font-light">
        Enter your email address and we'll send you reset instructions!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={`p-3 rounded-lg text-small ${
            message.includes('sent') 
              ? 'bg-success-50 text-success-700 border border-success-200' 
              : 'bg-error-50 text-error-700 border border-error-200'
          }`}>
            {message}
          </div>
        )}

        {/* Email Input */}
        <div>
          <TextBox
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="juan.delacruz@gmail.com"
          />
        </div>

        {/* Send Code Button */}
        <Button
          type="submit"      
          disabled={loading}
          className="w-full justify-center text-body font-semibold"
          isLoading={loading}
          variant="primary"
          size="md"
          fullRounded={true}
          useCustomHover={true}
        >
          {loading ? 'Sending...' : 'Send Reset Instructions'}
        </Button>

        {/* Back to Login Link */}
        {onBackToLogin && (
          <div className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="inline-flex items-center gap-2 font-alexandria font-light text-body text-primary-primary500 hover:text-primary-primary600 font-light hover:underline"
            >
              <IoArrowBack className="w-5 h-5 font-light" />
              Back to login
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
