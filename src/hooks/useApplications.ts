"use client";

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ApplicationService } from '@/lib/services/applications-services';
import type { AppliedJob } from '@/components/cards/AppliedJobCardList';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';
import { JobType, SubTypes } from '@/lib/constants/job-types';

interface UseApplicationsOptions {
  skip?: boolean;
  pageSize?: number;
}

function formatPeso(value: any) {
  const n = Number(value ?? 0);
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatAppliedDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

export function useApplications(userId?: string | null, options: UseApplicationsOptions = {}) {
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

      console.log('Raw applications data from API:', apps);

      const mapped = apps.map((a: any) => {
        const post = a.posts ?? a.post ?? {};
        const appliedOn = a.createdAt ?? a.created_at ?? '';
        
        console.log('Processing application:', {
          title: post.title,
          type: post.type,
          subType: post.subType,
          rawPost: post
        });
        
        // Extract subType array from post (same logic as useJobPosts)
        const sub = post.subType || [];
        
        console.log('Extracted subType array:', sub);
        
        // Extract gender tags
        const genderTags = Array.from(new Set(
          sub.filter((s: string) => Object.values(Gender).includes(s as Gender))
        ));
        
        // Extract experience tags
        const experienceTags = Array.from(new Set(
          sub.filter((s: string) => Object.values(ExperienceLevel).includes(s as ExperienceLevel))
        ));
        
        // Extract job type tags (including subtypes)
        const allJobSubTypes = Object.values(SubTypes).flat();
        const jobSubtypeTags = Array.from(new Set(
          sub.filter((s: string) => allJobSubTypes.includes(s))
             .filter((s: string) => !genderTags.includes(s) && !experienceTags.includes(s))
        ));
        const jobTypeTags = Array.from(new Set([post.type, ...jobSubtypeTags].filter(Boolean)));
        
        console.log('Extracted tags:', { genderTags, experienceTags, jobTypeTags });
        
        return {
          id: a.applicationId ?? a.id,
          title: post.title ?? 'Untitled',
          description: post.description ?? '',
          location: post.location ?? '',
          salary: formatPeso(post.price),
          salaryPeriod: 'month',
          appliedOn: formatAppliedDate(appliedOn),
          status: a.status ?? 'pending',
          genderTags,
          experienceTags,
          jobTypeTags,
        } as AppliedJob;
      });

      console.log('Final mapped applications:', mapped);
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

  const createApplication = useCallback(async (postId: string) => {
    if (!userId) {
      toast.error('Please log in to apply for jobs');
      return null;
    }

    try {
      const result = await ApplicationService.createApplication(postId, userId);
      // Refresh to reflect new application
      await load();
      return result;
    } catch (error) {
      console.error('Error applying to job:', error);
      return null;
    }
  }, [userId, load]);

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
    getAppliedPostIds,
  };
}

export default useApplications;