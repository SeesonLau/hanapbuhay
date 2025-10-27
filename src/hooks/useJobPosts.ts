"use client";

import { useEffect, useState, useCallback } from "react";
import { PostService } from "@/lib/services/posts-services";
import { ApplicationService } from "@/lib/services/applications-services";
import { supabase } from "@/lib/services/supabase/client";

type JobPostData = {
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
};

interface LoadParams {
  searchTerm?: string;
  location?: string;
  isLoadMore?: boolean;
  page?: number;
  pageSize?: number;
}

const PAGE_SIZE = 10;

export function useJobPosts(userId?: string | null) {
  const [jobs, setJobs] = useState<JobPostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);

  const formatPeso = (amount: number) => {
    try {
      return amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch {
      return String(amount);
    }
  };

  const formatPostedDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return iso;
    }
  };

  const mapPost = (post: any, applicantCount = 0): JobPostData => ({
    id: post.postId,
    title: post.title,
    description: post.description,
    location: post.location,
    salary: formatPeso(post.price),
    salaryPeriod: "month",
    postedDate: formatPostedDate(post.createdAt),
    applicantCount,
    genderTags: [],
    experienceTags: [],
    jobTypeTags: post.subType || [post.type].filter(Boolean),
  });

  const load = useCallback(async (params: LoadParams = {}) => {
    if (!userId && typeof userId !== 'undefined') {
      setJobs([]);
      setError("User not authenticated");
      return;
    }

    if (params.isLoadMore) {
      if (!hasMoreData || isLoadingMore) return;
      setIsLoadingMore(true);
    } else {
      setLoading(true);
      setCurrentPage(1);
      setJobs([]);
    }
    setError(null);

    try {
      const requestParams = {
        ...params,
        page: params.isLoadMore ? currentPage : 1,
        pageSize: PAGE_SIZE
      };
      delete requestParams.isLoadMore;

      // Get the current user's ID from the session
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;

      // If userId is provided, we're in manage mode, so show only that user's posts
      // Otherwise, in find mode, show all posts except current user's posts
      let svcResult;
      if (userId) {
        svcResult = await PostService.getPostsByUserId(userId, requestParams);
      } else {
        // In find mode, exclude current user's posts
        svcResult = await PostService.getAllPosts({
          ...requestParams,
          excludeUserId: currentUserId
        });
      }

      const posts = svcResult?.posts || [];
      const counts = await Promise.all(posts.map((p: any) => ApplicationService.getTotalApplicationsByPostIdCount(p.postId).catch(() => 0)));
      const mapped = posts.map((p: any, idx: number) => mapPost(p, counts[idx] ?? 0));

      if (params.isLoadMore) {
        setJobs(prev => [...prev, ...mapped]);
        setCurrentPage(prev => prev + 1);
      } else {
        setJobs(mapped);
      }

      setHasMoreData(svcResult.hasMore);
    } catch (err) {
      setError("Failed to load posts");
      console.error("Error loading posts:", err);
    } finally {
      if (params.isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [userId, currentPage, hasMoreData, isLoadingMore]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = async (query: string, location?: string) => {
    await load({ searchTerm: query, location });
  };

  const loadMore = useCallback(() => {
    return load({ isLoadMore: true });
  }, [load]);

  return {
    jobs,
    loading,
    isLoadingMore,
    error,
    hasMore: hasMoreData,
    handleSearch,
    loadMore,
    refresh: () => load()
  };
}

export type { JobPostData };