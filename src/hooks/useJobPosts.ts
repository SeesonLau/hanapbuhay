"use client";

import { useEffect, useState, useCallback } from "react";
import { PostService } from "@/lib/services/posts-services";
import { ApplicationService } from "@/lib/services/applications-services";

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

export function useJobPosts(userId?: string | null) {
  const [jobs, setJobs] = useState<JobPostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const load = useCallback(async (params: { searchTerm?: string; location?: string } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const svcResult = userId
        ? await (PostService as any).getPostsByUserId(userId, params)
        : await PostService.getAllPosts(params);

      const posts = svcResult?.posts || [];
      const counts = await Promise.all(posts.map((p: any) => ApplicationService.getTotalApplicationsByPostIdCount(p.postId).catch(() => 0)));
      const mapped = posts.map((p: any, idx: number) => mapPost(p, counts[idx] ?? 0));
      setJobs(mapped);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = async (query: string, location?: string) => {
    await load({ searchTerm: query, location });
  };

  return { jobs, loading, error, handleSearch, refresh: () => load() };
}

export type { JobPostData };
