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
      primary: '#FF9ED5',
      primaryHover: '#FF6BBF',
      primaryLight: '#FFC7E8',
      primaryDark: '#E74AA0',
      secondary: '#FFB3D9',
      secondaryHover: '#FF8AC8',
      secondaryLight: '#FFDCF0',
      accent: '#FF6BB8',
      accentHover: '#E74AA0',
      accentLight: '#FFAAD6',
      background: '#FFF5FB',
      backgroundSecondary: '#FFE6F4',
      surface: '#FFFFFF',
      surfaceHover: '#FFF9FD',
      text: '#8C2156',
      textSecondary: '#A83270',
      textMuted: '#B8678E',
      border: '#FFDCF0',
      borderLight: '#FFEBF7',
      success: '#8ED969',
      warning: '#FFB84D',
      error: '#FF6B8A',
      // Pastel colors
      pastelBg: '#FFF0F8',
      pastelBgLight: '#FFF8FC',
      pastelBorder: '#FFCCE6',
      pastelText: '#A83270',
      // UI colors
      cardBg: '#FFFFFF',
      cardBorder: '#FFE6F4',
      cardHover: '#FFF9FD',
      sidebarBg: '#FFFAFD',
      headerBg: '#FFF5FB',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #FF9ED5 0%, #FFB3D9 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5FB 100%)',
      button: 'linear-gradient(90deg, #FF9ED5 0%, #FF6BBF 100%)',
      subtle: 'linear-gradient(180deg, #FFF9FD 0%, #FFFFFF 100%)',
    },
  },
  summer: {
    name: 'summer',
    displayName: 'Summer',
    colors: {
      primary: '#FFD84D',
      primaryHover: '#FFC61A',
      primaryLight: '#FFE680',
      primaryDark: '#E6B300',
      secondary: '#FFEB99',
      secondaryHover: '#FFE366',
      secondaryLight: '#FFF4CC',
      accent: '#FFB84D',
      accentHover: '#FF9D1A',
      accentLight: '#FFCF80',
      background: '#FFFDF5',
      backgroundSecondary: '#FFF9E6',
      surface: '#FFFFFF',
      surfaceHover: '#FFFEFA',
      text: '#8C6600',
      textSecondary: '#B38600',
      textMuted: '#C29A33',
      border: '#FFF4CC',
      borderLight: '#FFF9E6',
      success: '#8ED969',
      warning: '#FFB84D',
      error: '#FF8566',
      // Pastel colors
      pastelBg: '#FFFBF0',
      pastelBgLight: '#FFFDF8',
      pastelBorder: '#FFECB3',
      pastelText: '#B38600',
      // UI colors
      cardBg: '#FFFFFF',
      cardBorder: '#FFF9E6',
      cardHover: '#FFFEFA',
      sidebarBg: '#FFFEFC',
      headerBg: '#FFFDF5',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #FFD84D 0%, #FFEB99 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 100%)',
      button: 'linear-gradient(90deg, #FFD84D 0%, #FFC61A 100%)',
      subtle: 'linear-gradient(180deg, #FFFEFA 0%, #FFFFFF 100%)',
    },
  },
  autumn: {
    name: 'autumn',
    displayName: 'Autumn',
    colors: {
      primary: '#FF8C42',
      primaryHover: '#FF6B1A',
      primaryLight: '#FFAD70',
      primaryDark: '#E65C00',
      secondary: '#D4693D',
      secondaryHover: '#B8562F',
      secondaryLight: '#E88A5C',
      accent: '#8B4513',
      accentHover: '#6B3410',
      accentLight: '#B85D2B',
      background: '#FFF8F2',
      backgroundSecondary: '#FFEEDD',
      surface: '#FFFFFF',
      surfaceHover: '#FFFCF8',
      text: '#5C2E0D',
      textSecondary: '#7A3D14',
      textMuted: '#996633',
      border: '#FFD9B8',
      borderLight: '#FFE9D6',
      success: '#8ED969',
      warning: '#FF8C42',
      error: '#CC5544',
      // Pastel colors
      pastelBg: '#FFF3E8',
      pastelBgLight: '#FFF9F4',
      pastelBorder: '#FFCCA3',
      pastelText: '#7A3D14',
      // UI colors
      cardBg: '#FFFFFF',
      cardBorder: '#FFEEDD',
      cardHover: '#FFFCF8',
      sidebarBg: '#FFFEFA',
      headerBg: '#FFF8F2',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #FF8C42 0%, #D4693D 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8F2 100%)',
      button: 'linear-gradient(90deg, #FF8C42 0%, #FF6B1A 100%)',
      subtle: 'linear-gradient(180deg, #FFFCF8 0%, #FFFFFF 100%)',
    },
  },
  winter: {
    name: 'winter',
    displayName: 'Winter',
    colors: {
      primary: '#6BB0FF',
      primaryHover: '#3D8FFF',
      primaryLight: '#A3D0FF',
      primaryDark: '#1A6FE0',
      secondary: '#B3D9FF',
      secondaryHover: '#8AC4FF',
      secondaryLight: '#D6ECFF',
      accent: '#A8D8FF',
      accentHover: '#7AC2FF',
      accentLight: '#D1E9FF',
      background: '#F7FBFF',
      backgroundSecondary: '#E8F4FF',
      surface: '#FFFFFF',
      surfaceHover: '#FCFEFF',
      text: '#1A4D7A',
      textSecondary: '#2B6699',
      textMuted: '#5280A3',
      border: '#CCE5FF',
      borderLight: '#E0F0FF',
      success: '#6BC996',
      warning: '#FFB84D',
      error: '#FF7A8A',
      // Pastel colors
      pastelBg: '#F0F8FF',
      pastelBgLight: '#F7FCFF',
      pastelBorder: '#CCE5FF',
      pastelText: '#2B6699',
      // UI colors
      cardBg: '#FFFFFF',
      cardBorder: '#E8F4FF',
      cardHover: '#FCFEFF',
      sidebarBg: '#FAFCFF',
      headerBg: '#F7FBFF',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #6BB0FF 0%, #B3D9FF 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #F7FBFF 100%)',
      button: 'linear-gradient(90deg, #6BB0FF 0%, #3D8FFF 100%)',
      subtle: 'linear-gradient(180deg, #FCFEFF 0%, #FFFFFF 100%)',
    },
  },
};

export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName];
};