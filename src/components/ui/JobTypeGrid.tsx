"use client";

import React, { useEffect, useRef, useState } from "react";
import { getNeutral300Color, getWhiteColor, getColor } from "@/styles/colors";
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

function getSelectedTileHeight(type: string): number {
  // Keep selected tiles within a 3-row max (3 * 120 = 360)
  // Service previously used 4 rows (380). Clamp to 360 to avoid extra grid height.
  // Use explicit pixel heights requested: non-Service 252px (2 rows combined), Service 385px (3 rows combined)
  return type === JobType.SERVICE ? 385 : 252;
}

export default function JobTypeGrid({ options, selected, onToggle, selectedSubTypes = [], onToggleSubType }: JobTypeGridProps) {
  // Measure selected tile content to avoid extra inner space below tags
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});

  useEffect(() => {
    const current = selected[0];
    if (!current) return;
    const el = contentRefs.current[current];
    if (el) {
      // Measure inner content height including padding
      const h = el.scrollHeight;
      setMeasuredHeights(prev => ({ ...prev, [current]: h }));
    }
  }, [selected, selectedSubTypes]);
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
      className="grid gap-3 mx-auto"
      style={{
        gridTemplateColumns: 'repeat(3, 180px)',
        gridAutoRows: '120px',
        gridAutoFlow: 'dense',
        minWidth: '564px',
        width: '564px'
      }}
    >
      {displayOptions.map((opt) => {
        const isSelected = selected.includes(opt.value);
        const measured = measuredHeights[opt.value] ?? getSelectedTileHeight(opt.value);
        const subTypes = SubTypes[opt.value as JobType] || [];
        const isCreative = opt.value === JobType.CREATIVE;
        const isSkilled = opt.value === JobType.SKILLED;
        // Fixed row/column span based on selection
        // Skilled selected: horizontal rectangle 370x120, span 2 columns, 1 row
        const targetRows = isSelected ? (
          opt.value === JobType.SERVICE ? 3 : isSkilled ? 1 : 2
        ) : 1;
        // Explicit heights: Unselected 120px, Selected non-Service 252px, Selected Service 385px, Selected Skilled 120px
        const selectedHeight = isSelected ? (
          opt.value === JobType.SERVICE ? 385 : isSkilled ? 120 : 252
        ) : 120;
        const needsScroll = isSelected && measured > selectedHeight;
        return (
          <button
            key={opt.value}
            type="button"
            className="group relative w-[180px] rounded-lg border overflow-hidden transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-md"
            style={{ 
              borderColor: getNeutral300Color(), 
              backgroundColor: getWhiteColor(),
              height: `${selectedHeight}px`,
              width: isSelected && isSkilled ? '370px' : '180px',
              gridRowEnd: `span ${targetRows}`,
              gridColumnEnd: isSelected && isSkilled ? 'span 2' : 'span 1'
            }}
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
                  className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                  style={{
                    backgroundColor: getColor('primary', 'primary100'),
                    color: getColor('tag', 'jobText'),
                    willChange: 'opacity, transform'
                  }}
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
                    className="text-[12px] font-medium text-center opacity-0 transform transition-all duration-300 ease-out translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                    style={{
                      color: getColor('tag', 'jobText'),
                      backgroundColor: 'transparent',
                    }}
                  >
                    {opt.label}
                  </div>
                </div>
              </>
            )}

            {/* Selected: smoothly replace with subtype tags grid */}
            {isSelected && (
              <div
                className={`absolute inset-0 p-3 transition-all duration-300 ease-out ${needsScroll ? 'overflow-y-auto' : ''} ${(isCreative || isSkilled) && needsScroll ? 'scrollbar-hide' : ''}`}
                style={{ 
                  backgroundColor: getColor('primary', 'primary100')
                }}
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
            )}
          </button>
        );
      })}
    </div>
  );
}