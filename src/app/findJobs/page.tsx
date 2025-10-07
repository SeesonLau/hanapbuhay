"use client";

import { useState } from "react";
import Banner from "@/components/ui/Banner";
import ViewProfileModal from "@/components/modals/ViewProfileModal";

export default function FindJobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query: string, location?: string) => {
    console.log("Search query:", query);
    if (location) {
      console.log("Location:", location);
    }
    // Add your search logic here
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section with Header and Search */}
      <Banner variant="findJobs" onSearch={handleSearch} />

      <main className="pl-4 pr-4 pb-8 pt-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Jobs</h1>
          <p className="text-lg text-gray-600 mb-6">
            This is the Find Jobs page. Content coming soon...
          </p>

          {/* PLACEHOLDER*/ }
          {/* View Profile Button */ }
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            View Profile
          </button>
        </div>
      </main>

      {/* Modal */}
      <ViewProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          {/* PLACEHOLDER*/ }

    </div>
  );
}
