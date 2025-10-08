// src/app/manage-job-posts/page.tsx
"use client";

import { useState } from 'react';
import Banner from '@/components/ui/Banner';
import ApplicantsModal from '@/components/modals/ApplicantsModal';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { ManageJobPostCard } from '@/components/cards/ManageJobPostCard';
import { ManageJobPostList } from '@/components/cards/ManageJobPostList';
import { JobType } from '@/lib/constants/job-types';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';

// Sample job post data
const sampleJobPosts = [
  {
    id: "1",
    title: "LF: Babysitter",
    description: "As parents, we just want someone we can trust with our children. We need help looking after them while we're away or busy.",
    location: "Casuntingan, Mandaue City",
    salary: "5,000.00",
    salaryPeriod: "month",
    postedDate: "August 20, 2025",
    applicantCount: 7,
    genderTags: [Gender.FEMALE],
    experienceTags: [ExperienceLevel.ENTRY],
    jobTypeTags: [JobType.SERVICE, "Baby Sitter"]
  },
  {
    id: "2",
    title: "Seeking House Cleaner",
    description: "Looking for a reliable house cleaner to help maintain our home. Must be detail-oriented and trustworthy.",
    location: "Lahug, Cebu City",
    salary: "3,500.00",
    salaryPeriod: "month",
    postedDate: "August 18, 2025",
    applicantCount: 3,
    genderTags: [Gender.MALE, Gender.FEMALE],
    experienceTags: [ExperienceLevel.ENTRY, ExperienceLevel.EXPERIENCED],
    jobTypeTags: [JobType.SERVICE, "House Helper"]
  },
  {
    id: "3",
    title: "Construction Worker Needed",
    description: "We are looking for skilled construction workers for our upcoming project. Experience in concrete work preferred.",
    location: "Talisay City, Cebu",
    salary: "8,000.00",
    salaryPeriod: "month",
    postedDate: "August 15, 2025",
    applicantCount: 2,
    genderTags: [Gender.MALE],
    experienceTags: [ExperienceLevel.EXPERIENCED],
    jobTypeTags: [JobType.CONSTRUCTION, "Construction Helper"]
  },
  {
    id: "4",
    title: "LF: Website builder for a clothing brand",
    description: "I need someone to build me a website for my clothing brand that I just started. Preferably with experience and attention to detail.",
    location: "Mabolo, Cebu City",
    salary: "20,000.00",
    salaryPeriod: "month",
    postedDate: "August 20, 2025",
    applicantCount: 1,
    genderTags: [Gender.ANY],
    experienceTags: [ExperienceLevel.EXPERT],
    jobTypeTags: [JobType.IT, "Website Builder"]
  }
];

export default function ManageJobPostsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const handleSearch = (query: string, location?: string) => {
    console.log('Search query:', query);
    if (location) {
      console.log('Location:', location);
    }
    // Add your search logic here
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen">
      {/* Banner Section with Header and Search */}
      <Banner variant="manageJobPosts" onSearch={handleSearch} />

      <main className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Page Content */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-6">Manage Job Posts</h1>
            <p className="text-lg text-gray-300">Create and manage your job postings</p>
          </div>

          {/* PLACEHOLDER */}
          <button
            onClick={openModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Applicants
          </button>
          <ApplicantsModal isOpen={isModalOpen} onClose={closeModal} />
          {/* PLACEHOLDER */}

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>
          </div>

          {/* Job Posts Display */}
          {viewMode === 'card' ? (
            <div className="w-full flex justify-center">
              <div className="flex flex-wrap items-start justify-between w-full gap-y-5">
                {sampleJobPosts.map((jobPost) => (
                  <ManageJobPostCard key={jobPost.id} jobData={jobPost} />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="flex flex-col items-start gap-5 w-full">
                {sampleJobPosts.map((jobPost) => (
                  <ManageJobPostList key={jobPost.id} jobData={jobPost} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
