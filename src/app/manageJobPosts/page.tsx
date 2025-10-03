// src/app/manage-job-posts/page.tsx
'use client';

import Banner from '@/components/ui/Banner';

export default function ManageJobPostsPage() {
  const handleSearch = (query: string, location?: string) => {
    console.log('Search query:', query);
    if (location) {
      console.log('Location:', location);
    }
    // Add your search logic here
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section with Header and Search */}
      <Banner
        variant="manageJobPosts"
        onSearch={handleSearch}
      />

      <main className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Page Content */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-6">Manage Job Posts</h1>
            <p className="text-lg text-gray-300">Create and manage your job postings</p>
          </div>

          {/* Job Posts Content */}
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Job Posts</h2>
              <p className="text-gray-600">Job posts content coming soon...</p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Component Usage</h3>
            <div className="space-y-3 text-gray-700">
              <p><strong>Simple variant:</strong> <code className="bg-gray-100 px-2 py-1 rounded">variant="simple"</code></p>
              <p><strong>Advanced variant:</strong> <code className="bg-gray-100 px-2 py-1 rounded">variant="advanced"</code></p>
              <p><strong>Custom placeholders:</strong> Use <code className="bg-gray-100 px-2 py-1 rounded">placeholder</code> and <code className="bg-gray-100 px-2 py-1 rounded">locationPlaceholder</code> props</p>
              <p><strong>Search callback:</strong> Use <code className="bg-gray-100 px-2 py-1 rounded">onSearch</code> prop to handle search actions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
