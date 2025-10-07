'use client';

import Banner from '@/components/ui/Banner';

export default function AppliedJobsPage() {
  const handleSearch = (query: string) => {
    // Add your search logic here
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section with Header and Search */}
      <Banner
        variant="appliedJobs"
        onSearch={handleSearch}
      />

      <main className="p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-h2 font-alexandria font-bold text-black mb-6">
            Applied Jobs
          </h1>
          <p className="text-lead font-inter font-normal text-gray-neutral600">
            Track your job applications here. Content coming soon...
          </p>
        </div>
      </main>
    </div>
  );
}
