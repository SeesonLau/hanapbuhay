'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoIosClose } from 'react-icons/io';
import { MdOutlineRateReview } from 'react-icons/md';
import StarRating from '@/components/ui/StarRating';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerName: string;
  onSubmit: (rating: number, comment: string) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  workerName,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
      // Reset form
      setRating(0);
      setComment('');
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form on close
    setRating(0);
    setComment('');
    onClose();
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white rounded-[20px] p-6 w-full max-w-[480px] mobile-S:max-w-[300px] mobile-M:max-w-[340px] mobile-L:max-w-[380px] tablet:max-w-[480px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-neutral100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gray-neutral900 rounded-lg flex items-center justify-center">
              <MdOutlineRateReview className="text-white text-lg" />
            </div>
            <h2 className="text-lead mobile-S:text-body mobile-M:text-lead font-bold text-gray-neutral950 font-alexandria">
              Rate the Worker
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-neutral400 hover:text-gray-neutral700 transition-colors"
            aria-label="Close modal"
          >
            <IoIosClose size={32} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Title and Description */}
          <div className="text-center">
            <h3 className="text-lead mobile-S:text-body mobile-M:text-lead font-semibold text-gray-neutral800 mb-1.5 font-inter">
              What do you think of this Worker?
            </h3>
            <p className="text-small mobile-S:text-tiny mobile-M:text-small text-gray-neutral500 font-inter">
              Your feedback is essential in helping this worker be recommended to future jobs.
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center">
            <div className="mobile-S:block mobile-M:block mobile-L:block tablet:hidden laptop:hidden laptop-L:hidden">
              <StarRating
                variant="rating"
                value={rating}
                onChange={setRating}
                size="lg"
                max={5}
                labelVariant="none"
              />
            </div>
            <div className="hidden tablet:block laptop:hidden laptop-L:hidden">
              <StarRating
                variant="rating"
                value={rating}
                onChange={setRating}
                size="xlg"
                max={5}
                labelVariant="none"
              />
            </div>
            <div className="hidden laptop:block laptop-L:block">
              <StarRating
                variant="rating"
                value={rating}
                onChange={setRating}
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
              disabled={rating === 0}
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
