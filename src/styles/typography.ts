export const TYPOGRAPHY_CLASSES = {
  hero: 'text-hero font-alexandria font-bold leading-[1.2]',
  h1: 'text-h1 font-alexandria font-bold leading-[1.3]',
  h2: 'text-h2 font-alexandria font-semibold leading-[1.4]',
  h3: 'text-h3 font-alexandria font-semibold leading-[1.4]',
  lead: 'text-lead font-inter font-normal leading-[1.5]',
  body: 'text-body font-inter font-normal leading-[1.6]',
  small: 'text-small font-inter font-normal leading-[1.4]',
};
export const TYPOGRAPHY = { 
    hero: { fontSize: '50px', fontFamily: 'var(--font-alexandria)', fontWeight: '700', lineHeight: '1.2', }, 
    h1: { fontSize: '40px', fontFamily: 'var(--font-alexandria)', fontWeight: '700', lineHeight: '1.3', }, 
    h2: { fontSize: '32px', fontFamily: 'var(--font-alexandria)', fontWeight: '600', lineHeight: '1.4', }, 
    h3: { fontSize: '26px', fontFamily: 'var(--font-alexandria)', fontWeight: '600', lineHeight: '1.4', }, 
    lead: { fontSize: '20px', fontFamily: 'var(--font-inter)', fontWeight: '400', lineHeight: '1.5', }, 
    body: { fontSize: '16px', fontFamily: 'var(--font-inter)', fontWeight: '400', lineHeight: '1.6', }, 
    small: { fontSize: '13px', fontFamily: 'var(--font-inter)', fontWeight: '400', lineHeight: '1.4', }, };

// Helper to apply typography styles
export const getTypographyStyle = (variant: keyof typeof TYPOGRAPHY) => {
  return TYPOGRAPHY[variant];
};

// Helper to get Tailwind classes
export const getTypographyClass = (variant: keyof typeof TYPOGRAPHY_CLASSES) => {
  return TYPOGRAPHY_CLASSES[variant];
};
