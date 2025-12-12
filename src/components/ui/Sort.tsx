'use client';

import React from 'react';
import Dropdown, { DropdownOption } from './Dropdown';
import { useLanguage } from '@/hooks/useLanguage';

export type SortVariant = 'findJobs' | 'manageJobs';

export interface SortProps {
  variant: SortVariant;
  onChange?: (option: DropdownOption) => void;
  value?: string | number | null; // Added value prop
  className?: string;
  fullWidth?: boolean;
  defaultToFirst?: boolean;
}

export default function Sort({
  variant,
  onChange,
  value = null, // Added value prop
  className = '',
  fullWidth = false,
  defaultToFirst = true
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
    ] as DropdownOption[]
  };

  const options = sortOptions[variant];

  return (
    <Dropdown
      options={options}
      placeholder={t.components.sort.sortBy}
      onChange={onChange}
      value={value} // Pass the value prop to Dropdown
      className={className}
      fullWidth={fullWidth}
      defaultToFirst={defaultToFirst}
    />
  );
}