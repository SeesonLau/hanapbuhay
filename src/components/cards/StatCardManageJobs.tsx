"use client";

import React from "react";

type ManageType = "total" | "inactive" | "active" | "resolved";
type ColorVariant = "blue" | "red" | "green" | "orange";

interface StatCardManageJobsProps {
  type: ManageType;
  title?: string;
  value?: string | number;
  className?: string;
}

const titleForType: Record<ManageType, string> = {
  total: "Total Job Posts",
  inactive: "Inactive Job Posts",
  active: "Active Job Posts",
  resolved: "Resolved Job Posts",
};

const iconForType: Record<ManageType, string> = {
  total: "/icons/stats-posted.svg",
  inactive: "/icons/inactive.svg",
  active: "/icons/active.svg",
  resolved: "/icons/stats-approved.svg",
};

const variantForType: Record<ManageType, ColorVariant> = {
  total: "blue",
  inactive: "red",
  active: "green",
  resolved: "orange",
};

const variantBgClass: Record<ColorVariant, string> = {
  blue: "bg-blue-default",
  red: "bg-error-error500",
  green: "bg-success-success400",
  orange: "bg-orange-400",
};

export default function StatCardManageJobs({
  type,
  title,
  value,
  className = "",
}: StatCardManageJobsProps) {
  const resolvedTitle = title || titleForType[type];
  const iconSrc = iconForType[type];
  const iconBgClass = variantBgClass[variantForType[type]];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-0.5 mobile-M:gap-1 tablet:gap-1.5 laptop:gap-0.5 laptop-L:gap-1 p-2 mobile-M:p-3 tablet:p-4 laptop:p-2 laptop-L:p-2.5 w-full h-full rounded-lg tablet:rounded-xl bg-white shadow-md ${className}`}
      style={{
        boxShadow: `0 4px 16px rgba(0, 0, 0, 0.12)`,
        minHeight: 'clamp(80px, 12vh, 120px)',
      }}
    >
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

      <span
        className="font-inter text-mini mobile-M:text-tiny tablet:text-small laptop:text-mini laptop-L:text-tiny font-medium text-center leading-tight text-gray-neutral600 line-clamp-1"
      >
        {resolvedTitle}
      </span>

      <span
        className="font-inter text-tiny mobile-M:text-small tablet:text-body laptop:text-small laptop-L:text-body font-bold text-center text-gray-neutral900 leading-none"
      >
        {value !== undefined && value !== null ? value : "—"}
      </span>
    </div>
  );
}
