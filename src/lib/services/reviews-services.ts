import { toast } from 'react-hot-toast';
import { supabase } from './supabase/client';
import { ReviewMessages } from '@/resources/messages/reviews';
import { Review } from '../models/review';

interface ReviewQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedReviews {
  reviews: Review[];
  count: number;
  hasMore: boolean;
}

export class ReviewService {
  private static readonly DEFAULT_PAGE_SIZE = 12;

  // Helper: Validate rating
  private static validateRating(rating: number): boolean {
    return rating >= 1 && rating <= 5;
  }

  // Get reviews by user ID (reviews received as a worker)
  static async getReviewsByUserId(
    userId: string,
    params: ReviewQueryParams = {}
  ): Promise<PaginatedReviews> {
    try {
      const {
        page = 1,
        pageSize = this.DEFAULT_PAGE_SIZE,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact' })
        .eq('userId', userId)
        .is('deletedAt', null)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (error) throw error;

      return {
        reviews: data || [],
        count: count || 0,
        hasMore: count ? from + (data?.length || 0) < count : false
      };
    } catch (error) {
      toast.error(ReviewMessages.FETCH_REVIEWS_ERROR);
      throw error;
    }
  }

  // Get reviews by post ID
  static async getReviewsByPostId(
    postId: string,
    params: ReviewQueryParams = {}
  ): Promise<PaginatedReviews> {
    try {
      const {
        page = 1,
        pageSize = this.DEFAULT_PAGE_SIZE,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact' })
        .eq('postId', postId)
        .is('deletedAt', null)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (error) throw error;

      return {
        reviews: data || [],
        count: count || 0,
        hasMore: count ? from + (data?.length || 0) < count : false
      };
    } catch (error) {
      toast.error(ReviewMessages.FETCH_REVIEWS_ERROR);
      throw error;
    }
  }

  // Create new review
  static async createReview(
    userId: string,    // ID of the worker being reviewed
    postId: string,    // ID of the post
    rating: number,
    createdBy: string,  // ID of the client giving the review
    comment?: string
  ): Promise<Review> {
    try {
      if (!this.validateRating(rating)) {
        toast.error(ReviewMessages.INVALID_RATING_ERROR);
        throw new Error('Invalid rating');
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          userId,
          postId,
          rating,
          comment,
          createdBy,
          updatedBy: createdBy
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.error(ReviewMessages.DUPLICATE_REVIEW_ERROR);
        }
        throw error;
      }

      toast.success(ReviewMessages.CREATE_REVIEW_SUCCESS);
      return data;
    } catch (error: any) {
      if (error?.message !== 'Invalid rating' && error?.code !== '23505') {
        toast.error(ReviewMessages.CREATE_REVIEW_ERROR);
      }
      throw error;
    }
  }

  // Update existing review
  static async updateReview(
    reviewId: string,
    rating: number,
    comment: string | null,
    updatedBy: string
  ): Promise<Review> {
    try {
      if (!this.validateRating(rating)) {
        toast.error(ReviewMessages.INVALID_RATING_ERROR);
        throw new Error('Invalid rating');
      }

      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating,
          comment,
          updatedAt: new Date().toISOString(),
          updatedBy
        })
        .eq('reviewId', reviewId)
        .is('deletedAt', null)
        .select()
        .single();

      if (error) throw error;

      toast.success(ReviewMessages.UPDATE_REVIEW_SUCCESS);
      return data;
    } catch (error: any) {
      if (error?.message !== 'Invalid rating') {
        toast.error(ReviewMessages.UPDATE_REVIEW_ERROR);
      }
      throw error;
    }
  }

  // Soft delete review
  static async deleteReview(reviewId: string, deletedBy: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          deletedAt: new Date().toISOString(),
          deletedBy
        })
        .eq('reviewId', reviewId);

      if (error) throw error;

      toast.success(ReviewMessages.DELETE_REVIEW_SUCCESS);
      return true;
    } catch (error) {
      toast.error(ReviewMessages.DELETE_REVIEW_ERROR);
      return false;
    }
  }

  // Get total reviews count
  static async getTotalReviewsCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .is('deletedAt', null);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      toast.error(ReviewMessages.FETCH_REVIEWS_ERROR);
      throw error;
    }
  }

  // Get total reviews count by user ID
  static async getTotalReviewsCountByUserId(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('userId', userId)
        .is('deletedAt', null);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      toast.error(ReviewMessages.FETCH_REVIEWS_ERROR);
      throw error;
    }
  }

  // Get total reviews count by post ID
  static async getTotalReviewsCountByPostId(postId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('postId', postId)
        .is('deletedAt', null);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      toast.error(ReviewMessages.FETCH_REVIEWS_ERROR);
      throw error;
    }
  }

  // Get average rating for a user
  static async getAverageRating(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('userId', userId)
        .is('deletedAt', null);

      if (error) throw error;

      if (!data || data.length === 0) return 0;

      const sum = data.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0);
      return Number((sum / data.length).toFixed(1));
    } catch (error) {
      toast.error(ReviewMessages.FETCH_REVIEWS_ERROR);
      throw error;
    }
  }

  // Get user rating distribution
  static async getRatingDistribution(userId: string): Promise<Record<number, number>> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('userId', userId)
        .is('deletedAt', null);

      if (error) throw error;

      const distribution: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
      if (!data) return distribution;

      // Calculate the distribution from the fetched ratings
      for (const review of data) {
        if (review.rating >= 1 && review.rating <= 5) {
          distribution[review.rating]++;
        }
      }

      return distribution;
    } catch (error) {
      toast.error(ReviewMessages.FETCH_REVIEWS_ERROR);
      throw error;
    }
  }

  // Check if a user has reviewed a worker for a specific post
  static async hasUserReviewedWorkerForPost(
    reviewerId: string,
    workerId: string,
    postId: string
  ): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('createdBy', reviewerId)
        .eq('userId', workerId) // userId in reviews table refers to the worker being reviewed
        .eq('postId', postId)
        .is('deletedAt', null);

      if (error) throw error;

      return (count || 0) > 0;
    } catch (error) {
      console.error('Error checking for existing review:', error);
      toast.error(ReviewMessages.FETCH_REVIEWS_ERROR);
      throw error;
    }
  }
}