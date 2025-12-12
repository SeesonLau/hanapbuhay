import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoIosClose } from 'react-icons/io';
import { MdOutlineRateReview } from 'react-icons/md';
import StarRating from '@/components/ui/StarRating';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerName: string;
  currentRating: number;
  currentComment: string;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  workerName,
  currentRating,
  currentComment,
  onRatingChange,
  onCommentChange,
  onSubmit,
  isLoading,
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = () => {
    if (currentRating > 0) {
      onSubmit();
    }
  };

  const handleClose = () => {
    onClose();
    // No need to reset rating/comment here, hook manages it
  };

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ backgroundColor: theme.modal.overlay }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div 
        className="rounded-[20px] p-6 w-full max-w-[480px] mobile-S:max-w-[300px] mobile-M:max-w-[340px] mobile-L:max-w-[380px] tablet:max-w-[480px] shadow-xl"
        style={{ backgroundColor: theme.modal.background }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between mb-6 pb-3 border-b"
          style={{ borderColor: theme.modal.headerBorder }}
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.text }}
            >
              <MdOutlineRateReview className="text-white text-lg" />
            </div>
            <h2 
              className="text-lead mobile-S:text-body mobile-M:text-lead font-bold font-alexandria"
              style={{ color: theme.colors.text }}
            >
              Rate the Worker
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="transition-colors"
            style={{ color: theme.modal.buttonClose }}
            onMouseOver={(e) => e.currentTarget.style.color = theme.modal.buttonCloseHover}
            onMouseOut={(e) => e.currentTarget.style.color = theme.modal.buttonClose}
            aria-label="Close modal"
          >
            <IoIosClose size={32} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Title and Description */}
          <div className="text-center">
            <h3 
              className="text-lead mobile-S:text-body mobile-M:text-lead font-semibold mb-1.5 font-inter"
              style={{ color: theme.colors.textSecondary }}
            >
              What do you think of this Worker?
            </h3>
            <p 
              className="text-small mobile-S:text-tiny mobile-M:text-small font-inter"
              style={{ color: theme.colors.textMuted }}
            >
              Your feedback is essential in helping this worker be recommended to future jobs.
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center">
            <div className="mobile-S:block mobile-M:block mobile-L:block tablet:hidden laptop:hidden laptop-L:hidden">
              <StarRating
                variant="rating"
                value={currentRating}
                onChange={onRatingChange}
                size="lg"
                max={5}
                labelVariant="none"
              />
            </div>
            <div className="hidden tablet:block laptop:hidden laptop-L:hidden">
              <StarRating
                variant="rating"
                value={currentRating}
                onChange={onRatingChange}
                size="xlg"
                max={5}
                labelVariant="none"
              />
            </div>
            <div className="hidden laptop:block laptop-L:block">
              <StarRating
                variant="rating"
                value={currentRating}
                onChange={onRatingChange}
                size="xxlg"
                max={5}
                labelVariant="none"
              />
            </div>
          </div>

          {/* Comment TextArea */}
          <div className="w-full">
            <TextArea
              placeholder="Add a comment"
              value={currentComment}
              onChange={(e) => onCommentChange(e.target.value)}
              height="140px"
              width="100%"
              responsive={true}
              className="w-full"
              maxLength={500}
              showCharCount={false}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-1">
            <Button
              variant="primary"
              size="xl"
              onClick={handleSubmit}
              disabled={currentRating === 0 || isLoading}
              className="w-full mobile-S:w-full mobile-M:w-full mobile-L:w-full tablet:w-[420px]"
              fullRounded={true}
            >
              Submit now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};