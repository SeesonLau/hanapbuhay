'use client';

import React from 'react';
import Dropdown, { DropdownOption } from './Dropdown';
import { useLanguage } from '@/hooks/useLanguage';

export type SortVariant = 'findJobs' | 'manageJobs' | 'applicants';

export interface SortProps {
  variant: SortVariant;
  onChange?: (option: DropdownOption) => void;
  className?: string;
  fullWidth?: boolean;
  defaultToFirst?: boolean;
  value?: string;
}

export default function Sort({
  variant,
  onChange,
  className = '',
  fullWidth = false,
  defaultToFirst = true,
  value
}: SortProps) {
  const { t } = useLanguage();

  // Sort options for different variants
  const sortOptions = {
    findJobs: [
      { id: 'latest', label: t.components.sort.newest, value: 'latest' },
      { id: 'oldest', label: t.components.sort.oldest, value: 'oldest' },
      { id: 'salary-asc', label: t.components.sort.salaryLow, value: 'salary-asc' },
      { id: 'salary-desc', label: t.components.sort.salaryHigh, value: 'salary-desc' },
    ] as DropdownOption[],

    manageJobs: [
      { id: 'latest', label: t.components.sort.newest, value: 'latest' },
      { id: 'oldest', label: t.components.sort.oldest, value: 'oldest' },
    ] as DropdownOption[],

    applicants: [
      { id: 'newest', label: t.components.sort.newest, value: 'newest' },
      { id: 'oldest', label: t.components.sort.oldest, value: 'oldest' },
    ] as DropdownOption[],
  };

  const options = sortOptions[variant];

  return (
    <Dropdown
      options={options}
      placeholder={t.components.sort.sortBy}
      onChange={onChange}
      className={className}
      fullWidth={fullWidth}
      defaultToFirst={defaultToFirst}
      value={value}
    />
  );
}