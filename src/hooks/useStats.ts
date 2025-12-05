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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const initialLoad = useRef(true);

  const load = useCallback(async () => {
    if (initialLoad.current) {
      setLoading(true);
    }
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
    } finally {
        setLoading(false);
        initialLoad.current = false;
    }
  }, [variant, userId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (variant !== 'manageJobs' || !userId) {
      return;
    }

    const channel = supabase
      .channel('realtime-posts-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `userId=eq.${userId}`,
        },
        () => {
          console.log('Post change detected, reloading stats...');
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, variant, load]);

  return { stats, loading, error, refresh: load };
}

export type { Stats };