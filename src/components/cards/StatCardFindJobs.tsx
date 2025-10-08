"use client";

import React from "react";
import { getWhiteColor, getBlackColor, getNeutral600Color, getBlueColor, getGreenColor, getYellowColor, getRedColor } from "@/styles/colors";
import { fontClasses } from "@/styles/fonts";

type ColorVariant = "blue" | "green" | "yellow" | "red";

interface StatCardFindJobsProps {
  title: string;
  value: string | number;
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

const variantBg: Record<ColorVariant, string> = {
  blue: getBlueColor(),
  green: getGreenColor(),
  yellow: getYellowColor(),
  red: getRedColor(),
};

export const StatCardFindJobs: React.FC<StatCardFindJobsProps> = ({ title, value, variant = "blue", className = "" }) => {
  const iconSrc = iconPathForTitle(title);
  const iconBg = variantBg[variant];

  return (
    <div
      className={`flex items-center justify-between px-4 ${className}`}
      style={{
        width: "380px",
        height: "87px",
        borderRadius: "10px",
        backgroundColor: getWhiteColor(),
        boxShadow: `0 4px 16px ${getBlackColor(0.12)}`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-md"
          style={{ width: 48, height: 48, backgroundColor: iconBg }}
        >
          <img src={iconSrc} alt={`${title} icon`} style={{ width: 44, height: 44 }} />
        </div>
        <span className={`${fontClasses.body} text-sm`} style={{ color: getNeutral600Color() }}>
          {title}
        </span>
      </div>
      <span className={`${fontClasses.heading} text-sm`} style={{ color: getNeutral600Color() }}>
        {value}
      </span>
    </div>
  );
};

export default StatCardFindJobs;