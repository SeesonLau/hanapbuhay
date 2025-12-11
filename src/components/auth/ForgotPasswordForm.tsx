//components/auth/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth-services';
import Button from '@/components/ui/Button';
import TextBox from '@/components/ui/TextBox';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

interface ForgotPasswordFormProps {
  onBackToLogin?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  onBackToLogin, 
  onLoadingChange
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onLoadingChange?.(true);
    setMessage('');

    try {
      const result = await AuthService.forgotPassword(email);
      if (result.success) {
        setMessage(t.auth.forgotPassword.success);
      } else {
        setMessage(result.message || t.auth.forgotPassword.errors.userNotFound);
      }
    } catch (error) {
      setMessage(t.common.messages.errorOccurred);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  const isSuccessMessage = message.includes('sent');

  return (
    <div className="w-full max-w-md mx-auto px-1 sm:px-2">
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
      <h2 className="text-h3 tablet: text-h2 font-bold text-white text-center mb-2 font-alexandria">
        {t.auth.forgotPassword.title}
      </h2>

      {/* Subtitle */}
      <p className="text-small sm:text-body text-gray-300 text-center mb-6 sm:mb-8 font-alexandria font-light">
        {t.auth.forgotPassword.subtitle}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {message && (
          <div 
            className="p-3 rounded-lg text-small border"
            style={{
              background: isSuccessMessage
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(10px)',
              borderColor: isSuccessMessage
                ? 'rgba(16, 185, 129, 0.3)' 
                : 'rgba(239, 68, 68, 0.3)',
              color: isSuccessMessage ? '#6EE7B7' : '#FCA5A5'
            }}
          >
            {message}
          </div>
        )}

        {/* Email Input */}
        <div>
          <TextBox
            type="email"
            label={t.auth.forgotPassword.emailLabel}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.auth.forgotPassword.emailPlaceholder}
            variant="glassmorphism"
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
          {loading ? `${t.auth.forgotPassword.sendButton}...` : t.auth.forgotPassword.sendButton}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;