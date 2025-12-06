"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { PostService } from "@/lib/services/posts-services";
import { ApplicationService } from "@/lib/services/applications-services";
import type { Post } from "@/lib/models/posts";
import { Gender } from "@/lib/constants/gender";
import { ExperienceLevel } from "@/lib/constants/experience-level";
import { JobType, SubTypes } from "@/lib/constants/job-types";
import type { FilterOptions } from '@/components/ui/FilterSection';

import { PostMessages } from "@/resources/messages/posts";

const PAGE_SIZE = 10;

export interface JobPostData {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  salaryPeriod: string;
  postedDate: string;
  isLocked: boolean;
  applicantCount?: number;
  genderTags?: string[];
  experienceTags?: string[];
  jobTypeTags?: string[];
  requirements?: string[];
  raw?: Post;
}

function formatPeso(value: any) {
  const n = Number(value ?? 0);
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPostedDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

// Helper to serialize filters into a compact string
const serializeFiltersForUrl = (filters: FilterOptions | null): string | undefined => {
  if (!filters) return undefined;

  const parts: string[] = [];

  // Job Types: jt=Agriculture:Farmhand,Other;IT:Developer
  const jobTypes = Object.entries(filters.jobTypes || {})
    .filter(([_, subtypes]) => subtypes.length > 0)
    .map(([type, subtypes]) => `${type}:${subtypes.join(',')}`)
    .join(';');
  if (jobTypes) parts.push(`jt=${jobTypes}`);

  // Salary Range: sr=lessThan5000,range10to20
  const salary = Object.entries(filters.salaryRange || {})
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(',');
  if (salary) parts.push(`sr=${salary}`);

  // Experience Level: el=entryLevel,intermediate
  const exp = Object.entries(filters.experienceLevel || {})
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(',');
  if (exp) parts.push(`el=${exp}`);
  
  // Gender: pg=male,female
  const gender = Object.entries(filters.preferredGender || {})
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(',');
  if (gender) parts.push(`pg=${gender}`);

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
    }
  });

  return filters;
};

