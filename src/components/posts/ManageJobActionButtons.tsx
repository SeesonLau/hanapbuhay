'use client';

import React from 'react';
import Button from '@/components/ui/Button';

interface ManageJobActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onViewApplicants: () => void;
  applicantCount?: number;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export const ManageJobActionButtons: React.FC<ManageJobActionButtonsProps> = ({
  onEdit,
  onDelete,
  onViewApplicants,
  applicantCount = 0,
  variant = 'vertical',
  className = ''
}) => {
  if (variant === 'horizontal') {
    return (
      <div className={`flex gap-0 ${className}`}>
        <button className="flex items-center justify-center flex-1 h-[30px] bg-white border border-gray-300 rounded-l-[10px] text-xs font-medium hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); onViewApplicants(); }}>
          <span className="text-blue-600 mr-1">{applicantCount}</span>
          <img src="/icons/profile.svg" alt="Applicants" className="w-[15px] h-[15px]" />
        </button>
        <button className="flex items-center justify-center flex-1 h-[30px] bg-white border-t border-b border-gray-300 hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
          <img src="/icons/edit.svg" alt="Edit" className="w-[15px] h-[15px]" />
        </button>
        <button className="flex items-center justify-center flex-1 h-[30px] bg-white border border-gray-300 rounded-r-[10px] hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
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