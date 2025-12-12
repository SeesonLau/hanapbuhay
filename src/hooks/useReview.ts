'use client';

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { ReviewService } from '@/lib/services/reviews-services';
import { ReviewMessages } from '@/resources/messages/reviews';
import { supabase } from '@/lib/services/supabase/client';

interface ReviewFormData {
  rating: number;
  comment: string;
  applicationId: string; // Not directly used by createReview, but useful for context/future
  workerId: string;      // The user being reviewed
  postId: string;        // The post associated with the review
  reviewerId: string;    // The user giving the review (current user)
}

interface UseReviewReturn {
  isReviewModalOpen: boolean;
  reviewForm: Omit<ReviewFormData, 'reviewerId'> | null;
  openReviewModal: (workerId: string, postId: string, applicationId: string) => void;
  closeReviewModal: () => void;
  handleRatingChange: (newRating: number) => void;
  handleCommentChange: (newComment: string) => void;
  submitReview: (onSuccess?: () => void) => Promise<void>;
  isLoading: boolean;
}

export const useReview = (): UseReviewReturn => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState<Omit<ReviewFormData, 'reviewerId'> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openReviewModal = useCallback((workerId: string, postId: string, applicationId: string) => {
    setReviewForm({
      rating: 0, // Initial rating
      comment: '',
      workerId,
      postId,
      applicationId,
    });
    setIsReviewModalOpen(true);
  }, []);

  const closeReviewModal = useCallback(() => {
    setIsReviewModalOpen(false);
    setReviewForm(null); // Clear form data on close
  }, []);

  const handleRatingChange = useCallback((newRating: number) => {
    setReviewForm(prev => (prev ? { ...prev, rating: newRating } : null));
  }, []);

  const handleCommentChange = useCallback((newComment: string) => {
    setReviewForm(prev => (prev ? { ...prev, comment: newComment } : null));
  }, []);

  const submitReview = useCallback(async (onSuccess?: () => void) => {
    if (!reviewForm) {
      toast.error('Review form data is missing.');
      return;
    }

    if (reviewForm.rating === 0) {
      toast.error(ReviewMessages.INVALID_RATING_ERROR);
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const reviewerId = session?.user?.id;

      if (!reviewerId) {
        toast.error('You must be logged in to submit a review.');
        return;
      }

      await ReviewService.createReview(
        reviewForm.workerId,
        reviewForm.postId,
        reviewForm.rating,
        reviewerId,
        reviewForm.comment || undefined
      );

      // ReviewService.createReview already handles success toast
      closeReviewModal();
      onSuccess?.(); // Callback for any post-submission actions in the component
    } catch (error: any) {
      // ReviewService.createReview already handles error toasts (including duplicate)
      console.error('Error submitting review:', error?.message || error, error?.stack);
    } finally {
      setIsLoading(false);
    }
  }, [reviewForm, closeReviewModal]);

  return {
    isReviewModalOpen,
    reviewForm,
    openReviewModal,
    closeReviewModal,
    handleRatingChange,
    handleCommentChange,
    submitReview,
    isLoading,
  };
};