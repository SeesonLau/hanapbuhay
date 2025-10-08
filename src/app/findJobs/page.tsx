"use client";

import { useState } from "react";
import Banner from "@/components/ui/Banner";
import ViewProfileModal from "@/components/modals/ViewProfileModal";

export default function FindJobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query: string, location?: string) => {
    if (location) {
    }
    // Add your search logic here
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section with Header and Search */}
      <Banner variant="findJobs" onSearch={handleSearch} />

      <main className="pl-4 pr-4 pb-8 pt-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-h2 font-alexandria font-bold text-black mb-6">Find Jobs</h1>
          <p className="text-lead font-inter font-normal text-gray-neutral600 mb-6">
            This is the Find Jobs page. Content coming soon...
          </p>

          {/* PLACEHOLDER*/ }
          {/* View Profile Button */ }
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-success-success500 text-white rounded-lg shadow hover:bg-success-success600"
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
