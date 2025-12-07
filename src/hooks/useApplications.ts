"use client";

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ApplicationService } from '@/lib/services/applications-services';
import { ProfileService } from '@/lib/services/profile-services';
import { ROUTES } from '@/lib/constants';
import type { AppliedJob } from '@/components/cards/AppliedJobCardList';
import type { FilterOptions } from '@/components/ui/FilterSection';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';
import { ApplicationStatus } from '@/lib/constants/application-status';
import { SubTypes } from '@/lib/constants/job-types';
import { parseStoredName } from '@/lib/utils/profile-utils';

const PAGE_SIZE = 10;

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
  const router = useRouter();
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [sort, setSort] = useState<{ sortBy: string; sortOrder: 'asc' | 'desc' }>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [filters, setFilters] = useState<FilterOptions | null>(null);

  const [isConfirming, setIsConfirming] = useState(false);
  const [postIdToApply, setPostIdToApply] = useState<string | null>(null);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const [applicationIdToDelete, setApplicationIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async (params: { page?: number; isLoadMore?: boolean; searchTerm?: string; location?: string; sortBy?: string; sortOrder?: 'asc' | 'desc'; filters?: FilterOptions | null } = {}) => {
    if (!userId) {
      setApplications([]);
      return;
    }

    const page = params.page ?? 1;
    const isLoadMore = params.isLoadMore ?? false;

    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const appliedFilters = 'filters' in params ? params.filters : filters;
      const filterParams: any = {
        searchTerm: params.searchTerm,
        location: params.location,
      };

      let statusParam: ApplicationStatus[] | undefined = undefined;
      if (appliedFilters) {
        const { jobTypes, salaryRange, experienceLevel, preferredGender } = appliedFilters;

        // Job Types
        const jobTypeKeys = Object.keys(jobTypes || {}).filter(key => jobTypes[key]?.length > 0);
        if (jobTypeKeys.length > 0) {
          const otherJobTypes: string[] = [];
          const specificSubTypes: string[] = [];
          for (const jobType of jobTypeKeys) {
            const subs = jobTypes[jobType];
            if (subs.includes('Other')) otherJobTypes.push(jobType);
            specificSubTypes.push(...subs.filter(s => s !== 'Other'));
          }
          if (specificSubTypes.length > 0) filterParams.subType = specificSubTypes;
          if (otherJobTypes.length > 0) {
            filterParams.jobType = otherJobTypes;
            if (specificSubTypes.length > 0) filterParams.matchMode = 'mixed';
          }
        }

        // Salary Range
        const selectedSalaryKeys = Object.entries(salaryRange || {}).filter(([_, v]) => v).map(([k]) => k);
        if (selectedSalaryKeys.length === 1) {
          const key = selectedSalaryKeys[0];
          if (key === 'lessThan5000') filterParams.priceRange = { min: 0, max: 4999 };
          else if (key === 'range10to20') filterParams.priceRange = { min: 10000, max: 20000 };
          else if (key === 'moreThan20000') filterParams.priceRange = { min: 20001, max: 1000000000 };
        }

        // Experience Level
        const selectedExperienceLevels = Object.entries(experienceLevel || {}).filter(([_, v]) => v).map(([k]) => {
          if (k === 'entryLevel') return ExperienceLevel.ENTRY;
          if (k === 'intermediate') return ExperienceLevel.INTERMEDIATE;
          if (k === 'professional') return ExperienceLevel.EXPERT;
          return k;
        });
        if (selectedExperienceLevels.length > 0) filterParams.experienceLevel = selectedExperienceLevels;

        // Preferred Gender
        const selectedGenders = Object.entries(preferredGender || {}).filter(([_, v]) => v).map(([k]) => {
          if (k === 'any') return Gender.ANY;
          if (k === 'male') return Gender.MALE;
          if (k === 'female') return Gender.FEMALE;
          if (k === 'others') return Gender.OTHERS;
          return k;
        });
        if (selectedGenders.length > 0) filterParams.preferredGender = selectedGenders;

        // Status (appliedJobs-only): map application status to top-level, and post flags to filters
        const st = (appliedFilters as any).status as NonNullable<FilterOptions['status']> | undefined;
        if (st) {
          const appStatuses: ApplicationStatus[] = [];
          if (st.pending) appStatuses.push(ApplicationStatus.PENDING);
          if (st.approved) appStatuses.push(ApplicationStatus.APPROVED);
          if (st.rejected) appStatuses.push(ApplicationStatus.REJECTED);
          if (appStatuses.length > 0) {
            statusParam = appStatuses;
          }
          filterParams.status = {
            locked: !!st.locked,
            deleted: !!st.deleted,
            pending: !!st.pending,
            approved: !!st.approved,
            rejected: !!st.rejected,
          };
        }
      }

      const queryParams: any = {
        page,
        pageSize: options.pageSize ?? PAGE_SIZE,
        sortBy: params.sortBy ?? sort.sortBy,
        sortOrder: params.sortOrder ?? sort.sortOrder,
        filters: filterParams,
        status: statusParam,
      };

      const res = await ApplicationService.getApplicationsByUserId(userId, queryParams);
      const apps = res.applications || [];

      const mapped = apps.map((a: any) => {
        const post = a.posts ?? a.post ?? {};
        const appliedOn = a.createdAt ?? a.created_at ?? '';
        
        const sub = post.subType || [];
        
        const genderTags = Array.from(new Set(
          sub.filter((s: string) => Object.values(Gender).includes(s as Gender))
        ));
        
        const experienceTags = Array.from(new Set(
          sub.filter((s: string) => Object.values(ExperienceLevel).includes(s as ExperienceLevel))
        ));
        
        const allJobSubTypes = Object.values(SubTypes).flat();
        const jobSubtypeTags = Array.from(new Set(
          sub.filter((s: string) => allJobSubTypes.includes(s))
             .filter((s: string) => !genderTags.includes(s) && !experienceTags.includes(s))
        ));
        const jobTypeTags = Array.from(new Set([post.type, ...jobSubtypeTags].filter(Boolean)));
        
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
          raw: a,
        } as AppliedJob;
      });
      const score = (job: AppliedJob) => {
        const rp = job.raw?.posts ?? job.raw?.post ?? {};
        const deleted = Boolean(rp?.deletedAt ?? rp?.deleted_at);
        const locked = Boolean(rp?.isLocked ?? rp?.is_locked);
        return deleted ? 2 : (locked ? 1 : 0);
      };
      const getCreated = (job: AppliedJob) => {
        const c = job.raw?.createdAt ?? job.raw?.created_at ?? '';
        const t = new Date(c).getTime();
        return Number.isFinite(t) ? t : 0;
      };
      const sortOrder = params.sortOrder ?? sort.sortOrder;
      const sortFn = (a: AppliedJob, b: AppliedJob) => {
        const sa = score(a);
        const sb = score(b);
        if (sa !== sb) return sa - sb;
        const ca = getCreated(a);
        const cb = getCreated(b);
        return sortOrder === 'asc' ? ca - cb : cb - ca;
      };

      if (isLoadMore) {
        setApplications(prev => {
          const combined = [...prev, ...mapped];
          return combined.sort(sortFn);
        });
      } else {
        setApplications(mapped.sort(sortFn));
      }
      setCurrentPage(page);
      setHasMoreData(res.hasMore);

    } catch (err) {
      console.error('Failed to load applications', err);
      setError('Failed to load applications');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [userId, options.pageSize, filters, sort.sortBy, sort.sortOrder]);

  useEffect(() => {
    if (options.skip) return;
    const { q, location, sort: sortVal, parsedFilters } = parseUrlParams();

    let sortBy = 'createdAt';
    let sortOrder: 'asc' | 'desc' = 'desc';
    if (sortVal) {
      const parts = sortVal.split('_');
      sortBy = parts[0] || 'createdAt';
      sortOrder = parts[1] === 'asc' ? 'asc' : 'desc';
    }

    setSort({ sortBy, sortOrder });
    if (parsedFilters) {
      setFilters(parsedFilters);
    }

    load({ searchTerm: q, location, sortBy, sortOrder, filters: parsedFilters });
  }, [options.skip]);


  const createApplication = useCallback((postId: string) => {
    if (!userId) {
      toast.error('Please log in to apply for jobs');
      return;
    }
    setPostIdToApply(postId);
    setIsConfirming(true);
  }, [userId]);

  const confirmApplication = useCallback(async () => {
    if (!postIdToApply || !userId) return;
    try {
      const profile = await ProfileService.getProfileByUserId(userId);
      const { firstName, lastName } = parseStoredName(profile?.name);
      const isProfileComplete = profile && firstName && lastName && profile.phoneNumber && profile.birthdate && profile.sex && profile.address;

      if (!isProfileComplete) {
        toast.error("Application unsuccessful. Must complete profile details first.");
        router.push(ROUTES.PROFILE);
        return;
      }
      
      await ApplicationService.createApplication(postIdToApply, userId);
      if (options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      
    } finally {
      setIsConfirming(false);
      setPostIdToApply(null);
    }
  }, [postIdToApply, userId, options, router]);

  const cancelApplication = useCallback(() => {
    setIsConfirming(false);
    setPostIdToApply(null);
  }, []);

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
      load({ page: 1 }); // Refresh the list
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

  const updateQueryParams = useCallback((params: Record<string, any>, push = true) => {
    if (typeof window === 'undefined') return;
    
    const url = new URL(window.location.href);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, String(value));
      }
    });
    
    const newUrl = url.toString();

    if (newUrl === window.location.href) return;

    const method = push ? 'pushState' : 'replaceState';
    window.history[method]({}, '', newUrl);
  }, []);

  const parseUrlParams = useCallback(() => {
    if (typeof window === 'undefined') return { sort: '', parsedFilters: null, applicationId: '', q: '', location: '' };
    
    const url = new URL(window.location.href);
    const sortVal = url.searchParams.get('sort') || '';
    const filtersStr = url.searchParams.get('filters');
    const applicationId = url.searchParams.get('applicationId') || '';
    const q = url.searchParams.get('q') || '';
    const location = url.searchParams.get('location') || '';
    
    return { sort: sortVal, parsedFilters: parseFiltersFromUrl(filtersStr), applicationId, q, location };
  }, []);

  const setSelectedApplicationId = useCallback((id?: string | null, push = true) => {
    updateQueryParams({ applicationId: id || undefined }, push);
  }, [updateQueryParams]);

  const applyFilters = useCallback(async (f: FilterOptions | null) => {
    setFilters(f);
    await load({ page: 1, filters: f });
    updateQueryParams({ filters: serializeFiltersForUrl(f) });
  }, [load, updateQueryParams]);

  const handleSort = useCallback(async (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setSort({ sortBy, sortOrder });
    await load({ page: 1, sortBy, sortOrder });
  }, [load]);

  const setSortInUrl = useCallback((sortParam?: string) => {
    const defaultSorts = new Set(['createdAt_desc', 'date_desc', 'latest']);
    const { sort: currentSort } = parseUrlParams();

    if (!sortParam || defaultSorts.has(sortParam)) {
      if (!currentSort) return;
      updateQueryParams({ sort: undefined }, false);
      return;
    }

    if (currentSort === sortParam) return;
    updateQueryParams({ sort: sortParam });
  }, [updateQueryParams, parseUrlParams]);

  const searchApplications = useCallback((query: string, location?: string) => {
    (async () => {
      await load({ page: 1, searchTerm: query, location });
      updateQueryParams({ q: query || undefined, location: location || undefined });
    })();
  }, [load, updateQueryParams]);
  
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMoreData) return;
    const { q, location } = parseUrlParams();
    await load({ 
      page: currentPage + 1, 
      isLoadMore: true,
      searchTerm: q,
      location,
      filters,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder
    });
  }, [isLoadingMore, hasMoreData, currentPage, load, parseUrlParams, filters, sort]);

  const refresh = useCallback(async () => {
    const { q, location, sort: sortVal, parsedFilters } = parseUrlParams();
    let sortBy = 'createdAt';
    let sortOrder: 'asc' | 'desc' = 'desc';
    if (sortVal) {
      const parts = sortVal.split('_');
      sortBy = parts[0] || 'createdAt';
      sortOrder = parts[1] === 'asc' ? 'asc' : 'desc';
    }
    await load({ page: 1, searchTerm: q, location, sortBy, sortOrder, filters: parsedFilters });
  }, [load, parseUrlParams]);

  return {
    applications,
    loading,
    isLoadingMore,
    hasMore: hasMoreData,
    error,
    refresh,
    loadMore,
    handleSort,
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
    applyFilters,
    setSortInUrl,
    parseUrlParams,
    updateQueryParams,
    searchApplications,
  };
}

