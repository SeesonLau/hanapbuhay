"use client";

import Banner from '@/components/ui/Banner';

export default function BannerTestPage() {
  const handleSearch = (query: string, location?: string) => {
    console.log('Search query:', query);
    if (location) {
      console.log('Location:', location);
    }
  };

  const mockUser = {
    userName: "Test User",
    userEmail: "test@example.com",
    userRole: "Job Seeker",
    userId: "123",
    userCreatedAt: "2024-01-01",
    notificationCount: 5
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#141515' }}>
      {/* All Banner Variants Test */}
      
      {/* Find Jobs Variant */}
      <div className="mb-4">
        <h2 className="text-white text-xl p-4 bg-gray-800">1. Find Jobs Variant</h2>
        <Banner
          variant="findJobs"
          onSearch={handleSearch}
          {...mockUser}
        />
      </div>

      {/* Manage Job Posts Variant */}
      <div className="mb-4">
        <h2 className="text-white text-xl p-4 bg-gray-800">2. Manage Job Posts Variant</h2>
        <Banner
          variant="manageJobPosts"
          onSearch={handleSearch}
          {...mockUser}
        />
      </div>

      {/* Applied Jobs Variant */}
      <div className="mb-4">
        <h2 className="text-white text-xl p-4 bg-gray-800">3. Applied Jobs Variant</h2>
        <Banner
          variant="appliedJobs"
          onSearch={handleSearch}
          {...mockUser}
        />
      </div>

      {/* Chat Variant */}
      <div className="mb-4">
        <h2 className="text-white text-xl p-4 bg-gray-800">4. Chat Variant</h2>
        <Banner
          variant="chat"
          {...mockUser}
        />
      </div>

      {/* Profile Variant */}
      <div className="mb-4">
        <h2 className="text-white text-xl p-4 bg-gray-800">5. Profile Variant</h2>
        <Banner
          variant="profile"
          {...mockUser}
        />
      </div>

      {/* Settings Variant */}
      <div className="mb-4">
        <h2 className="text-white text-xl p-4 bg-gray-800">6. Settings Variant</h2>
        <Banner
          variant="settings"
          {...mockUser}
        />
      </div>

      {/* Summary */}
      <div className="bg-white p-8 m-4 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Banner Component Test Summary</h1>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">✅ Improvements Made:</h3>
          <ul className="space-y-2 text-gray-700 list-disc list-inside">
            <li><strong>Consistent Height:</strong> All variants now have the same minimum height</li>
            <li><strong>Responsive Design:</strong> Proper scaling for mobile, tablet, and desktop</li>
            <li><strong>Typography Hierarchy:</strong> Better font scaling and readability</li>
            <li><strong>Centered Layout:</strong> Content is properly centered as per design</li>
            <li><strong>Consistent Spacing:</strong> Uniform padding and margins across variants</li>
            <li><strong>Flexible Layout:</strong> Handles variants with and without search bars</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-6">📱 Responsive Features:</h3>
          <ul className="space-y-2 text-gray-700 list-disc list-inside">
            <li>Typography scales from mobile (text-xl) to desktop (text-5xl)</li>
            <li>Responsive padding and margins for all screen sizes</li>
            <li>Flexible container width with proper max-width constraints</li>
            <li>Post button repositioning on different screen sizes</li>
            <li>Optimal line breaks for multi-line titles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}