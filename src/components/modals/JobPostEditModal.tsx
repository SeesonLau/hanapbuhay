"use client";

import React, { useMemo, useState, useEffect } from "react";
import TextBox from "@/components/ui/TextBox";
import TextArea from "@/components/ui/TextArea";
import AddButtonIcon from "@/assets/add.svg";
import DeleteButtonIcon from "@/assets/delete.svg";
import SelectBox from "@/components/ui/SelectBox";
import Button from "@/components/ui/Button";
import { getGenderOptions, Gender } from "@/lib/constants/gender";
import { getExperienceOptions, ExperienceLevel } from "@/lib/constants/experience-level";
import { JobType, getJobTypeOptions, SubTypes } from "@/lib/constants/job-types";
import { getProvinces, getCitiesByProvince, parseLocationDetailed } from "@/lib/constants/philippines-locations";
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
  const { province, city, address } = parseLocationDetailed(post.location ?? "");
  return {
    title: post.title ?? "",
    jobTypes: post.type ? [post.type] : [],
    experienceLevels: experiences,
    genders: genders,
    country: "Philippines",
    province: province ?? "",
    city: city ?? "",
    address: address ?? "",
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
  const [requirementsList, setRequirementsList] = useState<string[]>(
    (resolvedInitial?.qualifications ?? "")
      .split("\n")
      .map((s) => s.replace(/^\-\s*/, "").trim())
      .filter((s) => s.length > 0)
  );
  const [page, setPage] = useState<1 | 2>(1);
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
    setCity(ri?.city ?? (ri?.province ? getCitiesByProvince(ri.province)[0] ?? "" : "Cebu City"));
    setAddress(ri?.address ?? "");
    setSalary(ri?.salary ?? "");
    setSalaryPeriod(ri?.salaryPeriod ?? "day");
    setAbout(ri?.about ?? "");
    setQualifications(ri?.qualifications ?? "");
    setRequirementsList(
      (ri?.qualifications ?? "")
        .split("\n")
        .map((s) => s.replace(/^\-\s*/, "").trim())
        .filter((s) => s.length > 0)
    );
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

  const handleExperienceSelect = (value: string) => {
    setSelectedExperience(prev => (prev.includes(value) ? [] : [value]));
  };

  const handleGenderSelect = (value: string) => {
    const base = [Gender.MALE, Gender.FEMALE, Gender.OTHERS];
    if (value === Gender.ANY) {
      setSelectedGenders(prev => (prev.includes(Gender.ANY) ? [] : [Gender.ANY]));
      return;
    }
    setSelectedGenders(prev => {
      let next = prev.filter(g => g !== Gender.ANY);
      if (next.includes(value)) {
        next = next.filter(g => g !== value);
      } else {
        next = [...next, value];
      }
      const allThree = base.every(g => next.includes(g));
      if (allThree) return [Gender.ANY];
      return next;
    });
  };

  const isFormValid = (() => {
    const t = title.trim();
    const d = about.trim();
    const sNum = Number(salary);
    return t.length > 0 && d.length > 0 && !Number.isNaN(sNum) && sNum >= 0;
  })();

  const handleSubmit = () => {
    if (!isFormValid) {
      alert('Please fill Job Title and About this role, and ensure Salary Rate is a non-negative number. Street address is optional.');
      return;
    }
    const finalSubTypes = [...selectedSubTypes];
    const finalQualifications = requirementsList
      .filter((s) => s.trim().length > 0)
      .map((s) => `- ${s.trim()}`)
      .join("\n");
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
      qualifications: finalQualifications,
      subTypes: finalSubTypes,
    };
    onSubmit?.(data);
    setPage(1);
    onClose();
  };

  // Using Tailwind theme classes for colors and fonts

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 mobile-M:p-3 tablet:p-4 bg-black/50"
      onClick={() => { setPage(1); onClose(); }}
    >
      <div
        className={`font-inter w-[700px] max-w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-hide rounded-2xl shadow-lg border bg-white border-gray-neutral300 text-gray-neutral600`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 mobile-M:px-5 tablet:px-[50px] pt-4 tablet:pt-6 pb-3 relative">
          <h2 className={`font-alexandria text-[24px] font-semibold text-center w-full text-gray-neutral900`}>
            Edit Job Post
          </h2>
          <button
            onClick={() => { setPage(1); onClose(); }}
            aria-label="Close"
            className="text-2xl leading-none px-2 absolute right-4 mobile-M:right-5 tablet:right-[50px] top-4 tablet:top-6 text-gray-neutral600"
          >
            ×
          </button>
        </div>

        <div className="px-4 mobile-M:px-5 tablet:px-[50px] pb-4 tablet:pb-6 space-y-4 tablet:space-y-5">
          <div className={page === 1 ? '' : 'hidden'}>
          {/* Tags Section */}
          <div className="text-[14px] font-semibold mb-2 text-gray-neutral900">Tags</div>
          <div className="rounded-xl border p-4 border-gray-neutral300">
            {/* Selected Tags Summary */}
            <div className="mb-3">
              <div className="text-[14px] font-semibold mb-2 text-gray-neutral900">Selected Tags</div>
              <div
                className="rounded-lg border px-3 py-2 min-h-[34px] flex flex-wrap gap-2 items-center border-gray-neutral300"
              >
                {selectedSubTypes.length === 0 && selectedExperience.length === 0 && selectedGenders.length === 0 ? (
                  <span className="text-[12px] text-gray-neutral600">Selected tags</span>
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
              <div className="text-[14px] font-semibold mb-2 text-gray-neutral900">Job Type</div>
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

             <div className="border-t my-4 border-gray-neutral300" />
             {/* Experience Level */}
             <div className="mb-3">
               <div className="text-[14px] font-semibold mb-2 text-gray-neutral900">Experience Level</div>
               <div className="flex flex-wrap gap-2">
                {experienceOptions.map((opt) => (
                  <ExperienceLevelTag
                    key={opt.value}
                    label={opt.label}
                    selected={selectedExperience.includes(opt.value)}
                    onClick={() => handleExperienceSelect(String(opt.value))}
                  />
                ))}
               </div>
             </div>

             <div className="border-t my-4 border-gray-neutral300" />

             {/* Preferred Gender */}
             <div>
               <div className="text-[14px] font-semibold mb-2 text-gray-neutral900">Preferred Gender</div>
               <div className="flex flex-wrap gap-2">
                {genderOptions.map((opt) => (
                  <GenderTag
                    key={opt.value}
                    label={opt.label}
                    selected={selectedGenders.includes(opt.value)}
                    onClick={() => handleGenderSelect(String(opt.value))}
                  />
                ))}
               </div>
             </div>
          </div>
          </div>

          <div className={page === 2 ? '' : 'hidden'}>
          {/* Job Title */}
          <div className="mb-3">
            <TextBox 
              label="Job Title" 
              placeholder="Enter job title (e.g., Landscaper needed)" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              helperText={`${title.length}/50`}
              required
            />
          </div>
          {/* Location */}
          <div>
            <div className="text-[14px] font-semibold mb-2 text-gray-neutral900">Location</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <SelectBox 
                options={[{ value: "Philippines", label: "Philippines" }]} 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Select country"
              />
              <SelectBox 
                options={getProvinces().map((prov) => ({ value: prov, label: prov }))}
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Select province"
              />
              <SelectBox 
                options={getCitiesByProvince(province).map((city_name) => ({ value: city_name, label: city_name }))}
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
                maxLength={100}
                helperText={`${address.length}/100`}
              />
            </div>
          </div>

          {/* Salary Rate */}
          <div>
            <div className="text-[14px] font-semibold mb-2 text-gray-neutral900">Salary Rate</div>
            <div className="flex items-center gap-3">
              <TextBox 
                type="text" 
                placeholder="Enter amount (e.g., 1000.00)" 
                value={salary}
                onChange={(e) => {
                  let v = e.target.value.replace(/[^0-9.]/g, '');
                  const i = v.indexOf('.');
                  if (i !== -1) {
                    v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, '');
                  }
                  setSalary(v);
                }}
                leftIcon={<img src="/icons/PHP.svg" alt="PHP" className="w-4 h-4" />}
                className="flex-1"
                min={0}
                inputMode="decimal"
                pattern="^[0-9]*\.?[0-9]*$"
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
            <div className="text-[14px] font-semibold mb-2 text-gray-neutral900">About this role</div>
            <TextArea 
              placeholder="Description"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              height="100px"
              maxLength={1000}
              showCharCount={true}
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <div className="text-[14px] font-semibold mb-2 text-gray-neutral900">Requirements</div>
            <div className="space-y-3">
              {requirementsList.map((req, idx) => {
                const isLast = idx === requirementsList.length - 1;
                return (
                  <div key={`req-${idx}`} className="flex items-center gap-3">
                    <TextBox
                      placeholder={`Requirement ${idx + 1}`}
                      value={req}
                      onChange={(e) => {
                        const v = e.target.value;
                        setRequirementsList((prev) => {
                          const next = [...prev];
                          next[idx] = v;
                          return next;
                        });
                      }}
                      className="flex-1"
                    />
                    {isLast ? (
                      <button
                        type="button"
                        aria-label="Add requirement"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-transparent hover:opacity-90 transition-opacity"
                        onClick={() => {
                          setRequirementsList((prev) => {
                            const next = [...prev];
                            next.splice(idx + 1, 0, "");
                            return next;
                          });
                        }}
                      >
                        <img src={typeof AddButtonIcon === 'string' ? AddButtonIcon : (AddButtonIcon as any).src} alt="Add" className="w-9 h-9" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        aria-label="Clear requirement"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-error-error500 hover:bg-error-error600 transition-colors"
                        onClick={() => {
                          setRequirementsList((prev) => prev.filter((_, i) => i !== idx));
                        }}
                      >
                        <div
                          className="w-5 h-5 bg-white"
                          style={{
                            WebkitMaskImage: `url(${typeof DeleteButtonIcon === 'string' ? DeleteButtonIcon : (DeleteButtonIcon as any).src})`,
                            maskImage: `url(${typeof DeleteButtonIcon === 'string' ? DeleteButtonIcon : (DeleteButtonIcon as any).src})`,
                            WebkitMaskRepeat: 'no-repeat',
                            maskRepeat: 'no-repeat',
                            WebkitMaskSize: 'contain',
                            maskSize: 'contain',
                            WebkitMaskPosition: 'center',
                            maskPosition: 'center',
                          }}
                        />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
        <div className="mt-2">
          <div className="w-full h-2 bg-gray-neutral200 rounded-full">
            <div className={`h-2 bg-primary-primary500 rounded-full transition-all duration-300`} style={{ width: `${page === 1 ? 50 : 100}%` }}></div>
          </div>
          <div className="mt-1 text-right text-mini text-gray-neutral600">{page === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}</div>
        </div>
        <div className="pt-2 flex items-center justify-between">
          {page === 2 && (
            <Button variant="ghost" fullRounded={true} className="w-[140px] border-2 border-primary-primary500 text-primary-primary500 hover:bg-primary-primary100" onClick={() => setPage(1)}>Back</Button>
          )}
          {page === 1 && (
            <Button variant="primary" fullRounded={true} className="ml-auto w-[140px]" onClick={() => setPage(2)}>Next</Button>
          )}
          {page === 2 && (
            <Button variant="primary" fullRounded={true} className="ml-auto w-[140px] disabled:opacity-50" disabled={!isFormValid} onClick={handleSubmit}>Save</Button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
