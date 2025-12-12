'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiLock, FiGlobe, FiBell, FiCheck } from 'react-icons/fi';
import { AuthService } from '@/lib/services/auth-services';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { ThemeName } from '@/styles/theme';
import { Locale } from '@/i18n/config';

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
  const { themeName, setTheme, theme } = useTheme();
  const { locale, setLocale, t } = useLanguage();

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
    },
  });

  const [resetPasswordMessage, setResetPasswordMessage] = useState('');
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore body styles
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as ThemeName;
    setTheme(newTheme);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    setLocale(newLocale);
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) {
      setResetPasswordMessage(t.settings.resetPassword.noEmail);
      return;
    }

    setIsSendingResetEmail(true);
    setResetPasswordMessage('');

    try {
      const result = await AuthService.forgotPassword(user.email);

      if (result.success) {
        setResetPasswordMessage(t.settings.resetPassword.success);
      } else {
        setResetPasswordMessage(result.message || t.settings.resetPassword.error);
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      setResetPasswordMessage(t.settings.resetPassword.genericError);
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

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center p-3 mobile-M:p-4 transition-opacity duration-300 animate-in fade-in bg-black/50"
      style={{ zIndex: 2147483647 }}
      onClick={onClose}
    >
      <div 
        className="relative font-inter bg-white rounded-xl shadow-2xl w-full max-w-[280px] mobile-M:max-w-[320px] mobile-L:max-w-[380px] tablet:max-w-md animate-in zoom-in-95 duration-300"
        style={{ zIndex: 2147483648 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 mobile-L:p-4 border-b rounded-t-xl transition-colors duration-300"
          style={{
            backgroundColor: theme.colors.pastelBg,
            borderBottomColor: theme.colors.pastelBorder,
          }}
        >
          <h2
            className="text-body mobile-L:text-lead font-semibold transition-colors duration-300"
            style={{ color: theme.colors.pastelText }}
          >
            {t.settings.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all hover:bg-white/50 active:scale-95"
            aria-label={t.settings.close}
          >
            <FiX size={20} className="text-gray-neutral600" />
          </button>
        </div>

        {/* Content - No Scroll */}
        <div className="p-3 mobile-L:p-4 space-y-3 mobile-L:space-y-4">
          
          {/* Reset Password Section */}
          <div 
            className="p-3 rounded-lg border transition-colors duration-300"
            style={{
              backgroundColor: theme.colors.pastelBg,
              borderColor: theme.colors.pastelBorder,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FiLock size={16} style={{ color: theme.colors.primary }} />
              <h3
                className="text-small mobile-L:text-body font-semibold transition-colors duration-300"
                style={{ color: theme.colors.pastelText }}
              >
                {t.settings.resetPassword.title}
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
              {t.settings.resetPassword.description.replace('{{email}}', user?.email || 'your email')}
            </p>

            <button
              type="button"
              onClick={handleSendResetEmail}
              disabled={isSendingResetEmail}
              className="w-full px-3 py-2 rounded-lg transition-all font-medium text-tiny mobile-L:text-small active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
              style={{
                backgroundColor: isSendingResetEmail ? '#858B8A' : theme.colors.primary,
              }}
              onMouseOver={(e) => {
                if (!isSendingResetEmail) {
                  e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
                }
              }}
              onMouseOut={(e) => {
                if (!isSendingResetEmail) {
                  e.currentTarget.style.backgroundColor = theme.colors.primary;
                }
              }}
            >
              {isSendingResetEmail ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t.settings.resetPassword.sending}
                </>
              ) : (
                <>
                  <FiLock size={14} />
                  {t.settings.resetPassword.button}
                </>
              )}
            </button>
          </div>
          
          {/* Preferences Section */}
          <div 
            className="p-3 rounded-lg border transition-colors duration-300"
            style={{
              backgroundColor: theme.colors.pastelBg,
              borderColor: theme.colors.pastelBorder,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FiGlobe size={16} style={{ color: theme.colors.primary }} />
              <h3
                className="text-small mobile-L:text-body font-semibold transition-colors duration-300"
                style={{ color: theme.colors.pastelText }}
              >
                {t.settings.preferences.title}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 mobile-L:grid-cols-2 gap-2 mobile-L:gap-3 mb-3">
              <div>
                <label className="block text-tiny mobile-L:text-small font-medium mb-1 text-gray-neutral700">
                  {t.settings.preferences.theme.label}
                </label>
                <select
                  name="theme"
                  value={themeName}
                  onChange={handleThemeChange}
                  className="w-full rounded-lg border border-gray-neutral300 bg-white p-2 text-tiny mobile-L:text-small transition-all outline-none text-gray-neutral900"
                  onFocus={(e) => {
                    e.currentTarget.style.outline = `2px solid ${theme.colors.primary}`;
                    e.currentTarget.style.outlineOffset = '2px';
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.borderColor = '#AEB2B1'; // gray-neutral300
                  }}
                >
                  <option value="classic">🎨 {t.settings.preferences.theme.classic}</option>
                  <option value="spring">🌸 {t.settings.preferences.theme.spring}</option>
                  <option value="summer">☀️ {t.settings.preferences.theme.summer}</option>
                  <option value="autumn">🍂 {t.settings.preferences.theme.autumn}</option>
                  <option value="winter">❄️ {t.settings.preferences.theme.winter}</option>
                </select>
              </div>

              <div>
                <label className="block text-tiny mobile-L:text-small font-medium mb-1 text-gray-neutral700">
                  {t.settings.preferences.language.label}
                </label>
                <select
                  name="language"
                  value={locale}
                  onChange={handleLanguageChange}
                  className="w-full rounded-lg border border-gray-neutral300 bg-white p-2 text-tiny mobile-L:text-small transition-all outline-none text-gray-neutral900"
                  onFocus={(e) => {
                    e.currentTarget.style.outline = `2px solid ${theme.colors.primary}`;
                    e.currentTarget.style.outlineOffset = '2px';
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.borderColor = '#AEB2B1'; // gray-neutral300
                  }}
                >
                  <option value="en">{t.settings.preferences.language.en}</option>
                  <option value="tl">{t.settings.preferences.language.tl}</option>
                </select>
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
            {t.settings.actions.cancel}
          </button>
          <button
            onClick={handleSave}
            className="w-full mobile-L:w-auto px-4 py-2 rounded-lg transition-all font-medium text-tiny mobile-L:text-small active:scale-[0.98] text-white"
            style={{
              backgroundColor: theme.colors.primary,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
          >
            {t.settings.actions.save}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
