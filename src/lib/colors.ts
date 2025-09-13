// lib/colors.ts
// Define individual color types
interface BlueShades {
  default: string;
  hover: string;
}

interface RedShades {
  default: string;
  hover: string;
}

interface GrayShades {
  default: string;
  hover: string;
  border: string;
}

// Define the main COLORS object with proper typing
export const COLORS = {
  blue: {
    default: '#59ACFF',
    hover: '#3289FF',
  } as BlueShades,
  blueDark: {
    default: '#3289FF',
    hover: '#1C6AF4',
  } as BlueShades,
  red: {
    default: '#ED4A4A',
    hover: '#DA2727',
  } as RedShades,
  gray: {
    default: '#e6e7e7',
    hover: '#858b8a',
    border: '#3B3E3E',
  } as GrayShades,
  white: '#ffffff',
  black: '#000000',
};

// Type definitions
export type ColorName = keyof typeof COLORS;
export type BlueShade = keyof BlueShades;
export type RedShade = keyof RedShades;
export type GrayShade = keyof GrayShades;

// Helper function to convert hex to RGBA
const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Color getter functions
export const getBlueColor = (shade: BlueShade = 'default', opacity: number = 1): string => {
  const color = COLORS.blue[shade];
  return opacity >= 1 ? color : hexToRgba(color, opacity);
};

export const getBlueDarkColor = (shade: BlueShade = 'default', opacity: number = 1): string => {
  const color = COLORS.blueDark[shade];
  return opacity >= 1 ? color : hexToRgba(color, opacity);
};

export const getRedColor = (shade: RedShade = 'default', opacity: number = 1): string => {
  const color = COLORS.red[shade];
  return opacity >= 1 ? color : hexToRgba(color, opacity);
};

export const getGrayColor = (shade: GrayShade = 'default', opacity: number = 1): string => {
  const color = COLORS.gray[shade];
  return opacity >= 1 ? color : hexToRgba(color, opacity);
};

export const getWhiteColor = (opacity: number = 1): string => {
  return opacity >= 1 ? COLORS.white : hexToRgba(COLORS.white, opacity);
};

export const getBlackColor = (opacity: number = 1): string => {
  return opacity >= 1 ? COLORS.black : hexToRgba(COLORS.black, opacity);
};
