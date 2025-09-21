// Define interfaces for our color structure
interface ColorShades {
  default: string;
  hover: string;
}

interface GrayShades extends ColorShades {
  border: string;
  neutral100: string;
  neutral300: string;
  neutral400: string;
  neutral600: string;
}

// Define the main COLORS object
export const COLORS = {
  blue: {
    default: '#59ACFF',
    hover: '#3289FF',
  },
  blueDark: {
    default: '#3289FF',
    hover: '#1C6AF4',
  },
  red: {
    default: '#ED4A4A',
    hover: '#DA2727',
  },
  green: {
    default: '#6DCC4A', // Added green color
    hover: '#5AB536',   // Added a slightly darker shade for hover
  },
  yellow: {
    default: '#FFDE26', // Added yellow color
    hover: '#E5C522',   // Added a slightly darker shade for hover
  },
  gray: {
    default: '#e6e7e7',
    hover: '#858b8a',
    border: '#3B3E3E',
    neutral100: '#F5F5F5',
    neutral300: '#AEB2B1',
    neutral400: '#858B8A',
    neutral600: '#5A605F',
  },
  white: '#ffffff',
  black: '#000000',
  primary500: '#3289FF',
  primary700: '#1453E1',
};

// Type definitions for better type safety
export type ColorName = keyof typeof COLORS;
export type BlueShade = keyof typeof COLORS.blue;
export type RedShade = keyof typeof COLORS.red;
export type GreenShade = keyof typeof COLORS.green; // Added GreenShade
export type YellowShade = keyof typeof COLORS.yellow; // Added YellowShade
export type GrayShade = keyof typeof COLORS.gray;

// Helper function to convert hex to RGBA
const hexToRgba = (hex: string, opacity: number): string => {
  let hexValue = hex;
  if (hex.length === 4) {
    hexValue = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  
  const r = parseInt(hexValue.slice(1, 3), 16);
  const g = parseInt(hexValue.slice(3, 5), 16);
  const b = parseInt(hexValue.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Type-safe color getter function
export const getColor = (
  colorName: ColorName, 
  shade?: string, 
  opacity: number = 1
): string => {
  const colorObj = COLORS[colorName];
  
  // Handle string colors (white, black, primary500, primary700)
  if (typeof colorObj === 'string') {
    return opacity >= 1 ? colorObj : hexToRgba(colorObj, opacity);
  }
  
  // Handle object colors with shades
  const shadeKey = shade || 'default';
  const colorValue = (colorObj as Record<string, string>)[shadeKey];
  
  if (!colorValue) {
    console.warn(`Color shade "${shadeKey}" not found for color "${colorName}". Using default.`);
    const defaultValue = (colorObj as Record<string, string>).default;
    return opacity >= 1 ? defaultValue : hexToRgba(defaultValue, opacity);
  }
  
  return opacity >= 1 ? colorValue : hexToRgba(colorValue, opacity);
};

// Specific color getters for convenience with proper typing
export const getBlueColor = (shade: BlueShade = 'default', opacity: number = 1): string => 
  getColor('blue', shade, opacity);

export const getBlueDarkColor = (shade: BlueShade = 'default', opacity: number = 1): string => 
  getColor('blueDark', shade, opacity);

export const getRedColor = (shade: RedShade = 'default', opacity: number = 1): string => 
  getColor('red', shade, opacity);

export const getGreenColor = (shade: GreenShade = 'default', opacity: number = 1): string => // Added getGreenColor
  getColor('green', shade, opacity);

export const getYellowColor = (shade: YellowShade = 'default', opacity: number = 1): string => // Added getYellowColor
  getColor('yellow', shade, opacity);

export const getGrayColor = (shade: GrayShade = 'default', opacity: number = 1): string => 
  getColor('gray', shade, opacity);

export const getWhiteColor = (opacity: number = 1): string => 
  getColor('white', undefined, opacity);

export const getBlackColor = (opacity: number = 1): string => 
  getColor('black', undefined, opacity);

export const getPrimary500Color = (opacity: number = 1): string => 
  getColor('primary500', undefined, opacity);

export const getPrimary700Color = (opacity: number = 1): string => 
  getColor('primary700', undefined, opacity);

// Additional gray shade getters
export const getNeutral100Color = (opacity: number = 1): string => 
  getColor('gray', 'neutral100', opacity);

export const getNeutral300Color = (opacity: number = 1): string => 
  getColor('gray', 'neutral300', opacity);

export const getNeutral400Color = (opacity: number = 1): string => 
  getColor('gray', 'neutral400', opacity);

export const getNeutral600Color = (opacity: number = 1): string => 
  getColor('gray', 'neutral600', opacity);
