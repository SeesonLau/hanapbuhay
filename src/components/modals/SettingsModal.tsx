'use client';

import { useState } from 'react';
import { FiX, FiLock, FiGlobe, FiBell, FiCheck } from 'react-icons/fi';
import { AuthService } from '@/lib/services/auth-services';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    email: string;
    role: string;
    userId: string;
    createdAt: string;
  } | null;
}

export default function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: {
      email: true,
      push: false,
    },
    language: 'en',
  });

  const [resetPasswordMessage, setResetPasswordMessage] = useState('');
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) {
      setResetPasswordMessage('User email not found. Please log in again.');
      return;
    }

    setIsSendingResetEmail(true);
    setResetPasswordMessage('');

    try {
      const result = await AuthService.forgotPassword(user.email);
      
      if (result.success) {
        setResetPasswordMessage('Password reset instructions have been sent to your email.');
      } else {
        setResetPasswordMessage(result.message || 'Failed to send reset instructions. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      setResetPasswordMessage('An error occurred. Please try again.');
    } finally {
      setIsSendingResetEmail(false);
      
      // Hide message after 5 seconds
      setTimeout(() => {
        setResetPasswordMessage('');
      }, 5000);
    }
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-3 mobile-M:p-4 transition-opacity duration-300 animate-in fade-in bg-black/50"
      onClick={onClose}
    >
      <div 
        className="font-inter bg-white rounded-xl shadow-2xl w-full max-w-[280px] mobile-M:max-w-[320px] mobile-L:max-w-[380px] tablet:max-w-md animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 mobile-L:p-4 border-b border-gray-neutral200">
          <h2 className="text-body mobile-L:text-lead font-semibold text-gray-neutral900">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all hover:bg-gray-neutral100 active:scale-95"
            aria-label="Close settings"
          >
            <FiX size={20} className="text-gray-neutral600" />
          </button>
        </div>

        {/* Content - No Scroll */}
        <div className="p-3 mobile-L:p-4 space-y-3 mobile-L:space-y-4">
          
          {/* Reset Password Section */}
          <div className="p-3 rounded-lg border border-gray-neutral200 bg-gray-neutral50">
            <div className="flex items-center gap-2 mb-2">
              <FiLock size={16} className="text-primary-primary500" />
              <h3 className="text-small mobile-L:text-body font-semibold text-gray-neutral900">
                Reset Password
              </h3>
            </div>

            {resetPasswordMessage && (
              <div 
                className={`mb-2 p-2 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2 border ${
                  resetPasswordMessage.includes('sent')
                    ? 'bg-success-success50 border-success-success200'
                    : 'bg-error-error50 border-error-error200'
                }`}
              >
                <FiCheck 
                  size={14} 
                  className={resetPasswordMessage.includes('sent') ? 'text-success-success600' : 'text-error-error600'}
                />
                <span 
                  className={`text-tiny mobile-L:text-small font-medium ${
                    resetPasswordMessage.includes('sent') ? 'text-success-success700' : 'text-error-error700'
                  }`}
                >
                  {resetPasswordMessage}
                </span>
              </div>
            )}

            <p className="text-tiny mobile-L:text-small mb-2 text-gray-neutral600">
              Send reset instructions to {user?.email || 'your email'}
            </p>

            <button
              type="button"
              onClick={handleSendResetEmail}
              disabled={isSendingResetEmail}
              className="w-full px-3 py-2 rounded-lg transition-all font-medium text-tiny mobile-L:text-small active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-primary-primary500 hover:bg-primary-primary600 text-white"
            >
              {isSendingResetEmail ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FiLock size={14} />
                  Send Reset Instructions
                </>
              )}
            </button>
          </div>
          
          {/* Preferences Section */}
          <div className="p-3 rounded-lg border border-gray-neutral200 bg-gray-neutral50">
            <div className="flex items-center gap-2 mb-3">
              <FiGlobe size={16} className="text-primary-primary500" />
              <h3 className="text-small mobile-L:text-body font-semibold text-gray-neutral900">
                Preferences
              </h3>
            </div>
            
            <div className="grid grid-cols-1 mobile-L:grid-cols-2 gap-2 mobile-L:gap-3 mb-3">
              <div>
                <label className="block text-tiny mobile-L:text-small font-medium mb-1 text-gray-neutral700">
                  Theme
                </label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-neutral300 bg-white p-2 text-tiny mobile-L:text-small transition-all focus:ring-2 focus:ring-primary-primary500 focus:border-primary-primary500 outline-none text-gray-neutral900"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div>
                <label className="block text-tiny mobile-L:text-small font-medium mb-1 text-gray-neutral700">
                  Language
                </label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-neutral300 bg-white p-2 text-tiny mobile-L:text-small transition-all focus:ring-2 focus:ring-primary-primary500 focus:border-primary-primary500 outline-none text-gray-neutral900"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiBell size={14} className="text-primary-primary500" />
                <label className="text-tiny mobile-L:text-small font-medium text-gray-neutral700">
                  Notifications
                </label>
              </div>
              <div className="space-y-2 pl-5">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="email"
                    checked={settings.notifications.email}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded transition-all cursor-pointer accent-primary-primary500"
                  />
                  <span className="ml-2 text-tiny mobile-L:text-small group-hover:translate-x-0.5 transition-transform text-gray-neutral700">
                    Email notifications
                  </span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="push"
                    checked={settings.notifications.push}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded transition-all cursor-pointer accent-primary-primary500"
                  />
                  <span className="ml-2 text-tiny mobile-L:text-small group-hover:translate-x-0.5 transition-transform text-gray-neutral700">
                    Push notifications
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex flex-col mobile-L:flex-row justify-end gap-2 p-3 mobile-L:p-4 border-t border-gray-neutral200">
          <button
            onClick={onClose}
            className="w-full mobile-L:w-auto px-4 py-2 rounded-lg transition-all font-medium text-tiny mobile-L:text-small hover:bg-gray-neutral400 active:scale-[0.98] bg-gray-neutral300 text-gray-neutral900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full mobile-L:w-auto px-4 py-2 rounded-lg transition-all font-medium text-tiny mobile-L:text-small active:scale-[0.98] bg-primary-primary500 hover:bg-primary-primary600 text-white"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}