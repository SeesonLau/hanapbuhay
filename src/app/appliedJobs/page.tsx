'use client';

import { useState } from 'react';
import Banner from '@/components/ui/Banner';
import AppliedJobCard, { AppliedJob } from '@/components/applications/cards/AppliedJobCard';
import { FaTh, FaList } from 'react-icons/fa';
import Button from '@/components/ui/Button';

// Sample data for demonstration
const sampleJobs: AppliedJob[] = [
  {
    id: '1',
    title: 'Wanted! Caretaker for my lolo',
    description: "We're looking for someone caring and patient to help take care of a bedridden loved one at home. We want someone who can treat our family member with kindness and respect.",
    location: 'Basak, Cebu City',
    salary: 12000,
    salaryType: 'monthly',
    appliedOn: 'August 27, 2025',
    status: 'pending',
    tags: ['Caretaker', 'Entry level', 'Female'],
    genderPreference: 'Female'
  },
  {
    id: '2',
    title: 'LF: Plumber! NOW!',
    description: "When the sink clogs or a faucet leaks, it can really disrupt the whole household. We're looking for someone reliable who can help us fix these small but important problems.",
    location: 'Banilad, Cebu City',
    salary: 5000,
    salaryType: 'fixed',
    appliedOn: 'August 27, 2025',
    status: 'approved',
    tags: ['Plumber', 'Expert', 'Male']
  },
  {
    id: '3',
    title: 'Need a Driver ASAP',
    description: "Looking for a reliable driver with a clean driving record. Must be available for flexible hours and comfortable with city driving.",
    location: 'Banawa, Cebu City',
    salary: 15000,
    salaryType: 'monthly',
    appliedOn: 'August 27, 2025',
    status: 'rejected',
    tags: ['Driver', 'Entry level', 'Male']
  }
];

export default function AppliedJobsPage() {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [jobs, setJobs] = useState<AppliedJob[]>(sampleJobs);

  const handleSearch = (query: string) => {
    // Add your search logic here
    console.log('Searching for:', query);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-gray-neutral50">
      {/* Banner Section with Header and Search */}
      <Banner
        variant="appliedJobs"
        onSearch={handleSearch}
      />

      <main className="p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-h2 font-alexandria font-bold text-gray-neutral900 mb-2">
                Applied Jobs
              </h1>
              <p className="text-body font-inter text-gray-neutral600">
                Track and manage your job applications ({jobs.length} applications)
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-neutral200">
              <Button
                variant={viewMode === 'card' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('card')}
                className="flex items-center gap-2"
              >
                <FaTh className="w-4 h-4" />
                Card
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2"
              >
                <FaList className="w-4 h-4" />
                List
              </Button>
            </div>
          </div>

          {/* Jobs Container */}
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lead font-inter text-gray-neutral600 mb-4">
                No job applications found.
              </p>
              <p className="text-body font-inter text-gray-neutral500">
                Start applying for jobs to see them here!
              </p>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'card' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'flex flex-col gap-4'
              }
            `}>
              {jobs.map((job) => (
                <AppliedJobCard
                  key={job.id}
                  job={job}
                  variant={viewMode}
                  onDelete={handleDeleteJob}
                  className={viewMode === 'card' ? 'mx-auto' : ''}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
