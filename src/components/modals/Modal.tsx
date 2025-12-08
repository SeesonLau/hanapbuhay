'use client';

import { useTheme } from '@/hooks/useTheme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: theme.modal.overlay }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg p-6 w-96"
        style={{ backgroundColor: theme.modal.background }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 
            className="text-xl font-semibold"
            style={{ color: theme.colors.text }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: theme.modal.buttonClose }}
            onMouseOver={(e) => e.currentTarget.style.color = theme.modal.buttonCloseHover}
            onMouseOut={(e) => e.currentTarget.style.color = theme.modal.buttonClose}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};