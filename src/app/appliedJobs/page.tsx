// src/app/applied-jobs/page.tsx
'use client';

import Banner from '@/components/ui/Banner';

export default function AppliedJobsPage() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Add your search logic here
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#141515' }}>
      {/* Banner Section with Header and Search */}
      <Banner
        variant="appliedJobs"
        onSearch={handleSearch}
      />

      <main className="p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Applied Jobs</h1>
          <p className="text-lg text-gray-600">Track your job applications here. Content coming soon...</p>
        </div>
      </main>
    </div>
  );
}
