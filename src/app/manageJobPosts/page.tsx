// src/app/manage-job-posts/page.tsx
"use client";

import { useState } from 'react';
import Banner from '@/components/ui/Banner';
import ApplicantsModal from '@/components/modals/ApplicantsModal';
import JobPostViewModal, { JobPostViewData } from '@/components/modals/JobPostViewModal';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { ManageJobPostCard } from '@/components/cards/ManageJobPostCard';
import { ManageJobPostList } from '@/components/cards/ManageJobPostList';
import { JobType } from '@/lib/constants/job-types';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';
// Removed toggle and card/list for simplified page per request

// Sample job posts removed with card/list views

// Sample job post data for Manage Job Posts
const sampleJobPosts = [
  {
    id: 'm1',
    title: 'Construction Worker Needed',
    description:
      "Looking for a reliable construction worker to assist with ongoing projects. Must be physically fit and able to work with a team.",
    location: 'Banilad, Cebu City',
    salary: '15,000.00',
    salaryPeriod: 'month',
    postedDate: 'August 22, 2025',
    applicantCount: 8,
    genderTags: [Gender.MALE],
    experienceTags: [ExperienceLevel.INTERMEDIATE],
    jobTypeTags: [JobType.CONSTRUCTION, 'Construction Helper'],
  },
  {
    id: 'm2',
    title: 'LF: Babysitter (Weekends)',
    description:
      'We need a trustworthy babysitter for weekend schedules. Experience with toddlers preferred.',
    location: 'Casuntingan, Mandaue City',
    salary: '10,000.00',
    salaryPeriod: 'month',
    postedDate: 'August 20, 2025',
    applicantCount: 2,
    genderTags: [Gender.FEMALE],
    experienceTags: [ExperienceLevel.ENTRY],
    jobTypeTags: [JobType.SERVICE, 'Baby Sitter'],
  },
  // Additional posts with extended tags set
  {
    id: 'm3',
    title: 'Skilled Welder for Small Projects',
    description:
      'Seeking an experienced welder for small fabrication jobs. Bonus if you can assist with basic mechanical tasks.',
    location: 'Lapu-Lapu City',
    salary: '18,000.00',
    salaryPeriod: 'month',
    postedDate: 'September 2, 2025',
    applicantCount: 5,
    genderTags: [Gender.MALE, Gender.ANY],
    experienceTags: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.EXPERT],
    // Use valid subtypes from job-types constants
    jobTypeTags: ['Welder', 'Electrician', 'Mechanic', 'Tailor/Seamstress', 'Shoemaker/Cobbler'],
  },
  {
    id: 'm4',
    title: 'Digital Content Creator / Social Media',
    description:
      'Looking for a creative content creator to manage short-form videos and posts across platforms.',
    location: 'Cebu City',
    salary: '20,000.00',
    salaryPeriod: 'month',
    postedDate: 'September 5, 2025',
    applicantCount: 12,
    genderTags: [Gender.ANY, Gender.FEMALE],
    experienceTags: [ExperienceLevel.ENTRY, ExperienceLevel.INTERMEDIATE],
    jobTypeTags: ['Content Creator', 'Social Media Manager', 'Graphic Designer', 'Online Seller', 'Online Tutor'],
  },
];

export default function ManageJobPostsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);

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

      <main className="pl-4 pr-4 pb-8 pt-8">
        {/* Container matching Find Jobs layout */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Job Posts</h1>
          <p className="text-lg text-gray-600 mb-6">
            This is the Manage Job Posts page. Content coming soon...
          </p>

          {/* View Applicants Button */}
          <button
            onClick={openModal}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            View Applicants
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
                  <ManageJobPostCard 
                    key={jobPost.id} 
                    jobData={jobPost} 
                    onOpen={(data) => { setSelectedJob(data); setIsJobViewOpen(true); }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="flex flex-col items-start gap-4 w-[1840px] mx-auto">
                {sampleJobPosts.map((jobPost) => (
                  <ManageJobPostList 
                    key={jobPost.id} 
                    jobData={jobPost} 
                    onOpen={(data) => { setSelectedJob(data); setIsJobViewOpen(true); }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <ApplicantsModal isOpen={isModalOpen} onClose={closeModal} />
        <JobPostViewModal 
          isOpen={isJobViewOpen} 
          onClose={() => setIsJobViewOpen(false)} 
          job={selectedJob}
          onApply={(id) => console.log('apply', id)}
        />
      </main>
    </div>
  );
}
