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
import { 
  getGrayColor, 
  getNeutral600Color, 
  TYPOGRAPHY_CLASSES, 
  getBlueColor, 
  getRedColor, 
  getGreenColor,
  getBlueDarkColor
} from '@/styles';
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';

interface SignupFormProps {
  onBackClick?: () => void;
  onSignInClick?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onBackClick, onSignInClick }) => {
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
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password requirements
    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      setError('Please fix the password requirements below');
      setLoading(false);
      return;
    }

    try {
      const result = await AuthService.signUp(email, password, confirmPassword);

      if (result.success) {
        setShowValidationModal(true);
      } else {
        setError(result.message || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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
            <IoArrowBack className="w-6 h-6 text-gray-neutral800" />
          </button>
        )}

        {/* Logo */}
        <div className="flex justify-center mb-0">
          <Image
            src="/image/hanapbuhay-logo-notext.svg"
            alt="HanapBuhay Logo"
            width={80}
            height={80}
            priority
          />
        </div>

        {/* Title */}
        <h2 className="text-h3 font-bold text-gray-neutral900 text-center mb-4 font-alexandria">
          Sign Up
        </h2>

        <Preloader
      isVisible={loading}
      message={PreloaderMessages.PROCESSING}
      variant="default"
    />

        <form onSubmit={handleSubmit} className="space-y-3 px-6 pb-4">
          {error && (
            <div className="p-3 rounded-lg text-small bg-error-50 text-error-700 border border-error-200">
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
              required
              placeholder="juan.cruz@gmail.com"
            />
          </div>

          {/* Password */}
          <div>
            <TextBox
              type="password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordRequirements(e.target.value);
              }}
              required
              placeholder="••••••••"
              enableValidation={false}
            />

            {/* Password Requirements List - Only show when password has content */}
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
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              enableValidation={false}
            />
          </div>
          
          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full justify-center text-body font-semibold mt-8"
            isLoading={loading}
            variant="primary"
            size="md"
            fullRounded={true}
            useCustomHover={true}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-small text-gray-neutral600 mt-6 font-alexandria font-light">
            Already have an account? Sign in{' '}
            <button
              type="button"
              onClick={onSignInClick}
              className="font-alexandria font-light text-small text-primary-primary500 hover:text-primary-primary600 font-light hover:underline"
            >
            here
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

