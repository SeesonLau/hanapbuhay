import { useEffect, useState, useCallback, useRef } from 'react';
import { PostService } from '@/lib/services/posts-services';
import { ApplicationService } from '@/lib/services/applications-services';
import { ReviewService } from '@/lib/services/reviews-services';
import { supabase } from '@/lib/services/supabase/client';

type Variant = 'findJobs' | 'appliedJobs' | 'manageJobs';

type Stats = Record<string, number | null>;

export function useStats(options: { variant: Variant; userId?: string | null }) {
  const { variant, userId } = options;
  const [stats, setStats] = useState<Stats>({});
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
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
      } else if (variant === 'appliedJobs') {
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
      } else {
        // manageJobs
        if (!userId) {
          setStats({ totalPosts: 0, activePosts: 0, inactivePosts: 0, resolvedPosts: 0 });
        } else {
          const [totalPosts, activePosts, inactivePosts] = await Promise.all([
            PostService.getPostCountByUserId(userId),
            PostService.getPostCountByUserId(userId, { isLocked: false }),
            PostService.getPostCountByUserId(userId, { isLocked: true }),
          ]);
          const resolvedPosts = 0; // This seems to be always 0 for now.
          setStats({ totalPosts, activePosts, inactivePosts, resolvedPosts });
        }
      }
    } catch (err) {
      setError('Failed to load statistics');
    }
  }, [variant, userId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const channels: any[] = [];

    const createSubscription = (
      channelName: string,
      table: string,
      filter: string | undefined,
      callback: () => void
    ) => {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter,
          },
          callback
        )
        .subscribe();
      channels.push(channel);
    };

    const handleStatReload = () => {
        console.log('Change detected, reloading stats...');
        load();
    };

    if (variant === 'findJobs') {
      // For totalJobs, listens to all post changes
      createSubscription('realtime-all-posts', 'posts', undefined, handleStatReload);
      if (userId) {
        // For user-specific stats on findJobs page (completed, ratings, user's posts)
        createSubscription(`realtime-user-applications-${userId}`, 'applications', `userId=eq.${userId}`, handleStatReload);
        createSubscription(`realtime-user-reviews-${userId}`, 'reviews', `revieweeId=eq.${userId}`, handleStatReload);
        createSubscription(`realtime-user-posts-${userId}`, 'posts', `userId=eq.${userId}`, handleStatReload);
      }
    } else if (variant === 'appliedJobs' && userId) {
      createSubscription(`realtime-user-applications-${userId}`, 'applications', `userId=eq.${userId}`, handleStatReload);
    } else if (variant === 'manageJobs' && userId) {
      createSubscription(`realtime-user-posts-${userId}`, 'posts', `userId=eq.${userId}`, handleStatReload);
    }

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, variant, load]);

  return { stats, loading: false, error, refresh: load };
}

export type { Stats };