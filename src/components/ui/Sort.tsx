'use client';

import React from 'react';
import Dropdown, { DropdownOption } from './Dropdown';

export type SortVariant = 'findJobs' | 'manageJobs';

export interface SortProps {
  variant: SortVariant;
  onChange?: (option: DropdownOption) => void;
  className?: string;
  fullWidth?: boolean;
  defaultToFirst?: boolean;
}

// Sort options for different variants
const sortOptions = {
  findJobs: [
    { id: 'latest', label: 'Latest', value: 'latest' },
    { id: 'oldest', label: 'Oldest', value: 'oldest' },
    { id: 'salary-asc', label: 'Salary', value: 'salary-asc' },
    { id: 'salary-desc', label: 'Salary', value: 'salary-desc' },
  ] as DropdownOption[],
  
  manageJobs: [
    { id: 'latest', label: 'Latest', value: 'latest' },
    { id: 'oldest', label: 'Oldest', value: 'oldest' },
  ] as DropdownOption[]
};

export default function Sort({ 
  variant, 
  onChange, 
  className = '', 
  fullWidth = false,
  defaultToFirst = true 
}: SortProps) {
  const options = sortOptions[variant];

  return (
    <Dropdown
      options={options}
      placeholder="Sort"
      onChange={onChange}
      className={className}
      fullWidth={fullWidth}
      defaultToFirst={defaultToFirst}
    />
  );
}