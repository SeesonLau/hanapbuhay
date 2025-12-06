export type ThemeName = 'classic' | 'spring' | 'summer' | 'autumn' | 'winter';

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    accent: string;
    accentHover: string;
    background: string;
    backgroundSecondary: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    // Pastel colors for sections/cards
    pastelBg: string;
    pastelBorder: string;
    pastelText: string;
  };
  gradients: {
    hero: string;
    card: string;
    button: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  classic: {
    name: 'classic',
    displayName: 'Classic',
    colors: {
      primary: '#59ACFF',
      primaryHover: '#3289FF',
      secondary: '#4A46FF',
      secondaryHover: '#3E2AD8',
      accent: '#8ECAFF',
      accentHover: '#59ACFF',
      background: '#E6E7E7',
      backgroundSecondary: '#CFD2D1',
      surface: '#FFFFFF',
      text: '#141515',
      textSecondary: '#3B3E3E',
      border: '#3B3E3E',
      success: '#46BB27',
      warning: '#EF8F11',
      error: '#ED4A4A',
      // Pastel colors
      pastelBg: '#EEF7FF',
      pastelBorder: '#BCDEFF',
      pastelText: '#1743B6',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #59ACFF 0%, #4A46FF 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #EEF7FF 100%)',
      button: 'linear-gradient(90deg, #59ACFF 0%, #3289FF 100%)',
    },
  },
  spring: {
    name: 'spring',
    displayName: 'Spring',
    colors: {
      primary: '#71D852',
      primaryHover: '#46BB27',
      secondary: '#9CAAFF',
      secondaryHover: '#757CFF',
      accent: '#F8C751',
      accentHover: '#EF8F11',
      background: '#F5FFF5',
      backgroundSecondary: '#E8F5E9',
      surface: '#FFFFFF',
      text: '#224D1A',
      textSecondary: '#297219',
      border: '#DBF7D0',
      success: '#46BB27',
      warning: '#F8C751',
      error: '#DD3031',
      // Pastel colors
      pastelBg: '#F5FFF5',
      pastelBorder: '#DBF7D0',
      pastelText: '#297219',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #71D852 0%, #9CAAFF 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #F5FFF5 100%)',
      button: 'linear-gradient(90deg, #71D852 0%, #46BB27 100%)',
    },
  },
  summer: {
    name: 'summer',
    displayName: 'Summer',
    colors: {
      primary: '#3289FF',
      primaryHover: '#1C6AF4',
      secondary: '#F6B129',
      secondaryHover: '#EF8F11',
      accent: '#EE4546',
      accentHover: '#DD3031',
      background: '#F0F8FF',
      backgroundSecondary: '#E3F2FD',
      surface: '#FFFFFF',
      text: '#193D8F',
      textSecondary: '#1743B6',
      border: '#BCDEFF',
      success: '#71D852',
      warning: '#F6B129',
      error: '#EE4546',
      // Pastel colors
      pastelBg: '#FFF8E1',
      pastelBorder: '#FFE9A3',
      pastelText: '#1743B6',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #3289FF 0%, #F6B129 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #F0F8FF 100%)',
      button: 'linear-gradient(90deg, #3289FF 0%, #1C6AF4 100%)',
    },
  },
  autumn: {
    name: 'autumn',
    displayName: 'Autumn',
    colors: {
      primary: '#EF8F11',
      primaryHover: '#D46B0B',
      secondary: '#B91C1D',
      secondaryHover: '#991B1C',
      accent: '#8F3911',
      accentHover: '#753012',
      background: '#FFF8F0',
      backgroundSecondary: '#FFF0E0',
      surface: '#FFFFFF',
      text: '#753012',
      textSecondary: '#8F3911',
      border: '#FBE39F',
      success: '#46BB27',
      warning: '#EF8F11',
      error: '#DD3031',
      // Pastel colors
      pastelBg: '#FFF8F0',
      pastelBorder: '#FBE39F',
      pastelText: '#8F3911',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #EF8F11 0%, #B91C1D 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8F0 100%)',
      button: 'linear-gradient(90deg, #EF8F11 0%, #D46B0B 100%)',
    },
  },
  winter: {
    name: 'winter',
    displayName: 'Winter',
    colors: {
      primary: '#4A46FF',
      primaryHover: '#3E2AD8',
      secondary: '#59ACFF',
      secondaryHover: '#3289FF',
      accent: '#9CAAFF',
      accentHover: '#757CFF',
      background: '#F8F9FF',
      backgroundSecondary: '#ECF0FF',
      surface: '#FFFFFF',
      text: '#2D2689',
      textSecondary: '#3325AE',
      border: '#DDE4FF',
      success: '#46BB27',
      warning: '#F6B129',
      error: '#DD3031',
      // Pastel colors
      pastelBg: '#F8F9FF',
      pastelBorder: '#DDE4FF',
      pastelText: '#3325AE',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #4A46FF 0%, #59ACFF 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)',
      button: 'linear-gradient(90deg, #4A46FF 0%, #3E2AD8 100%)',
    },
  },
};

export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName];
};