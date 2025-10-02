"use client";

import Banner from '@/components/ui/Banner';

export default function BannerDemoPage() {
  const handleSearch = (query: string, location?: string) => {
    console.log('Search query:', query);
    if (location) {
      console.log('Location:', location);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#141515' }}>
      {/* Demo with Find Jobs variant */}
      <div className="mb-8">
        <Banner
          variant="findJobs"
          onSearch={handleSearch}
          userName="Demo User"
          userEmail="demo@example.com"
          userRole="Job Seeker"
          notificationCount={3}
        />
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Banner Component Demo</h1>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              This page demonstrates the Banner component with the "findJobs" variant.
            </p>
            
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Available Variants:</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>findJobs:</strong> Advanced search with job title and location fields</li>
                <li><strong>manageJobPosts:</strong> Simple search with "Post" button</li>
                <li><strong>appliedJobs:</strong> Simple search for tracking applications</li>
                <li><strong>chat:</strong> No search bar, optimized for messaging</li>
                <li><strong>profile:</strong> No search bar, for profile customization</li>
                <li><strong>settings:</strong> No search bar, basic settings page</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Features:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>✅ Fully responsive design</li>
                <li>✅ Integrated HeaderDashboard and SearchBar</li>
                <li>✅ Configurable variants for different pages</li>
                <li>✅ Gradient background matching your design specs</li>
                <li>✅ User authentication support</li>
                <li>✅ Notification system</li>
                <li>✅ Custom search callbacks</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Usage Example:</h3>
              <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`<Banner
  variant="findJobs"
  onSearch={handleSearch}
  userName="John Doe"
  userEmail="john@example.com"
  notificationCount={5}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}