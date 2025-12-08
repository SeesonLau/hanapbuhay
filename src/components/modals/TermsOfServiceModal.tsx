// src/components/modals/TermsOfServiceModal.tsx
'use client';

import { LegalModal } from './LegalModal';
import { fontClasses } from '@/styles/fonts';
import { useTheme } from '@/hooks/useTheme';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();

  return (
    <LegalModal isOpen={isOpen} onClose={onClose} title="Terms of Service">
      <div className={`space-y-6 ${fontClasses.body}`}>
        {/* Last Updated */}
        <p 
          className="text-small mobile-M:text-body"
          style={{ color: theme.colors.textMuted }}
        >
          Last updated: December 5, 2025
        </p>

        {/* Agreement */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Agreement to Terms
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            By accessing or using HanapBuhay, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our platform.
          </p>
        </section>

        {/* Description of Service */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Description of Service
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            HanapBuhay is a platform that connects local clients with skilled workers and freelancers in their community. 
            We provide tools for job posting, applications, messaging, and profile management to facilitate these connections.
          </p>
        </section>

        {/* User Accounts */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            User Accounts
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed mb-3"
            style={{ color: theme.colors.textSecondary }}
          >
            When creating an account, you agree to:
          </p>
          <ul 
            className="list-disc list-inside space-y-2 text-small mobile-M:text-body ml-2 mobile-M:ml-4"
            style={{ color: theme.colors.textSecondary }}
          >
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly update any changes to your information</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Not share your account with others</li>
          </ul>
        </section>

        {/* User Conduct */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            User Conduct
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed mb-3"
            style={{ color: theme.colors.textSecondary }}
          >
            You agree not to:
          </p>
          <ul 
            className="list-disc list-inside space-y-2 text-small mobile-M:text-body ml-2 mobile-M:ml-4"
            style={{ color: theme.colors.textSecondary }}
          >
            <li>Post false, misleading, or fraudulent content</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to the platform</li>
            <li>Use the platform for any illegal activities</li>
            <li>Spam or send unsolicited communications</li>
          </ul>
        </section>

        {/* Job Postings */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Job Postings and Applications
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            Clients are responsible for the accuracy of their job postings. Workers are responsible for 
            accurately representing their skills and qualifications. HanapBuhay is not a party to any 
            agreement between clients and workers and is not responsible for the quality of work performed 
            or payments between users.
          </p>
        </section>

        {/* Ratings and Reviews */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Ratings and Reviews
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            Users may leave ratings and reviews for completed jobs. Reviews must be honest, fair, and based 
            on actual experiences. We reserve the right to remove reviews that violate our guidelines.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Limitation of Liability
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            HanapBuhay is provided "as is" without warranties of any kind. We are not liable for any 
            damages arising from your use of the platform, including but not limited to disputes between 
            users, loss of data, or service interruptions.
          </p>
        </section>

        {/* Termination */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Termination
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            We reserve the right to suspend or terminate your account at any time for violations of these 
            terms or for any other reason at our discretion. You may also delete your account at any time 
            through your account settings.
          </p>
        </section>

        {/* Changes to Terms */}
        <section>
          <h3 
            className={`text-body mobile-M:text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
            style={{ color: theme.colors.text }}
          >
            Changes to Terms
          </h3>
          <p 
            className="text-small mobile-M:text-body leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            We may update these Terms of Service from time to time. We will notify users of significant 
            changes. Continued use of the platform after changes constitutes acceptance of the new terms.
          </p>
        </section>

        {/* Contact */}
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
            For questions about these Terms of Service, please contact us at{' '}
            <span style={{ color: theme.colors.primary }}>support@hanapbuhay.com</span>
          </p>
        </section>
      </div>
    </LegalModal>
  );
};

export default TermsOfServiceModal;