"use client";

import React, { useMemo, useState, useEffect } from "react";
import { getWhiteColor, getNeutral300Color, getNeutral600Color, getBlackColor, getPrimary500Color, getNeutral100Color } from "@/styles/colors";
import { fontClasses } from "@/styles/fonts";
import TextBox from "@/components/ui/TextBox";
import TextArea from "@/components/ui/TextArea";
import SelectBox from "@/components/ui/SelectBox";
import Button from "@/components/ui/Button";
import { getGenderOptions, Gender } from "@/lib/constants/gender";
import { getExperienceOptions, ExperienceLevel } from "@/lib/constants/experience-level";
import { JobType, getJobTypeOptions, SubTypes } from "@/lib/constants/job-types";
import { GenderTag, ExperienceLevelTag, JobTypeTag } from "@/components/ui/TagItem";
import JobTypeGrid from "@/components/ui/JobTypeGrid";
import type { JobPostAddFormData } from "./JobPostAddModal";
import type { Post } from '@/lib/models/posts';

const REQUIREMENTS_MARKER = "[requirements]";
function splitDescription(desc?: string): { about: string; qualifications: string } {
  const raw = desc ?? "";
  const idx = raw.indexOf(REQUIREMENTS_MARKER);
  if (idx === -1) {
    return { about: raw, qualifications: "" };
  }
  const about = raw.slice(0, idx).trim();
  const rest = raw.slice(idx + REQUIREMENTS_MARKER.length).trim();
  return { about, qualifications: rest };
}

interface JobPostEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<JobPostAddFormData> & { subTypes?: string[] };
  // Accept a Post directly (page was passing `post`) – we'll derive initialData from it if provided
  post?: Post | null;
  onSubmit?: (data: JobPostAddFormData & { subTypes?: string[] }) => void;
}

function mapPostToInitial(post: Post): Partial<JobPostAddFormData> & { subTypes?: string[] } {
  const { about, qualifications } = splitDescription(post.description);
  const sub = post.subType || [];
  const genders = sub.filter(s => Object.values(Gender).includes(s as Gender));
  const experiences = sub.filter(s => Object.values(ExperienceLevel).includes(s as ExperienceLevel));
  const allJobSubTypes = Object.values(SubTypes).flat();
  const jobSubTypes = sub.filter(s => allJobSubTypes.includes(s));
  return {
    title: post.title ?? "",
    jobTypes: post.type ? [post.type] : [],
    experienceLevels: experiences,
    genders: genders,
    country: "Philippines",
    province: "",
    city: post.location ?? "",
    address: "",
    salary: (typeof post.price === 'number') ? String(post.price) : (post.price ?? ""),
    salaryPeriod: 'month',
    about,
    qualifications,
    subTypes: Array.from(new Set(jobSubTypes)),
  };
}

