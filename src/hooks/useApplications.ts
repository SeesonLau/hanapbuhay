"use client";

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ApplicationService } from '@/lib/services/applications-services';
import type { AppliedJob } from '@/components/cards/AppliedJobCardList';
import { supabase } from '@/lib/services/supabase/client';

interface UseApplicationsOptions {
  skip?: boolean;
  pageSize?: number;
  /** Callback function to execute on successful application creation. */
  onSuccess?: () => void;
}

export function useApplications(userId?: string | null, options: UseApplicationsOptions = {}) {
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [postIdToApply, setPostIdToApply] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setApplications([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // fetch first page with a large pageSize so we get a reasonable set for UI
      const res = await ApplicationService.getApplicationsByUserId(userId, { page: 1, pageSize: options.pageSize ?? 50 });
      const apps = res.applications || [];

      const mapped = apps.map((a: any) => {
        const post = a.posts ?? a.post ?? {};
        const appliedOn = a.createdAt ?? a.created_at ?? '';
        return {
          id: a.applicationId ?? a.id,
          title: post.title ?? 'Untitled',
          description: post.description ?? '',
          location: post.location ?? '',
          salary: post.price ?? 0,
          salaryType: 'monthly' as const,
          appliedOn,
          status: a.status ?? 'pending',
          tags: post.subType ?? (post.type ? [post.type] : []),
          genderPreference: post.preferredGender ?? undefined,
        } as AppliedJob;
      });

      setApplications(mapped);
    } catch (err) {
      console.error('Failed to load applications', err);
      setError('Failed to load applications');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [userId, options.pageSize]);

  useEffect(() => {
    if (options.skip) return;
    load();
  }, [load, options.skip]);

  const createApplication = useCallback((postId: string) => {
    if (!userId) {
      toast.error('Please log in to apply for jobs');
      return;
    }
    // Set the post ID and open the confirmation modal
    setPostIdToApply(postId);
    setIsConfirming(true);
  }, [userId]);

  const confirmApplication = useCallback(async () => {
    if (!postIdToApply || !userId) return;
    try {
      await ApplicationService.createApplication(postIdToApply, userId);
      // If an onSuccess callback is provided, call it.
      if (options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      
    } finally {
      // Close the modal and reset the state
      setIsConfirming(false);
      setPostIdToApply(null);
    }
  }, [postIdToApply, userId, options.onSuccess]);

  const cancelApplication = useCallback(() => {
    setIsConfirming(false);
    setPostIdToApply(null);
  }, []);

  const getAppliedPostIds = useCallback(async (): Promise<string[]> => {
    if (!userId) return [];
    try {
      return await ApplicationService.getAppliedPostIdsByUser(userId);
    } catch (error) {
      console.error('Error fetching applied post IDs:', error);
      return [];
    }
  }, [userId]);

  return {
    applications,
    loading,
    error,
    refresh: load,
    createApplication,
    isConfirming,
    confirmApplication,
    cancelApplication,
    getAppliedPostIds,
  };
}

export default useApplications;
