// Success Messages
export const ReviewMessages = {
  // Success Messages
  CREATE_REVIEW_SUCCESS: 'Review submitted successfully!',
  UPDATE_REVIEW_SUCCESS: 'Review updated successfully!',
  DELETE_REVIEW_SUCCESS: 'Review deleted successfully!',

  // Error Messages
  CREATE_REVIEW_ERROR: 'Failed to submit review. Please try again.',
  UPDATE_REVIEW_ERROR: 'Failed to update review. Please try again.',
  DELETE_REVIEW_ERROR: 'Failed to delete review. Please try again.',
  FETCH_REVIEWS_ERROR: 'Failed to fetch reviews. Please try again.',
  DUPLICATE_REVIEW_ERROR: 'You have already reviewed this work.',
  INVALID_RATING_ERROR: 'Rating must be between 1 and 5.',

  // Loading Messages
  LOADING_REVIEWS: 'Loading reviews...',
  SUBMITTING_REVIEW: 'Submitting your review...',
  UPDATING_REVIEW: 'Updating review...',

  // Empty States
  NO_REVIEWS_FOUND: 'No reviews found.',
  NO_REVIEWS_AS_CLIENT: 'You haven\'t reviewed any workers yet.',
  NO_REVIEWS_AS_WORKER: 'You haven\'t received any reviews yet.',
  NO_REVIEWS_FOR_POST: 'No reviews received for this job post yet.'
} as const;