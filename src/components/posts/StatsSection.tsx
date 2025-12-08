"use client";

import React from 'react';
import StatCardFindJobs from '@/components/cards/StatCardFindJobs';
import StatCardAppliedJobs from '@/components/cards/StatCardAppliedJobs';
import StatCardManageJobs from '@/components/cards/StatCardManageJobs';
import type { Stats } from '@/hooks/useStats';
import { useTheme } from '@/hooks/useTheme';

type Variant = 'findJobs' | 'appliedJobs' | 'manageJobs';

interface Props {
  stats: Stats;
  variant: Variant;
  loading?: boolean;
  error?: string | null;
  onStatClick?: (type: 'total' | 'pending' | 'approved' | 'rejected') => void;
}

const StatsSection: React.FC<Props> = ({ stats, variant, loading, error, onStatClick }) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div 
        className="max-w-4xl mx-auto text-center py-6"
        style={{ color: theme.colors.textMuted }}
      >
        Loading statistics...
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="max-w-4xl mx-auto text-center py-6"
        style={{ color: theme.colors.error }}
      >
        {error}
      </div>
    );
  }

  if (variant === 'findJobs') {
    return (
      <div className="w-full h-full flex items-center justify-center py-4 laptop:py-6">
        {/* 2x2 grid on mobile, horizontal row on tablet, vertical column on laptop */}
        <div className="grid grid-cols-2 gap-2 mobile-M:gap-2.5 tablet:grid-cols-4 tablet:gap-3 laptop:grid-cols-1 laptop:gap-4 laptop-L:gap-5 w-full laptop:h-full auto-rows-fr">
          <StatCardFindJobs title="Total Jobs" value={stats.totalJobs ?? 0} variant="blue" className="min-w-0" />
          <StatCardFindJobs title="Ratings" value={stats.ratings ?? 0} variant="yellow" className="min-w-0" />
          <StatCardFindJobs title="Completed" value={stats.completed ?? 0} variant="green" className="min-w-0" />
          <StatCardFindJobs title="Posted" value={stats.posts ?? 0} variant="red" className="min-w-0" />
        </div>
      </div>
    );
  }

  if (variant === 'appliedJobs') {
    return (
      <div className="w-full h-full flex items-center justify-center py-4 laptop:py-6">
        <div className="grid grid-cols-2 gap-2 mobile-M:gap-2.5 tablet:grid-cols-4 tablet:gap-3 laptop:grid-cols-1 laptop:gap-4 laptop-L:gap-5 w-full laptop:h-full auto-rows-fr">
          <StatCardAppliedJobs type="total" value={stats.totalApplications ?? 0} onClick={onStatClick} className="min-w-0" />
          <StatCardAppliedJobs type="pending" value={stats.pending ?? 0} onClick={onStatClick} className="min-w-0" />
          <StatCardAppliedJobs type="approved" value={stats.approved ?? 0} onClick={onStatClick} className="min-w-0" />
          <StatCardAppliedJobs type="rejected" value={stats.rejected ?? 0} onClick={onStatClick} className="min-w-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center py-4 laptop:py-6">
      <div className="grid grid-cols-2 gap-2 mobile-M:gap-2.5 tablet:grid-cols-4 tablet:gap-3 laptop:grid-cols-1 laptop:gap-4 laptop-L:gap-5 w-full laptop:h-full auto-rows-fr">
        <StatCardManageJobs type="total" value={stats.totalPosts ?? 0} className="min-w-0" />
        <StatCardManageJobs type="inactive" value={stats.inactivePosts ?? 0} className="min-w-0" />
        <StatCardManageJobs type="active" value={stats.activePosts ?? 0} className="min-w-0" />
        <StatCardManageJobs type="resolved" value={stats.resolvedPosts ?? 0} className="min-w-0" />
      </div>
    </div>
  );
};

export default StatsSection;