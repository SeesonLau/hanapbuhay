'use client';

import Banner from '@/components/ui/Banner';
import StatCardAppliedJobs from '@/components/cards/StatCardAppliedJobs';

export default function AppliedJobsPage() {
  const handleSearch = (query: string) => {
    // Add your search logic here
    console.log('Searching for:', query);
  };

  // Removed mock types and data (AppliedJob, sampleJobs) and delete handler

  const handleStatFilter = (type: 'total' | 'pending' | 'approved' | 'rejected') => {
    console.log('Selected stat:', type);
    // TODO: Filter applied jobs list by selected status (not implemented yet)
  };

  return (
    <div className="min-h-screen bg-gray-neutral50">
      {/* Banner Section with Header and Search */}
      <Banner
        variant="appliedJobs"
        onSearch={handleSearch}
      />

      <main className="p-8 pt-[240px]">
        {/* Two-column layout: stats on the left, content on the right */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          {/* Left Stats Sidebar */}
          <div className="flex flex-col gap-4 md:sticky md:top-6">
            <StatCardAppliedJobs type="total" onClick={handleStatFilter} />
            <StatCardAppliedJobs type="pending" onClick={handleStatFilter} />
            <StatCardAppliedJobs type="approved" onClick={handleStatFilter} />
            <StatCardAppliedJobs type="rejected" onClick={handleStatFilter} />
          </div>

          {/* Right Main Content Container */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Applied Jobs</h1>
            <p className="text-lg text-gray-600">Track your job applications here. Content coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
