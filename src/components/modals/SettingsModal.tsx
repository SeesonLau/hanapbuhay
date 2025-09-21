'use client';

import { useState } from 'react';
import { 
  getWhiteColor, 
  getGrayColor, 
  getNeutral100Color,
  getNeutral300Color,
  getNeutral600Color,
  getPrimary500Color,
  getRedColor
} from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';
import { TYPOGRAPHY } from '@/styles/typography';

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

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validatePasswordForm = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    // Validate current password
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Please enter your current password.';
      isValid = false;
    }

    // Validate new password
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'Please enter a new password.';
      isValid = false;
    } else if (passwordData.newPassword.length < 8 || passwordData.newPassword.length > 20) {
      newErrors.newPassword = 'Password must be 8–20 characters.';
      isValid = false;
    }

    // Validate confirm password
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password.';
      isValid = false;
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      // Here you would typically send the password change request to your backend
      console.log('Password change submitted:', passwordData);
      
      // Reset form after successful submission
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Show success message (you could add a state for this)
      alert('Password changed successfully!');
    }
  };

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    console.log('Saving settings:', settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      style={{ backgroundColor: getWhiteColor(0.5) }}
      onClick={onClose}
    >
      <div 
        className={`${fontClasses.body} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-transform duration-300`}
        style={{ 
          backgroundColor: getNeutral100Color(),
          color: getGrayColor('neutral600')
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 
          className="text-xl font-semibold mb-6"
          style={{ 
            fontSize: TYPOGRAPHY.h3.fontSize,
            fontFamily: TYPOGRAPHY.h3.fontFamily,
            fontWeight: TYPOGRAPHY.h3.fontWeight,
            color: getGrayColor('neutral600')
          }}
        >
          Settings
        </h2>
        
        {user && (
          <div 
            className="mb-6 p-4 rounded-lg border"
            style={{ 
              backgroundColor: getWhiteColor(),
              borderColor: getGrayColor('border')
            }}
          >
            <h3 
              className="font-medium mb-3"
              style={{ color: getGrayColor('neutral600') }}
            >
              User Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p 
                  className="text-sm"
                  style={{ color: getGrayColor('neutral600') }}
                >
                  <span className="font-medium">Email:</span> {user.email}
                </p>
              </div>
              <div>
                <p 
                  className="text-sm"
                  style={{ color: getGrayColor('neutral600') }}
                >
                  <span className="font-medium">User ID:</span> {user.userId}
                </p>
              </div>
              <div>
                <p 
                  className="text-sm"
                  style={{ color: getGrayColor('neutral600') }}
                >
                  <span className="font-medium">Role:</span> {user.role}
                </p>
              </div>
              <div>
                <p 
                  className="text-sm"
                  style={{ color: getGrayColor('neutral600') }}
                >
                  <span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Password Change Section */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: getWhiteColor(),
              borderColor: getGrayColor('border')
            }}
          >
            <h3 
              className="font-medium mb-4"
              style={{ color: getGrayColor('neutral600') }}
            >
              Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: getGrayColor('neutral600') }}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full rounded-md border p-2 transition-colors duration-300`}
                  style={{ 
                    borderColor: errors.currentPassword ? getRedColor() : getGrayColor('border'),
                    color: getGrayColor('neutral600'),
                    backgroundColor: getWhiteColor()
                  }}
                  placeholder="Enter current password"
                />
                {errors.currentPassword && (
                  <p 
                    className="mt-1 text-sm"
                    style={{ color: getRedColor() }}
                  >
                    {errors.currentPassword}
                  </p>
                )}
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: getGrayColor('neutral600') }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full rounded-md border p-2 transition-colors duration-300`}
                  style={{ 
                    borderColor: errors.newPassword ? getRedColor() : getGrayColor('border'),
                    color: getGrayColor('neutral600'),
                    backgroundColor: getWhiteColor()
                  }}
                  placeholder="Enter new password (8-20 characters)"
                />
                {errors.newPassword && (
                  <p 
                    className="mt-1 text-sm"
                    style={{ color: getRedColor() }}
                  >
                    {errors.newPassword}
                  </p>
                )}
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: getGrayColor('neutral600') }}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full rounded-md border p-2 transition-colors duration-300`}
                  style={{ 
                    borderColor: errors.confirmPassword ? getRedColor() : getGrayColor('border'),
                    color: getGrayColor('neutral600'),
                    backgroundColor: getWhiteColor()
                  }}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <p 
                    className="mt-1 text-sm"
                    style={{ color: getRedColor() }}
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md transition-colors duration-300"
                  style={{ 
                    backgroundColor: getPrimary500Color(),
                    color: getWhiteColor()
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = getPrimary500Color(0.8);
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = getPrimary500Color();
                  }}
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
          
          {/* Preferences Section */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: getWhiteColor(),
              borderColor: getGrayColor('border')
            }}
          >
            <h3 
              className="font-medium mb-4"
              style={{ color: getGrayColor('neutral600') }}
            >
              Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: getGrayColor('neutral600') }}
                >
                  Theme
                </label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleInputChange}
                  className="w-full rounded-md border p-2 transition-colors duration-300"
                  style={{ 
                    borderColor: getGrayColor('border'),
                    color: getGrayColor('neutral600'),
                    backgroundColor: getWhiteColor()
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: getGrayColor('neutral600') }}
                >
                  Language
                </label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleInputChange}
                  className="w-full rounded-md border p-2 transition-colors duration-300"
                  style={{ 
                    borderColor: getGrayColor('border'),
                    color: getGrayColor('neutral600'),
                    backgroundColor: getWhiteColor()
                  }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: getGrayColor('neutral600') }}
              >
                Notifications
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="email"
                    checked={settings.notifications.email}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 transition-colors duration-300"
                    style={{ 
                      color: getPrimary500Color(),
                      borderColor: getGrayColor('border')
                    }}
                  />
                  <span 
                    className="ml-2 text-sm"
                    style={{ color: getGrayColor('neutral600') }}
                  >
                    Email notifications
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="push"
                    checked={settings.notifications.push}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 transition-colors duration-300"
                    style={{ 
                      color: getPrimary500Color(),
                      borderColor: getGrayColor('border')
                    }}
                  />
                  <span 
                    className="ml-2 text-sm"
                    style={{ color: getGrayColor('neutral600') }}
                  >
                    Push notifications
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md transition-colors duration-300"
            style={{ 
              backgroundColor: getGrayColor('neutral300'),
              color: getGrayColor('neutral600')
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = getGrayColor('neutral400');
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = getGrayColor('neutral300');
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md transition-colors duration-300"
            style={{ 
              backgroundColor: getPrimary500Color(),
              color: getWhiteColor()
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = getPrimary500Color(0.8);
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = getPrimary500Color();
            }}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
