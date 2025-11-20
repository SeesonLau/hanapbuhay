'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { TrashIcon } from '@/components/ui/DeleteModal'; // Import TrashIcon
import { ReviewService } from '@/lib/services/reviews-services';
import type { Review } from '@/lib/models/review';
import { supabase } from '@/lib/services/supabase/client';

type RatingDistribution = Record<1 | 2 | 3 | 4 | 5, number>;

interface ReviewsComponentProps {
  onDelete: (reviewId: string) => void;
}

export const ReviewsComponent: React.FC<ReviewsComponentProps> = ({ onDelete }) => {
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [distribution, setDistribution] = useState<RatingDistribution>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndReviews = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id ?? null;
      setUserId(currentUserId);
      if (currentUserId) await loadReviews(currentUserId);
    };

    fetchUserAndReviews();
  }, []);

  const loadReviews = async (currentUserId: string) => {
    try {
      setLoading(true);
      const [receivedResult, avgRating, dist] = await Promise.all([
        ReviewService.getReviewsByUserId(currentUserId),
        ReviewService.getAverageRating(currentUserId),
        ReviewService.getRatingDistribution(currentUserId)
      ]);

      setReceivedReviews(receivedResult.reviews);
      setAverageRating(avgRating);
      setDistribution({
        1: dist[1] ?? 0,
        2: dist[2] ?? 0,
        3: dist[3] ?? 0,
        4: dist[4] ?? 0,
        5: dist[5] ?? 0,
      });
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (rating: 1 | 2 | 3 | 4 | 5): number => {
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    return total ? Math.round((distribution[rating] / total) * 100) : 0;
  };

  if (!userId) {
    return <div className="text-center py-8">Please log in to view reviews.</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Your Rating Overview</h2>
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Average Rating</div>
          </div>
          <div className="flex-grow">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-2 mb-2">
                <div className="w-12 text-sm text-gray-600">{rating} Stars</div>
                <div className="flex-grow bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${getPercentage(rating as 1 | 2 | 3 | 4 | 5)}%` }}
                  />
                </div>
                <div className="w-12 text-sm text-gray-600">
                  {distribution[rating as 1 | 2 | 3 | 4 | 5]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold">Reviews Received</h3>
        {receivedReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            You haven't received any reviews yet.
          </div>
        ) : (
          <div className="space-y-4">
            {receivedReviews.map(review => (
              <div key={review.reviewId} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.createdBy}</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Post ID: {review.postId}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-blue-600">{review.rating}</span>
                      <span className="text-gray-500">/5</span>
                    </div>
                    <button
                      onClick={() => onDelete(review.reviewId)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete review"
                    >
                      <TrashIcon className="w-[18px] h-[18px]" /> {/* Use TrashIcon */}
                    </button>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};