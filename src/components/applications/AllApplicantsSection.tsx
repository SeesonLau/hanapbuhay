'use client';

import React from 'react';
import ApplicantStatusCard from './cards/ApplicantStatusCard';

export default function AllApplicantsSection() {
  const applicants = [
    { name: 'Maria Santos', status: 'Accepted' },
    { name: 'Juan Dela Cruz', status: 'Denied' },
    { name: 'Ana Lopez', status: 'Denied' },
    { name: 'Carlos Reyes', status: 'Accepted' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
      {applicants.map((applicant, index) => (
        <ApplicantStatusCard
          key={index}
          name={applicant.name}
          rating={4.5}
          dateApplied="Oct 5, 2025"
          status={applicant.status as 'Accepted' | 'Denied'}
        />
      ))}
    </div>
  );
}
