"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getWhiteColor,
  getNeutral100Color,
  getNeutral300Color,
  getNeutral600Color,
  getBlackColor,
  getPrimary500Color,
} from "@/styles/colors";
import { fontClasses } from "@/styles/fonts";
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
import { ProfileService } from "@/lib/services/profile-services";
import { formatDisplayName } from "@/lib/utils/profile-utils";

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [poster, setPoster] = useState<{ name: string; role?: string; avatarUrl?: string } | null>(null);
  const [posterUserId, setPosterUserId] = useState<string | null>(null);

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    }
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const raw = (job as any)?.raw;
        const userId = raw?.userId || raw?.createdBy;
        if (!userId) return;
        setPosterUserId(String(userId));
        const info = await ProfileService.getNameProfilePic(String(userId));
        if (info) {
          const displayName = formatDisplayName(info.name ?? "");
          setPoster({ name: displayName || "Unknown Poster", role: "Client", avatarUrl: info.profilePicUrl ?? undefined });
        }
      } catch (_) {}
    };
    if (isOpen && job) {
      fetchPoster();
    }
  }, [isOpen, job]);

  if (!isOpen || !job) return null;

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
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: getBlackColor(0.5) }}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={`${fontClasses.body} w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg border`}
        style={{ backgroundColor: getWhiteColor(), borderColor: getNeutral300Color(), color: getNeutral600Color() }}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-3 flex items-start justify-between">
          <h2 className={`${fontClasses.heading} text-[24px] font-semibold`} style={{ color: getBlackColor() }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none px-2"
            style={{ color: getNeutral600Color() }}
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
          <div className="flex flex-wrap items-center gap-2">
            <StaticLocationTag label={location} />
            <StaticSalaryTag label={`${salary} /${salaryPeriod}`} className="whitespace-nowrap" />
          </div>
        </div>

        {/* About + Requirements panels side-by-side */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-neutral900/60 p-4">
              <h3 className="text-[13px] font-semibold mb-2 text-gray-neutral900">About this role</h3>
              <p className="text-[11px] text-gray-neutral600">{description}</p>
            </div>
            <div className="rounded-xl border border-gray-neutral900/60 p-4">
              <h3 className="text-[13px] font-semibold mb-2 text-gray-neutral900">Requirements</h3>
              {requirements.length > 0 ? (
                <ul className="space-y-1 text-[11px] text-gray-neutral600">
                  {requirements.map((item, idx) => (
                    <li key={`req-${idx}`}>• {item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-gray-neutral600">No specific requirements provided.</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile container (between Requirements and footer) */}
        <div className="px-6 pt-6">
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-lg border cursor-pointer"
            style={{ backgroundColor: getWhiteColor(), borderColor: getNeutral300Color() }}
            onClick={() => setIsProfileOpen(true)}
          >
            <img
              src={(poster?.avatarUrl ?? postedBy?.avatarUrl) ?? "/image/phoebe.jpeg"}
              alt={(poster?.name ?? postedBy?.name) ?? "Poster Avatar"}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-gray-neutral900">
                {(poster?.name ?? postedBy?.name) ?? "Unknown Poster"}
              </div>
              <div className="text-[11px] text-gray-neutral600">
                {(poster?.role ?? postedBy?.role) ?? "Client"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer: posted date + applicants + Apply */}
        <div className="px-6 py-6">
          <div className={`flex items-center ${onApply ? 'justify-between' : 'justify-start'}`}>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-gray-neutral600">
                Posted on: {postedDate}
              </span>
              <span className="text-gray-neutral400">•</span>
              <span className="text-[11px] text-gray-neutral600">
                {applicantCount} Applicants
              </span>
            </div>
            {onApply && (
              <button
                onClick={() => onApply(id)}
                className="px-4 py-2 rounded-lg text-white text-sm"
                style={{ backgroundColor: getPrimary500Color() }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = getPrimary500Color(0.9))}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = getPrimary500Color())}
              >
                Apply Now
              </button>
            )}
          </div>
        </div>

      </motion.div>
      <ViewProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userId={posterUserId ?? ""}
        userType={'employer'}
      />
    </motion.div>
  );
}
