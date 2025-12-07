'use client';

import React from 'react';
import AppliedJobCardList from '@/components/cards/AppliedJobCardList';
import useApplications from '@/hooks/useApplications';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  userId?: string | null;
}

export default function MyNewApplications({ userId }: Props) {
  const { theme } = useTheme();
  const { applications, loading, error } = useApplications(userId);

  if (loading) {
    return (
      <div 
        className="py-6 text-center"
        style={{ color: theme.colors.textSecondary }}
      >
        Loading applications...
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="py-6 text-center"
        style={{ color: theme.colors.error }}
      >
        {error}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div 
        className="py-6 text-center"
        style={{ color: theme.colors.textMuted }}
      >
        No applications found.
      </div>
    );
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