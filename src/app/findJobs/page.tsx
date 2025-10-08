"use client";

import { useState } from "react";
import Banner from "@/components/ui/Banner";
import ViewProfileModal from "@/components/modals/ViewProfileModal";
import JobPostViewModal, { JobPostViewData } from "@/components/modals/JobPostViewModal";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { JobPostCard } from "@/components/cards/JobPostCard";
import { StatCardFindJobs } from "@/components/cards/StatCardFindJobs";
import { JobPostList } from "@/components/cards/JobPostList";
import { JobType } from "@/lib/constants/job-types";
import { Gender } from "@/lib/constants/gender";
import { ExperienceLevel } from "@/lib/constants/experience-level";

// Sample job post data for Find Jobs
const sampleJobPosts = [
  {
    id: "p1",
    title: "LF: Plumber! NOW!",
    description: "When the sink clogs or a faucet leaks, it can really disrupt the whole household. We’re looking for someone reliable who can help us fix these small but important problems.",
    location: "Banilad, Cebu City",
    salary: "5,000.00",
    salaryPeriod: "month",
    postedDate: "August 20, 2025",
    applicantCount: 15,
    genderTags: [Gender.MALE],
    experienceTags: [ExperienceLevel.EXPERT],
    jobTypeTags: [JobType.SKILLED, "Plumber"]
  },
  {
    id: "p2",
    title: "LF: Babysitter",
    description: "As parents, we just want someone we can trust with our children. We need help looking after them while we're away or busy.",
    location: "Casuntingan, Mandaue City",
    salary: "10,000.00",
    salaryPeriod: "month",
    postedDate: "August 20, 2025",
    applicantCount: 2,
    genderTags: [Gender.FEMALE],
    experienceTags: [ExperienceLevel.ENTRY],
    jobTypeTags: [JobType.SERVICE, "Baby Sitter"]
  }
];

export default function FindJobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const handleSearch = (query: string, location?: string) => {
    console.log("Search query:", query);
    if (location) {
      console.log("Location:", location);
    }
    // Add your search logic here
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section with Header and Search */}
      <Banner variant="findJobs" onSearch={handleSearch} />

      <main className="pl-4 pr-4 pb-8 pt-8">
        {/* Stats Row */}
        <div className="w-full overflow-x-auto mb-6">
          <div className="flex items-stretch gap-4 w-[1520px] mx-auto">
            <StatCardFindJobs title="Total Jobs" value={12} variant="blue" />
            <StatCardFindJobs title="Completed" value={10} variant="green" />
            <StatCardFindJobs title="Ratings" value={4.5} variant="yellow" />
            <StatCardFindJobs title="Posted" value={5} variant="red" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Jobs</h1>
          <p className="text-lg text-gray-600 mb-6">
            This is the Find Jobs page. Content coming soon...
          </p>

          {/* PLACEHOLDER*/ }
          {/* View Profile Button */ }
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            View Profile
          </button>
        </div>

        {/* Job Posts Section */}
        <div className="mt-8 space-y-6">
          {/* Controls */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>
          </div>

          {/* Display */}
          {viewMode === 'card' ? (
            <div className="w-full flex justify-center">
              <div className="flex flex-wrap items-start justify-center gap-5">
                {sampleJobPosts.map((jobPost) => (
                  <JobPostCard 
                    key={jobPost.id} 
                    jobData={jobPost} 
                    onOpen={(data) => { setSelectedJob(data); setIsJobViewOpen(true); }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="flex flex-col items-start gap-4 w-[1526px] mx-auto">
                {sampleJobPosts.map((jobPost) => (
                  <JobPostList 
                    key={jobPost.id} 
                    jobData={jobPost} 
                    onOpen={(data) => { setSelectedJob(data); setIsJobViewOpen(true); }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <ViewProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <JobPostViewModal 
        isOpen={isJobViewOpen} 
        onClose={() => setIsJobViewOpen(false)} 
        job={selectedJob}
        onApply={(id) => console.log('apply', id)}
      />
          {/* PLACEHOLDER*/ }

    </div>
  );
}
