import React from 'react';
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
  trash: TrashIcon,
  briefcase: BriefcaseIcon,
  review: UserReviewIcon,
};

// --- Component Props ---
export interface DeleteModalProps {
  /** Controls the visibility of the modal */
  isOpen: boolean;
  /** Function to call when the modal should be closed (e.g., clicking cancel or the backdrop) */
  onClose: () => void;
  /** Function to call when the confirmation button is clicked */
  onConfirm: () => void;
  /** The main title of the modal */
  title: string;
  /** The descriptive text below the title */
  description: string;
  /** The text for the confirmation button (e.g., "Delete", "Withdraw") */
  confirmText: string;
  /** The variant determines which icon is displayed. 'trash' for deletion, 'briefcase' for job-related actions, 'review' for user reviews. */
  variant: 'trash' | 'briefcase' | 'review';
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
  title,
  description,
  confirmText,
  variant,
  cancelText = 'Cancel',
  isProcessing = false,
}) => {
  // Render nothing if the modal is not open
  if (!isOpen) {
    return null;
  }

  // Select the appropriate icon component based on the variant prop
  const IconComponent = iconMap[variant];

  return (
    // Backdrop overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="flex flex-col items-center w-[650px] bg-white rounded-[30px] overflow-hidden"
        style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red gradient bar */}
        <div 
          className="w-full h-[20px]"
          style={{
            background: `linear-gradient(270deg, ${COLORS.red.neutral100} 0%, ${COLORS.red.neutral600} 100%)`
          }} 
        />

        {/* Content wrapper with padding and gap */}
        <div className="flex flex-col items-center w-full pt-[41px] px-[27px] pb-[30px]">
          {/* Icon container */}
          <div 
            className="flex items-center justify-center w-[100px] h-[100px] rounded-full mb-[41px]"
            style={{ backgroundColor: COLORS.red.neutral200 }}
          >
            <IconComponent className="w-[53px] h-[53px]" style={{ color: COLORS.red.neutral500 }} />
          </div>

          {/* Title */}
          <h3 
            className="text-center mb-[20px]"
            style={{ 
              color: COLORS.red.neutral500,
              fontFamily: TYPOGRAPHY.title.fontFamily,
              fontWeight: TYPOGRAPHY.title.fontWeight,
              fontSize: TYPOGRAPHY.title.fontSize,
              lineHeight: TYPOGRAPHY.title.lineHeight
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p 
            className="text-center mb-[41px]"
            style={{ 
              color: COLORS.gray.neutral700,
              fontFamily: TYPOGRAPHY.description.fontFamily,
              fontWeight: TYPOGRAPHY.description.fontWeight,
              fontSize: TYPOGRAPHY.description.fontSize,
              lineHeight: TYPOGRAPHY.description.lineHeight
            }}
          >
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-row items-center gap-[30px] w-full">
            <Button
              onClick={onClose}
              disabled={isProcessing}
              variant="secondary"
              size="lg"
              className="flex-1 h-[58px] rounded-[10px]"
              style={{
                backgroundColor: COLORS.gray.default,
                border: `1px solid ${COLORS.gray.default}`,
                color: COLORS.gray.neutral300,
                fontFamily: TYPOGRAPHY.popups.fontFamily,
                fontWeight: TYPOGRAPHY.popups.fontWeight,
                fontSize: TYPOGRAPHY.popups.fontSize,
                lineHeight: TYPOGRAPHY.popups.lineHeight
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = COLORS.gray.neutral300;
                  e.currentTarget.style.borderColor = COLORS.gray.neutral300;
                  e.currentTarget.style.color = COLORS.gray.neutral100;
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = COLORS.gray.default;
                  e.currentTarget.style.borderColor = COLORS.gray.default;
                  e.currentTarget.style.color = COLORS.gray.neutral300;
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
              className="flex-1 h-[58px] rounded-[10px]"
              style={{
                backgroundColor: COLORS.red.default,
                color: '#FAFAFA',
                fontFamily: TYPOGRAPHY.popups.fontFamily,
                fontWeight: TYPOGRAPHY.popups.fontWeight,
                fontSize: TYPOGRAPHY.popups.fontSize,
                lineHeight: TYPOGRAPHY.popups.lineHeight
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = COLORS.red.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = COLORS.red.default;
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