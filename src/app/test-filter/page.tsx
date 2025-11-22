"use client";

import { useState } from "react";
import FilterSection, { FilterOptions } from "@/components/ui/FilterSection";

export default function TestFilterPage() {
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    jobTypes: {},
    salaryRange: {
      lessThan5000: false,
      range10to20: false,
      moreThan20000: false,
      custom: false,
    },
    experienceLevel: {
      entryLevel: false,
      intermediate: false,
      professional: false,
    },
    preferredGender: {
      any: false,
      female: false,
      male: false,
      others: false,
    },
  });

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    console.log("Applied Filters:", filters);
    alert("Filters applied! Check console for details.");
  };

  const handleClearFilters = () => {
    setActiveFilters({
      jobTypes: {},
      salaryRange: {
        lessThan5000: false,
        range10to20: false,
        moreThan20000: false,
        custom: false,
      },
      experienceLevel: {
        entryLevel: false,
        intermediate: false,
        professional: false,
      },
      preferredGender: {
        any: false,
        female: false,
        male: false,
        others: false,
      },
    });
    console.log("Filters cleared");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-h1 font-bold font-alexandria mb-6 text-gray-neutral900">
          FilterSection Component Test
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filter Section Container */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
              <FilterSection
                initialFilters={activeFilters}
                onApply={handleApplyFilters}
                onClearAll={handleClearFilters}
                className="h-full"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-h3 font-bold font-alexandria mb-4 text-gray-neutral900">
                Active Filters
              </h2>
              
              <div className="space-y-4">
                {/* Job Types */}
                <div>
                  <h3 className="text-body font-semibold text-gray-neutral700 mb-2">Job Types:</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    {Object.keys(activeFilters.jobTypes).length > 0 ? (
                      <ul className="list-disc list-inside">
                        {Object.entries(activeFilters.jobTypes).map(([key, value]) => 
                          value && <li key={key} className="text-small text-gray-neutral600">{key}</li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-small text-gray-neutral500 italic">None selected</p>
                    )}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <h3 className="text-body font-semibold text-gray-neutral700 mb-2">Salary Range:</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <ul className="list-disc list-inside">
                      {activeFilters.salaryRange.lessThan5000 && (
                        <li className="text-small text-gray-neutral600">Less than Php 5000</li>
                      )}
                      {activeFilters.salaryRange.range10to20 && (
                        <li className="text-small text-gray-neutral600">Php 10,000 - Php 20,000</li>
                      )}
                      {activeFilters.salaryRange.moreThan20000 && (
                        <li className="text-small text-gray-neutral600">More than Php 20,000</li>
                      )}
                      {activeFilters.salaryRange.custom && (
                        <li className="text-small text-gray-neutral600">Custom</li>
                      )}
                      {!Object.values(activeFilters.salaryRange).some(Boolean) && (
                        <p className="text-small text-gray-neutral500 italic">None selected</p>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <h3 className="text-body font-semibold text-gray-neutral700 mb-2">Experience Level:</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <ul className="list-disc list-inside">
                      {activeFilters.experienceLevel.entryLevel && (
                        <li className="text-small text-gray-neutral600">Entry level</li>
                      )}
                      {activeFilters.experienceLevel.intermediate && (
                        <li className="text-small text-gray-neutral600">Intermediate</li>
                      )}
                      {activeFilters.experienceLevel.professional && (
                        <li className="text-small text-gray-neutral600">Professional</li>
                      )}
                      {!Object.values(activeFilters.experienceLevel).some(Boolean) && (
                        <p className="text-small text-gray-neutral500 italic">None selected</p>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Preferred Gender */}
                <div>
                  <h3 className="text-body font-semibold text-gray-neutral700 mb-2">Preferred Gender:</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <ul className="list-disc list-inside">
                      {activeFilters.preferredGender.any && (
                        <li className="text-small text-gray-neutral600">Any</li>
                      )}
                      {activeFilters.preferredGender.female && (
                        <li className="text-small text-gray-neutral600">Female</li>
                      )}
                      {activeFilters.preferredGender.male && (
                        <li className="text-small text-gray-neutral600">Male</li>
                      )}
                      {activeFilters.preferredGender.others && (
                        <li className="text-small text-gray-neutral600">Others</li>
                      )}
                      {!Object.values(activeFilters.preferredGender).some(Boolean) && (
                        <p className="text-small text-gray-neutral500 italic">None selected</p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* JSON Display */}
              <div className="mt-6">
                <h3 className="text-body font-semibold text-gray-neutral700 mb-2">Raw Filter Data:</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded text-tiny overflow-auto max-h-60">
                  {JSON.stringify(activeFilters, null, 2)}
                </pre>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 border-l-4 border-primary-primary500 p-4 rounded">
              <h3 className="text-body font-semibold text-primary-primary700 mb-2">Test Instructions:</h3>
              <ul className="list-disc list-inside space-y-1 text-small text-gray-neutral700">
                <li>Expand filter sections by clicking on the category headers</li>
                <li>Select multiple filters across different categories</li>
                <li>Test scrolling when all sections are expanded</li>
                <li>Verify the Apply button stays fixed at the bottom</li>
                <li>Click Apply to see selected filters update on the right</li>
                <li>Use Clear All to reset all selections</li>
                <li>Check console for detailed filter logs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
