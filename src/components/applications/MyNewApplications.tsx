'use client';

import React from 'react';
import AppliedJobCardList from '@/components/cards/AppliedJobCardList';
import useApplications from '@/hooks/useApplications';

interface Props {
  userId?: string | null;
}

export default function MyNewApplications({ userId }: Props) {
  const { applications, loading, error } = useApplications(userId);

  if (loading) return <div className="py-6 text-center">Loading applications...</div>;
  if (error) return <div className="py-6 text-center text-red-600">{error}</div>;

  if (!applications || applications.length === 0) {
    return <div className="py-6 text-center text-gray-neutral500">No applications found.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {applications.map((app) => (
          <AppliedJobCardList key={app.id} job={app} />
        ))}
      </div>
    </div>
  );
}
