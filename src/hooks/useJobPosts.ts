"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { PostService } from "@/lib/services/posts-services";
import { ApplicationService } from "@/lib/services/applications-services";
import type { Post } from "@/lib/models/posts";
import type { FilterOptions } from '@/components/ui/FilterSection';

const PAGE_SIZE = 10;

export interface JobPostData {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  salaryPeriod: string;
  postedDate: string;
  applicantCount?: number;
  genderTags?: string[];
  experienceTags?: string[];
  jobTypeTags?: string[];
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

  const mapPost = (post: Post, applicantCount = 0): JobPostData => ({
    id: post.postId,
    title: post.title,
    description: post.description ?? "",
    location: post.location ?? "",
    salary: formatPeso((post as any).price),
    salaryPeriod: "month",
    postedDate: formatPostedDate(post.createdAt),
    applicantCount,
    genderTags: [],
    experienceTags: [],
    jobTypeTags: post.subType ?? (post.type ? [post.type] : []),
    raw: post,
  });

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
      const appliedFilters = params.filters ?? filters;
      if (appliedFilters) {
        const { jobTypes, salaryRange } = appliedFilters;

        // jobTypes: object where keys are jobType and values are arrays of subtypes
        const jobTypeKeys = Object.keys(jobTypes || {});
        if (jobTypeKeys.length === 1) {
          const jt = jobTypeKeys[0];
          requestParams.jobType = jt;
          const subs = jobTypes[jt];
          if (subs && subs.length) requestParams.subType = subs;
        } else if (jobTypeKeys.length > 1) {
          // multiple job types selected: pass all selected subtypes as subType filter
          const allSubs: string[] = [];
          for (const k of jobTypeKeys) {
            const arr = jobTypes[k];
            if (arr && arr.length) allSubs.push(...arr);
          }
          if (allSubs.length) requestParams.subType = allSubs;
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
      }

      let svcResult: any;
      if (userId && options.excludeMine !== true) {
        // existing behavior: fetch posts by user when userId provided and not excluding mine
        svcResult = await PostService.getPostsByUserId(userId, requestParams);
      } else {
        svcResult = await PostService.getAllPosts(requestParams);
      }

      let posts: Post[] = svcResult?.posts ?? [];

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
          console.error('Failed to fetch applied post ids', err);
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
      console.error("Error loading posts:", err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [userId, sort.sortBy, sort.sortOrder]);

  const applyFilters = useCallback(async (f: FilterOptions | null) => {
    setFilters(f);
    await load({ page: 1, filters: f });
  }, [load]);

  useEffect(() => {
    if (options.skip) {
      return;
    }
    // load first page when userId changes (or on mount)
    load({ page: 1 });
  }, [load, options.skip]);

  const handleSearch = useCallback(async (query: string, location?: string) => {
    await load({ page: 1, searchTerm: query, location });
  }, [load]);

  const handleSort = useCallback(async (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setSort({ sortBy, sortOrder });
    await load({ page: 1, sortBy, sortOrder });
  }, [load]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMoreData) return;
    await load({ page: currentPage + 1, isLoadMore: true });
  }, [isLoadingMore, hasMoreData, currentPage, load]);

  const deletePost = useCallback(async (postId: string) => {
    if (!userId) throw new Error("User not authenticated");
    try {
      await PostService.deletePost(postId, userId);
      toast.success("Post deleted successfully");
      // refresh
      await load({ page: 1 });
    } catch (err) {
      toast.error("Failed to delete post");
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
      console.error("Failed to update post:", err);
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
      console.error("Failed to create post:", err);
      throw err;
    }
  }, [userId, load]);

  const refresh = useCallback(async () => {
    await load({ page: 1 });
  }, [load]);

  return {
    jobs,
    loading,
    isLoadingMore,
    error,
    hasMore: hasMoreData,
    handleSearch,
    handleSort,
    loadMore,
    refresh,
    deletePost,
    updatePost,
    createPost,
    applyFilters,
  };
}