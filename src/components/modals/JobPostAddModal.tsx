"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import TextBox from "@/components/ui/TextBox";
import TextArea from "@/components/ui/TextArea";
import AddButtonIcon from "@/assets/add.svg";
import DeleteButtonIcon from "@/assets/delete.svg";
import SelectBox from "@/components/ui/SelectBox";
import Button from "@/components/ui/Button";
import { Gender, getGenderOptions } from "@/lib/constants/gender";
import { ExperienceLevel, getExperienceOptions } from "@/lib/constants/experience-level";
import { getJobTypeOptions, SubTypes } from "@/lib/constants/job-types";
import type { JobType } from "@/lib/constants/job-types";
import { GenderTag, ExperienceLevelTag, JobTypeTag } from "@/components/ui/TagItem";
import JobTypeGrid from "@/components/ui/JobTypeGrid";
import { getProvinces, getCitiesByProvince } from "@/lib/constants/philippines-locations";

export interface JobPostAddFormData {
  title: string;
  jobTypes: string[]; // top-level types
  experienceLevels: string[];
  genders: string[];
  country: string;
  province: string;
  city: string;
  address: string;
  salary: string; // numeric string
  salaryPeriod: 'day' | 'week' | 'month';
  about: string;
  qualifications: string;
}

interface JobPostAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: JobPostAddFormData) => void;
}

