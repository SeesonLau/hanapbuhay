"use client";

import React, { useMemo, useState, useEffect } from "react";
import { getWhiteColor, getNeutral300Color, getNeutral600Color, getBlackColor, getPrimary500Color, getNeutral100Color } from "@/styles/colors";
import { fontClasses } from "@/styles/fonts";
import TextBox from "@/components/ui/TextBox";
import TextArea from "@/components/ui/TextArea";
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

const defaultAbout = "Having a well-kept garden makes the home more relaxing and welcoming; but it’s hard to manage with our busy schedule. We need someone who enjoys working with plants, keeping things tidy, and making sure our garden always looks fresh and alive.";
const defaultQualifications = [
  "Experience in gardening or landscaping",
  "Knowledge of plant care and maintenance",
  "Physically able to do outdoor tasks",
  "Creative eye for arranging plants and outdoor spaces is a plus",
  "Maintain the family’s backyard and front yard",
  "Plant, water, prune, and take care of trees, flowers, or grass",
  "Keep the garden clean and free of weeds",
  "Suggest improvements for a more beautiful outdoor space",
].map((s) => `- ${s}`).join("\n");

export default function JobPostAddModal({ isOpen, onClose, onSubmit }: JobPostAddModalProps) {
  const [title, setTitle] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [country, setCountry] = useState("Philippines");
  const [province, setProvince] = useState("Cebu");
  const [city, setCity] = useState("Cebu City");
  const [address, setAddress] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState<'day' | 'week' | 'month'>("day");
  const [about, setAbout] = useState("");
  const [qualifications, setQualifications] = useState("");

  const resetForm = () => {
    setTitle("");
    setSelectedJobTypes([]);
    setSelectedSubTypes([]);
    setSelectedExperience([]);
    setSelectedGenders([]);
    setCountry("Philippines");
    setProvince("Cebu");
    setCity("Cebu City");
    setAddress("");
    setSalary("");
    setSalaryPeriod("day");
    setAbout("");
    setQualifications("");
  };

  // Always start with a clean form whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
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

  const handleSubmit = () => {
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
      qualifications: qualifications.trim(),
      // @ts-expect-error allow optional for now without breaking callers
      subTypes: selectedSubTypes,
    };
    onSubmit?.(data);
    // Reset after submit so next open is blank
    resetForm();
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
            Post a Job
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
            </div>
            {/* Job Type */}
            <div className="mb-3">
              <div className="text-[14px] font-semibold mb-2" style={{ color: getBlackColor() }}>Job Type</div>
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
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}