// src/app/manage-job-posts/page.tsx
"use client";

import React, { useState } from 'react';
import HeaderDashboard from '@/components/ui/HeaderDashboard';
import { ManageJobPostCard } from '@/components/ui/ManageJobPostCard';
import { ManageJobPostList } from '@/components/ui/ManageJobPostList';
import { ViewToggle } from '@/components/ui/ViewToggle';

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
    genderTags: ["Female"],
    experienceTags: ["Entry level"],
    jobTypeTags: ["Baby Sitter"]
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
    genderTags: ["Male", "Female"],
    experienceTags: ["Entry level", "Experienced"],
    jobTypeTags: ["Service"]
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
    genderTags: ["Male"],
    experienceTags: ["Experienced"],
    jobTypeTags: ["Construction"]
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
    genderTags: ["Any"],
    experienceTags: ["Expert"],
    jobTypeTags: ["Website Builder"]
  }
];

export default function ManageJobPostsPage() {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#141515' }}>
      {/* Header Section */}
      <header className="w-full flex justify-center pt-8 px-4">
        <HeaderDashboard />
      </header>

      <main className="p-8">
        <div className="max-w-[1840px] mx-auto">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Job Posts</h1>
                <p className="text-lg text-gray-600">View and manage your job postings</p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <ViewToggle value={viewMode} onChange={setViewMode} />
              </div>
            </div>
          </div>

          {/* Job Posts Display - centered containers that hug content */}
          {viewMode === 'card' ? (
            <div className="w-full flex justify-center">
              <div className="flex flex-wrap items-start justify-between w-[1840px] gap-y-[20px]">
                {sampleJobPosts.map((jobPost) => (
                  <ManageJobPostCard key={jobPost.id} jobData={jobPost} />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="flex flex-col items-start gap-[20px] w-[1840px]">
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