export function useJobPosts(userId?: string | null, options: { skip?: boolean; excludeMine?: boolean; excludeApplied?: boolean } = {}) {
  const [jobs, setJobs] = useState<JobPostData[]>([]);
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

  const REQUIREMENTS_MARKER = "[requirements]";
  const splitDescriptionAndRequirements = (desc?: string): { about: string; requirements: string[] } => {
    const raw = desc ?? "";
    const markerIdx = raw.indexOf(REQUIREMENTS_MARKER);
    if (markerIdx === -1) {
      return { about: raw, requirements: [] };
    }
    const about = raw.slice(0, markerIdx).trim();
    const reqSection = raw.slice(markerIdx + REQUIREMENTS_MARKER.length).trim();
    const lines = reqSection.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const items = lines.map((l) => l.replace(/^[-•]\s*/, "").trim()).filter(Boolean);
    return { about, requirements: items };
  };

  const mapPost = (post: Post, applicantCount = 0): JobPostData => {
    const { about, requirements } = splitDescriptionAndRequirements(post.description);
    const sub = post.subType || [];
    const genderTags = Array.from(new Set(sub.filter(s => Object.values(Gender).includes(s as Gender))));
    const experienceTags = Array.from(new Set(sub.filter(s => Object.values(ExperienceLevel).includes(s as ExperienceLevel))));
    const allJobSubTypes = Object.values(SubTypes).flat();
    const jobSubtypeTags = Array.from(new Set(
      sub.filter(s => allJobSubTypes.includes(s))
         .filter(s => !genderTags.includes(s) && !experienceTags.includes(s))
    ));
    const jobTypeTags = Array.from(new Set([post.type, ...jobSubtypeTags].filter(Boolean)));
    return {
      id: post.postId,
      title: post.title,
      description: about,
      location: post.location ?? "",
      salary: formatPeso((post as any).price),
      salaryPeriod: "month",
      postedDate: formatPostedDate(post.createdAt),
      isLocked: post.isLocked,
      applicantCount,
      genderTags,
      experienceTags,
      jobTypeTags,
      requirements,
      raw: post,
    };
  };

    // URL utility functions
    const updateQueryParams = (params: Record<string, any>, push = true) => {
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
    };
  
    const parseUrlParams = () => {
      if (typeof window === 'undefined') return { q: '', location: '', sortVal: '', parsedFilters: null, postId: '' };
      
      const url = new URL(window.location.href);
      const q = url.searchParams.get('q') || '';
      const location = url.searchParams.get('location') || '';
      const sortVal = url.searchParams.get('sort') || '';
      const filtersStr = url.searchParams.get('filters');
      const postId = url.searchParams.get('postId') || '';
      
      return { q, location, sortVal, parsedFilters: parseFiltersFromUrl(filtersStr), postId };
    };

  const load = useCallback(async (params: { page?: number; isLoadMore?: boolean; searchTerm?: string; location?: string; sortBy?: string; sortOrder?: 'asc' | 'desc'; filters?: FilterOptions | null } = {}) => {
    const page = params.page ?? 1;
    const isLoadMore = params.isLoadMore ?? false;

    try {
      if (isLoadMore) setIsLoadingMore(true);
      else setLoading(true);

      const requestParams: any = {
        page,
        pageSize: PAGE_SIZE,
        ...(params.searchTerm ? { searchTerm: `*${params.searchTerm}*` } : {}),
        ...(params.location ? { location: params.location } : {}),
        sortBy: params.sortBy ?? sort.sortBy,
        sortOrder: params.sortOrder ?? sort.sortOrder,
      };

      // Apply filters (job types, subtypes, price range) to request params if provided
      const appliedFilters = 'filters' in params ? params.filters : filters;
      if (appliedFilters) {
        const { jobTypes, salaryRange, experienceLevel, preferredGender } = appliedFilters;

        console.log('Applying filters - jobTypes object:', jobTypes);

        // jobTypes: object where keys are jobType (e.g., "Agriculture") and values are arrays of subtypes (e.g., ["Farmhand", "Other"])
        const jobTypeKeys = Object.keys(jobTypes || {}).filter(key => {
          const subs = jobTypes[key];
          return subs && subs.length > 0; // Only include job types with selected subtypes
        });

        console.log('Job type keys with selections:', jobTypeKeys);

        if (jobTypeKeys.length > 0) {
          // Separate "Other" selections from specific subtype selections
          const otherJobTypes: string[] = []; // Job types that have "Other" selected
          const specificSubTypes: string[] = []; // Specific subtypes like "Farmhand", "Graphic Designer", etc.

          for (const jobType of jobTypeKeys) {
            const subs = jobTypes[jobType];
            if (subs && subs.length > 0) {
              console.log(`Processing ${jobType}:`, subs);
              // Check if this job type has "Other" selected
              if (subs.includes('Other')) {
                otherJobTypes.push(jobType);
                console.log(`  -> Added to otherJobTypes`);
              }
              // Add all non-"Other" subtypes to the list
              const nonOtherSubs = subs.filter(s => s !== 'Other');
              if (nonOtherSubs.length > 0) {
                specificSubTypes.push(...nonOtherSubs);
                console.log(`  -> Added to specificSubTypes:`, nonOtherSubs);
              }
            }
          }

          console.log('Final filter state:', { specificSubTypes, otherJobTypes });

          // If there are specific subtypes selected, filter by subType field
          if (specificSubTypes.length > 0) {
            requestParams.subType = specificSubTypes;
            console.log('Set requestParams.subType:', specificSubTypes);
          }

          // If there are "Other" selections (job types with only "Other" selected), filter by type field
          if (otherJobTypes.length > 0) {
            if (specificSubTypes.length > 0) {
              // Mix of specific subtypes and "Other": need to filter by both
              // We'll use a combination approach: (subType IN [...] OR type IN [...])
              requestParams.jobType = otherJobTypes;
              requestParams.matchMode = 'mixed'; // Flag to indicate mixed filtering
              console.log('Mixed filter mode - jobType:', otherJobTypes, 'matchMode: mixed');
            } else {
              // Only "Other" selected
              if (otherJobTypes.length === 1) {
                requestParams.jobType = otherJobTypes[0];
              } else {
                requestParams.jobType = otherJobTypes;
              }
            }
          }
        }

        // salaryRange: only support single selection for server-side filtering
        const selectedSalaryKeys = Object.entries(salaryRange || {})
          .filter(([_, v]) => v)
          .map(([k]) => k);

        if (selectedSalaryKeys.length === 1) {
          const key = selectedSalaryKeys[0];
          if (key === 'lessThan5000') {
            requestParams.priceRange = { min: 0, max: 4999 };
          } else if (key === 'range10to20') {
            requestParams.priceRange = { min: 10000, max: 20000 };
          } else if (key === 'moreThan20000') {
            requestParams.priceRange = { min: 20001, max: 1000000000 };
          }
        }

        // Add experienceLevel to requestParams
        const selectedExperienceLevels = Object.entries(experienceLevel || {})
          .filter(([_, v]) => v)
          .map(([k]) => {
            if (k === 'entryLevel') return ExperienceLevel.ENTRY;
            if (k === 'intermediate') return ExperienceLevel.INTERMEDIATE;
            if (k === 'professional') return ExperienceLevel.EXPERT;
            return k;
          });

        if (selectedExperienceLevels.length > 0) {
          requestParams.experienceLevel = selectedExperienceLevels;
        }
        
        // Add preferredGender to requestParams
        const selectedGenders = Object.entries(preferredGender || {})
          .filter(([_, v]) => v)
          .map(([k]) => {
            if (k === 'any') return Gender.ANY;
            if (k === 'male') return Gender.MALE;
            if (k === 'female') return Gender.FEMALE;
            if (k === 'others') return Gender.OTHERS;
            return k;
          });
        
        if (selectedGenders.length > 0) {
          requestParams.preferredGender = selectedGenders;
        }
      }

      console.log('Final requestParams sent to API:', requestParams);

      let svcResult: any;
      if (userId && options.excludeMine !== true) {
        // existing behavior: fetch posts by user when userId provided and not excluding mine
        svcResult = await PostService.getPostsByUserId(userId, requestParams);
      } else {
        svcResult = await PostService.getAllPosts(requestParams);
      }

      let posts: Post[] = svcResult?.posts ?? [];
      console.log('Retrieved posts from API:', posts.length, 'posts');

      // If requested, exclude posts that belong to the current user
      if (userId && options.excludeMine) {
        posts = posts.filter((p) => p.userId !== userId);
      }

      // If requested, exclude posts that the current user already applied for
      if (userId && options.excludeApplied) {
        try {
          const appliedPostIds = await ApplicationService.getAppliedPostIdsByUser(userId);
          const set = new Set(appliedPostIds);
          posts = posts.filter((p) => !set.has(p.postId));
        } catch (err) {
          // swallow error and proceed without excluding
        }
      }

      const counts = await Promise.all(posts.map((p) => ApplicationService.getTotalApplicationsByPostIdCount(p.postId).catch(() => 0)));
      const mapped = posts.map((p, idx) => mapPost(p, counts[idx] ?? 0));

      if (isLoadMore) {
        setJobs((prev) => [...prev, ...mapped]);
        setCurrentPage(page);
      } else {
        setJobs(mapped);
        setCurrentPage(page);
      }

      setHasMoreData(Boolean(svcResult?.hasMore));
      setError(null);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [userId, sort.sortBy, sort.sortOrder, filters, options.excludeMine, options.excludeApplied]);

  const applyFilters = useCallback(async (f: FilterOptions | null) => {
    setFilters(f);
    await load({ page: 1, filters: f });
    updateQueryParams({ filters: serializeFiltersForUrl(f) });
  }, [load, updateQueryParams]);

  useEffect(() => {
    const { q, location: loc, sortVal, parsedFilters } = parseUrlParams();

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

    if (q || loc || sortVal || parsedFilters) {
      load({
        page: 1,
        searchTerm: q,
        location: loc,
        sortBy,
        sortOrder,
        filters: parsedFilters,
      });
    } else if (!options.skip) {
      load({ page: 1 });
    }
  }, [options.skip]);
  
  const setSelectedPostId = (id?: string | null, push = true) => {
    updateQueryParams({ postId: id || undefined }, push);
  };



  const handleSearch = useCallback((query: string, location?: string) => {
    (async () => {
      await load({ page: 1, searchTerm: query, location });

      // Update URL with search params
      updateQueryParams({ q: query || undefined, location: location || undefined });

      // Then apply fuzzy search ranking on client-side for better relevance
      setJobs((prevJobs) => {
        if (!query.trim()) return prevJobs;

        const queryLower = query.toLowerCase();

        const calculateFuzzyScore = (text: string, searchTerm: string): number => {
          const textLower = text.toLowerCase();

          if (textLower.includes(searchTerm)) return 1000;

          const words = searchTerm.split(/\s+/).filter(Boolean);
          if (words.every(w => textLower.includes(w))) return 500;

          let matchedChars = 0;
          let textIdx = 0;
          for (let i = 0; i < searchTerm.length && textIdx < textLower.length; i++) {
            const searchChar = searchTerm[i];
            while (textIdx < textLower.length && textLower[textIdx] !== searchChar) {
              textIdx++;
            }
            if (textIdx < textLower.length) {
              matchedChars++;
              textIdx++;
            }
          }

          let score = (matchedChars / Math.max(1, searchTerm.length)) * 300;
          words.forEach(word => {
            if (textLower.includes(word.substring(0, 3))) score += 50;
          });
          return score;
        };

        return prevJobs
          .map((job) => {
            let score = 0;
            const titleLower = job.title.toLowerCase();
            const descLower = job.description.toLowerCase();

            score += calculateFuzzyScore(titleLower, queryLower) * 1.5;
            score += calculateFuzzyScore(descLower, queryLower) * 0.5;

            return { job, score };
          })
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .map((item) => item.job);
      });
    })();
  }, [load]);

  const handleSort = useCallback(async (sortBy: string, sortOrder: 'asc' | 'desc') => {
    const requested = { sortBy, sortOrder };

    // Update state and reload
    setSort(requested);
    await load({ page: 1, sortBy, sortOrder });

    // Determine current sort value in URL
    const { sortVal: currentSortVal } = parseUrlParams();
    const requestedSortParam = sortOrder === 'asc' ? `${sortBy}_asc` : `${sortBy}_desc`;

    // Default sort is createdAt desc -> treated as absence of `sort` param
    const isDefault = sortBy === 'createdAt' && sortOrder === 'desc';

    if (isDefault) {
      // If URL already doesn't have sort, avoid updating
      if (!currentSortVal) return;

      // Remove sort param using replaceState so we don't add history entries
      updateQueryParams({ sort: undefined }, false);
      return;
    }

    // For non-default: only update URL if it differs
    if (currentSortVal === requestedSortParam) return;
    updateQueryParams({ sort: requestedSortParam });
  }, [load]);

  const setSortInUrl = useCallback((sort?: string) => {
    // Default sorts treated as absence of `sort` param
    const defaultSorts = new Set(['createdAt_desc', 'date_desc']);
    const { sortVal: currentSort } = parseUrlParams();

    if (!sort || defaultSorts.has(sort)) {
      if (!currentSort) return;
      // use replaceState to avoid adding to history
      updateQueryParams({ sort: undefined }, false);
      return;
    }

    if (currentSort === sort) return;
    updateQueryParams({ sort });
  }, [parseUrlParams, updateQueryParams]);

  const setSortInUrlForManage = useCallback((sort?: string) => {
    // This is a simplified version for manage jobs which only has date sort
    const defaultSorts = new Set(['latest', 'date_desc']);
    const { sortVal: currentSort } = parseUrlParams();

    if (!sort || defaultSorts.has(sort)) {
      if (!currentSort) return;
      // use replaceState to avoid adding to history
      updateQueryParams({ sort: undefined }, false);
      return;
    }

    if (currentSort === sort) return;
    updateQueryParams({ sort });
  }, [parseUrlParams, updateQueryParams]);


  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMoreData) return;
    await load({ page: currentPage + 1, isLoadMore: true });
  }, [isLoadingMore, hasMoreData, currentPage, load]);

  const deletePost = useCallback(async (postId: string) => {
    if (!userId) throw new Error("User not authenticated");
    try {
      await PostService.deletePost(postId, userId);
      // refresh
      await load({ page: 1 });
    } catch (err) {
      toast.error("Failed to delete post");
      throw err;
    }
  }, [userId, load]);

  const toggleLockPost = useCallback(async (postId: string, isLocked: boolean) => {
    if (!userId) throw new Error("User not authenticated");
    try {
      await PostService.updatePost(postId, { isLocked });
      toast.success(PostMessages.LOCK_SUCCESS(isLocked));
      // Refresh the list to show the updated status
      await load({ page: 1 });
    } catch (err) {
      toast.error(PostMessages.LOCK_FAILURE(isLocked));
      throw err;
    }
  }, [userId, load]);

  const updatePost = useCallback(async (postId: string, postData: Partial<Post> | any) => {
    if (!userId) throw new Error("User not authenticated");
    try {
      const updated = await PostService.updatePost(postId, postData);
      // After updating, refresh the list
      await load({ page: 1 });
      return updated;
    } catch (err) {
      throw err;
    }
  }, [userId, load]);

  const createPost = useCallback(async (postData: Omit<Post, 'postId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>) => {
    if (!userId) throw new Error("User not authenticated");
    try {
      const created = await PostService.createPost(postData);
      // After creating, refresh the list
      await load({ page: 1 });
      return created;
    } catch (err) {
      throw err;
    }
  }, [userId, load]);

  const refresh = useCallback(async () => {
    await load({ page: 1 });
  }, [load]);

  return {
    jobs: jobs,
    loading,
    isLoadingMore,
    error,
    hasMore: hasMoreData,
    handleSearch,
    handleSort,
    loadMore,
    refresh,
    deletePost,
    toggleLockPost,
    updatePost,
    createPost,
    applyFilters,
    setSelectedPostId,
    parseUrlParams,
    setSortInUrl, // findJobs uses this
    setSortInUrlForManage,
    updateQueryParams,
  };
}