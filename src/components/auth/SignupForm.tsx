'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth-services';
import { passwordRequirements } from '@/lib/constants';
import { validatePassword } from '@/lib/utils/validation';
import { Modal } from '@/components/modals/Modal';
import Button from '@/components/ui/Button';
import { 
  getGrayColor, 
  getNeutral600Color, 
  TYPOGRAPHY_CLASSES, 
  getBlueColor, 
  getRedColor, 
  getGreenColor,
  getBlueDarkColor
} from '@/styles';

export const SignupForm: React.FC = () => {
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div 
            className="p-3 rounded-md text-sm"
            style={{
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA'
            }}
          >
            {error}
          </div>
        )}

        <div>
          <label 
            className={`block ${TYPOGRAPHY_CLASSES.small} font-medium text-gray-700`}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label 
            className={`block ${TYPOGRAPHY_CLASSES.small} font-medium text-gray-700`}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkPasswordRequirements(e.target.value);
            }}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Create a password"
          />

          {/* Password Requirements List */}
          <div className="mt-2 p-3 rounded-md bg-gray-50 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Password must contain:
            </p>
            <ul className="space-y-1 text-sm">
              {passwordRequirements.map((requirement, index) => {
                const status = getRequirementStatus(requirement);
                return (
                  <li
                    key={index}
                    className="flex items-center"
                    style={{
                      color: status.isMet ? '#059669' : status.isError ? '#DC2626' : '#4B5563'
                    }}
                  >
                    <span
                      className="mr-2"
                      style={{
                        color: status.isMet ? '#059669' : '#4B5563'
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
        </div>

        <div>
          <label 
            className={`block ${TYPOGRAPHY_CLASSES.small} font-medium text-gray-700`}
          >
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm your password"
          />
        </div>
        
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
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

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
