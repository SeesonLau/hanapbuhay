"use client";

import { useState, useEffect, useRef } from "react";
import { HiArrowDown } from "react-icons/hi";
import ReviewCard from "../ui/ReviewCard";
import StarRating from "../ui/StarRating";

interface Review {
  id: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  avatarUrl?: string;
}

export default function ReviewListSection() {
  const MAX_REVIEW_LENGTH = 50;

  const truncateText = (text: string, maxLength: number = MAX_REVIEW_LENGTH) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const reviews: Review[] = [
    {
      id: "1",
      rating: 5,
      reviewText:
        "Excellent worker! Very professional and completed the task ahead of schedule. Highly recommend for any project.",
      reviewerName: "Maria Santos",
    },
    {
      id: "2",
      rating: 4.5,
      reviewText:
        "Great communication and quality work. Would definitely hire again for future projects.",
      reviewerName: "Juan Dela Cruz",
    },
    {
      id: "3",
      rating: 4,
      reviewText:
        "Good job overall. Met all requirements and was responsive to feedback throughout the project.",
      reviewerName: "Ana Lopez",
    },
    {
      id: "4",
      rating: 5,
      reviewText:
        "Outstanding attention to detail and very reliable. Delivered exactly what was needed with excellent results.",
      reviewerName: "Carlos Reyes",
    },
    {
      id: "5",
      rating: 4.5,
      reviewText:
        "Professional and efficient. Completed the work with high quality and was easy to work with.",
      reviewerName: "Sofia Rodriguez",
    },
    {
      id: "6",
      rating: 4,
      reviewText:
        "Solid performance and met deadlines consistently. A pleasure to work with on this project.",
      reviewerName: "Miguel Torres",
    },
    {
      id: "7",
      rating: 5,
      reviewText:
        "Exceeded expectations in every way. Will definitely be my first choice for future work.",
      reviewerName: "Isabella Garcia",
    },
  ];

  // Mock values for now (replace with backend later)
  const [averageRating, setAverageRating] = useState<number>(4.6);
  const [userReviewCount, setUserReviewCount] = useState<number>(7);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    setIsScrollable(el.scrollHeight > el.clientHeight);

    const handleScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      setIsAtBottom(atBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [reviews]);

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between -mt-6">
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
        className="rounded-lg max-h-[370px] overflow-y-auto scrollbar-hide py-2 px-2 snap-y snap-mandatory scroll-smooth"
        style={{ scrollPaddingTop: "0.5rem", scrollPaddingBottom: "0.5rem" }}
      >
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="snap-start transition-transform duration-200 ease-in-out hover:scale-[1.01] hover:shadow-lg hover:bg-gray-50 rounded-lg border border-transparent"
            >
              <ReviewCard
                rating={review.rating}
                reviewText={truncateText(review.reviewText)}
                reviewerName={review.reviewerName}
                avatarUrl={review.avatarUrl}
              />
            </div>
          ))}
        </div>
      </div>

      {isScrollable && !isAtBottom && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-gradient-to-t from-white/95 to-transparent p-0 text-sm text-gray-neutral500">
          <HiArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      )}
    </div>
  );
}