// Helper to serialize filters into a compact string
const serializeFiltersForUrl = (filters: FilterOptions | null): string | undefined => {
  if (!filters) return undefined;
  const parts: string[] = [];
  
  const jobTypes = Object.entries(filters.jobTypes || {})
    .filter(([_, subtypes]) => subtypes.length > 0)
    .map(([type, subtypes]) => `${type}:${subtypes.join(',')}`)
    .join(';');
  if (jobTypes) parts.push(`jt=${jobTypes}`);

  const salary = Object.entries(filters.salaryRange || {})
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(',');
  if (salary) parts.push(`sr=${salary}`);

  const exp = Object.entries(filters.experienceLevel || {})
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(',');
  if (exp) parts.push(`el=${exp}`);
  
  const gender = Object.entries(filters.preferredGender || {})
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(',');
  if (gender) parts.push(`pg=${gender}`);

  const stVals = filters.status ? Object.entries(filters.status)
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(',') : '';
  if (stVals) parts.push(`st=${stVals}`);

  return parts.join('|');
};

// Helper to parse the compact filter string back into an object
const parseFiltersFromUrl = (str: string | null): FilterOptions | null => {
  if (!str) return null;
  
  const filters: FilterOptions = {
    jobTypes: {},
    salaryRange: { lessThan5000: false, range10to20: false, moreThan20000: false, custom: false },
    experienceLevel: { entryLevel: false, intermediate: false, professional: false },
    preferredGender: { any: false, female: false, male: false, others: false },
    status: { deleted: false, locked: false, pending: false, approved: false, rejected: false },
  };

  str.split('|').forEach(part => {
    const [key, value] = part.split('=');
    if (!key || !value) return;

    if (key === 'jt') {
      value.split(';').forEach(typePart => {
        const [type, subtypesStr] = typePart.split(':');
        if (type && subtypesStr) {
          filters.jobTypes[type] = subtypesStr.split(',');
        }
      });
    } else if (key === 'sr') {
      value.split(',').forEach(k => (filters.salaryRange as any)[k] = true);
    } else if (key === 'el') {
      value.split(',').forEach(k => (filters.experienceLevel as any)[k] = true);
    } else if (key === 'pg') {
      value.split(',').forEach(k => (filters.preferredGender as any)[k] = true);
    } else if (key === 'st') {
      value.split(',').forEach(k => {
        if ((filters.status as any)[k] !== undefined) {
          (filters.status as any)[k] = true;
        }
      });
    }
  });

  return filters;
};

export default useApplications;
