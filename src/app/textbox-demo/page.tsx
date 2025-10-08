'use client';

import React, { useState } from 'react';
import JobTypeAccordion, { JobTypeSelection } from '@/components/ui/JobTypeAccordion';
import { getTypographyClass, getGrayColor } from '@/styles';

export default function TextboxDemoPage() {
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobTypeSelection>({});

  const handleJobTypeChange = (selection: JobTypeSelection) => {
    setSelectedJobTypes(selection);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={getTypographyClass('h1')} style={{ color: getGrayColor('neutral700') }}>
            JobTypeAccordion Demo
          </h1>
          <p className={getTypographyClass('lead')} style={{ color: getGrayColor('neutral600') }}>
            Testing the JobTypeAccordion component with various job types and subtypes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* JobTypeAccordion Component */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className={getTypographyClass('h3')} style={{ color: getGrayColor('neutral700') }}>
              Job Type Selection
            </h2>
            <p className={getTypographyClass('body')} style={{ color: getGrayColor('neutral600') }}>
              Select job types and their subtypes:
            </p>
            
            <div className="mt-4">
              <JobTypeAccordion
                selectedJobTypes={selectedJobTypes}
                onChange={handleJobTypeChange}
                className="border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Selected Values Display */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className={getTypographyClass('h3')} style={{ color: getGrayColor('neutral700') }}>
              Selected Job Types
            </h2>
            <p className={getTypographyClass('body')} style={{ color: getGrayColor('neutral600') }}>
              Current selection state:
            </p>
            
            <div className="mt-4">
              {Object.keys(selectedJobTypes).length === 0 ? (
                <p className={getTypographyClass('small')} style={{ color: getGrayColor('neutral400') }}>
                  No job types selected
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(selectedJobTypes).map(([jobType, subTypes]) => (
                    <div key={jobType} className="border-l-4 border-blue-400 pl-4">
                      <h4 className={getTypographyClass('body')} style={{ color: getGrayColor('neutral700') }}>
                        {jobType}
                      </h4>
                      {subTypes.length > 0 && (
                        <ul className="mt-1 space-y-1">
                          {subTypes.map((subType) => (
                            <li 
                              key={subType} 
                              className={getTypographyClass('small')}
                              style={{ color: getGrayColor('neutral600') }}
                            >
                              • {subType}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* JSON Display */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className={getTypographyClass('body')} style={{ color: getGrayColor('neutral700') }}>
                Raw JSON Output:
              </h3>
              <pre 
                className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40"
                style={{ color: getGrayColor('neutral600') }}
              >
                {JSON.stringify(selectedJobTypes, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Testing Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className={getTypographyClass('h3')} style={{ color: getGrayColor('neutral700') }}>
            Testing Actions
          </h2>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setSelectedJobTypes({})}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setSelectedJobTypes({
                'Technology': ['Frontend Development', 'Backend Development'],
                'Creative': ['Graphic Design']
              })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Load Sample Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}