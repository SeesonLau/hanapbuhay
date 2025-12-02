import React, { useEffect } from 'react';
import Button from './Button';
import { COLORS } from '@/styles/colors';
import { TYPOGRAPHY } from '@/styles/typography';

// --- SVG Icons ---
// For simplicity, icons are defined directly in this file.
// In a larger application, you might move these to their own files.

export const TrashIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} width="53" height="53" viewBox="0 0 53 54" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M39.75 20.375L37.895 38.9206C37.6145 41.7318 37.4754 43.1363 36.835 44.1985C36.2733 45.1335 35.4472 45.8812 34.461 46.3472C33.3414 46.875 31.9325 46.875 29.1058 46.875H23.8942C21.0697 46.875 19.6586 46.875 18.539 46.345C17.5519 45.8794 16.7251 45.1316 16.1628 44.1963C15.5268 43.1363 15.3855 41.7318 15.1028 38.9206L13.25 20.375M29.8125 34.7292V23.6875M23.1875 34.7292V23.6875M9.9375 14.8542H20.129M20.129 14.8542L20.9814 8.9535C21.2287 7.88025 22.1209 7.125 23.1455 7.125H29.8545C30.8791 7.125 31.7691 7.88025 32.0186 8.9535L32.871 14.8542M20.129 14.8542H32.871M32.871 14.8542H43.0625" />
  </svg>
);

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const BriefcaseIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} width="53" height="53" viewBox="0 0 40 40" fill="currentColor" stroke="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M3.33398 20.45C7.59834 22.109 12.0985 23.0822 16.6673 23.3334V26.6666H23.334V23.3334C27.8918 23.0479 32.3835 22.099 36.6673 20.5166V33.3334H3.33398V20.45ZM25.0006 5L26.6673 6.66664V10H36.6673V18.6834C31.557 20.5914 26.1551 21.6007 20.7006 21.6666H19.5006C13.973 21.6068 8.49957 20.5686 3.33398 18.6V10H13.334V6.66664L15.0006 5H25.0006ZM23.334 8.33336H16.6673V10H23.334V8.33336Z" />
  </svg>
);

export const UserReviewIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} width="53" height="53" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
    <path d="m12 15 1.57-3.43L17 10l-3.43-1.57L12 5l-1.57 3.43L7 10l3.43 1.57L12 15z"/>
    <path d="M4 17.17L5.17 16H20V4H4v13.17zm6.43-8.74L12 5l1.57 3.43L17 10l-3.43 1.57L12 15l-1.57-3.43L7 10l3.43-1.57z" opacity="0.25"/>
  </svg>
);

// A map to easily select the icon component based on the variant prop
const iconMap = {
  delete: TrashIcon,
  apply: BriefcaseIcon,
  review: UserReviewIcon,
};

/**
 * Defines the unique identifier for each type of modal.
 * This ensures type safety and enables autocompletion.
 */
export type ModalType =
  | 'deleteJobPost'
  | 'deleteAccount'
  | 'withdrawApplication'
  | 'deleteWorkExperience'
  | 'deleteWorkerReview'
  | 'createApplication'
  | 'deleteProject';

/**
 * Defines the structure for the content of each modal variant.
 */
interface ModalContent {
  variant: 'delete' | 'apply' | 'review'; // Determines which icon and color scheme to use
  title: string;
  description: string;
  confirmText: string;
}

/**
 * A centralized constant object that holds all the text and configuration
 * for the different modal variants.
 */
export const MODAL_CONTENT: Record<ModalType, ModalContent> = {
  deleteJobPost: {
    variant: 'delete',
    title: 'Delete Job Post?',
    description: 'This action cannot be undone.',
    confirmText: 'Delete',
  },
  deleteAccount: {
    variant: 'delete',
    title: 'Deleting Account',
    description: 'Are you sure you want to delete your account?',
    confirmText: 'Delete',
  },
  withdrawApplication: {
    variant: 'apply',
    title: 'Job Application Withdrawal',
    description: 'Are you sure you want to withdraw from this job?',
    confirmText: 'Withdraw',
  },
  deleteWorkExperience: {
    variant: 'apply',
    title: 'Deleting Work Experience',
    description: 'Are you sure you want to delete this work experience?',
    confirmText: 'Delete',
  },
  deleteWorkerReview: {
    variant: 'review',
    title: 'Deleting Worker Review',
    description: 'Are you sure you want to delete this worker review?',
    confirmText: 'Delete',
  },
  createApplication: {
    variant: 'apply',
    title: 'Confirm Application',
    description: 'Are you sure you want to proceed with this job application?',
    confirmText: 'Proceed',
  },
  deleteProject: {
    variant: 'delete',
    title: 'Delete Project',
    description: 'Are you sure you want to delete this project? This action cannot be undone.',
    confirmText: 'Delete',
  },
};

