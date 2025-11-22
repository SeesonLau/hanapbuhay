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
      className={`flex items-center justify-between px-4 w-[340px] h-[130px] rounded-[10px] bg-white shadow-md transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-[2px] cursor-pointer ${className}`}
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
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center justify-center rounded-md ${iconBgClass} w-[100px] h-[100px]`}
        >
          <img src={iconSrc} alt={`${resolvedTitle} icon`} className="w-20 h-20" />
        </div>
        <span className={`font-inter text-sm text-gray-neutral600`}>
          {resolvedTitle}
        </span>
      </div>
      <span className={`font-alexandria text-sm text-gray-neutral600`}>
        {value !== undefined && value !== null ? value : "—"}
      </span>
    </div>
  );
};

export default StatCardAppliedJobs;