// src/components/modals/PrivacyPolicyModal.tsx
'use client';

import { LegalModal } from './LegalModal';
import { fontClasses } from '@/styles/fonts';
import { useTheme } from '@/hooks/useTheme';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();

  return (
    <LegalModal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <div className={`space-y-6 ${fontClasses.body}`}>
        {/* Last Updated */}
        <p 
          className="text-small mobile-M:text-body"
          style={{ color: theme.colors.textMuted }}
        >
          Last updated: December 5, 2025
        </p>

        {/* Introduction */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Introduction
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            Welcome to HanapBuhay. We are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Information We Collect
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed mb-3"
            style={{ color: theme.colors.textSecondary }}
          >
            We collect information that you provide directly to us, including:
          </p>
          <ul 
            className="list-disc list-inside space-y-2 text-small mobile-M:text-body ml-2 mobile-M:ml-4"
            style={{ color: theme.colors.textSecondary }}
          >
            <li>Account information (name, email, password)</li>
            <li>Profile information (skills, experience, location)</li>
            <li>Job posting details and applications</li>
            <li>Communications between users</li>
            <li>Ratings and reviews</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            How We Use Your Information
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed mb-3"
            style={{ color: theme.colors.textSecondary }}
          >
            We use the information we collect to:
          </p>
          <ul 
            className="list-disc list-inside space-y-2 text-small mobile-M:text-body ml-2 mobile-M:ml-4"
            style={{ color: theme.colors.textSecondary }}
          >
            <li>Provide, maintain, and improve our services</li>
            <li>Connect workers with clients in their local community</li>
            <li>Process job applications and facilitate communication</li>
            <li>Send notifications about job opportunities and updates</li>
            <li>Ensure the security and integrity of our platform</li>
            <li>Respond to your inquiries and provide customer support</li>
          </ul>
        </section>

        {/* Information Sharing */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Information Sharing
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            We do not sell your personal information. We may share your information only in the following circumstances:
          </p>
          <ul 
            className="list-disc list-inside space-y-2 text-small mobile-M:text-body ml-2 mobile-M:ml-4 mt-3"
            style={{ color: theme.colors.textSecondary }}
          >
            <li>With other users as necessary to facilitate job connections</li>
            <li>With service providers who assist in operating our platform</li>
            <li>When required by law or to protect our rights</li>
            <li>With your consent</li>
          </ul>
        </section>

        {/* Data Security */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Data Security
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            We implement appropriate technical and organizational security measures to protect your personal information. 
            However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* Your Rights */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Your Rights
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed mb-3"
            style={{ color: theme.colors.textSecondary }}
          >
            You have the right to:
          </p>
          <ul 
            className="list-disc list-inside space-y-2 text-small mobile-M:text-body ml-2 mobile-M:ml-4"
            style={{ color: theme.colors.textSecondary }}
          >
            <li>Access and update your personal information</li>
            <li>Delete your account and associated data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request a copy of your data</li>
          </ul>
        </section>

        {/* Contact Us */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Contact Us
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            If you have questions about this Privacy Policy, please contact us at{' '}
            <span style={{ color: theme.colors.primary }}>support@hanapbuhay.com</span>
          </p>
        </section>
      </div>
    </LegalModal>
  );
};

export default PrivacyPolicyModal;