"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

type AppliedType = "total" | "pending" | "approved" | "rejected";

interface StatCardAppliedJobsProps {
  type: AppliedType;
  title?: string;
  value?: string | number;
  className?: string;
  onClick?: (type: AppliedType) => void;
}

const iconForType: Record<AppliedType, string> = {
  total: "/icons/stats-totalapplications.svg",
  pending: "/icons/stats-pending.svg",
  approved: "/icons/stats-approved.svg",
  rejected: "/icons/stats-rejected.svg",
};

export const StatCardAppliedJobs: React.FC<StatCardAppliedJobsProps> = ({
  type,
  title,
  value,
  className = "",
  onClick,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const titleForType: Record<AppliedType, string> = {
    total: t.jobs.appliedJobs.stats.totalApplications,
    pending: t.jobs.appliedJobs.stats.pending,
    approved: t.jobs.appliedJobs.stats.approved,
    rejected: t.jobs.appliedJobs.stats.rejected,
  };

  const resolvedTitle = title || titleForType[type];
  const iconSrc = iconForType[type];

  // Map type to theme variant
  const getIconBgColor = () => {
    switch (type) {
      case "total":
        return theme.statCard.variant1;
      case "pending":
        return theme.statCard.variant4;
      case "approved":
        return theme.statCard.variant3;
      case "rejected":
        return theme.statCard.variant2;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-0.5 mobile-M:gap-1 tablet:gap-1.5 laptop:gap-0.5 laptop-L:gap-1 p-2 mobile-M:p-3 tablet:p-4 laptop:p-2 laptop-L:p-2.5 w-full h-full rounded-lg tablet:rounded-xl shadow-md transition-all duration-200 ease-out cursor-pointer ${className}`}
      style={{
        backgroundColor: theme.colors.cardBg,
        boxShadow: `0 4px 16px rgba(0, 0, 0, 0.12)`,
        minHeight: 'clamp(80px, 12vh, 120px)',
      }}
      role="button"
      tabIndex={0}
      aria-label={`Filter applied jobs: ${resolvedTitle}`}
      onClick={() => onClick?.(type)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(type);
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.16)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center rounded-md tablet:rounded-lg flex-shrink-0"
        style={{ 
          backgroundColor: getIconBgColor(),
          width: 'clamp(28px, 6vw, 36px)', 
          height: 'clamp(28px, 6vw, 36px)', 
        }}
      >
        <img 
          src={iconSrc} 
          alt={`${resolvedTitle} icon`} 
          className="object-contain"
          style={{ 
            width: 'clamp(18px, 4.5vw, 22px)', 
            height: 'clamp(18px, 4.5vw, 22px)' 
          }} 
        />
      </div>
      
      {/* Title */}
      <span 
        className="font-inter text-mini mobile-M:text-tiny tablet:text-small laptop:text-mini laptop-L:text-tiny font-medium text-center leading-tight line-clamp-1"
        style={{ color: theme.statCard.text }}
      >
        {resolvedTitle}
      </span>
      
      {/* Value */}
      <span 
        className="font-inter text-tiny mobile-M:text-small tablet:text-body laptop:text-small laptop-L:text-body font-bold text-center leading-none"
        style={{ color: theme.statCard.textValue }}
      >
        {value !== undefined && value !== null ? value : "—"}
      </span>
    </div>
  );
};

export default StatCardAppliedJobs;