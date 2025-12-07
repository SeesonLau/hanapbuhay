"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";

type ManageType = "total" | "inactive" | "active" | "resolved";

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

export default function StatCardManageJobs({
  type,
  title,
  value,
  className = "",
}: StatCardManageJobsProps) {
  const { theme } = useTheme();
  const resolvedTitle = title || titleForType[type];
  const iconSrc = iconForType[type];

  // Map type to theme variant
  const getIconBgColor = () => {
    switch (type) {
      case "total":
        return theme.statCard.variant1;
      case "inactive":
        return theme.statCard.variant2;
      case "active":
        return theme.statCard.variant3;
      case "resolved":
        return theme.statCard.variant4;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-0.5 mobile-M:gap-1 tablet:gap-1.5 laptop:gap-0.5 laptop-L:gap-1 p-2 mobile-M:p-3 tablet:p-4 laptop:p-2 laptop-L:p-2.5 w-full h-full rounded-lg tablet:rounded-xl shadow-md ${className}`}
      style={{
        backgroundColor: theme.colors.cardBg,
        boxShadow: `0 4px 16px rgba(0, 0, 0, 0.12)`,
        minHeight: 'clamp(80px, 12vh, 120px)',
      }}
    >
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

      <span
        className="font-inter text-mini mobile-M:text-tiny tablet:text-small laptop:text-mini laptop-L:text-tiny font-medium text-center leading-tight line-clamp-1"
        style={{ color: theme.statCard.text }}
      >
        {resolvedTitle}
      </span>

      <span
        className="font-inter text-tiny mobile-M:text-small tablet:text-body laptop:text-small laptop-L:text-body font-bold text-center leading-none"
        style={{ color: theme.statCard.textValue }}
      >
        {value !== undefined && value !== null ? value : "—"}
      </span>
    </div>
  );
}