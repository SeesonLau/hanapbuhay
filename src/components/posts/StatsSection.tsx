"use client";

import React from 'react';
import StatCardFindJobs from '@/components/cards/StatCardFindJobs';
import StatCardAppliedJobs from '@/components/cards/StatCardAppliedJobs';
import type { Stats } from '@/hooks/useStats';

type Variant = 'findJobs' | 'appliedJobs';

interface Props {
  stats: Stats;
  variant: Variant;
  loading?: boolean;
  error?: string | null;
  onStatClick?: (type: 'total' | 'pending' | 'approved' | 'rejected') => void;
}

const StatsSection: React.FC<Props> = ({ stats, variant, loading, error, onStatClick }) => {
  if (loading) return <div className="max-w-4xl mx-auto text-center py-6">Loading statistics...</div>;
  if (error) return <div className="max-w-4xl mx-auto text-center py-6 text-red-600">{error}</div>;

  if (variant === 'findJobs') {
    return (
      <div className="w-full mt-4 mb-6">
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          <StatCardFindJobs title="Total Jobs" value={stats.totalJobs ?? 0} variant="blue" />
          <StatCardFindJobs title="Completed" value={stats.completed ?? 0} variant="green" />
          <StatCardFindJobs title="Ratings" value={stats.ratings ?? 0} variant="yellow" />
          <StatCardFindJobs title="Posted" value={stats.posts ?? 0} variant="red" />
        </div>
      </div>
    );
  }

  // appliedJobs
  return (
    <div className="w-full mb-6">
      <div className="flex flex-col gap-4 md:sticky md:top-6">
        <StatCardAppliedJobs type="total" value={stats.totalApplications ?? 0} onClick={onStatClick} />
        <StatCardAppliedJobs type="pending" value={stats.pending ?? 0} onClick={onStatClick} />
        <StatCardAppliedJobs type="approved" value={stats.approved ?? 0} onClick={onStatClick} />
        <StatCardAppliedJobs type="rejected" value={stats.rejected ?? 0} onClick={onStatClick} />
      </div>
    </div>
  );
};

export default StatsSection;