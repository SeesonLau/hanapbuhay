'use client';

import { useState } from 'react';

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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#F1F6FA] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-6 text-[#141515]">Settings</h2>
        
        {user && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <h3 className="font-medium text-[#141515] mb-3">User Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-[#141515]"><span className="font-medium">Email:</span> {user.email}</p>
              </div>
              <div>
                <p className="text-sm text-[#141515]"><span className="font-medium">User ID:</span> {user.userId}</p>
              </div>
              <div>
                <p className="text-sm text-[#141515]"><span className="font-medium">Role:</span> {user.role}</p>
              </div>
              <div>
                <p className="text-sm text-[#141515]"><span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Password Change Section */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-[#141515] mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#141515] mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full rounded-md border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-[#193D8F] focus:ring-[#193D8F]`}
                  placeholder="Enter current password"
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#141515] mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full rounded-md border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-[#193D8F] focus:ring-[#193D8F]`}
                  placeholder="Enter new password (8-20 characters)"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#141515] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-[#193D8F] focus:ring-[#193D8F]`}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#193D8F] text-white px-4 py-2 rounded-md hover:bg-[#152c6b] transition-colors"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
          
          {/* Preferences Section */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-[#141515] mb-4">Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#141515] mb-2">Theme</label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#193D8F] focus:ring-[#193D8F]"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#141515] mb-2">Language</label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#193D8F] focus:ring-[#193D8F]"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#141515] mb-2">Notifications</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="email"
                    checked={settings.notifications.email}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-[#193D8F] focus:ring-[#193D8F]"
                  />
                  <span className="ml-2 text-[#141515]">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="push"
                    checked={settings.notifications.push}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-[#193D8F] focus:ring-[#193D8F]"
                  />
                  <span className="ml-2 text-[#141515]">Push notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-[#141515] px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#193D8F] text-white px-4 py-2 rounded-md hover:bg-[#152c6b] transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
