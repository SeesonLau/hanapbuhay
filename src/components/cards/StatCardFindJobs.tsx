"use client";

import React from "react";
// Refactored to Tailwind theme tokens

type ColorVariant = "blue" | "green" | "yellow" | "red";

interface StatCardFindJobsProps {
  title: string;
  value?: string | number; // optional, will be provided by DB later
  variant?: ColorVariant; // color of the icon background box
  className?: string;
}

const iconPathForTitle = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes("total job")) return "/icons/stats-totaljobs.svg";
  if (t.includes("completed")) return "/icons/stats-completed.svg";
  if (t.includes("rating")) return "/icons/stats-ratings.svg";
  return "/icons/stats-posted.svg";
};

const variantBgClass: Record<ColorVariant, string> = {
  blue: "bg-blue-default",
  green: "bg-success-success400", // use success tint for green
  yellow: "bg-warning-warning300",
  red: "bg-error-error500",
};

export const StatCardFindJobs: React.FC<StatCardFindJobsProps> = ({ title, value, variant = "blue", className = "" }) => {
  const iconSrc = iconPathForTitle(title);
  const iconBgClass = variantBgClass[variant];

  return (
    <div
      className={`flex items-center justify-between px-4 w-full h-[87px] rounded-[10px] bg-white shadow-md ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center rounded-md ${iconBgClass} w-12 h-12`}
        >
          <img src={iconSrc} alt={`${title} icon`} className="w-11 h-11" />
        </div>
        <span className={`font-inter text-sm text-gray-neutral600`}>
          {title}
        </span>
      </div>
      <span className={`font-alexandria text-sm text-gray-neutral600`}>
        {value !== undefined && value !== null ? value : "—"}
      </span>
    </div>
  );
};

export default StatCardFindJobs;