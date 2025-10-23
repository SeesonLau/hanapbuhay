"use client";

import React from "react";
import {
  getWhiteColor,
  getBlackColor,
  getNeutral600Color,
  getBlueColor,
  getGreenColor,
  getYellowColor,
  getRedColor,
} from "@/styles/colors";
import { fontClasses } from "@/styles/fonts";

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

const variantBg: Record<ColorVariant, string> = {
  blue: getBlueColor(),
  green: getGreenColor(),
  yellow: getYellowColor(),
  red: getRedColor(),
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
  const iconBg = variantBg[variantForType[type]];

  return (
    <div
      className={`flex items-center justify-between px-4 w-[340px] h-[130px] rounded-[10px] bg-white shadow transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-pointer ${className}`}
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
          className="flex items-center justify-center rounded-md"
          style={{ width: 100, height: 100, backgroundColor: iconBg }}
        >
          <img src={iconSrc} alt={`${resolvedTitle} icon`} style={{ width: 80, height: 80 }} />
        </div>
        <span className={`${fontClasses.body} text-sm`} style={{ color: getNeutral600Color() }}>
          {resolvedTitle}
        </span>
      </div>
      <span className={`${fontClasses.heading} text-sm`} style={{ color: getNeutral600Color() }}>
        {value !== undefined && value !== null ? value : "—"}
      </span>
    </div>
  );
};

export default StatCardAppliedJobs;