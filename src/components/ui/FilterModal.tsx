import React, { useEffect } from 'react';
import FilterSection, { FilterOptions } from './FilterSection';
import { useTheme } from '@/hooks/useTheme';

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: FilterOptions) => void;
  onClearAll?: () => void;
  initialFilters?: Partial<FilterOptions>;
  variant?: 'default' | 'appliedJobs';
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onClearAll,
  initialFilters,
  variant = 'default',
}) => {
  const { theme } = useTheme();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close modal when screen size changes to large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = (filters: FilterOptions) => {
    onApply?.(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with animation */}
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-in-out"
        style={{
          backgroundColor: theme.modal.overlay,
          opacity: isOpen ? 1 : 0,
        }}
        onClick={onClose}
      />

      {/* Modal Panel - Slide from left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-full max-w-[240px] shadow-2xl transform transition-all duration-300 ease-out flex flex-col"
        style={{
          backgroundColor: theme.modal.background,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Filter Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <FilterSection
            onApply={handleApply}
            onClearAll={onClearAll}
            initialFilters={initialFilters}
            className="w-full h-full"
            variant={variant}
          />
        </div>

        {/* Swipe indicator for mobile */}
        <div 
          className="sm:hidden absolute top-2 left-1/2 transform -translate-x-1/2"
        >
          <div 
            className="w-12 h-1 rounded-full transition-colors duration-300"
            style={{ backgroundColor: theme.colors.borderLight }}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterModal;