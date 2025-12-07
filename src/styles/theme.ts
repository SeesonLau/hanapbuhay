export type ThemeName = 'classic' | 'spring' | 'summer' | 'autumn' | 'winter';

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryHover: string;
    secondaryLight: string;
    accent: string;
    accentHover: string;
    accentLight: string;
    background: string;
    backgroundSecondary: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderLight: string;
    success: string;
    warning: string;
    error: string;
    // Pastel colors for sections/cards
    pastelBg: string;
    pastelBgLight: string;
    pastelBorder: string;
    pastelText: string;
    // Additional UI colors
    cardBg: string;
    cardBorder: string;
    cardHover: string;
    sidebarBg: string;
    headerBg: string;
  };
  gradients: {
    hero: string;
    card: string;
    button: string;
    subtle: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  classic: {
    name: 'classic',
    displayName: 'Classic',
    colors: {
      primary: '#59ACFF',
      primaryHover: '#3289FF',
      primaryLight: '#8ECAFF',
      primaryDark: '#1C6AF4',
      secondary: '#4A46FF',
      secondaryHover: '#3E2AD8',
      secondaryLight: '#757CFF',
      accent: '#8ECAFF',
      accentHover: '#59ACFF',
      accentLight: '#BCDEFF',
      background: '#E6E7E7',
      backgroundSecondary: '#CFD2D1',
      surface: '#FFFFFF',
      surfaceHover: '#F8FBFF',
      text: '#141515',
      textSecondary: '#3B3E3E',
      textMuted: '#6A706F',
      border: '#3B3E3E',
      borderLight: '#CFD2D1',
      success: '#46BB27',
      warning: '#EF8F11',
      error: '#ED4A4A',
      // Pastel colors
      pastelBg: '#EEF7FF',
      pastelBgLight: '#F8FBFF',
      pastelBorder: '#BCDEFF',
      pastelText: '#1743B6',
      // UI colors
      cardBg: '#FFFFFF',
      cardBorder: '#E3F2FD',
      cardHover: '#F8FBFF',
      sidebarBg: '#FAFBFF',
      headerBg: '#EEF7FF',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #59ACFF 0%, #4A46FF 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #EEF7FF 100%)',
      button: 'linear-gradient(90deg, #59ACFF 0%, #3289FF 100%)',
      subtle: 'linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%)',
    },
  },
  spring: {
    name: 'spring',
    displayName: 'Spring',
    colors: {
      primary: '#71D852',
      primaryHover: '#46BB27',
      primaryLight: '#8DE571',
      primaryDark: '#33951B',
      secondary: '#9CAAFF',
      secondaryHover: '#757CFF',
      secondaryLight: '#C2CCFF',
      accent: '#F8C751',
      accentHover: '#EF8F11',
      accentLight: '#FBE39F',
      background: '#F5FFF5',
      backgroundSecondary: '#E8F5E9',
      surface: '#FFFFFF',
      surfaceHover: '#F9FFF9',
      text: '#224D1A',
      textSecondary: '#297219',
      textMuted: '#5A705A',
      border: '#DBF7D0',
      borderLight: '#EFFCE9',
      success: '#46BB27',
      warning: '#F8C751',
      error: '#DD3031',
      // Pastel colors
      pastelBg: '#F5FFF5',
      pastelBgLight: '#FAFFFA',
      pastelBorder: '#DBF7D0',
      pastelText: '#297219',
      // UI colors
      cardBg: '#FFFFFF',
      cardBorder: '#E8F5E9',
      cardHover: '#F9FFF9',
      sidebarBg: '#FAFFFA',
      headerBg: '#F5FFF5',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #71D852 0%, #9CAAFF 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #F5FFF5 100%)',
      button: 'linear-gradient(90deg, #71D852 0%, #46BB27 100%)',
      subtle: 'linear-gradient(180deg, #F9FFF9 0%, #FFFFFF 100%)',
    },
  },
  summer: {
    name: 'summer',
    displayName: 'Summer',
    colors: {
      primary: '#3289FF',
      primaryHover: '#1C6AF4',
      primaryLight: '#59ACFF',
      primaryDark: '#1453E1',
      secondary: '#F6B129',
      secondaryHover: '#EF8F11',
      secondaryLight: '#F8C751',
      accent: '#EE4546',
      accentHover: '#DD3031',
      accentLight: '#F87172',
      background: '#F0F8FF',
      backgroundSecondary: '#E3F2FD',
      surface: '#FFFFFF',
      surfaceHover: '#FFFBF0',
      text: '#193D8F',
      textSecondary: '#1743B6',
      textMuted: '#5A6B8A',
      border: '#BCDEFF',
      borderLight: '#D9ECFF',
      success: '#71D852',
      warning: '#F6B129',
      error: '#EE4546',
      // Pastel colors
      pastelBg: '#FFF8E1',
      pastelBgLight: '#FFFCF0',
      pastelBorder: '#FFE9A3',
      pastelText: '#1743B6',
      // UI colors
      cardBg: '#FFFFFF',
      cardBorder: '#FFF4D9',
      cardHover: '#FFFBF0',
      sidebarBg: '#FFFDF5',
      headerBg: '#FFF8E1',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #3289FF 0%, #F6B129 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #F0F8FF 100%)',
      button: 'linear-gradient(90deg, #3289FF 0%, #1C6AF4 100%)',
      subtle: 'linear-gradient(180deg, #FFFBF0 0%, #FFFFFF 100%)',
    },
  },
  autumn: {
    name: 'autumn',
    displayName: 'Autumn',
    colors: {
      primary: '#EF8F11',
      primaryHover: '#D46B0B',
      primaryLight: '#F6B129',
      primaryDark: '#B04A0D',
      secondary: '#B91C1D',
      secondaryHover: '#991B1C',
      secondaryLight: '#DD3031',
      accent: '#8F3911',
      accentHover: '#753012',
      accentLight: '#B04A0D',
      background: '#FFF8F0',
      backgroundSecondary: '#FFF0E0',
      surface: '#FFFFFF',
      surfaceHover: '#FFFBF5',
      text: '#753012',
      textSecondary: '#8F3911',
      textMuted: '#9D6B4A',
      border: '#FBE39F',
      borderLight: '#FDEFC8',
      success: '#46BB27',
      warning: '#EF8F11',
      error: '#DD3031',
      // Pastel colors
      pastelBg: '#FFF8F0',
      pastelBgLight: '#FFFCF8',
      pastelBorder: '#FBE39F',
      pastelText: '#8F3911',
      // UI colors
      cardBg: '#FFFFFF',
      cardBorder: '#FFF4E6',
      cardHover: '#FFFBF5',
      sidebarBg: '#FFFDF9',
      headerBg: '#FFF8F0',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #EF8F11 0%, #B91C1D 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8F0 100%)',
      button: 'linear-gradient(90deg, #EF8F11 0%, #D46B0B 100%)',
      subtle: 'linear-gradient(180deg, #FFFBF5 0%, #FFFFFF 100%)',
    },
  },
  winter: {
    name: 'winter',
    displayName: 'Winter',
    colors: {
      primary: '#4A46FF',
      primaryHover: '#3E2AD8',
      primaryLight: '#757CFF',
      primaryDark: '#2D2689',
      secondary: '#59ACFF',
      secondaryHover: '#3289FF',
      secondaryLight: '#8ECAFF',
      accent: '#9CAAFF',
      accentHover: '#757CFF',
      accentLight: '#C2CCFF',
      background: '#F8F9FF',
      backgroundSecondary: '#ECF0FF',
      surface: '#FFFFFF',
      surfaceHover: '#FBFCFF',
      text: '#2D2689',
      textSecondary: '#3325AE',
      textMuted: '#5A5D8A',
      border: '#DDE4FF',
      borderLight: '#ECF0FF',
      success: '#46BB27',
      warning: '#F6B129',
      error: '#DD3031',
      // Pastel colors
      pastelBg: '#F8F9FF',
      pastelBgLight: '#FCFDFF',
      pastelBorder: '#DDE4FF',
      pastelText: '#3325AE',
      // UI colors
      cardBg: '#FFFFFF',
      cardBorder: '#ECF0FF',
      cardHover: '#FBFCFF',
      sidebarBg: '#FAFBFF',
      headerBg: '#F8F9FF',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #4A46FF 0%, #59ACFF 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)',
      button: 'linear-gradient(90deg, #4A46FF 0%, #3E2AD8 100%)',
      subtle: 'linear-gradient(180deg, #FBFCFF 0%, #FFFFFF 100%)',
    },
  },
};

export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName];
};