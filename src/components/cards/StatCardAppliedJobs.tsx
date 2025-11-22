"use client";

import React from "react";
// Refactored to Tailwind theme tokens

type AppliedType = "total" | "pending" | "approved" | "rejected";

type ColorVariant = "blue" | "green" | "yellow" | "red";

interface StatCardAppliedJobsProps {
  type: AppliedType;
  title?: string; // optional; defaults based on type
  value?: string | number; // optional, provided by DB later
  className?: string;
  onClick?: (type: AppliedType) => void; // new: click handler
}

const titleForType: Record<AppliedType, string> = {
  total: "Total Applications",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const iconForType: Record<AppliedType, string> = {
  total: "/icons/stats-totalapplications.svg",
  pending: "/icons/stats-pending.svg",
  approved: "/icons/stats-approved.svg",
  rejected: "/icons/stats-rejected.svg",
};

const variantForType: Record<AppliedType, ColorVariant> = {
  total: "blue",
  pending: "yellow",
  approved: "green",
  rejected: "red",
};

const variantBgClass: Record<ColorVariant, string> = {
  blue: "bg-blue-default",
  green: "bg-success-success400",
  yellow: "bg-warning-warning300",
  red: "bg-error-error500",
};

export const StatCardAppliedJobs: React.FC<StatCardAppliedJobsProps> = ({
  type,
  title,
  value,
  className = "",
  onClick,
}) => {
  const resolvedTitle = title || titleForType[type];
  const iconSrc = iconForType[type];
  const iconBgClass = variantBgClass[variantForType[type]];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-0.5 mobile-M:gap-1 tablet:gap-1.5 laptop:gap-0.5 laptop-L:gap-1 p-2 mobile-M:p-3 tablet:p-4 laptop:p-2 laptop-L:p-2.5 w-full h-full rounded-lg tablet:rounded-xl bg-white shadow-md transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-[2px] cursor-pointer ${className}`}
      style={{
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
    >
      {/* Icon */}
      <div
        className={`flex items-center justify-center rounded-md tablet:rounded-lg flex-shrink-0 ${iconBgClass}`}
        style={{ 
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
        className="font-inter text-mini mobile-M:text-tiny tablet:text-small laptop:text-mini laptop-L:text-tiny font-medium text-center leading-tight text-gray-neutral600 line-clamp-1"
      >
        {resolvedTitle}
      </span>
      
      {/* Value */}
      <span 
        className="font-inter text-tiny mobile-M:text-small tablet:text-body laptop:text-small laptop-L:text-body font-bold text-center text-gray-neutral900 leading-none"
      >
        {value !== undefined && value !== null ? value : "—"}
      </span>
    </div>
  );
};

export default StatCardAppliedJobs;