export const TYPOGRAPHY_CLASSES = {
  hero: 'text-hero font-alexandria font-bold leading-[1.2]',
  'hero-light': 'text-hero font-alexandria font-light leading-[1.2]',
  'hero-normal': 'text-hero font-alexandria font-normal leading-[1.2]',
  'hero-semibold': 'text-hero font-alexandria font-semibold leading-[1.2]',
  
  h1: 'text-h1 font-alexandria font-bold leading-[1.3]',
  'h1-light': 'text-h1 font-alexandria font-light leading-[1.3]',
  'h1-normal': 'text-h1 font-alexandria font-normal leading-[1.3]',
  'h1-semibold': 'text-h1 font-alexandria font-semibold leading-[1.3]',
  
  h2: 'text-h2 font-alexandria font-semibold leading-[1.4]',
  'h2-light': 'text-h2 font-alexandria font-light leading-[1.4]',
  'h2-normal': 'text-h2 font-alexandria font-normal leading-[1.4]',
  'h2-bold': 'text-h2 font-alexandria font-bold leading-[1.4]',
  
  h3: 'text-h3 font-alexandria font-semibold leading-[1.4]',
  'h3-light': 'text-h3 font-alexandria font-light leading-[1.4]',
  'h3-normal': 'text-h3 font-alexandria font-normal leading-[1.4]',
  'h3-bold': 'text-h3 font-alexandria font-bold leading-[1.4]',
  
  lead: 'text-lead font-inter font-normal leading-[1.5]',
  'lead-light': 'text-lead font-inter font-light leading-[1.5]',
  'lead-semibold': 'text-lead font-inter font-semibold leading-[1.5]',
  'lead-bold': 'text-lead font-inter font-bold leading-[1.5]',
  
  body: 'text-body font-inter font-normal leading-[1.6]',
  'body-light': 'text-body font-inter font-light leading-[1.6]',
  'body-semibold': 'text-body font-inter font-semibold leading-[1.6]',
  'body-bold': 'text-body font-inter font-bold leading-[1.6]',
  
  title: 'text-[30px] font-inter font-semibold leading-[1.2]',
  'title-light': 'text-[30px] font-inter font-light leading-[1.2]',
  'title-normal': 'text-[30px] font-inter font-normal leading-[1.2]',
  'title-bold': 'text-[30px] font-inter font-bold leading-[1.2]',
  
  description: 'text-lead font-alexandria font-light leading-[1.2]',
  'description-normal': 'text-lead font-alexandria font-normal leading-[1.2]',
  'description-semibold': 'text-lead font-alexandria font-semibold leading-[1.2]',
  'description-bold': 'text-lead font-alexandria font-bold leading-[1.2]',
  
  small: 'text-small font-inter font-normal leading-[1.4]',
  'small-light': 'text-small font-inter font-light leading-[1.4]',
  'small-semibold': 'text-small font-inter font-semibold leading-[1.4]',
  'small-bold': 'text-small font-inter font-bold leading-[1.4]',
};

export const TYPOGRAPHY = { 
    hero: { fontSize: '50px', fontFamily: 'var(--font-alexandria)', fontWeight: '700', lineHeight: '1.2', }, 
    h1: { fontSize: '40px', fontFamily: 'var(--font-alexandria)', fontWeight: '700', lineHeight: '1.3', }, 
    h2: { fontSize: '32px', fontFamily: 'var(--font-alexandria)', fontWeight: '600', lineHeight: '1.4', }, 
    h3: { fontSize: '26px', fontFamily: 'var(--font-alexandria)', fontWeight: '600', lineHeight: '1.4', }, 
    lead: { fontSize: '20px', fontFamily: 'var(--font-inter)', fontWeight: '400', lineHeight: '1.5', }, 
    title: { fontSize: '30px', fontFamily: 'var(--font-inter)', fontWeight: '600', lineHeight: '1.2' },
    description: { fontSize: '20px', fontFamily: 'var(--font-alexandria)', fontWeight: '300', lineHeight: '1.2' },
    body: { fontSize: '16px', fontFamily: 'var(--font-inter)', fontWeight: '400', lineHeight: '1.6', }, 
    small: { fontSize: '13px', fontFamily: 'var(--font-inter)', fontWeight: '400', lineHeight: '1.4', },
    tiny: { fontSize: '10px', fontFamily: 'var(--font-inter)', fontWeight: '400', lineHeight: '1.3', }, 
    popups: { fontSize: '18px', fontFamily: 'var(--font-inter)', fontWeight: '500', lineHeight: '22px', },
  };

// Font weight values for inline styles
export const FONT_WEIGHT_VALUES = {
  light: '300',
  normal: '400',
  medium: '500', 
  semibold: '600',
  bold: '700',
} as const;

