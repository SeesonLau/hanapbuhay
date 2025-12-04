"use client";

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ApplicationService } from '@/lib/services/applications-services';
import type { AppliedJob } from '@/components/cards/AppliedJobCardList';
import type { FilterOptions } from '@/components/ui/FilterSection';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';
import { JobType, SubTypes } from '@/lib/constants/job-types';

interface UseApplicationsOptions {
  skip?: boolean;
  pageSize?: number;
  /** Callback function to execute on successful application creation. */
  onSuccess?: () => void;
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
  const [isConfirming, setIsConfirming] = useState(false);
  const [postIdToApply, setPostIdToApply] = useState<string | null>(null);
  // State for delete confirmation
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const [applicationIdToDelete, setApplicationIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
          raw: a, // Preserve raw application data with posts info
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

  // --- Delete Application Logic ---

  const deleteApplication = useCallback((applicationId: string) => {
    if (!userId) {
      toast.error('Please log in to manage applications');
      return;
    }
    setApplicationIdToDelete(applicationId);
    setIsDeleteConfirming(true);
  }, [userId]);

  const confirmDeleteApplication = useCallback(async () => {
    if (!applicationIdToDelete || !userId) return;
    setIsDeleting(true);
    try {
      await ApplicationService.deleteApplication(applicationIdToDelete, userId);
      load(); // Refresh the list
    } catch (error) {
      toast.error('Failed to withdraw application.');
    } finally {
      setIsDeleting(false);
      setIsDeleteConfirming(false);
      setApplicationIdToDelete(null);
    }
  }, [applicationIdToDelete, userId, load]);

  const cancelDeleteApplication = useCallback(() => {
    setIsDeleteConfirming(false);
    setApplicationIdToDelete(null);
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

  // URL management helpers
  const updateQueryParams = useCallback((params: Record<string, any>, push = true) => {
    if (typeof window === 'undefined') return;
    
    const url = new URL(window.location.href);
    
    // Update or delete parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, String(value));
      }
    });
    
    const newUrl = url.toString();

    // No-op if URL would not change
    if (newUrl === window.location.href) return;

    const method = push ? 'pushState' : 'replaceState';
    window.history[method]({}, '', newUrl);
  }, []);

  const parseUrlParams = useCallback(() => {
    if (typeof window === 'undefined') return { sort: '', parsedFilters: null, applicationId: '' };
    
    const url = new URL(window.location.href);
    const sortVal = url.searchParams.get('sort') || '';
    const filtersJson = url.searchParams.get('filters');
    const applicationId = url.searchParams.get('applicationId') || '';
    
    let parsedFilters: FilterOptions | null = null;
    if (filtersJson) {
      try {
        parsedFilters = JSON.parse(filtersJson);
      } catch {
        parsedFilters = null;
      }
    }
    
    return { sort: sortVal, parsedFilters, applicationId };
  }, []);

  const setSelectedApplicationId = useCallback((id?: string | null, push = true) => {
    updateQueryParams({ applicationId: id || undefined }, push);
  }, [updateQueryParams]);

  const isFiltersEmpty = (f: FilterOptions | null) => {
    if (!f) return true;
    // jobTypes: object with arrays
    const { jobTypes, salaryRange, experienceLevel, preferredGender } = f as any;
    const hasJobTypes = Object.values(jobTypes || {}).some((arr: any) => Array.isArray(arr) && arr.length > 0);
    const hasSalary = Object.values(salaryRange || {}).some(Boolean);
    const hasExp = Object.values(experienceLevel || {}).some(Boolean);
    const hasGender = Object.values(preferredGender || {}).some(Boolean);
    return !(hasJobTypes || hasSalary || hasExp || hasGender);
  };

  const setFiltersInUrl = useCallback((f: FilterOptions | null) => {
    if (!f || isFiltersEmpty(f)) {
      updateQueryParams({ filters: undefined });
      return;
    }
    updateQueryParams({ filters: JSON.stringify(f) });
  }, [updateQueryParams]);

  const setSortInUrl = useCallback((sort?: string) => {
    // Default sorts treated as absence of `sort` param
    const defaultSorts = new Set(['createdAt_desc', 'date_desc']);
    const { sort: currentSort } = parseUrlParams();

    if (!sort || defaultSorts.has(sort)) {
      if (!currentSort) return;
      updateQueryParams({ sort: undefined }, false);
      return;
    }

    if (currentSort === sort) return;
    updateQueryParams({ sort });
  }, [updateQueryParams, parseUrlParams]);

  return {
    applications,
    loading,
    error,
    refresh: load,
    createApplication,
    isConfirming,
    confirmApplication,
    cancelApplication,
    deleteApplication,
    isDeleting,
    isDeleteConfirming,
    confirmDeleteApplication,
    cancelDeleteApplication,
    getAppliedPostIds,
    setSelectedApplicationId,
    setFiltersInUrl,
    setSortInUrl,
    parseUrlParams,
    updateQueryParams,
  };
}

export default useApplications;