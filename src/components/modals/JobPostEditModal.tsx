"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import TextBox from "@/components/ui/TextBox";
import TextArea from "@/components/ui/TextArea";
import AddButtonIcon from "@/assets/add.svg";
import DeleteButtonIcon from "@/assets/delete.svg";
import SelectBox from "@/components/ui/SelectBox";
import Button from "@/components/ui/Button";
import { getGenderOptions, Gender } from "@/lib/constants/gender";
import { getExperienceOptions, ExperienceLevel } from "@/lib/constants/experience-level";
import { JobType, getJobTypeOptions, SubTypes } from "@/lib/constants/job-types";
import { SALARY_TYPE } from "@/lib/constants/salary-type";
import { getProvinces, getCitiesByProvince, parseLocationDetailed } from "@/lib/constants/philippines-locations";
import { GenderTag, ExperienceLevelTag, JobTypeTag } from "@/components/ui/TagItem";
import JobTypeGrid from "@/components/ui/JobTypeGrid";
import type { JobPostAddFormData } from "./JobPostAddModal";
import type { Post } from '@/lib/models/posts';
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

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
  post?: Post | null;
  onSubmit?: (data: JobPostAddFormData & { subTypes?: string[] }) => void;
  isRestricted?: boolean;
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
    salaryType: post.salaryType,
    about,
    qualifications,
    subTypes: Array.from(new Set(jobSubTypes)),
  };
}

