"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { CgSortAz, CgSortZa } from "react-icons/cg";
import { useTheme } from '@/hooks/useTheme';

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
  defaultToFirst?: boolean;
};

function CaretIcon({ className = '', isOpen = false, style }: { className?: string; isOpen?: boolean; style?: React.CSSProperties }) {
  return isOpen ? (
    <IoIosArrowUp className={className} style={style} />
  ) : (
    <IoIosArrowDown className={className} style={style} />
  );
}

function SortIcon({ flipped = false, className = '', style }: { flipped?: boolean; className?: string; style?: React.CSSProperties }) {
  return flipped ? (
    <CgSortZa className={className} style={style} />
  ) : (
    <CgSortAz className={className} style={style} />
  );
}

export const IconSortAsc = (props: { className?: string }) => <CgSortAz className={props.className} />;
export const IconSortDesc = (props: { className?: string }) => <CgSortZa className={props.className} />;

const Dropdown = memo(function Dropdown({ 
  options, 
  value = null, 
  onChange, 
  placeholder = 'Sort', 
  className = '', 
  fullWidth = false, 
  renderOption, 
  defaultToFirst = true 
}: Props) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption | null>(() => {
    if (value != null) {
      return options.find((o) => o.value === value || o.id === String(value)) ?? null;
    }
    return defaultToFirst && options.length > 0 ? options[0] : null;
  });
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined);
  const hasInitializedRef = useRef(false);

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
  }, [open, selected?.id, options]); 

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

  // Handle value changes and defaultToFirst logic
  useEffect(() => {
    if (value != null) {
      const found = options.find((o) => o.value === value || o.id === String(value)) ?? null;
      if (found?.id !== selected?.id) {
        setSelected(found);
      }
      return;
    }
    if (defaultToFirst && options.length > 0) {
      if (options[0].id !== selected?.id) {
        setSelected(options[0]);
      }
    } else if (selected !== null) {
      setSelected(null);
    }
  }, [value, options, defaultToFirst, selected?.id]);

  // Only call onChange once on initial mount if defaultToFirst is true
  useEffect(() => {
    if (!hasInitializedRef.current && value == null && defaultToFirst && options.length > 0 && selected) {
      hasInitializedRef.current = true;
      onChange?.(selected);
    }
  }, []);

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
      listRef.current?.focus();
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
  }, [options.length, activeIndex, handleSelect, options]);

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
        className={`flex items-center justify-start ${fullWidth ? 'w-full' : 'w-auto'} px-1.5 mobile-M:px-2 py-1.5 mobile-M:py-2 shadow rounded-md text-body font-medium border transition-all duration-300`}
        style={{
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          borderColor: open ? theme.colors.border : theme.colors.borderLight,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.surface;
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = theme.colors.border;
        }}
        onBlur={(e) => {
          if (!open) {
            e.currentTarget.style.borderColor = theme.colors.borderLight;
          }
        }}
      >
        <div className="flex items-center gap-1 mobile-M:gap-2 truncate">
          {selected ? (
            <>
              {selected.icon && (
                <span 
                  className="w-4 h-4 mobile-M:w-5 mobile-M:h-5 flex-shrink-0 transition-colors duration-300"
                  style={{ color: theme.colors.textMuted }}
                >
                  {selected.icon}
                </span>
              )}
              <span 
                className="truncate text-tiny mobile-M:text-small font-inter transition-colors duration-300"
                style={{ color: theme.colors.text }}
              >
                {selected.label}
              </span>
              {selected.id.includes('salary') && (
                <SortIcon 
                  flipped={selected.id.includes('desc')} 
                  className="w-4 h-4 mobile-M:w-5 mobile-M:h-5 transition-colors duration-300" 
                  style={{ color: theme.colors.textMuted }}
                />
              )}
            </>
          ) : (
            <span 
              className="truncate text-tiny mobile-M:text-small font-inter transition-colors duration-300"
              style={{ color: theme.colors.textMuted }}
            >
              {placeholder}
            </span>
          )}
        </div>
        <span className="ml-1 mobile-M:ml-2">
          <CaretIcon 
            className="w-2.5 h-2.5 mobile-M:w-3 mobile-M:h-3 transition-colors duration-300" 
            isOpen={open}
            style={{ color: theme.colors.textMuted }}
          />
        </span>
      </button>

      {open && (
        <div
          ref={listRef}
          tabIndex={0}
          onKeyDown={onListKeyDown}
          onMouseLeave={() => {
            if (selected) {
              const selectedIndex = options.findIndex(opt => opt.id === selected.id);
              setActiveIndex(selectedIndex >= 0 ? selectedIndex : -1);
            } else {
              setActiveIndex(-1);
            }
          }}
          role="menu"
          aria-orientation="vertical"
          style={triggerWidth && !fullWidth ? { 
            minWidth: `${triggerWidth}px`,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderLight,
          } : {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderLight,
          }}
          className={`absolute mt-2 ${fullWidth ? 'left-0 right-0' : ''} ${fullWidth ? 'w-full' : ''} shadow-lg rounded-lg z-50 focus:outline-none border transition-colors duration-300`}
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
                  className={`flex items-center gap-2 px-3 py-1 text-tiny font-medium font-inter text-left w-full transition-colors duration-300`}
                  style={{
                    backgroundColor: isActive 
                      ? theme.colors.surfaceHover
                      : isSelected 
                        ? theme.colors.pastelBgLight
                        : 'transparent',
                    color: theme.colors.text,
                    fontWeight: isSelected ? 600 : 500,
                  }}
                >
                  {renderOption ? (
                    <div className="w-full">
                      {renderOption(opt, isSelected)}
                    </div>
                  ) : (
                    <>
                      {opt.icon ? (
                        <span 
                          className="w-5 h-5 flex-shrink-0 transition-colors duration-300"
                          style={{ color: theme.colors.textMuted }}
                        >
                          {opt.icon}
                        </span>
                      ) : null}
                      <span className="flex-1 text-small font-inter">{opt.label}</span>
                      {opt.id.includes('salary') && (
                        <SortIcon 
                          flipped={opt.id.includes('desc')} 
                          className="w-6 h-6 transition-colors duration-300"
                          style={{ color: theme.colors.textMuted }}
                        />
                      )}
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