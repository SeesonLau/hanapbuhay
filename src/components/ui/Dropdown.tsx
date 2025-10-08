"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { CgSortAz, CgSortZa } from "react-icons/cg";

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
  fullWidth?: boolean;
  renderOption?: (opt: DropdownOption, isSelected: boolean) => React.ReactNode;
};

function CaretIcon({ className = '', isOpen = false }: { className?: string; isOpen?: boolean }) {
  return isOpen ? (
    <IoIosArrowUp className={className} />
  ) : (
    <IoIosArrowDown className={className} />
  );
}

function SortIcon({ flipped = false, className = '' }: { flipped?: boolean; className?: string }) {
  return flipped ? (
    <CgSortZa className={className} />
  ) : (
    <CgSortAz className={className} />
  );
}

export const IconSortAsc = (props: { className?: string }) => <CgSortAz className={props.className} />;
export const IconSortDesc = (props: { className?: string }) => <CgSortZa className={props.className} />;

const Dropdown = memo(function Dropdown({ options, value = null, onChange, placeholder = 'Sort', className = '', fullWidth = false, renderOption, }: Props) {
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

  useEffect(() => {
    if (open) {
      if (selected) {
        const idx = options.findIndex((o) => o.id === selected.id);
        setActiveIndex(idx >= 0 ? idx : 0);
      } else {
        setActiveIndex(0);
      }
    } else {
      setActiveIndex(-1);
    }
  }, [open, selected?.id]); 

  useEffect(() => {
    function measure() {
      const w = triggerRef.current?.offsetWidth;
      if (typeof w === 'number') setTriggerWidth(w);
    }

    measure();

    const RO = (window as any).ResizeObserver;
    if (triggerRef.current && RO) {
      const ro = new RO(() => measure());
      ro.observe(triggerRef.current);
      return () => ro.disconnect();
    }

    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [fullWidth]); 

  useEffect(() => {
    if (value == null) {
      setSelected(null);
      return;
    }
    const found = options.find((o) => o.value === value || o.id === String(value)) ?? null;
    setSelected(found);
  }, [value, options]);

  const handleSelect = useCallback((opt: DropdownOption) => {
    setSelected(opt);
    setOpen(false);
    onChange?.(opt);
    triggerRef.current?.focus();
  }, [onChange]);

  const onTriggerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      setTimeout(() => {
        listRef.current?.focus();
      }, 0);
    }
  }, []);

  const onListKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [options.length, activeIndex, handleSelect]);

  const toggleOpen = useCallback(() => setOpen((s) => !s), []);

  return (
    <div ref={rootRef} className={`relative inline-block text-left ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={toggleOpen}
        onKeyDown={onTriggerKeyDown}
        className={`flex items-center justify-between ${fullWidth ? 'w-full' : 'w-auto'} px-3 py-2 bg-white hover:bg-gray-neutral50 shadow rounded-md text-body font-medium text-gray-neutral900 border border-gray-neutral200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
      >
        <span className="truncate text-small font-inter">{selected ? selected.label : placeholder}</span>
        <span className="ml-4">
          <CaretIcon className="w-3 h-3 text-gray-neutral600 transition-colors duration-150" isOpen={open} />
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
          className={`absolute mt-2 ${fullWidth ? 'left-0 right-0' : ''} ${fullWidth ? 'w-full' : ''} bg-white shadow-lg rounded-lg z-50 focus:outline-none border border-gray-neutral200`}
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
                  className={`flex items-center gap-3 px-3 py-2 text-small font-medium font-inter text-gray-neutral900 hover:bg-gray-neutral50 hover:text-primary-600 text-left w-full transition-colors duration-150 ${isSelected ? 'bg-primary-50 text-primary-700' : ''} ${isActive ? 'ring-2 ring-primary-300' : ''}`}
                >
                  {renderOption ? (
                    <div className="w-full">
                      {renderOption(opt, isSelected)}
                    </div>
                  ) : (
                    <>
                      {opt.icon ? <span className="w-5 h-5 flex-shrink-0 text-gray-neutral600">{opt.icon}</span> : null}
                      <span className="flex-1 text-small font-inter">{opt.label}</span>
                      {opt.id.includes('salary') && <SortIcon flipped={opt.id.includes('desc')} className="w-6 h-6 text-gray-neutral600" />}
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
});

export default Dropdown;
