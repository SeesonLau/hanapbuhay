"use client";

import React, { useEffect, useRef, useState } from 'react';

export type DropdownOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  value?: string | number;
};

type Props = {
  options: DropdownOption[];
  value?: string | number | null;
  onChange?: (option: DropdownOption) => void;
  placeholder?: string;
  className?: string;
  // whether the dropdown should expand to the full width of its container
  fullWidth?: boolean;
  // optional custom renderer for each option (useful for complex layouts)
  renderOption?: (opt: DropdownOption, isSelected: boolean) => React.ReactNode;
};

function CaretIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SortIcon({ flipped = false, className = '' }: { flipped?: boolean; className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform={flipped ? 'scale(1,-1) translate(0,-24)' : undefined} />
    </svg>
  );
}

// named exports for compatibility
export const IconSortAsc = (props: { className?: string }) => <SortIcon flipped={false} className={props.className} />;
export const IconSortDesc = (props: { className?: string }) => <SortIcon flipped={true} className={props.className} />;

export default function Dropdown({ options, value = null, onChange, placeholder = 'Sort', className = '', fullWidth = false, renderOption, }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption | null>(() => {
    if (value == null) return null;
    return options.find((o) => o.value === value || o.id === String(value)) ?? null;
  });
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // reset active index when opening
  useEffect(() => {
    if (open) {
      const idx = selected ? options.findIndex((o) => o.id === selected.id) : -1;
      setActiveIndex(idx >= 0 ? idx : 0);
    } else {
      setActiveIndex(-1);
    }
  }, [open, selected, options]);

  // measure trigger width so the menu can be at least as wide as the trigger
  useEffect(() => {
    function measure() {
      const w = triggerRef.current?.offsetWidth;
      if (typeof w === 'number') setTriggerWidth(w);
    }

    measure();

    // prefer ResizeObserver when available (handles font/zoom/layout changes)
    const RO = (window as any).ResizeObserver;
    if (triggerRef.current && RO) {
      const ro = new RO(() => measure());
      ro.observe(triggerRef.current);
      return () => ro.disconnect();
    }

    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [selected, open, options, fullWidth]);

  useEffect(() => {
    if (value == null) return;
    const found = options.find((o) => o.value === value || o.id === String(value)) ?? null;
    setSelected(found);
  }, [value, options]);

  function handleSelect(opt: DropdownOption) {
    setSelected(opt);
    setOpen(false);
    onChange?.(opt);
    // return focus to trigger
    triggerRef.current?.focus();
  }

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      // focus list
      setTimeout(() => {
        listRef.current?.focus();
      }, 0);
    }
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(options[activeIndex]);
    }
  }

  return (
    <div ref={rootRef} className={`relative inline-block text-left ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onTriggerKeyDown}
  className={`flex items-center justify-between ${fullWidth ? 'w-full' : 'w-auto'} px-3 py-2 bg-white shadow rounded-md text-sm font-medium text-black`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <span className="ml-2">
          <CaretIcon className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div
          ref={listRef}
          tabIndex={0}
          onKeyDown={onListKeyDown}
          role="menu"
          aria-orientation="vertical"
          style={triggerWidth && !fullWidth ? { minWidth: `${triggerWidth}px` } : undefined}
          className={`absolute mt-2 ${fullWidth ? 'left-0 right-0' : ''} ${fullWidth ? 'w-full' : ''} bg-white shadow-lg rounded-lg z-50 focus:outline-none`}
        >
          <div className="flex flex-col py-2">
            {options.map((opt, idx) => {
              const isSelected = selected?.id === opt.id;
              const isActive = activeIndex === idx;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="menuitem"
                  aria-current={isSelected || undefined}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 text-left w-full ${isSelected ? 'bg-gray-100' : ''} ${isActive ? 'ring-2 ring-indigo-300' : ''}`}
                >
                  {renderOption ? (
                    <div className="w-full">
                      {renderOption(opt, isSelected)}
                    </div>
                  ) : (
                    <>
                      {opt.icon ? <span className="w-5 h-5 flex-shrink-0">{opt.icon}</span> : null}
                      <span className="flex-1">{opt.label}</span>
                      {opt.id.includes('salary') && <SortIcon flipped={opt.id.includes('desc')} className="w-4 h-4 text-black" />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