// --- Component Props ---
export interface DeleteModalProps {
  /** Controls the visibility of the modal */
  isOpen: boolean;
  /** Function to call when the modal should be closed (e.g., clicking cancel or the backdrop) */
  onClose: () => void;
  /** Function to call when the confirmation button is clicked */
  onConfirm: () => void;
  /** The type of modal to display, which determines the text, icon, and color scheme. */
  modalType: ModalType;
  /** Optional text for the cancel button */
  cancelText?: string;
  /** Optional flag to show a loading state on the confirm button */
  isProcessing?: boolean;
}

/**
 * A reusable modal component for confirming destructive actions like deletion or withdrawal.
 * It is highly customizable through props to fit various use cases.
 */
export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  modalType,
  cancelText = 'Cancel',
  isProcessing = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      const prevHtml = document.documentElement.style.overflow;
      const prevBody = document.body.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = prevHtml;
        document.body.style.overflow = prevBody;
      };
    }
  }, [isOpen]);
  // Render nothing if the modal is not open
  if (!isOpen) {
    return null;
  }

  // Get the content for the specified modal type
  const { title, description, confirmText, variant } = MODAL_CONTENT[modalType];

  // Select the appropriate icon component based on the variant prop
  const IconComponent = iconMap[variant];

  // Define color schemes for each variant based on tailwind.config.js
  const colorSchemes = {
    delete: {
      gradientFrom: COLORS.error.error100, // #FEE2E2
      gradientTo: COLORS.error.error400,     // #F87172
      iconBg: COLORS.error.error200,         // #FECACA
      iconColor: COLORS.error.error500,      // #EE4546
      confirmBg: COLORS.error.error500,      // #EE4546
      confirmHoverBg: COLORS.error.error600, // #DD3031
    },
    apply: {
      gradientFrom: COLORS.primary.primary100, // #D9ECFF
      gradientTo: COLORS.primary.primary400,   // #59ACFF
      iconBg: COLORS.primary.primary200,       // #BCDEFF
      iconColor: COLORS.primary.primary500,    // #3289FF
      confirmBg: COLORS.primary.primary500,    // #3289FF
      confirmHoverBg: COLORS.primary.primary600, // #1C6AF4
    },
    review: {
      gradientFrom: COLORS.secondary.secondary100, // #DDE4FF
      gradientTo: COLORS.secondary.secondary400,   // #757CFF
      iconBg: COLORS.secondary.secondary200,       // #C2CCFF
      iconColor: COLORS.secondary.secondary500,    // #4A46FF
      confirmBg: COLORS.secondary.secondary500,    // #4A46FF
      confirmHoverBg: COLORS.secondary.secondary600, // #4936F5
    },
  };

  const colors = colorSchemes[variant];

  return (
    // Backdrop overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="relative mx-auto flex h-auto w-[90%] min-w-[280px] max-w-[360px] flex-col items-center overflow-hidden rounded-[20px] bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red gradient bar */}
        <div 
          className="h-[12px] w-full self-stretch"
          style={{
            background: `linear-gradient(270deg, ${colors.gradientFrom} 0%, ${colors.gradientTo} 100%)`
          }} 
        />

        {/* Content wrapper with padding and gap */}
        <div className="flex flex-col items-center w-full gap-3 pb-6">
          {/* Icon container */}
          <div 
            className="mt-3 flex h-14 w-14 flex-row items-center justify-center gap-[10px] rounded-[50px] p-0"
            style={{ backgroundColor: colors.iconBg }}
          >
            <IconComponent className="h-6 w-6 flex-none" style={{ color: colors.iconColor }} />
          </div>

          {/* Title */}
          <h3 
            className="h-auto w-auto self-stretch text-center"
            style={{ 
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '22px',
              color: colors.iconColor,
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p 
            className="h-auto w-auto self-stretch text-center"
            style={{ 
              fontFamily: 'Alexandria',
              fontWeight: 300,
              fontSize: '12px',
              lineHeight: '15px',
              color: '#444645', // Neutral/800
            }}
          >
            {description}
          </p>

          {/* Action Buttons */}
          <div className="box-border mt-2 flex h-8 w-full flex-row items-center self-stretch px-6 gap-3">
            <Button
              onClick={onClose}
              disabled={isProcessing}
              variant="secondary"
              size="lg"
              className="h-8 flex-1 cursor-pointer rounded-[5px]"
              style={{
                backgroundColor: '#E6E7E7', // gray.default
                color: '#858B8A', // gray.neutral400
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '15px',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = COLORS.gray.hover;
                  e.currentTarget.style.color = COLORS.gray.neutral50;
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = '#E6E7E7';
                  e.currentTarget.style.color = '#858B8A';
                }
              }}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              isLoading={isProcessing}
              variant="danger"
              size="lg"
              className="h-8 flex-1 cursor-pointer rounded-[5px]"
              style={{
                backgroundColor: colors.confirmBg,
                color: '#FAFAFA', // gray.neutral50
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '15px',
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = colors.confirmHoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = colors.confirmBg;
                }
              }}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : null}
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;