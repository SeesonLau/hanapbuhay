// src/components/modals/LegalModal.tsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { fontClasses } from '@/styles/fonts';
import { useTheme } from '@/hooks/useTheme';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;
      
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 mobile-M:p-6 tablet:p-8"
          onWheel={handleWheel}
          onTouchMove={handleTouchMove}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: theme.modal.overlay }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[95vw] mobile-M:max-w-[90vw] tablet:max-w-2xl laptop:max-w-3xl max-h-[85vh] rounded-2xl mobile-M:rounded-3xl flex flex-col"
            style={{
              background: theme.modal.background,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.modal.headerBorder}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              className="flex-shrink-0 flex items-center justify-between p-4 mobile-M:p-5 tablet:p-6 border-b"
              style={{ 
                borderColor: theme.modal.headerBorder,
                background: theme.modal.background
              }}
            >
              <h2 
                className={`text-lead mobile-M:text-h3 tablet:text-h2 font-bold ${fontClasses.heading}`}
                style={{ color: theme.colors.text }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 mobile-M:w-10 mobile-M:h-10 flex items-center justify-center rounded-full transition-all duration-200"
                style={{ color: theme.modal.buttonClose }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                  e.currentTarget.style.color = theme.modal.buttonCloseHover;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.modal.buttonClose;
                }}
              >
                <FaTimes className="text-sm mobile-M:text-base" />
              </button>
            </div>
            
            {/* Content - scrollable */}
            <div 
              className="flex-1 p-4 mobile-M:p-5 tablet:p-6 overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;