export default function JobPostEditModal({ isOpen, onClose, initialData, onSubmit, post, isRestricted }: JobPostEditModalProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
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
  const [salaryType, setSalaryType] = useState<string>(resolvedInitial?.salaryType ?? SALARY_TYPE[0].value);
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
    setProvince(ri?.province ?? "");
    setCity(ri?.city ?? (ri?.province ? getCitiesByProvince(ri.province)[0] ?? "" : ""));
    setAddress(ri?.address ?? "");
    setSalary(ri?.salary ?? "");
    setSalaryType(ri?.salaryType ?? SALARY_TYPE[0].value);
    setAbout(ri?.about ?? "");
    setQualifications(ri?.qualifications ?? "");
    setRequirementsList(
      (ri?.qualifications ?? "")
        .split("\n")
        .map((s) => s.replace(/^\-\s*/, "").trim())
        .filter((s) => s.length > 0)
    );
  };

  useEffect(() => {
    const ri = initialData ?? (post ? mapPostToInitial(post) : undefined);
    resetFromInitial(ri);
  }, [initialData, post]);

  useEffect(() => {
    if (isOpen) {
      const ri = initialData ?? (post ? mapPostToInitial(post) : undefined);
      resetFromInitial(ri);
    }
  }, [isOpen, initialData, post]);

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

  if (!isOpen || !resolvedInitial) return null;

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
    const salaryText = salary.trim();
    const sNum = Number(salaryText);
    const integerDigits = salaryText.replace(/\..*/, '').replace(/[^0-9]/g, '').length;
    const withinMaxDigits = integerDigits > 0 && integerDigits <= 6;
    return t.length > 0 && d.length > 0 && !Number.isNaN(sNum) && sNum >= 0 && withinMaxDigits;
  })();

  const handleSubmit = () => {
    if (!isFormValid) {
      alert(t.jobs.jobPostModal.messages.fillRequired);
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
      salaryType: salaryType,
      about: about.trim(),
      qualifications: finalQualifications,
      subTypes: finalSubTypes,
    };
    onSubmit?.(data);
    setPage(1);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 mobile-M:p-3 tablet:p-4"
      style={{ backgroundColor: theme.modal.overlay }}
      onClick={() => { setPage(1); onClose(); }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="font-inter w-[700px] max-w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-hide rounded-2xl shadow-lg border"
        style={{ 
          backgroundColor: theme.modal.background,
          borderColor: theme.modal.headerBorder,
          color: theme.colors.textMuted
        }}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Header */}
        <div className="px-4 mobile-M:px-5 tablet:px-[50px] pt-4 tablet:pt-6 pb-3 relative">
          <h2
            className="font-alexandria text-[24px] font-semibold text-center w-full"
            style={{ color: theme.colors.text }}
          >
            {t.jobs.jobPostModal.editTitle}
          </h2>
          <button
            onClick={() => { setPage(1); onClose(); }}
            aria-label="Close"
            className="text-2xl leading-none px-2 absolute right-4 mobile-M:right-5 tablet:right-[50px] top-4 tablet:top-6 transition-colors"
            style={{ color: theme.modal.buttonClose }}
            onMouseOver={(e) => e.currentTarget.style.color = theme.modal.buttonCloseHover}
            onMouseOut={(e) => e.currentTarget.style.color = theme.modal.buttonClose}
          >
            ×
          </button>
        </div>

        <div className="px-4 mobile-M:px-5 tablet:px-[50px] pb-4 tablet:pb-6 space-y-4 tablet:space-y-5">
          <div className={page === 1 ? '' : 'hidden'}>
          {/* Tags Section */}
          <div
            className="text-[14px] font-semibold mb-2"
            style={{ color: theme.colors.text }}
          >
            {t.jobs.jobPostModal.fields.tags}
          </div>
          <div 
            className={`rounded-xl border p-4 ${isRestricted ? 'opacity-60 pointer-events-none' : ''}`}
            style={{ borderColor: theme.modal.sectionBorder }}
          >
            {/* Selected Tags Summary */}
            <div className="mb-3">
              <div
                className="text-[14px] font-semibold mb-2"
                style={{ color: theme.colors.text }}
              >
                {t.jobs.jobPostModal.fields.selectedTags}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="rounded-lg border px-3 py-2 min-h-[34px] flex-1 flex flex-wrap gap-2 items-center"
                  style={{ borderColor: theme.modal.sectionBorder }}
                >
                  {selectedSubTypes.length === 0 && selectedExperience.length === 0 && selectedGenders.length === 0 ? (
                    <span
                      className="text-[12px]"
                      style={{ color: theme.colors.textMuted }}
                    >
                      {t.jobs.jobPostModal.fields.selectedTags}
                    </span>
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
                {(selectedSubTypes.length > 0 || selectedExperience.length > 0 || selectedGenders.length > 0) && (
                  <button
                    type="button"
                    aria-label="Clear selected tags"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors"
                    style={{ backgroundColor: theme.colors.error }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
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
              <div
                className="text-[14px] font-semibold mb-2"
                style={{ color: theme.colors.text }}
              >
                {t.jobs.jobPostModal.fields.jobType}
              </div>
              <JobTypeGrid
                options={jobTypeOptions}
                selected={effectiveJobTypes.slice(0, 1)}
                selectedSubTypes={selectedSubTypes}
                onToggleSubType={(sub) => { if (isRestricted) return; toggleSubType(sub); }}
                onToggle={(value) => {
                  if (isRestricted) return;
                  const isAlreadySelected = effectiveJobTypes[0] === value;
                  if (isAlreadySelected) {
                    setSelectedJobTypes([]);
                  } else {
                    setSelectedJobTypes([String(value)]);
                  }
                }}
              />
            </div>

             <div 
               className="border-t my-4"
               style={{ borderColor: theme.modal.sectionBorder }}
             />
             {/* Experience Level */}
             <div className="mb-3">
               <div
                 className="text-[14px] font-semibold mb-2"
                 style={{ color: theme.colors.text }}
               >
                 {t.jobs.jobPostModal.fields.experienceLevel}
               </div>
               <div className="flex flex-wrap gap-2">
                {experienceOptions.map((opt) => (
                  <ExperienceLevelTag
                    key={opt.value}
                    label={opt.label}
                    selected={selectedExperience.includes(opt.value)}
                    onClick={isRestricted ? undefined : () => handleExperienceSelect(String(opt.value))}
                  />
                ))}
               </div>
             </div>

             <div 
               className="border-t my-4"
               style={{ borderColor: theme.modal.sectionBorder }}
             />

             {/* Preferred Gender */}
             <div>
               <div
                 className="text-[14px] font-semibold mb-2"
                 style={{ color: theme.colors.text }}
               >
                 {t.jobs.jobPostModal.fields.gender}
               </div>
               <div className="flex flex-wrap gap-2">
                {genderOptions.map((opt) => (
                  <GenderTag
                    key={opt.value}
                    label={opt.label}
                    selected={selectedGenders.includes(opt.value)}
                    onClick={isRestricted ? undefined : () => handleGenderSelect(String(opt.value))}
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
              label={t.jobs.jobPostModal.fields.jobTitle}
              placeholder={t.jobs.jobPostModal.fields.jobTitlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              helperText={`${title.length}/50`}
              required
              hideRequiredAsterisk
              disabled={!!isRestricted}
            />
          </div>
          {/* Location */}
          <div>
            <div
              className="text-[14px] font-semibold mb-2"
              style={{ color: theme.colors.text }}
            >
              {t.jobs.jobPostModal.fields.location}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectBox 
            options={[{ value: "Philippines", label: "Philippines" }]} 
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Select country"
            required
          />
          <SelectBox 
            options={getProvinces().map((prov) => ({ value: prov, label: prov }))}
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            placeholder="Select province"
            required
          />
          <SelectBox 
            options={getCitiesByProvince(province).map((city_name) => ({ value: city_name, label: city_name }))}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Select city or municipality"
            required
          />
            </div>
            <div className="mt-3">
              <TextBox
                placeholder={t.jobs.jobPostModal.fields.addressPlaceholder}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                maxLength={50}
                helperText={`${address.length}/50`}
              />
            </div>
          </div>

          {/* Salary Rate */}
          <div>
            <div
              className="text-[14px] font-semibold mb-2"
              style={{ color: theme.colors.text }}
            >
              {t.jobs.jobPostModal.fields.salary}
            </div>
            <div className="flex items-center gap-3">
              
          <TextBox 
            type="text" 
            placeholder="Enter amount" 
            value={salary}
                onChange={(e) => {
                  let v = e.target.value.replace(/[^0-9.]/g, '');
                  const firstDot = v.indexOf('.');
                  if (firstDot !== -1) {
                    // Keep only the first dot
                    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
                  }
                  const [intPartRaw, decPartRaw = ''] = v.split('.');
                  const intPart = (intPartRaw || '').slice(0, 6);
                  const decPart = (decPartRaw || '').slice(0, 2);
                  if (v === '.') {
                    v = '0.'; // allow starting with a decimal point
                  } else if (firstDot !== -1) {
                    v = decPart.length ? `${intPart}.${decPart}` : `${intPart}.`;
                  } else {
                    v = intPart;
                  }
                  setSalary(v);
                }}
            leftIcon={<img src="/icons/PHP.svg" alt="PHP" className="w-4 h-4" />}
            className="flex-1"
            min={0}
            inputMode="decimal"
                pattern="^\\d{0,6}(\\.\\d{0,2})?$"
                disabled={!!isRestricted}
                required
              />
              <SelectBox
                width="180px"
                options={SALARY_TYPE}
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value)}
                disabled={!!isRestricted}
                required
              />
            </div>
          </div>

          {/* About this role */}
          <div>
            <div
              className="text-[14px] font-semibold mb-2"
              style={{ color: theme.colors.text }}
            >
              {t.jobs.jobPostModal.fields.about}
            </div>
            <TextArea
              placeholder={t.jobs.jobPostModal.fields.aboutPlaceholder}
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
            <div
              className="text-[14px] font-semibold mb-2"
              style={{ color: theme.colors.text }}
            >
              {t.jobs.jobPostModal.fields.requirements}
            </div>
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
                      required={idx === 0}
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
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors"
                        style={{ backgroundColor: theme.colors.error }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
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
          <div 
            className="w-full h-2 rounded-full"
            style={{ backgroundColor: theme.colors.borderLight }}
          >
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${page === 1 ? 50 : 100}%`,
                backgroundColor: theme.colors.primary
              }}
            />
          </div>
          <div 
            className="mt-1 text-right text-mini"
            style={{ color: theme.colors.textMuted }}
          >
            {page === 1 ? `${t.jobs.jobPostModal.buttons.step} 1 ${t.jobs.jobPostModal.buttons.of} 2` : `${t.jobs.jobPostModal.buttons.step} 2 ${t.jobs.jobPostModal.buttons.of} 2`}
          </div>
        </div>
        <div className="pt-2 flex items-center justify-between">
          {page === 2 && (
            <Button
              variant="ghost"
              fullRounded={true}
              className="w-[140px]"
              style={{
                border: `2px solid ${theme.colors.primary}`,
                color: theme.colors.primary
              }}
              onClick={() => setPage(1)}
            >
              {t.jobs.jobPostModal.buttons.previous}
            </Button>
          )}
          {page === 1 && (
            <Button
              variant="primary"
              fullRounded={true}
              className="ml-auto w-[140px]"
              onClick={() => setPage(2)}
            >
              {t.jobs.jobPostModal.buttons.next}
            </Button>
          )}
          {page === 2 && (
            <Button
              variant="primary"
              fullRounded={true}
              className="ml-auto w-[140px] disabled:opacity-50"
              disabled={!isFormValid}
              onClick={handleSubmit}
            >
              {t.jobs.jobPostModal.buttons.saveChanges}
            </Button>
          )}
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}
