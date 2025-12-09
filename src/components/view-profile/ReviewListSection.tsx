"use client";

import { useState, useEffect, useRef } from "react";
import { HiArrowDown } from "react-icons/hi";
import ReviewCard from "../ui/ReviewCard";
import StarRating from "../ui/StarRating";
import { ReviewService } from "@/lib/services/reviews-services";
import { ProfileService } from "@/lib/services/profile-services";

interface Review {
  reviewId: string;
  rating: number;
  comment: string | null;
  createdBy: string;
  reviewerName: string;
  avatarUrl?: string;
}

interface ReviewListSectionProps {
  userId: string;
  reviewsData?: Review[];
  averageRating?: number;
  userReviewCount?: number;
}

export default function ReviewListSection({
  userId,
  reviewsData: externalReviewsData,
  averageRating: externalAverageRating,
  userReviewCount: externalUserReviewCount
}: ReviewListSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(!externalReviewsData);
  const [averageRating, setAverageRating] = useState<number>(externalAverageRating || 0);
  const [userReviewCount, setUserReviewCount] = useState<number>(externalUserReviewCount || 0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Dynamic truncation based on container width
  const getMaxCharacters = (width: number) => {
    // Adjust these values based on your design
    // Base: 300px width = 75 characters
    // Each additional 100px adds ~25 characters
    const baseWidth = 300;
    const baseChars = 75;
    const charsPerHundredPx = 25;

    if (width <= baseWidth) return baseChars;

    const additionalWidth = width - baseWidth;
    const additionalChars = Math.floor((additionalWidth / 100) * charsPerHundredPx);

    return baseChars + additionalChars;
  };

  const truncateText = (text: string, width: number) => {
    const maxLength = getMaxCharacters(width);
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    // If data is provided externally, use it directly
    if (externalReviewsData && externalAverageRating !== undefined && externalUserReviewCount !== undefined) {
      setReviews(externalReviewsData);
      setAverageRating(externalAverageRating);
      setUserReviewCount(externalUserReviewCount);
      setLoading(false);
      return;
    }

    // Otherwise, fetch the data
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Fetch reviews
        const { reviews: reviewsData } = await ReviewService.getReviewsByUserId(userId, {
          pageSize: 100,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });

        // Fetch average rating and total count
        const avgRating = await ReviewService.getAverageRating(userId);
        const totalCount = await ReviewService.getTotalReviewsCountByUserId(userId);

        setAverageRating(avgRating);
        setUserReviewCount(totalCount);

        // Fetch reviewer names and profile pictures
        const reviewsWithProfiles = await Promise.all(
          reviewsData.map(async (review) => {
            const profileData = await ProfileService.getNameProfilePic(review.createdBy);
            const displayName = profileData?.name
              ? profileData.name.split('|||')[0].split(' ').slice(0, 2).join(' ')
              : 'Anonymous';

            return {
              reviewId: review.reviewId,
              rating: review.rating,
              comment: review.comment ?? null,
              createdBy: review.createdBy,
              reviewerName: displayName,
              avatarUrl: profileData?.profilePicUrl || undefined
            };
          })
        );

        setReviews(reviewsWithProfiles);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId, externalReviewsData, externalAverageRating, externalUserReviewCount]);

  useEffect(() => {
    const el = scrollRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const checkScrollable = () => {
      setIsScrollable(el.scrollHeight > el.clientHeight);
    };

    const handleScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      setIsAtBottom(atBottom);
    };

    checkScrollable();
    el.addEventListener("scroll", handleScroll);

    // ResizeObserver to watch for container width AND height changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
        checkScrollable();
      }
    });

    resizeObserver.observe(container);
    
    // Set initial width
    setContainerWidth(container.clientWidth);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [reviews]);

  if (loading) {
    return (
      <div className="px-6 pb-6 pt-10 sm:pt-6 flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="px-6 pb-6 pt-10 sm:pt-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between -mt-6 mb-4">
          <p className="font-inter font-semibold text-gray-neutral900">Reviews</p>
          <StarRating
            variant="display"
            value={0}
            labelVariant="count"
            ratingCount={0}
            size="sm"
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-gray-neutral400">No reviews yet</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="px-6 pb-6 pt-10 sm:pt-6 relative flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between -mt-6 mb-2 flex-shrink-0">
        <p className="font-inter font-semibold text-gray-neutral900">Reviews</p>

        <StarRating
          variant="display"
          value={averageRating}
          labelVariant="count"
          ratingCount={userReviewCount}
          size="sm"
        />
      </div>

      <div
        ref={scrollRef}
        className="rounded-lg flex-1 overflow-y-auto scrollbar-hide py-2 px-2 snap-y snap-mandatory scroll-smooth"
        style={{ scrollPaddingTop: "0.5rem", scrollPaddingBottom: "0.5rem" }}
      >
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div
              key={review.reviewId}
              className="snap-start transition-transform duration-200 ease-in-out hover:scale-[1.01] hover:shadow-lg hover:bg-gray-50 rounded-lg border border-transparent"
            >
              <ReviewCard
                rating={review.rating}
                reviewText={review.comment ? truncateText(review.comment, containerWidth) : " "}
                reviewerName={review.reviewerName}
                avatarUrl={review.avatarUrl}
              />
            </div>
          ))}
        </div>
      </div>

      {isScrollable && !isAtBottom && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-gradient-to-t from-white/95 to-transparent p-2 text-sm text-gray-neutral500 pointer-events-none">
          <HiArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      )}
    </div>
  );
}