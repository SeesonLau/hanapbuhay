'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/services/auth-services';
import { passwordRequirements } from '@/lib/constants';
import { validatePassword } from '@/lib/utils/validation';
import { Modal } from '@/components/ui/Modal';

export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password requirements
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);

    const result = await AuthService.signUp(email, password);
    
    if (result.success) {
      setShowValidationModal(true);
    } else {
      setError(result.message || 'Signup failed');
    }
    
    setLoading(false);
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
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
            onChange={(e) => {
              setPassword(e.target.value);
              checkPasswordRequirements(e.target.value);
            }}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          
          {/* Password Requirements List */}
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
            <ul className="space-y-1 text-sm">
              {passwordRequirements.map((requirement, index) => {
                const status = getRequirementStatus(requirement);
                return (
                  <li 
                    key={index} 
                    className={`flex items-center ${status.className}`}
                  >
                    <span className={`mr-2 ${status.isMet ? 'text-green-500' : 'text-gray-400'}`}>
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
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <Modal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        title="Email Verification"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            We've sent a verification email to <strong>{email}</strong>. 
            Please check your inbox and click the verification link to activate your account.
          </p>
          <button
            onClick={() => setShowValidationModal(false)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </Modal>
    </>
  );
};
