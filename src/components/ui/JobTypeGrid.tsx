"use client";

import React, { useEffect, useRef, useState } from "react";
import { SubTypes, JobType } from "@/lib/constants/job-types";
import { JobTypeTag, StaticJobTypeTag } from "@/components/ui/TagItem";

export interface JobTypeOption {
  value: string;
  label: string;
}

interface JobTypeGridProps {
  options: JobTypeOption[];
  selected: string[];
  onToggle: (value: string) => void;
  selectedSubTypes?: string[];
  onToggleSubType?: (subType: string) => void;
}

function getSelectedTileRows(type: string): number {
  return type === JobType.SERVICE ? 3 : 2;
}

export default function JobTypeGrid({ options, selected, onToggle, selectedSubTypes = [], onToggleSubType }: JobTypeGridProps) {
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Reorder tiles conditionally to achieve one-way exchanges:
  // - When Skilled is selected, swap Skilled with Creative.
  // - When Service is selected, swap Service with IT.
  const swapInArray = (arr: JobTypeOption[], a: JobType, b: JobType) => {
    const iA = arr.findIndex(o => o.value === a);
    const iB = arr.findIndex(o => o.value === b);
    if (iA >= 0 && iB >= 0) {
      const copy = [...arr];
      const temp = copy[iA];
      copy[iA] = copy[iB];
      copy[iB] = temp;
      return copy;
    }
    return arr;
  };

  const selectedType = selected[0] as JobType | undefined;
  let displayOptions = options;
  if (selectedType === JobType.SKILLED) {
    // Place Skilled under Creative and Construction (after both in order)
    const copy = [...displayOptions];
    const skilledIdx = copy.findIndex(o => o.value === JobType.SKILLED);
    const creativeIdx = copy.findIndex(o => o.value === JobType.CREATIVE);
    const constructionIdx = copy.findIndex(o => o.value === JobType.CONSTRUCTION);
    if (skilledIdx >= 0) {
      const [skilledOpt] = copy.splice(skilledIdx, 1);
      const insertIdx = Math.max(creativeIdx, constructionIdx);
      if (insertIdx >= 0) {
        copy.splice(insertIdx + 1, 0, skilledOpt);
        displayOptions = copy;
      }
    }
  } else if (selectedType === JobType.SERVICE) {
    displayOptions = swapInArray(displayOptions, JobType.SERVICE, JobType.IT);
  }

  // Fixed row spans when selected: non-Service => 2 rows, Service => 3 rows
  return (
    <div
      className="grid gap-3 mx-auto w-full grid-cols-2 tablet:grid-cols-3 auto-rows-[minmax(72px,auto)] mobile-L:auto-rows-[minmax(82px,auto)] tablet:auto-rows-[minmax(120px,auto)]"
      style={{ gridAutoFlow: 'dense' }}
    >
      {displayOptions.map((opt) => {
        const isSelected = selected.includes(opt.value);
        const rowsForSelected = getSelectedTileRows(opt.value);
        const subTypes = SubTypes[opt.value as JobType] || [];
        const isCreative = opt.value === JobType.CREATIVE;
        const isSkilled = opt.value === JobType.SKILLED;
        // Fixed row/column span based on selection
        // Skilled selected: horizontal rectangle 370x120, span 2 columns, 1 row
        const targetRows = isSelected ? (
          opt.value === JobType.SERVICE ? 3 : isSkilled ? 1 : 2
        ) : 1;
        // Explicit heights: Unselected 120px, Selected non-Service 252px, Selected Service 385px, Selected Skilled 120px
        const baseHeightClass = isSelected
          ? (opt.value === JobType.SERVICE
              ? 'h-[320px] mobile-S:h-[324px] mobile-M:h-[324px] mobile-L:h-[354px] tablet:h-[385px] laptop:h-[385px]'
              : isSkilled
                ? 'h-auto'
                : 'h-[210px] mobile-L:h-[230px] tablet:h-[252px] laptop:h-[252px]')
          : 'h-[100px] mobile-L:h-[110px] tablet:h-[120px]';

        const rowSpanClass = isSelected
          ? (opt.value === JobType.SERVICE
              ? 'row-span-3'
              : isSkilled
                ? 'row-span-2 tablet:row-span-1'
                : 'row-span-2')
          : 'row-span-1';
        return (
          <button
            key={opt.value}
            type="button"
            className={`group relative w-full rounded-lg border border-gray-neutral300 ${isSelected && isSkilled ? 'bg-primary-primary100' : 'bg-white'} ${opt.value === JobType.SKILLED ? 'overflow-visible' : 'overflow-hidden'} transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-md ${baseHeightClass} ${rowSpanClass} ${isSelected && isSkilled ? 'col-span-2 tablet:col-span-2' : ''} ${isSelected && opt.value === JobType.SERVICE ? 'mobile-S:col-start-2 mobile-M:col-start-2 mobile-L:col-start-2 tablet:col-start-3 laptop:col-start-3 laptop-L:col-start-3' : ''}`}
            onClick={() => onToggle(opt.value)}
            aria-pressed={isSelected}
            aria-label={opt.label}
          >
            {/* Content: base icon + hover state when not selected */}
            {!isSelected && (
              <>
                {/* Base faint icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={`/icons/${opt.value}.svg`}
                    alt=""
                    className="w-12 h-12 opacity-35"
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(27%) sepia(99%) saturate(2613%) hue-rotate(214deg) brightness(99%) contrast(101%)'
                    }}
                    aria-hidden
                  />
                </div>
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-primary-primary100 text-tag-jobText"
                >
                  <img
                    src={`/icons/${opt.value}.svg`}
                    alt={`${opt.label} icon`}
                    className="w-12 h-12 opacity-90 mb-2 transform transition-transform duration-300 ease-out translate-y-1 group-hover:translate-y-0 group-hover:scale-105"
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(27%) sepia(99%) saturate(2613%) hue-rotate(214deg) brightness(99%) contrast(101%)'
                    }}
                  />
                  <div
                    className="text-[12px] font-medium text-center opacity-0 transform transition-all duration-300 ease-out translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 text-tag-jobText"
                  >
                    {opt.label}
                  </div>
                </div>
              </>
            )}

            {/* Subtype grid: always rendered; animates open/close */}
            <div
              className={`${opt.value === JobType.SKILLED ? 'relative' : 'absolute inset-0'} p-2 mobile-L:p-2 tablet:p-3 transition-all duration-300 ease-out ${opt.value === JobType.SKILLED ? '' : 'overflow-y-auto'} ${(isCreative || isSkilled) ? 'scrollbar-hide' : ''} bg-primary-primary100 ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
              ref={(el) => { if (isSelected) contentRefs.current[opt.value] = el; }}
            >
              <div className="mb-2">
                <StaticJobTypeTag label={opt.label} />
              </div>
              <div className={`${isSkilled ? 'grid grid-cols-2 gap-2 items-start' : 'flex flex-col gap-2 items-start'}`}>
                {subTypes.map((sub) => (
                  <JobTypeTag
                    key={`${opt.value}-${sub}`}
                    label={sub}
                    selected={selectedSubTypes.includes(sub)}
                    onClick={() => onToggleSubType?.(sub)}
                  />
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}