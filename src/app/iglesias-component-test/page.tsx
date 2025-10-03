"use client";

import React, { useState, useEffect } from 'react';
import TextBox from '@/components/ui/TextBox';
import Checkbox from '@/components/ui/Checkbox';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
import StarRating from '@/components/ui/StarRating';
import SearchBar from '@/components/ui/SearchBar';

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
