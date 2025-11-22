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
      className={`flex flex-col items-center justify-center gap-0.5 mobile-M:gap-1 tablet:gap-1.5 laptop:gap-1 laptop-L:gap-1.5 p-2 mobile-M:p-3 tablet:p-4 laptop:p-3 laptop-L:p-3.5 w-full laptop:h-full rounded-lg tablet:rounded-xl bg-white shadow-md ${className}`}
      style={{
        boxShadow: `0 4px 16px rgba(0, 0, 0, 0.12)`,
      }}
    >
      {/* Icon */}
      <div
        className={`flex items-center justify-center rounded-md tablet:rounded-lg flex-shrink-0 ${iconBgClass}`}
        style={{ 
          width: 'clamp(32px, 8vw, 40px)', 
          height: 'clamp(32px, 8vw, 40px)', 
        }}
      >
        <img 
          src={iconSrc} 
          alt={`${title} icon`} 
          className="object-contain"
          style={{ 
            width: 'clamp(20px, 6vw, 24px)', 
            height: 'clamp(20px, 6vw, 24px)' 
          }} 
        />
      </div>
      
      {/* Title */}
      <span 
        className="font-inter text-mini mobile-M:text-tiny tablet:text-small laptop:text-mini laptop-L:text-tiny font-medium text-center leading-tight text-gray-neutral600 line-clamp-1"
      >
        {title}
      </span>
      
      {/* Value */}
      <span 
        className="font-inter text-tiny mobile-M:text-small tablet:text-body laptop:text-small laptop-L:text-body font-bold text-center text-gray-neutral600 leading-none"
      >
        {value !== undefined && value !== null ? value : "—"}
      </span>
    </div>
  );
};

export default StatCardFindJobs;