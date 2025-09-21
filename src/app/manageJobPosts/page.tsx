// src/app/manage-job-posts/page.tsx
import HeaderDashboard from '@/components/ui/HeaderDashboard';

export default function ManageJobPostsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#141515' }}>
      {/* Header Section */}
      <header className="w-full flex justify-center pt-8 px-4">
        <HeaderDashboard />
      </header>

      <main className="p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Job Posts</h1>
          <p className="text-lg text-gray-600">This is the Manage Job Posts page. Content coming soon...</p>
        </div>
      </main>
    </div>
  );
}
