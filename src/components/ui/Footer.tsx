// src/components/ui/Footer.tsx
'use client';
import { fontClasses } from '@/styles/fonts';
import { useState } from 'react';
import { FaTwitter, FaFacebook, FaEnvelope } from "react-icons/fa";
import { PrivacyPolicyModal } from '@/components/modals/PrivacyPolicyModal';
import { TermsOfServiceModal } from '@/components/modals/TermsOfServiceModal';
import { FAQsModal } from '@/components/modals/FAQsModal';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [emailCopied, setEmailCopied] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isFAQsModalOpen, setIsFAQsModalOpen] = useState(false);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('seesonjohnlau@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <>
      <footer 
        className="w-full py-6 tablet:py-8 flex flex-col items-center gap-6 tablet:gap-8 px-4 tablet:px-6 laptop:px-8 transition-colors duration-300"
        style={{ 
          background: `linear-gradient(to bottom, ${theme.landing.bgGradientMid}, ${theme.landing.bgGradientEnd})`
        }}
      >
        <div className="w-full max-w-6xl grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 gap-6 tablet:gap-8">
          {/* Column 1: Logo and Description */}
          <div className="flex flex-col items-center tablet:items-start max-w-xs mx-auto tablet:mx-0">
            <div className="mb-3">
              <img 
                className="h-10 tablet:h-12" 
                src="/image/hanapbuhay-variant-logo.svg" 
                alt="HanapBuhay Logo" 
              />
            </div>
            <div
              className={`text-center tablet:text-left text-small tablet:text-body font-normal leading-relaxed ${fontClasses.body} transition-colors duration-300`}
              style={{ color: theme.landing.bodyText }}
            >
              {t.home.hero.descriptionFooter}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center tablet:items-start">
            <div
              className={`text-lead tablet:text-h3 font-bold mb-3 ${fontClasses.heading} transition-colors duration-300`}
              style={{ color: theme.landing.headingPrimary }}
            >
              {t.components.footer.quickLinks}
            </div>
            {[
              { name: t.components.footer.benefits, action: () => handleScrollToSection('benefits') },
              { name: t.components.footer.recommendedJobs, action: () => handleScrollToSection('recommended-jobs') },
              { name: t.components.footer.popularCategories, action: () => handleScrollToSection('popular-categories') },
              { name: t.components.footer.privacy, action: () => setIsPrivacyModalOpen(true) },
              { name: t.components.footer.terms, action: () => setIsTermsModalOpen(true) },
            ].map((link) => (
              <button
                key={link.name}
                onClick={link.action}
                className={`text-small tablet:text-body font-normal leading-relaxed mb-1.5 hover:underline ${fontClasses.body} transition-colors duration-300`}
                style={{ color: theme.landing.bodyText }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.landing.accentPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.landing.bodyText;
                }}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col items-center tablet:items-start">
            <div
              className={`text-lead tablet:text-h3 font-bold mb-3 ${fontClasses.heading} transition-colors duration-300`}
              style={{ color: theme.landing.headingPrimary }}
            >
              {t.components.footer.support}
            </div>
            <button
              onClick={() => setIsFAQsModalOpen(true)}
              className={`text-small tablet:text-body font-normal leading-relaxed mb-1.5 hover:underline ${fontClasses.body} transition-colors duration-300`}
              style={{ color: theme.landing.bodyText }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.landing.accentPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.landing.bodyText;
              }}
            >
              {t.components.footer.faq}
            </button>
          </div>

          {/* Column 4: Follow Us */}
          <div className="flex flex-col items-center tablet:items-start">
            <div
              className={`text-lead tablet:text-h3 font-bold mb-3 ${fontClasses.heading} transition-colors duration-300`}
              style={{ color: theme.landing.headingPrimary }}
            >
              {t.components.footer.followUs}
            </div>
            <div className="flex gap-3 tablet:gap-4">
              {/* Twitter Icon */}
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 tablet:w-9 tablet:h-9 flex items-center justify-center rounded-full transition-all duration-300"
                aria-label="Twitter"
                style={{ color: theme.landing.bodyText }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.landing.iconBg;
                  e.currentTarget.style.color = theme.landing.accentPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.landing.bodyText;
                }}
              >
                <FaTwitter size={16} className="tablet:text-[18px]" />
              </a>
              
              {/* Facebook Icon */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 tablet:w-9 tablet:h-9 flex items-center justify-center rounded-full transition-all duration-300"
                aria-label="Facebook"
                style={{ color: theme.landing.bodyText }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.landing.iconBg;
                  e.currentTarget.style.color = theme.landing.accentPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.landing.bodyText;
                }}
              >
                <FaFacebook size={16} className="tablet:text-[18px]" />
              </a>
              
              {/* Gmail Icon */}
              <button
                onClick={copyEmailToClipboard}
                className="w-8 h-8 tablet:w-9 tablet:h-9 flex items-center justify-center rounded-full transition-all duration-300 relative"
                aria-label="Copy email to clipboard"
                style={{ color: theme.landing.bodyText }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.landing.iconBg;
                  e.currentTarget.style.color = theme.landing.accentPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.landing.bodyText;
                }}
              >
                <FaEnvelope size={16} className="tablet:text-[18px]" />
                
                {emailCopied && (
                  <div
                    className="absolute -top-8 text-xs px-2 py-1 rounded transition-colors duration-300"
                    style={{
                      backgroundColor: theme.landing.iconBg,
                      color: theme.landing.headingPrimary,
                      border: `1px solid ${theme.landing.iconBorder}`
                    }}
                  >
                    {t.components.footer.emailCopied}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={`text-center text-tiny tablet:text-small font-normal ${fontClasses.body} transition-colors duration-300`}
          style={{ color: theme.landing.bodyTextMuted }}
        >
          {t.components.footer.copyright}
        </div>
      </footer>

      {/* Modals */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
      <TermsOfServiceModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />
      <FAQsModal 
        isOpen={isFAQsModalOpen} 
        onClose={() => setIsFAQsModalOpen(false)} 
      />
    </>
  );
};

export default Footer;