export default function JobPostEditModal({ isOpen, onClose, initialData, onSubmit, post }: JobPostEditModalProps) {
  const resolvedInitial = initialData ?? (post ? mapPostToInitial(post) : undefined);
  const [title, setTitle] = useState(resolvedInitial?.title ?? "");
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(resolvedInitial?.jobTypes ?? []);
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>(resolvedInitial?.subTypes ?? []);
  const [selectedExperience, setSelectedExperience] = useState<string[]>(resolvedInitial?.experienceLevels ?? []);
  const [selectedGenders, setSelectedGenders] = useState<string[]>(resolvedInitial?.genders ?? []);
  const [country, setCountry] = useState(resolvedInitial?.country ?? "Philippines");
  const [province, setProvince] = useState(resolvedInitial?.province ?? "Cebu");
  const [city, setCity] = useState(resolvedInitial?.city ?? "Cebu City");
  const [address, setAddress] = useState(resolvedInitial?.address ?? "");
  const [salary, setSalary] = useState(resolvedInitial?.salary ?? "");
  const [salaryPeriod, setSalaryPeriod] = useState<'day' | 'week' | 'month'>(resolvedInitial?.salaryPeriod ?? "day");
  const [about, setAbout] = useState(resolvedInitial?.about ?? "");
  const [qualifications, setQualifications] = useState(resolvedInitial?.qualifications ?? "");

  // Helper to reset all state from a given initial data snapshot
  const resetFromInitial = (ri?: Partial<JobPostAddFormData> & { subTypes?: string[] }) => {
    const nextJobTypes = ri?.jobTypes ?? [];
    const nextSubTypes = Array.from(new Set(ri?.subTypes ?? []));

    // Fallback: derive job types from subTypes if jobTypes not provided
    const derivedJobTypes = (nextJobTypes.length === 0 && nextSubTypes.length > 0)
      ? Array.from(new Set(
          Object.entries(SubTypes)
            .filter(([, subs]) => nextSubTypes.some(s => subs.includes(s)))
            .map(([jt]) => jt)
        ))
      : nextJobTypes;

    setTitle(ri?.title ?? "");
    setSelectedJobTypes(derivedJobTypes);
    setSelectedSubTypes(nextSubTypes);
    setSelectedExperience(Array.from(new Set(ri?.experienceLevels ?? [])));
    setSelectedGenders(Array.from(new Set(ri?.genders ?? [])));
    setCountry(ri?.country ?? "Philippines");
    setProvince(ri?.province ?? "Cebu");
    setCity(ri?.city ?? "Cebu City");
    setAddress(ri?.address ?? "");
    setSalary(ri?.salary ?? "");
    setSalaryPeriod(ri?.salaryPeriod ?? "day");
    setAbout(ri?.about ?? "");
    setQualifications(ri?.qualifications ?? "");
  };

  // Sync state when `initialData` or `post` changes. Compute resolvedInitial locally
  // to avoid object-identity changes causing repeated effects.
  useEffect(() => {
    const ri = initialData ?? (post ? mapPostToInitial(post) : undefined);
    resetFromInitial(ri);
  }, [initialData, post]);

  // Reset to unedited values each time the modal opens
  useEffect(() => {
    if (isOpen) {
      const ri = initialData ?? (post ? mapPostToInitial(post) : undefined);
      resetFromInitial(ri);
    }
  }, [isOpen, initialData, post]);

  const jobTypeOptions = useMemo(() => getJobTypeOptions(), []);
  const experienceOptions = useMemo(() => getExperienceOptions(), []);
  const genderOptions = useMemo(() => getGenderOptions(), []);

  // Compute effective selections for first render before state sync
  const initialSubTypes = resolvedInitial?.subTypes ?? [];
  const initialJobTypes = resolvedInitial?.jobTypes ?? [];
  const derivedInitialJobTypes = (initialJobTypes.length === 0 && initialSubTypes.length > 0)
    ? Array.from(new Set(
        Object.entries(SubTypes)
          .filter(([, subs]) => initialSubTypes.some(s => subs.includes(s)))
          .map(([jt]) => jt)
      ))
    : initialJobTypes;
  const effectiveJobTypes = selectedJobTypes.length ? selectedJobTypes : derivedInitialJobTypes;
  const effectiveSubTypes = selectedSubTypes.length ? selectedSubTypes : initialSubTypes;

  if (!isOpen || !resolvedInitial) return null;

  const toggleArrayValue = (arr: string[], value: string) => {
    return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
  };
  const toggleSubType = (subType: string) => {
    setSelectedSubTypes(prev => prev.includes(subType) ? prev.filter(s => s !== subType) : [...prev, subType]);
  };

  const handleSubmit = () => {
    const finalSubTypes = [...selectedSubTypes];
    const data: JobPostAddFormData & { subTypes?: string[] } = {
      title: title.trim(),
      jobTypes: selectedJobTypes,
      experienceLevels: selectedExperience,
      genders: selectedGenders,
      country,
      province,
      city,
      address: address.trim(),
      salary: salary.trim(),
      salaryPeriod,
      about: about.trim(),
      qualifications: qualifications.trim(),
      subTypes: finalSubTypes,
    };
    onSubmit?.(data);
    onClose();
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: getWhiteColor(),
    borderColor: getNeutral300Color(),
    color: getNeutral600Color(),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className={`${fontClasses.body} w-[700px] max-w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-hide rounded-2xl shadow-lg border`}
        style={containerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-[50px] pt-6 pb-3 relative">
          <h2 className={`${fontClasses.heading} text-[24px] font-semibold text-center w-full`} style={{ color: getBlackColor() }}>
            Edit Job Post
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none px-2 absolute right-[50px] top-6"
            style={{ color: getNeutral600Color() }}
          >
            ×
          </button>
        </div>

        <div className="px-[50px] pb-6 space-y-5">
          {/* Job Title */}
          <TextBox 
            label="Job Title" 
            placeholder="Enter job title (e.g., Landscaper needed)" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Tags Section */}
          <div className="text-[14px] font-semibold mb-2" style={{ color: getBlackColor() }}>Tags</div>
          <div className="rounded-xl border p-4" style={{ borderColor: getNeutral300Color() }}>
            {/* Selected Tags Summary */}
            <div className="mb-3">
              <div className="text-[14px] font-semibold mb-2" style={{ color: getBlackColor() }}>Selected Tags</div>
              <div
                className="rounded-lg border px-3 py-2 min-h-[34px] flex flex-wrap gap-2 items-center"
                style={{ borderColor: getNeutral300Color() }}
              >
                {selectedSubTypes.length === 0 && selectedExperience.length === 0 && selectedGenders.length === 0 ? (
                  <span className="text-[12px]" style={{ color: getNeutral600Color() }}>Selected tags</span>
                ) : (
                  <>
                    {selectedSubTypes.map((label) => (
                      <JobTypeTag 
                        key={`sel-jt-${label}`} 
                        label={label} 
                        selected={true}
                        onClick={() => setSelectedSubTypes(prev => prev.filter(s => s !== label))}
                      />
                    ))}
                    {selectedExperience.map((label) => (
                      <ExperienceLevelTag 
                        key={`sel-exp-${label}`} 
                        label={label} 
                        selected={true}
                        onClick={() => setSelectedExperience(prev => prev.filter(v => v !== label))}
                      />
                    ))}
                    {selectedGenders.map((label) => (
                      <GenderTag 
                        key={`sel-gen-${label}`} 
                        label={label} 
                        selected={true}
                        onClick={() => setSelectedGenders(prev => prev.filter(v => v !== label))}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
            {/* Job Type */}
            <div className="mb-3">
              <div className="text-[14px] font-semibold mb-2" style={{ color: getBlackColor() }}>Job Type</div>
              <JobTypeGrid
                options={jobTypeOptions}
                selected={effectiveJobTypes.slice(0, 1)}
                selectedSubTypes={selectedSubTypes}
                onToggleSubType={(sub) => toggleSubType(sub)}
                onToggle={(value) => {
                  const subList = SubTypes[value as JobType] || [];
                  const isAlreadySelected = effectiveJobTypes[0] === value;
                  if (isAlreadySelected) {
                    // Deselect current but preserve previously selected subtypes
                    setSelectedJobTypes([]);
                  } else {
                    // Switch selected category; keep ALL previously selected subtypes across categories
                    setSelectedJobTypes([String(value)]);
                  }
                }}
              />
              {/* Subtypes now render inside the selected tiles above */}
            </div>

             <div className="border-t my-4" style={{ borderColor: getNeutral300Color() }} />
             {/* Experience Level */}
             <div className="mb-3">
               <div className="text-[14px] font-semibold mb-2" style={{ color: getBlackColor() }}>Experience Level</div>
               <div className="flex flex-wrap gap-2">
                 {experienceOptions.map((opt) => (
                   <ExperienceLevelTag
                     key={opt.value}
                     label={opt.label}
                     selected={selectedExperience.includes(opt.value)}
                     onClick={() => setSelectedExperience(prev => toggleArrayValue(prev, String(opt.value)))}
                   />
                 ))}
               </div>
             </div>

             <div className="border-t my-4" style={{ borderColor: getNeutral300Color() }} />

             {/* Preferred Gender */}
             <div>
               <div className="text-[14px] font-semibold mb-2" style={{ color: getBlackColor() }}>Preferred Gender</div>
               <div className="flex flex-wrap gap-2">
                 {genderOptions.map((opt) => (
                   <GenderTag
                     key={opt.value}
                     label={opt.label}
                     selected={selectedGenders.includes(opt.value)}
                     onClick={() => setSelectedGenders(prev => toggleArrayValue(prev, String(opt.value)))}
                   />
                 ))}
               </div>
             </div>
          </div>

          {/* Location */}
          <div>
            <div className="text-[14px] font-semibold mb-2" style={{ color: getBlackColor() }}>Location</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <SelectBox 
                options={[{ value: "Philippines", label: "Philippines" }]} 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Select country"
              />
              <SelectBox 
                options={[{ value: "Cebu", label: "Cebu" }, { value: "Metro Manila", label: "Metro Manila" }]} 
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Select province"
              />
              <SelectBox 
                options={[{ value: "Cebu City", label: "Cebu City" }, { value: "Makati", label: "Makati" }]} 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Select city or municipality"
              />
            </div>
            <div className="mt-3">
              <TextBox 
                placeholder="Enter specific street address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Salary Rate */}
          <div>
            <div className="text-[14px] font-semibold mb-2" style={{ color: getBlackColor() }}>Salary Rate</div>
            <div className="flex items-center gap-3">
              <TextBox 
                type="number" 
                placeholder="Enter amount (e.g., 1000.00)" 
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                leftIcon={<img src="/icons/PHP.svg" alt="PHP" className="w-4 h-4" />}
                className="flex-1"
              />
              <SelectBox 
                width="180px"
                options={[
                  { value: 'day', label: 'per day' },
                  { value: 'week', label: 'per week' },
                  { value: 'month', label: 'per month' },
                ]}
                value={salaryPeriod}
                onChange={(e) => setSalaryPeriod(e.target.value as 'day' | 'week' | 'month')}
              />
            </div>
          </div>

          {/* About this role */}
          <div>
            <div className="text-[14px] font-semibold mb-2" style={{ color: getBlackColor() }}>About this role</div>
            <TextArea 
              placeholder="Description"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              height="140px"
            />
          </div>

          {/* Requirements */}
          <div>
            <div className="text-[14px] font-semibold mb-2" style={{ color: getBlackColor() }}>Requirements</div>
            <TextArea 
              placeholder="Press Enter to add a bullet; list requirements, skills, and experience"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              height="160px"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const el = e.currentTarget;
                  const pos = el.selectionStart ?? qualifications.length;
                  const end = el.selectionEnd ?? pos;
                  const insert = qualifications.length === 0 ? '- ' : '\n- ';
                  const newValue = qualifications.slice(0, pos) + insert + qualifications.slice(end);
                  setQualifications(newValue);
                  setTimeout(() => {
                    el.selectionStart = pos + insert.length;
                    el.selectionEnd = pos + insert.length;
                  }, 0);
                }
              }}
            />
          </div>

          {/* Footer */}
          <div className="pt-2">
            <Button 
              variant="primary" 
              fullRounded={true}
              className="w-full"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
