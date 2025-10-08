"use client";

import React, { useState, useEffect } from 'react';
import TextBox from '@/components/ui/TextBox';
import Checkbox from '@/components/ui/Checkbox';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
import StarRating from '@/components/ui/StarRating';
import SearchBar from '@/components/ui/SearchBar';
import AppliedJobCard, { AppliedJob } from '@/components/applications/cards/AppliedJobCard';
import Button from '@/components/ui/Button';

// Simple mock API to simulate username availability check
const mockCheckUsername = (username: string) => {
  return new Promise<{ available: boolean }>((resolve) => {
    // simulate network latency
    setTimeout(() => {
      // treat usernames shorter than 3 chars or equal to 'taken' as unavailable
      if (!username || username.length < 3 || username.toLowerCase() === 'taken') {
        resolve({ available: false });
      } else {
        resolve({ available: true });
      }
    }, 900);
  });
};

export default function TextBoxPlayground() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  // Debounce user input before checking availability
  useEffect(() => {
    if (!username) {
      setAvailable(null);
      setLoading(false);
      setError(undefined);
      return;
    }

    setLoading(true);
    setAvailable(null);
    setError(undefined);

    const id = setTimeout(() => {
      mockCheckUsername(username)
        .then((res) => {
          setAvailable(res.available);
          setLoading(false);
        })
        .catch(() => {
          setError('Unable to check username');
          setLoading(false);
        });
    }, 450);

    return () => clearTimeout(id);
  }, [username]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">TextBox Component Playground</h1>

        <section className="space-y-3">
          <h2 className="font-semibold">Dropdown demo (Sort)</h2>
          <Dropdown
            options={[
              { id: 'latest', label: 'Latest', value: 'latest' },
              { id: 'oldest', label: 'Oldest', value: 'oldest' },
              { id: 'salary-asc', label: 'Salary (asc)', value: 'salary-asc' },
              { id: 'salary-desc', label: 'Salary (desc)', value: 'salary-desc' },
              { id: 'nearby', label: 'Nearby', value: 'nearby' },
            ] as DropdownOption[]}
            placeholder="Sort"
            onChange={(o) => console.log('dropdown select', o)}
          />

          <div className="mt-4">
            <h3 className="text-sm font-medium">With icons (text + icon)</h3>
            <Dropdown
              options={[
                { id: 'latest', label: 'Latest', value: 'latest'},
                { id: 'oldest', label: 'Oldest', value: 'oldest'},
                { id: 'salary-asc', label: 'Salary (asc)', value: 'salary-asc', },
                { id: 'salary-desc', label: 'Salary (desc)', value: 'salary-desc', },
                { id: 'nearby', label: 'Nearby', value: 'nearby',  },
              ] as DropdownOption[]}
              placeholder="Sort"
              onChange={(o) => console.log('dropdown icon select', o)}
            />
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium">Full width (responsive)</h3>
            <div className="w-full max-w-md">
              <Dropdown
                fullWidth
                options={[
                  { id: 'latest', label: 'Latest', value: 'latest' },
                  { id: 'oldest', label: 'Oldest', value: 'oldest' },
                  { id: 'nearby', label: 'Nearby', value: 'nearby' },
                ] as DropdownOption[]}
                placeholder="Sort"
                onChange={(o) => console.log('dropdown fullwidth select', o)}
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">SearchBar Component Demo</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Simple variant</h3>
              <SearchBar 
                variant="simple"
                onSearch={(query) => console.log('Simple search:', query)}
                placeholder="Search"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Advanced variant (with location)</h3>
              <SearchBar 
                variant="advanced"
                onSearch={(query, location) => console.log('Advanced search:', { query, location })}
                placeholder="Job title or keyword"
                locationPlaceholder="Location"
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Async username availability</h2>
          <TextBox
            label="Username"
            placeholder="Type a username"
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            showLoadingIcon={loading}
            showSuccessIcon={available === true}
            error={available === false ? 'Username is taken or too short' : undefined}
            helperText={available === true ? 'Username looks good!' : undefined}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Password field</h2>
          <TextBox
            label="Password"
            placeholder="Enter a password"
            type="password"
            minPasswordLength={8}
            helperText="Min 8 characters"
            iconSize="md"
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Email validation</h2>
          <TextBox
            label="Email"
            placeholder="user@example.com"
            type="email"
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Misc examples</h2>
          <TextBox label="Phone" placeholder="+1 555 555 555" type="tel" />
          <TextBox label="Number" placeholder="42" type="number" />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Checkbox examples</h2>
          <Checkbox label="Welder" defaultChecked />
          <Checkbox label="Carpenter" />
          <Checkbox label="Disabled (Plumber)" disabled />
          {/* Controlled example */}
          <ControlledCheckboxDemo />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Star rating (display)</h2>
          <div>
            <StarRating variant="display" value={4.2} max={5} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Star rating (interactive)</h2>
          <InteractiveRatingDemo />
        </section>

        <section className="space-y-6">
          <h2 className="font-semibold">Applied Job Card Components</h2>
          <AppliedJobCardDemo />
        </section>
      </div>
    </div>
  );
}

