'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';

interface ManageJobActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onViewApplicants: () => void;
  applicantCount?: number;
  variant?: 'horizontal' | 'vertical' | 'compact';
  className?: string;
  showLockToggle?: boolean;
  isOpenLock?: boolean;
  onToggleLock?: () => void;
}

export const ManageJobActionButtons: React.FC<ManageJobActionButtonsProps> = ({
  onEdit,
  onDelete,
  onViewApplicants,
  applicantCount = 0,
  variant = 'vertical',
  className = '',
  showLockToggle = false,
  isOpenLock = true,
  onToggleLock,
}) => {
  const { theme } = useTheme();

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <button 
          className="inline-flex items-center justify-center h-[30px] px-3 border rounded-[10px] text-xs font-medium transition-colors" 
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderLight,
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.colors.surface}
          onClick={(e) => { e.stopPropagation(); onViewApplicants(); }}
        >
          <span 
            className="mr-1"
            style={{ color: theme.colors.primary }}
          >
            {applicantCount}
          </span>
          <img src="/icons/profile.svg" alt="Applicants" className="w-[15px] h-[15px]" />
        </button>
        <button 
          className="inline-flex items-center justify-center h-[30px] w-[36px] border rounded-[10px] transition-colors" 
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderLight,
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.colors.surface}
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
        >
          <img src="/icons/edit.svg" alt="Edit" className="w-[15px] h-[15px]" />
        </button>
        <button 
          className="inline-flex items-center justify-center h-[30px] w-[36px] border rounded-[10px] transition-colors" 
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderLight,
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.colors.surface}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <img src="/icons/delete.svg" alt="Delete" className="w-[15px] h-[15px]" />
        </button>
        {showLockToggle && (
          <button
            className="inline-flex items-center justify-center h-[30px] px-2 rounded-[10px] border transition-colors"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.borderLight,
              color: isOpenLock ? theme.colors.success : theme.colors.textMuted
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.colors.surface}
            onClick={(e) => { e.stopPropagation(); onToggleLock?.(); }}
            aria-label={isOpenLock ? 'Open' : 'Closed'}
          >
            {isOpenLock ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10V7a5 5 0 019.5-2" />
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <circle cx="12" cy="15" r="1.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10V7a5 5 0 0110 0v3" />
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <circle cx="12" cy="15" r="1.5" />
              </svg>
            )}
          </button>
        )}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex gap-0 ${className}`}>
        <button 
          className="flex items-center justify-center flex-1 h-[30px] border rounded-l-[10px] text-xs font-medium transition-colors" 
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderLight,
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.colors.surface}
          onClick={(e) => { e.stopPropagation(); onViewApplicants(); }}
        >
          <span 
            className="mr-1"
            style={{ color: theme.colors.primary }}
          >
            {applicantCount}
          </span>
          <img src="/icons/profile.svg" alt="Applicants" className="w-[15px] h-[15px]" />
        </button>
        <button 
          className="flex items-center justify-center flex-1 h-[30px] border-t border-b transition-colors" 
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderLight,
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.colors.surface}
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
        >
          <img src="/icons/edit.svg" alt="Edit" className="w-[15px] h-[15px]" />
        </button>
        <button 
          className="flex items-center justify-center flex-1 h-[30px] border rounded-r-[10px] transition-colors" 
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderLight,
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.colors.surface}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <img src="/icons/delete.svg" alt="Delete" className="w-[15px] h-[15px]" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-row gap-2 ${className}`}>
      <Button
        variant="primary"
        onClick={onViewApplicants}
      >
        View Applicants {applicantCount > 0 && `(${applicantCount})`}
      </Button>
      <Button
        variant="secondary"
        onClick={onEdit}
      >
        Edit
      </Button>
      <Button
        variant="danger"
        onClick={onDelete}
      >
        Delete
      </Button>
    </div>
  );
};

export default ManageJobActionButtons;
