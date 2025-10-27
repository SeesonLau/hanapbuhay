"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { PostService } from "@/lib/services/posts-services";
import { ApplicationService } from "@/lib/services/applications-services";
import type { Post } from "@/lib/models/posts";

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

export function useJobPosts(userId?: string | null) {
  const [jobs, setJobs] = useState<JobPostData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);

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

  const load = useCallback(async (params: { page?: number; isLoadMore?: boolean; searchTerm?: string; location?: string } = {}) => {
    const page = params.page ?? 1;
    const isLoadMore = params.isLoadMore ?? false;

    try {
      if (isLoadMore) setIsLoadingMore(true);
      else setLoading(true);

      const requestParams: any = {
        page,
        pageSize: PAGE_SIZE,
        ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
        ...(params.location ? { location: params.location } : {}),
      };

      let svcResult: any;
      if (userId) {
        svcResult = await PostService.getPostsByUserId(userId, requestParams);
      } else {
        svcResult = await PostService.getAllPosts(requestParams);
      }

      const posts: Post[] = svcResult?.posts ?? [];
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
  }, [userId]);

  useEffect(() => {
    // load first page when userId changes (or on mount)
    load({ page: 1 });
  }, [load]);

  const handleSearch = useCallback(async (query: string, location?: string) => {
    await load({ page: 1, searchTerm: query, location });
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
    loadMore,
    refresh,
    deletePost,
    updatePost,
    createPost,
  };
}