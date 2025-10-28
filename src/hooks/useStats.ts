"use client";

import { useEffect, useState, useCallback } from 'react';
import { PostService } from '@/lib/services/posts-services';
import { ApplicationService } from '@/lib/services/applications-services';
import { ReviewService } from '@/lib/services/reviews-services';

type Variant = 'findJobs' | 'appliedJobs';

type Stats = Record<string, number | null>;

export function useStats(options: { variant: Variant; userId?: string | null }) {
  const { variant, userId } = options;
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (variant === 'findJobs') {
        const [totalJobs, approvedCount, avgRating, postsCount] = await Promise.all([
          PostService.getTotalActivePostsCount(),
          userId ? ApplicationService.getApplicationsByUserIdCount(userId, { status: 'approved' }) : Promise.resolve(0),
          userId ? ReviewService.getAverageRating(userId) : Promise.resolve(0),
          userId ? PostService.getPostCountByUserId(userId) : Promise.resolve(0),
        ]);

        setStats({ totalJobs, completed: approvedCount, ratings: avgRating, posts: postsCount });
      } else {
        // appliedJobs
        if (!userId) {
          setStats({ totalApplications: 0, pending: 0, approved: 0, rejected: 0 });
        } else {
          const [total, pending, approved, rejected] = await Promise.all([
            ApplicationService.getApplicationsByUserIdCount(userId),
            ApplicationService.getApplicationsByUserIdCount(userId, { status: 'pending' }),
            ApplicationService.getApplicationsByUserIdCount(userId, { status: 'approved' }),
            ApplicationService.getApplicationsByUserIdCount(userId, { status: 'rejected' }),
          ]);
          setStats({ totalApplications: total, pending, approved, rejected });
        }
      }
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, [variant, userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, loading, error, refresh: load };
}

export type { Stats };