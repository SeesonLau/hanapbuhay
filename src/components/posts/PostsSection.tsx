"use client";

import React from "react";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { JobPostCard } from "@/components/cards/JobPostCard";
import { JobPostList } from "@/components/cards/JobPostList";
import { ManageJobPostCard } from "@/components/cards/ManageJobPostCard";
import { ManageJobPostList } from "@/components/cards/ManageJobPostList";
import type { JobPostData } from "@/hooks/useJobPosts";

type Variant = "find" | "manage";

interface Props {
  jobs: JobPostData[];
  variant?: Variant;
  loading?: boolean;
  error?: string | null;
  viewMode: "card" | "list";
  onViewModeChange: (v: "card" | "list") => void;
  onOpen?: (data: any) => void;
  onApply?: (id: string) => void;
  onViewApplicants?: (data: any) => void;
}

const PostsSection: React.FC<Props> = ({ jobs, variant = "find", loading, error, viewMode, onViewModeChange, onOpen, onApply, onViewApplicants }) => {
  if (loading) return <div className="text-center py-8">Loading job posts...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!jobs || jobs.length === 0) return <div className="text-center py-8 text-gray-500">No job posts available.</div>;

  const isManage = variant === "manage";

  return (
    <div className="mt-8 space-y-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <ViewToggle value={viewMode} onChange={onViewModeChange} />
          </div>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="w-full flex justify-center">
          <div className="flex flex-wrap items-start justify-center gap-5">
            {jobs.map((job) => (
              isManage ? (
                <ManageJobPostCard key={job.id} jobData={job as any} onOpen={onOpen} onViewApplicants={onViewApplicants} />
              ) : (
                <JobPostCard key={job.id} jobData={job as any} onOpen={onOpen} onApply={onApply} />
              )
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className={`flex flex-col items-start gap-4 mx-auto ${viewMode === 'list' ? 'w-[1526px]' : ''}`}>
            {jobs.map((job) => (
              isManage ? (
                <ManageJobPostList key={job.id} jobData={job as any} onOpen={onOpen} onViewApplicants={onViewApplicants} />
              ) : (
                <JobPostList key={job.id} jobData={job as any} onOpen={onOpen} onApply={onApply} />
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsSection;
