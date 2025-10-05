'use client';

import React from 'react';
import ApplicantCard from './cards/ApplicantCard';

export default function NewApplicantsSection() {
  const applicants = [
    { name: 'Maria Santos', position: 'Graphic Designer' },
    { name: 'Juan Dela Cruz', position: 'Web Developer' },
    { name: 'Ana Lopez', position: 'Project Manager' },
    { name: 'Carlos Reyes', position: 'UI/UX Designer' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
      {applicants.map((applicant, index) => (
        <ApplicantCard
          key={index}
          name={applicant.name}
          position={applicant.position}
          rating={4.5}
          dateApplied="Oct 5, 2025"
        />
      ))}
    </div>
  );
}