function ControlledCheckboxDemo() {
  const [checked, setChecked] = React.useState(false);

  return (
    <div className="space-y-2">
      <Checkbox label={checked ? 'Selected: Electrician' : 'Electrician'} checked={checked} onChange={(c) => setChecked(c)} />
      <button
        type="button"
        onClick={() => setChecked((s) => !s)}
        className="inline-block mt-1 text-sm text-blue-600 underline"
      >
        Toggle from parent
      </button>
    </div>
  );
}

function InteractiveRatingDemo() {
  const [rating, setRating] = useState<number>(0)

  return (
    <div className="space-y-2">
      <StarRating variant="rating" value={rating} onChange={setRating} />
      <div className="text-sm text-gray-600">Selected: {rating} / 5</div>
    </div>
  )
}

function AppliedJobCardDemo() {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [jobs, setJobs] = useState<AppliedJob[]>([
    {
      id: '1',
      title: 'Wanted! Caretaker for my lolo',
      description: "We're looking for someone caring and patient to help take care of a bedridden loved one at home. We want someone who can treat our family member with kindness and respect.",
      location: 'Basak, Cebu City',
      salary: 12000,
      salaryType: 'monthly',
      appliedOn: 'August 27, 2025',
      status: 'pending',
      tags: ['Caretaker', 'Entry level', 'Female'],
      genderPreference: 'Female'
    },
    {
      id: '2',
      title: 'LF: Plumber! NOW!',
      description: "When the sink clogs or a faucet leaks, it can really disrupt the whole household. We're looking for someone reliable who can help us fix these small but important problems.",
      location: 'Banilad, Cebu City',
      salary: 5000,
      salaryType: 'fixed',
      appliedOn: 'August 27, 2025',
      status: 'approved',
      tags: ['Plumber', 'Expert', 'Male']
    },
    {
      id: '3',
      title: 'Need a Driver ASAP',
      description: "Looking for a reliable driver with a clean driving record. Must be available for flexible hours and comfortable with city driving.",
      location: 'Banawa, Cebu City',
      salary: 15000,
      salaryType: 'monthly',
      appliedOn: 'August 27, 2025',
      status: 'rejected',
      tags: ['Driver', 'Entry level', 'Male']
    }
  ]);

  const handleDeleteJob = (jobId: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    console.log('Deleted job:', jobId);
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-300">
        <Button
          variant={viewMode === 'card' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('card')}
        >
          Card View
        </Button>
        <Button
          variant={viewMode === 'list' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          List View
        </Button>
      </div>

      {/* Status Examples */}
      <div>
        <h3 className="text-sm font-medium mb-3">Different Status Examples</h3>
        <div className={`
          ${viewMode === 'card' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'flex flex-col gap-3'
          }
        `}>
          {jobs.map((job) => (
            <AppliedJobCard
              key={job.id}
              job={job}
              variant={viewMode}
              onDelete={handleDeleteJob}
              className={viewMode === 'card' ? 'max-w-sm' : ''}
            />
          ))}
        </div>
      </div>

      {/* Single Card Examples */}
      <div>
        <h3 className="text-sm font-medium mb-3">Individual Examples</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Pending Status (Card)</h4>
            <AppliedJobCard
              job={jobs[0]}
              variant="card"
              onDelete={handleDeleteJob}
              className="max-w-sm"
            />
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Approved Status (List)</h4>
            <AppliedJobCard
              job={jobs[1]}
              variant="list"
              onDelete={handleDeleteJob}
            />
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Rejected Status (Card)</h4>
            <AppliedJobCard
              job={jobs[2]}
              variant="card"
              onDelete={handleDeleteJob}
              className="max-w-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
