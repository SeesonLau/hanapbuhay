// src/components/modals/FAQsModal.tsx
// src/components/modals/FAQsModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { LegalModal } from './LegalModal';
import { fontClasses } from '@/styles/fonts';
import { useTheme } from '@/hooks/useTheme';

interface FAQsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'workers' | 'clients' | 'account';
}

const faqs: FAQItem[] = [
  // General
  {
    category: 'general',
    question: 'What is HanapBuhay?',
    answer: 'HanapBuhay is a platform that connects local clients with skilled workers and freelancers in their community. Whether you need help with home repairs, digital services, or any skilled work, HanapBuhay makes it easy to find trusted professionals nearby.'
  },
  {
    category: 'general',
    question: 'Is HanapBuhay free to use?',
    answer: 'Yes! Creating an account and browsing job listings is completely free. Workers can apply to jobs at no cost, and clients can post jobs without any fees. We believe in making local job connections accessible to everyone.'
  },
  {
    category: 'general',
    question: 'How does the rating system work?',
    answer: 'After completing a job, both clients and workers can leave ratings and reviews for each other. Ratings are on a 5-star scale and help build trust within the community. Higher-rated users are more likely to be chosen for jobs.'
  },
  // For Workers
  {
    category: 'workers',
    question: 'How do I find jobs on HanapBuhay?',
    answer: 'After creating your account, go to the "Find Jobs" section. You can browse available jobs, filter by category, location, and salary range. When you find a job that matches your skills, simply click "Apply" and wait for the client to respond.'
  },
  {
    category: 'workers',
    question: 'How do I make my profile stand out?',
    answer: 'Complete your profile with detailed information about your skills and experience. Add any certifications or past work examples. Maintain a good rating by providing quality service, and always communicate professionally with clients.'
  },
  {
    category: 'workers',
    question: 'Can I work in multiple job categories?',
    answer: 'Absolutely! You can add multiple skills to your profile and apply to jobs across different categories. This increases your chances of finding work that matches your abilities.'
  },
  // For Clients
  {
    category: 'clients',
    question: 'How do I post a job?',
    answer: 'Click on "Post a Job" or go to "Manage Job Posts" in your dashboard. Fill in the job details including title, description, required skills, location, and your budget. Once posted, workers in your area can view and apply to your job.'
  },
  {
    category: 'clients',
    question: 'How do I choose the right worker?',
    answer: 'Review applicants\' profiles, including their skills, experience, and ratings from previous clients. You can also check their completed projects and reviews. Take your time to find someone who best fits your needs.'
  },
  {
    category: 'clients',
    question: 'What if I\'m not satisfied with the work?',
    answer: 'We encourage open communication between clients and workers. If issues arise, try to resolve them directly first. You can leave an honest review after the job is completed. For serious concerns, contact our support team.'
  },
  // Account
  {
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you a link to reset your password. Make sure to check your spam folder if you don\'t see the email.'
  },
  {
    category: 'account',
    question: 'Can I delete my account?',
    answer: 'Yes, you can delete your account through your profile settings. Please note that this action is permanent and will remove all your data, including job history, reviews, and messages.'
  },
  {
    category: 'account',
    question: 'How do I update my profile information?',
    answer: 'Go to your Profile page and click "Edit Profile". You can update your personal information, skills, experience, and profile picture. Remember to save your changes before leaving the page.'
  }
];

const categoryLabels: Record<string, string> = {
  general: 'General',
  workers: 'For Workers',
  clients: 'For Clients',
  account: 'Account & Settings'
};

const FAQAccordion: React.FC<{ faq: FAQItem; isOpen: boolean; onToggle: () => void }> = ({ 
  faq, 
  isOpen, 
  onToggle 
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-xl mobile-M:rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border: `1px solid ${isOpen ? theme.modal.accordionBorderActive : theme.modal.accordionBorder}`,
        backgroundColor: isOpen ? theme.modal.accordionBgActive : theme.modal.accordionBg
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 mobile-M:p-4 tablet:p-5 text-left"
      >
        <span 
          className={`text-small mobile-M:text-body tablet:text-lead font-medium pr-4 ${fontClasses.heading}`}
          style={{ color: theme.modal.accordionText }}
        >
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
          style={{ color: theme.colors.primary }}
        >
          <FaChevronDown className="text-xs mobile-M:text-sm" />
        </motion.span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 mobile-M:px-4 tablet:px-5 pb-3 mobile-M:pb-4 tablet:pb-5 pt-0">
              <p 
                className={`text-small mobile-M:text-body leading-relaxed ${fontClasses.body}`}
                style={{ color: theme.modal.accordionTextMuted }}
              >
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQsModal: React.FC<FAQsModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('general');

  const categories = ['general', 'workers', 'clients', 'account'];
  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <LegalModal isOpen={isOpen} onClose={onClose} title="Frequently Asked Questions">
      <div className="space-y-4 mobile-M:space-y-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mobile-M:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setOpenIndex(null);
              }}
              className={`px-3 mobile-M:px-4 py-1.5 mobile-M:py-2 rounded-full text-tiny mobile-M:text-small font-medium transition-all duration-200 ${fontClasses.body}`}
              style={{
                backgroundColor: activeCategory === category 
                  ? theme.modal.categoryTabBgActive
                  : theme.modal.categoryTabBg,
                border: `1px solid ${activeCategory === category 
                  ? theme.modal.categoryTabBorderActive
                  : theme.modal.categoryTabBorder}`,
                color: activeCategory === category 
                  ? theme.modal.categoryTabTextActive
                  : theme.modal.categoryTabText
              }}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-2 mobile-M:space-y-3">
          {filteredFaqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* Contact Support */}
        <div 
          className="p-4 mobile-M:p-5 rounded-xl mobile-M:rounded-2xl text-center"
          style={{
            backgroundColor: theme.modal.infoBg,
            border: `1px solid ${theme.modal.infoBorder}`
          }}
        >
          <p 
            className={`text-small mobile-M:text-body mb-2 ${fontClasses.body}`}
            style={{ color: theme.modal.infoText }}
          >
            Can't find what you're looking for?
          </p>
          <p 
            className={`text-small mobile-M:text-body ${fontClasses.body}`}
            style={{ color: theme.modal.infoText }}
          >
            Contact us at{' '}
            <span style={{ color: theme.modal.infoTextAccent }}>
              support@hanapbuhay.com
            </span>
          </p>
        </div>
      </div>
    </LegalModal>
  );
};

export default FAQsModal;