// src/components/ui/Footer.tsx
'use client';
import { getNeutral100Color, getNeutral600Color } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';
import { useState } from 'react';
import { FaTwitter, FaFacebook, FaEnvelope } from "react-icons/fa";
import { PrivacyPolicyModal } from '@/components/modals/PrivacyPolicyModal';
import { TermsOfServiceModal } from '@/components/modals/TermsOfServiceModal';
import { FAQsModal } from '@/components/modals/FAQsModal';

const Footer = () => {
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
        className="w-full py-6 tablet:py-8 flex flex-col items-center gap-6 tablet:gap-8 px-4 tablet:px-6 laptop:px-8"
        style={{ backgroundColor: '#141515' }}
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
              className={`text-center tablet:text-left text-small tablet:text-body font-normal leading-relaxed ${fontClasses.body}`}
              style={{ color: getNeutral100Color() }}
            >
              Connecting local clients with skilled freelancers in the community.
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center tablet:items-start">
            <div 
              className={`text-lead tablet:text-h3 font-bold mb-3 ${fontClasses.heading}`}
              style={{ color: getNeutral100Color() }}
            >
              Quick Links
            </div>
            {[
              { name: 'Benefits', action: () => handleScrollToSection('benefits') },
              { name: 'How It Works', action: () => handleScrollToSection('how-it-works') },
              { name: 'Popular Categories', action: () => handleScrollToSection('popular-categories') },
              { name: 'Privacy Policy', action: () => setIsPrivacyModalOpen(true) },
              { name: 'Terms of Service', action: () => setIsTermsModalOpen(true) },
            ].map((link) => (
              <button
                key={link.name}
                onClick={link.action}
                className={`text-small tablet:text-body font-normal leading-relaxed mb-1.5 hover:underline ${fontClasses.body}`}
                style={{ color: getNeutral100Color() }}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col items-center tablet:items-start">
            <div 
              className={`text-lead tablet:text-h3 font-bold mb-3 ${fontClasses.heading}`}
              style={{ color: getNeutral100Color() }}
            >
              Support
            </div>
            <button
              onClick={() => setIsFAQsModalOpen(true)}
              className={`text-small tablet:text-body font-normal leading-relaxed mb-1.5 hover:underline ${fontClasses.body}`}
              style={{ color: getNeutral100Color() }}
            >
              FAQs
            </button>
          </div>

        {/* Column 4: Follow Us */}
        <div className="flex flex-col items-center tablet:items-start">
          <div 
            className={`text-lead tablet:text-h3 font-bold mb-3 ${fontClasses.heading}`}
            style={{ color: getNeutral100Color() }}
          >
            Follow Us
          </div>
          <div className="flex gap-3 tablet:gap-4">
            {/* Twitter Icon */}
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 tablet:w-9 tablet:h-9 flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors"
              aria-label="Twitter"
              style={{ color: getNeutral100Color() }}
            >
              <FaTwitter size={16} className="tablet:text-[18px]" />
            </a>
            
            {/* Facebook Icon */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 tablet:w-9 tablet:h-9 flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors"
              aria-label="Facebook"
              style={{ color: getNeutral100Color() }}
            >
              <FaFacebook size={16} className="tablet:text-[18px]" />
            </a>
            
            {/* Gmail Icon */}
            <button
              onClick={copyEmailToClipboard}
              className="w-8 h-8 tablet:w-9 tablet:h-9 flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors relative"
              aria-label="Copy email to clipboard"
              style={{ color: getNeutral100Color() }}
            >
              <FaEnvelope size={16} className="tablet:text-[18px]" />
              
              {emailCopied && (
                <div className="absolute -top-8 bg-neutral-800 text-white text-xs px-2 py-1 rounded">
                  Copied!
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div 
        className={`text-center text-tiny tablet:text-small font-normal ${fontClasses.body}`}
        style={{ color: getNeutral100Color() }}
      >
        © 2025 HanapBuhay. All rights reserved.
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