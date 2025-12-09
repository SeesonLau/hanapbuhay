// components/auth/SignupForm.tsx
'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth-services';
import { passwordRequirements } from '@/lib/constants';
import { validatePassword } from '@/lib/utils/validation';
import { Modal } from '@/components/modals/Modal';
import Button from '@/components/ui/Button';
import TextBox from '@/components/ui/TextBox';
import Image from 'next/image';
import { IoArrowBack } from "react-icons/io5";
import { useLanguage } from '@/hooks/useLanguage';


interface SignupFormProps {
  onBackClick?: () => void;
  onSignInClick?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onBackClick, onSignInClick, onLoadingChange }) => {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onLoadingChange?.(true);
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(t.auth.signup.errors.passwordMismatch);
      setLoading(false);
      return;
    }

    // Validate password requirements
    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      setError(t.auth.signup.errors.weakPassword);
      setLoading(false);
      return;
    }

    try {
      const result = await AuthService.signUp(email, password, confirmPassword);

      if (result.success) {
        setShowValidationModal(true);
      } else {
        setError(result.message || t.auth.signup.errors.requiredField);
      }
    } catch (err) {
      setError(t.common.messages.errorOccurred);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  const checkPasswordRequirements = (pwd: string) => {
    const errors = validatePassword(pwd);
    setPasswordErrors(errors);
  };

  // Check which requirements are met
  const getRequirementStatus = (requirement: { re: RegExp; label: string }) => {
    const isMet = requirement.re.test(password);
    const isError = passwordErrors.includes(requirement.label);

    return {
      isMet,
      isError,
      className: isMet
        ? 'text-green-600'
        : isError
        ? 'text-red-600'
        : 'text-gray-500'
    };
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        {/* Back Button */}
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="mb-1 p-2 hover:bg-gray-neutral100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <IoArrowBack className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Logo */}
        <div className="flex justify-center mb-0">
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
          {t.auth.signup.title}
        </h2>

        

        <form onSubmit={handleSubmit} className="space-y-4 px-2 sm:px-6 pb-4">
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
              label={t.auth.signup.emailLabel}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth.signup.emailPlaceholder}
              variant="glassmorphism"
            />
          </div>

          {/* Password */}
          <div>
            <TextBox
              type="password"
              label={t.auth.signup.passwordLabel}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordRequirements(e.target.value);
              }}
              placeholder={t.auth.signup.passwordPlaceholder}
              enableValidation={false}
              variant="glassmorphism"
            />

            {/* Password Requirements List - Only show when password has content */}
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
              label={t.auth.signup.confirmPasswordLabel}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t.auth.signup.confirmPasswordPlaceholder}
              enableValidation={false}
              variant="glassmorphism"
            />
          </div>
          
          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full justify-center text-body font-semibold mt-12"
            isLoading={loading}
            variant="primary"
            size="md"
            fullRounded={true}
            useCustomHover={true}
          >
            {loading ? `${t.auth.signup.signupButton}...` : t.auth.signup.signupButton}
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-mini sm:text-small text-gray-300 mt-6 font-alexandria font-light">
            {t.auth.signup.haveAccount} {' '}
            <button
              type="button"
              onClick={onSignInClick}
              className="font-alexandria font-light text-mini sm:text-small text-blue-300 hover:text-blue-200 font-light hover:underline"
            >
            {t.auth.signup.loginLink}
            </button>
          </p>
        </form>
      </div>

      <Modal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        title="Email Verification"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            We've sent a verification email to <strong>{email}</strong>. 
            Please check your inbox and click the verification link to activate your account.
          </p>
          <Button
            onClick={() => setShowValidationModal(false)}
            className="w-full justify-center"
            variant="primary"
          >
            OK
          </Button>
        </div>
      </Modal>
    </>
  );
};

