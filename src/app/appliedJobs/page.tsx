// src/app/applied-jobs/page.tsx
import HeaderDashboard from '@/components/ui/HeaderDashboard';

export default function AppliedJobsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#141515' }}>
      {/* Header Section */}
      <header className="w-full flex justify-center pt-8 px-4">
        <HeaderDashboard />
      </header>

      <main className="p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Applied Jobs</h1>
          <p className="text-lg text-gray-600">This is the Applied Jobs page. Content coming soon...</p>
        </div>
      </main>
    </div>
  );
}
