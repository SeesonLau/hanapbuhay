"use client";

import React from 'react';
import HeaderDashboard from '@/components/ui/HeaderDashboard';
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticLocationTag, StaticSalaryTag, GenderTag, ExperienceLevelTag, JobTypeTag } from '@/components/ui/TagItem';
import { JobType, SubTypes } from '@/lib/constants/job-types';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';
import { fontClasses } from '@/styles/fonts';
import { getBlackColor } from '@/styles/colors';

export default function TagsDemoPage() {
  const allGenders = Object.values(Gender);
  const allExperienceLevels = Object.values(ExperienceLevel);
  const allJobTypes = Object.values(JobType);

  const sampleLocations = [
    'Mabolo, Cebu City',
    'Casuntingan, Mandaue City',
    'Talisay City, Cebu'
  ];

  const sampleSalaryRates = [
    '5,000.00 /month',
    '500.00 /day',
    '150.00 /hour'
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#141515' }}>
      <header className="w-full flex justify-center pt-8 px-4">
        <HeaderDashboard />
      </header>

      <main className="p-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className={`${fontClasses.heading} text-2xl font-bold mb-2`} style={{ color: getBlackColor() }}>
              Tags Demo
            </h1>
            <p className={`${fontClasses.body} text-sm`} style={{ color: getBlackColor(0.8) }}>
              Preview of static and interactive tags: Gender, Experience Level, Job Type subtypes, Location, and Salary Rate.
            </p>
          </div>

          {/* Gender Tags */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className={`${fontClasses.heading} text-xl font-semibold mb-3`} style={{ color: getBlackColor() }}>Gender</h2>
            <div className="flex flex-wrap gap-2">
              {allGenders.map((g) => (
                <StaticGenderTag key={g} label={g} />
              ))}
            </div>
            <div className="mt-4">
              <h3 className={`${fontClasses.heading} text-sm font-medium mb-2`} style={{ color: getBlackColor() }}>Interactive</h3>
              <div className="flex flex-wrap gap-2">
                {allGenders.map((g) => (
                  <GenderTag key={`interactive-${g}`} label={g} />
                ))}
              </div>
            </div>
          </section>

          {/* Experience Level Tags */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className={`${fontClasses.heading} text-xl font-semibold mb-3`} style={{ color: getBlackColor() }}>Experience Level</h2>
            <div className="flex flex-wrap gap-2">
              {allExperienceLevels.map((e) => (
                <StaticExperienceLevelTag key={e} label={e} />
              ))}
            </div>
            <div className="mt-4">
              <h3 className={`${fontClasses.heading} text-sm font-medium mb-2`} style={{ color: getBlackColor() }}>Interactive</h3>
              <div className="flex flex-wrap gap-2">
                {allExperienceLevels.map((e) => (
                  <ExperienceLevelTag key={`interactive-${e}`} label={e} />
                ))}
              </div>
            </div>
          </section>

          {/* Job Type Subtypes Tags */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className={`${fontClasses.heading} text-xl font-semibold mb-3`} style={{ color: getBlackColor() }}>Job Type Subtypes</h2>
            <div className="space-y-6">
              {allJobTypes.map((type) => (
                <div key={type}>
                  <h3 className={`${fontClasses.heading} text-lg font-medium mb-2`} style={{ color: getBlackColor() }}>{type}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(SubTypes[type] || []).map((sub) => (
                      <StaticJobTypeTag key={`${type}-${sub}`} label={sub} />
                    ))}
                  </div>
                  <div className="mt-3">
                    <h4 className={`${fontClasses.heading} text-sm font-medium mb-2`} style={{ color: getBlackColor() }}>Interactive</h4>
                    <div className="flex flex-wrap gap-2">
                      {(SubTypes[type] || []).map((sub) => (
                        <JobTypeTag key={`interactive-${type}-${sub}`} label={sub} categoryIcon={`/icons/${type}.svg`} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Location Tags */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className={`${fontClasses.heading} text-xl font-semibold mb-3`} style={{ color: getBlackColor() }}>Location</h2>
            <div className="flex flex-wrap gap-2">
              {sampleLocations.map((loc) => (
                <StaticLocationTag key={loc} label={loc} />
              ))}
            </div>
          </section>

          {/* Salary Rate Tags */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className={`${fontClasses.heading} text-xl font-semibold mb-3`} style={{ color: getBlackColor() }}>Salary Rate</h2>
            <div className="flex flex-wrap gap-2">
              {sampleSalaryRates.map((rate) => (
                <StaticSalaryTag key={rate} label={rate} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}