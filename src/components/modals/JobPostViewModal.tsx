"use client";

import React, { useState } from "react";
import {
  StaticGenderTag,
  StaticExperienceLevelTag,
  StaticJobTypeTag,
  StaticLocationTag,
  StaticSalaryTag,
} from "@/components/ui/TagItem";
import { JobType, SubTypes } from "@/lib/constants/job-types";
import { Gender } from "@/lib/constants/gender";
import { ExperienceLevel } from "@/lib/constants/experience-level";
import ViewProfileModal from "@/components/modals/ViewProfileModal";

export interface JobPostViewData {
  id: string;
  title: string;
  description: string; // Used for "About this role"
  requirements?: string[]; // Used for requirements
  location: string;
  salary: string;
  salaryPeriod: string;
  postedDate: string;
  applicantCount?: number;
  genderTags?: string[];
  experienceTags?: string[];
  jobTypeTags?: string[];
  postedBy?: {
    name: string;
    role?: string;
    avatarUrl?: string;
  };
}

interface JobPostViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPostViewData | null;
  onApply?: (id: string) => void;
}

// Helpers to validate tags against constants
const normalizeJobType = (label: string): string | null => {
  const isSubType = Object.values(JobType).some((jt) => (SubTypes[jt] || []).includes(label));
  return isSubType ? label : null;
};

const normalizeGender = (label: string): string | null => {
  return Object.values(Gender).includes(label as Gender) ? label : null;
};

const normalizeExperience = (label: string): string | null => {
  return Object.values(ExperienceLevel).includes(label as ExperienceLevel) ? label : null;
};

export default function JobPostViewModal({ isOpen, onClose, job, onApply }: JobPostViewModalProps) {
  if (!isOpen || !job) return null;

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const {
    id,
    title,
    description,
    requirements = [],
    location,
    salary,
    salaryPeriod,
    postedDate,
    applicantCount = 0,
    genderTags = [],
    experienceTags = [],
    jobTypeTags = [],
    postedBy,
  } = job;

  const normalizedJobTypes = jobTypeTags
    .map((label) => normalizeJobType(label))
    .filter((t): t is string => Boolean(t));

  const normalizedGenders = genderTags
    .map((label) => normalizeGender(label))
    .filter((t): t is string => Boolean(t));

  const normalizedExperiences = experienceTags
    .map((label) => normalizeExperience(label))
    .filter((t): t is string => Boolean(t));

  const allTags = [
    ...normalizedJobTypes.map((label) => ({ type: "jobtype" as const, label })),
    ...normalizedExperiences.map((label) => ({ type: "experience" as const, label })),
    ...normalizedGenders.map((label) => ({ type: "gender" as const, label })),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className={`font-inter w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg border bg-white border-gray-neutral300 text-gray-neutral600`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-3 flex items-start justify-between">
          <h2 className={`font-alexandria text-[24px] font-semibold text-gray-neutral900`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none px-2 text-gray-neutral600"
          >
            ×
          </button>
        </div>

        {/* Tags */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-1">
            {allTags.map((tag, idx) =>
              tag.type === "gender" ? (
                <StaticGenderTag key={`tag-${idx}`} label={tag.label} />
              ) : tag.type === "experience" ? (
                <StaticExperienceLevelTag key={`tag-${idx}`} label={tag.label} />
              ) : (
                <StaticJobTypeTag key={`tag-${idx}`} label={tag.label} />
              )
            )}
          </div>
        </div>

        {/* Location and Salary */}
        <div className="px-6 pb-2">
          <div className="flex items-center gap-2">
            <StaticLocationTag label={location} />
            <StaticSalaryTag label={`${salary} /${salaryPeriod}`} />
          </div>
        </div>

        {/* About this role */}
        <div className="px-6 pt-4">
          <h3 className="text-[18px] font-semibold mb-2 text-gray-neutral900">
            About this role
          </h3>
          <p className="text-[14px] text-gray-neutral600">
            {description}
          </p>
        </div>

        {/* Requirements (always visible under About this role) */}
        <div className="px-6 pt-6">
          <h3 className="text-[18px] font-semibold mb-2 text-gray-neutral900">
            Requirements
          </h3>
          {requirements.length > 0 ? (
            <ul className="space-y-1 text-[14px] text-gray-neutral600">
              {requirements.map((item, idx) => (
                <li key={`req-${idx}`}>• {item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[14px] text-gray-neutral600">
              No specific requirements provided.
            </p>
          )}
        </div>

        {/* Profile container (between Requirements and footer) */}
        <div className="px-6 pt-6">
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-lg border cursor-pointer bg-white border-gray-neutral300"
            onClick={() => setIsProfileOpen(true)}
          >
            <img
              src={postedBy?.avatarUrl ?? "/image/phoebe.jpeg"}
              alt={postedBy?.name ?? "Poster Avatar"}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="leading-tight">
              <div className="text-[14px] font-semibold text-gray-neutral900">
                {postedBy?.name ?? "Unknown Poster"}
              </div>
              <div className="text-[12px] text-gray-neutral600">
                {postedBy?.role ?? "Client"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer: posted date + applicants + Apply */}
        <div className="px-6 py-6">
          <div className={`flex items-center ${onApply ? 'justify-between' : 'justify-start'}`}>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-gray-neutral600">
                Posted on: {postedDate}
              </span>
              <span className="text-gray-neutral400">•</span>
              <span className="text-[12px] text-gray-neutral600">
                {applicantCount} Applicants
              </span>
            </div>
            {onApply && (
              <button
                onClick={() => onApply(id)}
                className="px-4 py-2 rounded-lg text-white text-sm bg-primary-primary500 hover:bg-primary-primary600"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}