import React, { useEffect } from 'react';
import FilterSection, { FilterOptions } from './FilterSection';

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: FilterOptions) => void;
  onClearAll?: () => void;
  initialFilters?: Partial<FilterOptions>;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onClearAll,
  initialFilters,
}) => {
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
      // Check if screen is lg or larger (1024px)
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
        className="absolute inset-0 bg-black transition-opacity duration-300 ease-in-out"
        style={{
          opacity: isOpen ? 0.5 : 0,
        }}
        onClick={onClose}
      />

      {/* Modal Panel - Slide from left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-full max-w-[240px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col"
        style={{
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
          />
        </div>

        {/* Swipe indicator for mobile */}
        <div className="sm:hidden absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-1 bg-gray-neutral300 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
