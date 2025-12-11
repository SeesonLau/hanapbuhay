"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";

type ColorVariant = "variant1" | "variant2" | "variant3" | "variant4";

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

export const StatCardFindJobs: React.FC<StatCardFindJobsProps> = ({ title, value, variant = "variant1", className = "" }) => {
  const { theme } = useTheme();
  const iconSrc = iconPathForTitle(title);
  
  const getIconBgColor = () => {
    switch (variant) {
      case "variant1":
        return theme.statCard.variant1;
      case "variant2":
        return theme.statCard.variant2;
      case "variant3":
        return theme.statCard.variant3;
      case "variant4":
        return theme.statCard.variant4;
      default:
        return theme.statCard.variant1;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-0.5 mobile-M:gap-1 tablet:gap-1.5 laptop:gap-1 laptop-L:gap-1.5 p-2 mobile-M:p-3 tablet:p-4 laptop:p-3 laptop-L:p-3.5 w-full laptop:h-full rounded-lg tablet:rounded-xl shadow-md ${className}`}
      style={{
        backgroundColor: theme.colors.cardBg,
        boxShadow: `0 4px 16px rgba(0, 0, 0, 0.12)`,
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center rounded-md tablet:rounded-lg flex-shrink-0"
        style={{ 
          backgroundColor: getIconBgColor(),
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
        className="font-inter text-mini mobile-M:text-tiny tablet:text-small laptop:text-mini laptop-L:text-tiny font-medium text-center leading-tight line-clamp-1"
        style={{ color: theme.statCard.text }}
      >
        {title}
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

export default StatCardFindJobs;