export default function JobPostAddModal({ isOpen, onClose, onSubmit }: JobPostAddModalProps) {
  const [title, setTitle] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [country, setCountry] = useState("Philippines");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState<'day' | 'week' | 'month'>("day");
  const [about, setAbout] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [requirementsList, setRequirementsList] = useState<string[]>([""]);
  const [page, setPage] = useState<1 | 2>(1);

  const resetForm = () => {
    setTitle("");
    setSelectedJobTypes([]);
    setSelectedSubTypes([]);
    setSelectedExperience([]);
    setSelectedGenders([]);
    setCountry("Philippines");
    setProvince("");
    setCity("");
    setAddress("");
    setSalary("");
    setSalaryPeriod("day");
    setAbout("");
    setQualifications("");
    setRequirementsList([""]);
    setPage(1);
  };

  // Always start with a clean form whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const prevHtml = document.documentElement.style.overflow;
      const prevBody = document.body.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = prevHtml;
        document.body.style.overflow = prevBody;
      };
    }
  }, [isOpen]);

  const jobTypeOptions = useMemo(() => getJobTypeOptions(), []);
  const experienceOptions = useMemo(() => getExperienceOptions(), []);
  const genderOptions = useMemo(() => getGenderOptions(), []);

  if (!isOpen) return null;

  const toggleArrayValue = (arr: string[], value: string) => {
    return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
  };
  const toggleSubType = (subType: string) => {
    setSelectedSubTypes(prev => prev.includes(subType) ? prev.filter(s => s !== subType) : [...prev, subType]);
  };

  const clearSelectedTags = () => {
    setSelectedJobTypes([]);
    setSelectedSubTypes([]);
    setSelectedExperience([]);
    setSelectedGenders([]);
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
    const hasJobType = selectedJobTypes.length > 0;
    const hasExperience = selectedExperience.length > 0;
    const hasGender = selectedGenders.length > 0;
    const salaryText = salary.trim();
    const sNum = Number(salaryText);
    const integerDigits = salaryText.replace(/\..*/, '').replace(/[^0-9]/g, '').length;
    const withinMaxDigits = integerDigits > 0 && integerDigits <= 6;
    const hasSalary = salaryText.length > 0 && !Number.isNaN(sNum) && sNum >= 0 && withinMaxDigits;
    const hasRequirements = requirementsList.some((s) => s.trim().length > 0);
    return t.length > 0 && d.length > 0 && hasJobType && hasExperience && hasGender && hasSalary && hasRequirements;
  })();

  const handleSubmit = () => {
    if (!isFormValid) {
      alert('Please complete: Job Title, About this role, select Job Type, Experience Level, and Preferred Gender, enter a valid Salary Rate, and add at least one requirement.');
      return;
    }
    const data: JobPostAddFormData = {
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
      qualifications: requirementsList
        .filter((s) => s.trim().length > 0)
        .map((s) => `- ${s.trim()}`)
        .join("\n"),
      // @ts-expect-error allow optional for now without breaking callers
      subTypes: selectedSubTypes,
    };
    onSubmit?.(data);
    // Reset after submit so next open is blank
    resetForm();
    onClose();
  };

  // Using Tailwind theme classes for colors and fonts

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 mobile-M:p-3 tablet:p-4 bg-black/50"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={`font-inter w-[700px] max-w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-hide rounded-2xl shadow-lg border bg-white border-gray-neutral300 text-gray-neutral600`}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Header */}
        <div className="px-4 mobile-M:px-5 tablet:px-[50px] pt-4 tablet:pt-6 pb-3 relative">
          <h2 className={`font-alexandria text-[24px] font-semibold text-center w-full text-gray-neutral900`}>
            Post a Job
          </h2>
          <button
            onClick={onClose}
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
              <div className="flex items-center gap-2">
                <div
                  className="rounded-lg border px-3 py-2 min-h-[34px] flex-1 flex flex-wrap gap-2 items-center border-gray-neutral300"
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
                          onClick={() => toggleSubType(label)}
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
                {(selectedSubTypes.length > 0 || selectedExperience.length > 0 || selectedGenders.length > 0) && (
                  <button
                    type="button"
                    aria-label="Clear selected tags"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-error-error500 hover:bg-error-error600 transition-colors"
                    onClick={clearSelectedTags}
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
            </div>
            {/* Job Type */}
            <div className="mb-3">
              <div className="text-[14px] font-semibold mb-2 text-gray-neutral900">Job Type</div>
              <JobTypeGrid
                options={jobTypeOptions}
                selected={selectedJobTypes.slice(0, 1)}
                selectedSubTypes={selectedSubTypes}
                onToggleSubType={(sub) => toggleSubType(sub)}
                onToggle={(value) => {
                  const subList = SubTypes[value as JobType] || [];
                  const isAlreadySelected = selectedJobTypes[0] === value;
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

             {/* Sub Types are now rendered directly below their selected main tag above */}

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
                onChange={(e) => {
                  setProvince(e.target.value);
                  // Reset city when province changes
                  const cities = getCitiesByProvince(e.target.value);
                  setCity(cities.length > 0 ? cities[0] : "");
                }}
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
                maxLength={50}
                helperText={`${address.length}/50`}
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
                  const firstDot = v.indexOf('.');
                  if (firstDot !== -1) {
                    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
                  }
                  const [intPartRaw, decPartRaw = ''] = v.split('.');
                  const intPart = (intPartRaw || '').slice(0, 6);
                  const decPart = (decPartRaw || '').slice(0, 2);
                  v = decPart.length ? `${intPart}.${decPart}` : intPart;
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
              maxLength={500}
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
                    {isLast && requirementsList.length < 10 ? (
                      <button
                        type="button"
                        aria-label="Add requirement"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-transparent hover:opacity-90 transition-opacity"
                        onClick={() => {
                          setRequirementsList((prev) => {
                            if (prev.length >= 10) return prev;
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
              <Button 
                variant="primary" 
                fullRounded={true} 
                className="ml-auto w-[140px] disabled:opacity-50" 
                disabled={selectedSubTypes.length === 0 || selectedExperience.length === 0 || selectedGenders.length === 0}
                onClick={() => setPage(2)}
              >
                Next
              </Button>
            )}
            {page === 2 && (
              <Button variant="primary" fullRounded={true} className="ml-auto w-[140px] disabled:opacity-50" disabled={!isFormValid} onClick={handleSubmit}>Post</Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
