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
  neutral300: string;
  neutral400: string;
  neutral600: string;
  neutral100: string;
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
    neutral100: '#F5F5F5', // For SeePreviousNotificationsButton default
    neutral300: '#AEB2B1', // Text color for SeePreviousNotificationsButton
    neutral400: '#858B8A', // For VisitProfileButton default
    neutral600: '#5A605F', // For VisitProfileButton hover
  } as GrayShades,
  white: '#ffffff',
  black: '#000000',
  primary500: '#3289FF', // For LoginButton and SignUpButton
  primary700: '#1453E1', // For SignUpButton hover
};

// Type definitions
export type ColorName = keyof typeof COLORS;
export type BlueShade = keyof BlueShades;
export type RedShade = keyof RedShades;
export type GrayShade = keyof GrayShades;

// Helper function to convert hex to RGBA
const hexToRgba = (hex: string, opacity: number): string => {
  // Handle shorthand hex notation (#RGB)
  let hexValue = hex;
  if (hex.length === 4) {
    hexValue = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  
  const r = parseInt(hexValue.slice(1, 3), 16);
  const g = parseInt(hexValue.slice(3, 5), 16);
  const b = parseInt(hexValue.slice(5, 7), 16);
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

// Additional getter functions for specific colors
export const getPrimary500Color = (opacity: number = 1): string => {
  return opacity >= 1 ? COLORS.primary500 : hexToRgba(COLORS.primary500, opacity);
};

export const getPrimary700Color = (opacity: number = 1): string => {
  return opacity >= 1 ? COLORS.primary700 : hexToRgba(COLORS.primary700, opacity);
};

export const getNeutral100Color = (opacity: number = 1): string => {
  return opacity >= 1 ? COLORS.gray.neutral100 : hexToRgba(COLORS.gray.neutral100, opacity);
};

export const getNeutral300Color = (opacity: number = 1): string => {
  return opacity >= 1 ? COLORS.gray.neutral300 : hexToRgba(COLORS.gray.neutral300, opacity);
};

export const getNeutral400Color = (opacity: number = 1): string => {
  return opacity >= 1 ? COLORS.gray.neutral400 : hexToRgba(COLORS.gray.neutral400, opacity);
};

export const getNeutral600Color = (opacity: number = 1): string => {
  return opacity >= 1 ? COLORS.gray.neutral600 : hexToRgba(COLORS.gray.neutral600, opacity);
};
