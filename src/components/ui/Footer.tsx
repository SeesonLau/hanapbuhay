// src/components/ui/Footer.tsx
'use client';
import { getNeutral100Color, getNeutral600Color } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';
import { useState } from 'react';
import { FaTwitter, FaFacebook, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const [emailCopied, setEmailCopied] = useState(false);

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
    <footer 
      className="w-full py-12 flex flex-col items-center gap-16 px-4"
      style={{ backgroundColor: '#141515' }} // Changed to match page background
    >
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {/* Column 1: Logo and Description */}
        <div className="flex flex-col items-center md:items-start max-w-xs">
          <div className="mb-4">
            <img 
              className="h-14" 
              src="/image/hanapbuhay-variant-logo.svg" 
              alt="HanapBuhay Logo" 
            />
          </div>
          <div 
            className={`text-center md:text-left text-lg font-normal leading-relaxed ${fontClasses.body}`}
            style={{ color: getNeutral100Color() }}
          >
            Connecting local clients with skilled freelancers in the community.
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <div 
            className={`text-2xl font-bold mb-5 ${fontClasses.heading}`}
            style={{ color: getNeutral100Color() }}
          >
            Quick Links
          </div>
          {[
            { name: 'Benefits', action: () => handleScrollToSection('benefits') }, // Updated ID
            { name: 'How It Works', action: () => handleScrollToSection('how-it-works') }, // Updated ID
            { name: 'Testimonials', action: () => handleScrollToSection('testimonials') }, // Updated ID
            { name: 'Contact Us', action: () => handleScrollToSection('contact-us') }, // Added contact section
            { name: 'Privacy Policy', action: () => {} },
            { name: 'Terms of Service', action: () => {} },
          ].map((link) => (
            <button
              key={link.name}
              onClick={link.action}
              className={`text-lg font-normal leading-relaxed mb-2 hover:underline ${fontClasses.body}`}
              style={{ color: getNeutral100Color() }}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Column 3: Support */}
        <div className="flex flex-col items-center md:items-start">
          <div 
            className={`text-2xl font-bold mb-5 ${fontClasses.heading}`}
            style={{ color: getNeutral100Color() }}
          >
            Support
          </div>
          {['FAQs', 'Help Center'].map((link) => (
            <button
              key={link}
              className={`text-lg font-normal leading-relaxed mb-2 hover:underline ${fontClasses.body}`}
              style={{ color: getNeutral100Color() }}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Column 4: Follow Us */}
        <div className="flex flex-col items-center md:items-start">
          <div 
            className={`text-2xl font-bold mb-5 ${fontClasses.heading}`}
            style={{ color: getNeutral100Color() }}
          >
            Follow Us
          </div>
          <div className="flex gap-6">
            {/* Twitter Icon */}
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors"
              aria-label="Twitter"
              style={{ color: getNeutral100Color() }}
            >
              <FaTwitter size={20} />
            </a>
            
            {/* Facebook Icon */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors"
              aria-label="Facebook"
              style={{ color: getNeutral100Color() }}
            >
              <FaFacebook size={20} />
            </a>
            
            {/* Gmail Icon */}
            <button
              onClick={copyEmailToClipboard}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors relative"
              aria-label="Copy email to clipboard"
              style={{ color: getNeutral100Color() }}
            >
              <FaEnvelope size={20} />
              
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
        className={`text-center text-lg font-normal ${fontClasses.body}`}
        style={{ color: getNeutral100Color() }}
      >
        © 2025 HanapBuhay. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