// Base typography styles (without font weight)
const BASE_TYPOGRAPHY = {
  hero: { fontSize: '50px', fontFamily: 'var(--font-alexandria)', lineHeight: '1.2' },
  h1: { fontSize: '40px', fontFamily: 'var(--font-alexandria)', lineHeight: '1.3' },
  h2: { fontSize: '32px', fontFamily: 'var(--font-alexandria)', lineHeight: '1.4' },
  h3: { fontSize: '26px', fontFamily: 'var(--font-alexandria)', lineHeight: '1.4' },
  lead: { fontSize: '20px', fontFamily: 'var(--font-inter)', lineHeight: '1.5' },
  title: { fontSize: '30px', fontFamily: 'var(--font-inter)', lineHeight: '1.2' },
  description: { fontSize: '20px', fontFamily: 'var(--font-alexandria)', lineHeight: '1.2' },
  body: { fontSize: '16px', fontFamily: 'var(--font-inter)', lineHeight: '1.6' },
  small: { fontSize: '13px', fontFamily: 'var(--font-inter)', lineHeight: '1.4' },
  tiny: { fontSize: '10px', fontFamily: 'var(--font-inter)', lineHeight: '1.3' },
  popups: { fontSize: '18px', fontFamily: 'var(--font-inter)', lineHeight: '22px' },
} as const;

export type BaseTypographyStyleVariant = keyof typeof BASE_TYPOGRAPHY;

// Helper to apply typography styles with default font weight
export const getTypographyStyle = (variant: keyof typeof TYPOGRAPHY) => {
  return TYPOGRAPHY[variant];
};

// Enhanced helper to get typography style with customizable font weight
export const getTypographyStyleWithWeight = (
  variant: BaseTypographyStyleVariant,
  fontWeight: FontWeight = 'normal'
) => {
  const baseStyle = BASE_TYPOGRAPHY[variant];
  const weightValue = FONT_WEIGHT_VALUES[fontWeight];
  return {
    ...baseStyle,
    fontWeight: weightValue,
  };
};

// Helper to build custom typography style
export const buildTypographyStyle = (options: {
  variant: BaseTypographyStyleVariant;
  weight?: FontWeight;
  extraStyles?: React.CSSProperties;
}) => {
  const { variant, weight = 'normal', extraStyles = {} } = options;
  const baseStyle = BASE_TYPOGRAPHY[variant];
  const weightValue = FONT_WEIGHT_VALUES[weight];
  
  return {
    ...baseStyle,
    fontWeight: weightValue,
    ...extraStyles,
  };
};

// Font weight options
export const FONT_WEIGHTS = {
  light: 'font-light',
  normal: 'font-normal', 
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;

export type FontWeight = keyof typeof FONT_WEIGHTS;

// Base typography variants (without font weight)
const BASE_TYPOGRAPHY_CLASSES = {
  hero: 'text-hero font-alexandria leading-[1.2]',
  h1: 'text-h1 font-alexandria leading-[1.3]',
  h2: 'text-h2 font-alexandria leading-[1.4]',
  h3: 'text-h3 font-alexandria leading-[1.4]',
  lead: 'text-lead font-inter leading-[1.5]',
  body: 'text-body font-inter leading-[1.6]',
  title: 'text-[30px] font-inter leading-[1.2]',
  description: 'text-lead font-alexandria leading-[1.2]',
  small: 'text-small font-inter leading-[1.4]',
} as const;

export type BaseTypographyVariant = keyof typeof BASE_TYPOGRAPHY_CLASSES;

// Helper to get Tailwind classes with default font weight
export const getTypographyClass = (variant: keyof typeof TYPOGRAPHY_CLASSES) => {
  return TYPOGRAPHY_CLASSES[variant];
};

// Enhanced helper to get typography class with customizable font weight
export const getTypographyClassWithWeight = (
  variant: BaseTypographyVariant, 
  fontWeight: FontWeight = 'normal'
) => {
  const baseClass = BASE_TYPOGRAPHY_CLASSES[variant];
  const weightClass = FONT_WEIGHTS[fontWeight];
  return `${baseClass} ${weightClass}`;
};

// Helper to build custom typography class
export const buildTypographyClass = (options: {
  variant: BaseTypographyVariant;
  weight?: FontWeight;
  extraClasses?: string;
}) => {
  const { variant, weight = 'normal', extraClasses = '' } = options;
  const baseClass = BASE_TYPOGRAPHY_CLASSES[variant];
  const weightClass = FONT_WEIGHTS[weight];
  return `${baseClass} ${weightClass} ${extraClasses}`.trim();
};
