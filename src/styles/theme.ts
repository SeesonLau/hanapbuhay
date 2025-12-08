//theme.ts 
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
    pastelBg: string;
    pastelBgLight: string;
    pastelBorder: string;
    pastelText: string;
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
  banner: {
    gradientStart: string;
    gradientMid: string;
    gradientEnd: string;
    particleColors: string[];
    overlayOpacity: number;
  };
  statCard: {
    variant1: string;
    variant2: string;
    variant3: string;
    variant4: string;
    text: string;
    textValue: string;
  };
  landing: {
    bgGradientStart: string;
    bgGradientMid: string;
    bgGradientEnd: string;
    sectionBg: string;
    sectionBgLight: string;
    glassBg: string;
    glassBorder: string;
    glassHoverBg: string;
    glassHoverBorder: string;
    iconBg: string;
    iconBorder: string;
    headingPrimary: string;
    headingGradientStart: string;
    headingGradientMid: string;
    headingGradientEnd: string;
    bodyText: string;
    bodyTextMuted: string;
    accentPrimary: string;
    accentSecondary: string;
    accentGlow: string;
    categoryColors: {
      agriculture: { bg: string; border: string; iconBg: string };
      digital: { bg: string; border: string; iconBg: string };
      it: { bg: string; border: string; iconBg: string };
      creative: { bg: string; border: string; iconBg: string };
      construction: { bg: string; border: string; iconBg: string };
      service: { bg: string; border: string; iconBg: string };
      skilled: { bg: string; border: string; iconBg: string };
      other: { bg: string; border: string; iconBg: string };
    };
  };
  modal: {
    overlay: string;
    background: string;
    headerBorder: string;
    sectionBorder: string;
    buttonClose: string;
    buttonCloseHover: string;
    accordionBorder: string;
    accordionBorderActive: string;
    accordionBg: string;
    accordionBgActive: string;
    accordionText: string;
    accordionTextMuted: string;
    categoryTabBg: string;
    categoryTabBgActive: string;
    categoryTabBorder: string;
    categoryTabBorderActive: string;
    categoryTabText: string;
    categoryTabTextActive: string;
    infoBg: string;
    infoBorder: string;
    infoText: string;
    infoTextAccent: string;
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
      pastelBg: '#EEF7FF',
      pastelBgLight: '#F8FBFF',
      pastelBorder: '#BCDEFF',
      pastelText: '#1743B6',
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
    banner: {
      gradientStart: '#000000',
      gradientMid: '#0f172a',
      gradientEnd: '#1e3a8a',
      particleColors: ['#60a5fa', '#93c5fd', '#ffffff'],
      overlayOpacity: 0.95,
    },
    statCard: {
      variant1: '#59ACFF',
      variant2: '#ED4A4A',
      variant3: '#46BB27',
      variant4: '#FF8800',
      text: '#6A706F',
      textValue: '#141515',
    },
    landing: {
      bgGradientStart: '#000000',
      bgGradientMid: '#0f172a',
      bgGradientEnd: '#1e3a8a',
      sectionBg: 'rgba(255, 255, 255, 0.03)',
      sectionBgLight: 'rgba(255, 255, 255, 0.05)',
      glassBg: 'rgba(255, 255, 255, 0.03)',
      glassBorder: 'rgba(255, 255, 255, 0.08)',
      glassHoverBg: 'rgba(255, 255, 255, 0.05)',
      glassHoverBorder: 'rgba(59, 130, 246, 0.3)',
      iconBg: 'rgba(59, 130, 246, 0.1)',
      iconBorder: 'rgba(59, 130, 246, 0.2)',
      headingPrimary: '#ffffff',
      headingGradientStart: '#22d3ee',
      headingGradientMid: '#60a5fa',
      headingGradientEnd: '#2563eb',
      bodyText: '#9ca3af',
      bodyTextMuted: '#6b7280',
      accentPrimary: '#60a5fa',
      accentSecondary: '#3b82f6',
      accentGlow: 'rgba(59, 130, 246, 0.3)',
      categoryColors: {
        agriculture: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', iconBg: 'rgba(34, 197, 94, 0.2)' },
        digital: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', iconBg: 'rgba(59, 130, 246, 0.2)' },
        it: { bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.3)', iconBg: 'rgba(99, 102, 241, 0.2)' },
        creative: { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.3)', iconBg: 'rgba(236, 72, 153, 0.2)' },
        construction: { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', iconBg: 'rgba(245, 158, 11, 0.2)' },
        service: { bg: 'rgba(14, 165, 233, 0.15)', border: 'rgba(14, 165, 233, 0.3)', iconBg: 'rgba(14, 165, 233, 0.2)' },
        skilled: { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)', iconBg: 'rgba(168, 85, 247, 0.2)' },
        other: { bg: 'rgba(107, 114, 128, 0.15)', border: 'rgba(107, 114, 128, 0.3)', iconBg: 'rgba(107, 114, 128, 0.2)' },
      },
    },
    modal: {
      overlay: 'rgba(0, 0, 0, 0.5)',
      background: '#FFFFFF',
      headerBorder: '#E3F2FD',
      sectionBorder: '#CFD2D1',
      buttonClose: '#6A706F',
      buttonCloseHover: '#141515',
      accordionBorder: 'rgba(59, 130, 246, 0.2)',
      accordionBorderActive: 'rgba(59, 130, 246, 0.4)',
      accordionBg: 'rgba(89, 172, 255, 0.05)',
      accordionBgActive: 'rgba(59, 130, 246, 0.1)',
      accordionText: '#141515',
      accordionTextMuted: '#6A706F',
      categoryTabBg: 'rgba(89, 172, 255, 0.1)',
      categoryTabBgActive: 'rgba(59, 130, 246, 0.2)',
      categoryTabBorder: 'rgba(59, 130, 246, 0.2)',
      categoryTabBorderActive: 'rgba(59, 130, 246, 0.4)',
      categoryTabText: '#6A706F',
      categoryTabTextActive: '#59ACFF',
      infoBg: 'rgba(89, 172, 255, 0.05)',
      infoBorder: 'rgba(89, 172, 255, 0.2)',
      infoText: '#6A706F',
      infoTextAccent: '#59ACFF',
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
      pastelBg: '#FFF0F8',
      pastelBgLight: '#FFF8FC',
      pastelBorder: '#FFCCE6',
      pastelText: '#A83270',
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
    banner: {
      gradientStart: '#2d1b2e',
      gradientMid: '#4a2d3f',
      gradientEnd: '#5c3a4d',
      particleColors: ['#d4a5a5', '#e8c4c4', '#c49999', '#f5e6e6'],
      overlayOpacity: 0.92,
    },
    statCard: {
      variant1: '#FFCCE6',
      variant2: '#FFB3D9',
      variant3: '#FF9ED5',
      variant4: '#E74AA0',
      text: '#A83270',
      textValue: '#8C2156',
    },
    landing: {
      bgGradientStart: '#1a0f1a',
      bgGradientMid: '#2d1b2e',
      bgGradientEnd: '#5c3a4d',
      sectionBg: 'rgba(255, 182, 217, 0.08)',
      sectionBgLight: 'rgba(255, 182, 217, 0.12)',
      glassBg: 'rgba(255, 179, 217, 0.08)',
      glassBorder: 'rgba(255, 158, 213, 0.15)',
      glassHoverBg: 'rgba(255, 179, 217, 0.12)',
      glassHoverBorder: 'rgba(255, 107, 191, 0.3)',
      iconBg: 'rgba(255, 158, 213, 0.15)',
      iconBorder: 'rgba(255, 158, 213, 0.25)',
      headingPrimary: '#ffffff',
      headingGradientStart: '#ffaad6',
      headingGradientMid: '#ff9ed5',
      headingGradientEnd: '#ff6bbf',
      bodyText: '#e8c4e8',
      bodyTextMuted: '#c49dc4',
      accentPrimary: '#ff9ed5',
      accentSecondary: '#ff6bbf',
      accentGlow: 'rgba(255, 158, 213, 0.3)',
      categoryColors: {
        agriculture: { bg: 'rgba(142, 217, 105, 0.15)', border: 'rgba(142, 217, 105, 0.3)', iconBg: 'rgba(142, 217, 105, 0.2)' },
        digital: { bg: 'rgba(255, 158, 213, 0.15)', border: 'rgba(255, 158, 213, 0.3)', iconBg: 'rgba(255, 158, 213, 0.2)' },
        it: { bg: 'rgba(255, 179, 217, 0.15)', border: 'rgba(255, 179, 217, 0.3)', iconBg: 'rgba(255, 179, 217, 0.2)' },
        creative: { bg: 'rgba(255, 107, 184, 0.15)', border: 'rgba(255, 107, 184, 0.3)', iconBg: 'rgba(255, 107, 184, 0.2)' },
        construction: { bg: 'rgba(255, 184, 77, 0.15)', border: 'rgba(255, 184, 77, 0.3)', iconBg: 'rgba(255, 184, 77, 0.2)' },
        service: { bg: 'rgba(255, 199, 232, 0.15)', border: 'rgba(255, 199, 232, 0.3)', iconBg: 'rgba(255, 199, 232, 0.2)' },
        skilled: { bg: 'rgba(231, 74, 160, 0.15)', border: 'rgba(231, 74, 160, 0.3)', iconBg: 'rgba(231, 74, 160, 0.2)' },
        other: { bg: 'rgba(184, 103, 142, 0.15)', border: 'rgba(184, 103, 142, 0.3)', iconBg: 'rgba(184, 103, 142, 0.2)' },
      },
    },
    modal: {
      overlay: 'rgba(45, 27, 46, 0.6)',
      background: '#FFFFFF',
      headerBorder: '#FFE6F4',
      sectionBorder: '#FFEBF7',
      buttonClose: '#B8678E',
      buttonCloseHover: '#8C2156',
      accordionBorder: 'rgba(255, 158, 213, 0.25)',
      accordionBorderActive: 'rgba(255, 107, 191, 0.4)',
      accordionBg: 'rgba(255, 158, 213, 0.08)',
      accordionBgActive: 'rgba(255, 107, 191, 0.12)',
      accordionText: '#8C2156',
      accordionTextMuted: '#B8678E',
      categoryTabBg: 'rgba(255, 158, 213, 0.12)',
      categoryTabBgActive: 'rgba(255, 107, 191, 0.2)',
      categoryTabBorder: 'rgba(255, 158, 213, 0.25)',
      categoryTabBorderActive: 'rgba(255, 107, 191, 0.4)',
      categoryTabText: '#B8678E',
      categoryTabTextActive: '#FF9ED5',
      infoBg: 'rgba(255, 158, 213, 0.08)',
      infoBorder: 'rgba(255, 158, 213, 0.25)',
      infoText: '#B8678E',
      infoTextAccent: '#FF9ED5',
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
      pastelBg: '#FFFBF0',
      pastelBgLight: '#FFFDF8',
      pastelBorder: '#FFECB3',
      pastelText: '#B38600',
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
    banner: {
      gradientStart: '#1a2e1a',
      gradientMid: '#1f3d2b',
      gradientEnd: '#2a4a3a',
      particleColors: ['#d4a853', '#a89968', '#e6c76f', '#c9a945'],
      overlayOpacity: 0.90,
    },
    statCard: {
      variant1: '#FFF4CC',
      variant2: '#FFEB99',
      variant3: '#FFD84D',
      variant4: '#E6B300',
      text: '#B38600',
      textValue: '#8C6600',
    },
    landing: {
      bgGradientStart: '#1a1a0a',
      bgGradientMid: '#2a3320',
      bgGradientEnd: '#3a4a2a',
      sectionBg: 'rgba(255, 235, 153, 0.08)',
      sectionBgLight: 'rgba(255, 235, 153, 0.12)',
      glassBg: 'rgba(255, 235, 153, 0.08)',
      glassBorder: 'rgba(255, 216, 77, 0.15)',
      glassHoverBg: 'rgba(255, 235, 153, 0.12)',
      glassHoverBorder: 'rgba(255, 198, 26, 0.3)',
      iconBg: 'rgba(255, 216, 77, 0.15)',
      iconBorder: 'rgba(255, 216, 77, 0.25)',
      headingPrimary: '#ffffff',
      headingGradientStart: '#ffe680',
      headingGradientMid: '#ffd84d',
      headingGradientEnd: '#ffc61a',
      bodyText: '#e6d4a8',
      bodyTextMuted: '#c2a868',
      accentPrimary: '#ffd84d',
      accentSecondary: '#ffc61a',
      accentGlow: 'rgba(255, 216, 77, 0.3)',
      categoryColors: {
        agriculture: { bg: 'rgba(142, 217, 105, 0.15)', border: 'rgba(142, 217, 105, 0.3)', iconBg: 'rgba(142, 217, 105, 0.2)' },
        digital: { bg: 'rgba(255, 216, 77, 0.15)', border: 'rgba(255, 216, 77, 0.3)', iconBg: 'rgba(255, 216, 77, 0.2)' },
        it: { bg: 'rgba(255, 235, 153, 0.15)', border: 'rgba(255, 235, 153, 0.3)', iconBg: 'rgba(255, 235, 153, 0.2)' },
        creative: { bg: 'rgba(255, 184, 77, 0.15)', border: 'rgba(255, 184, 77, 0.3)', iconBg: 'rgba(255, 184, 77, 0.2)' },
        construction: { bg: 'rgba(230, 179, 0, 0.15)', border: 'rgba(230, 179, 0, 0.3)', iconBg: 'rgba(230, 179, 0, 0.2)' },
        service: { bg: 'rgba(255, 230, 128, 0.15)', border: 'rgba(255, 230, 128, 0.3)', iconBg: 'rgba(255, 230, 128, 0.2)' },
        skilled: { bg: 'rgba(255, 198, 26, 0.15)', border: 'rgba(255, 198, 26, 0.3)', iconBg: 'rgba(255, 198, 26, 0.2)' },
        other: { bg: 'rgba(194, 154, 51, 0.15)', border: 'rgba(194, 154, 51, 0.3)', iconBg: 'rgba(194, 154, 51, 0.2)' },
      },
    },
    modal: {
      overlay: 'rgba(26, 46, 26, 0.6)',
      background: '#FFFFFF',
      headerBorder: '#FFF9E6',
      sectionBorder: '#FFF4CC',
      buttonClose: '#C29A33',
      buttonCloseHover: '#8C6600',
      accordionBorder: 'rgba(255, 216, 77, 0.25)',
      accordionBorderActive: 'rgba(255, 198, 26, 0.4)',
      accordionBg: 'rgba(255, 216, 77, 0.08)',
      accordionBgActive: 'rgba(255, 198, 26, 0.12)',
      accordionText: '#8C6600',
      accordionTextMuted: '#C29A33',
      categoryTabBg: 'rgba(255, 216, 77, 0.12)',
      categoryTabBgActive: 'rgba(255, 198, 26, 0.2)',
      categoryTabBorder: 'rgba(255, 216, 77, 0.25)',
      categoryTabBorderActive: 'rgba(255, 198, 26, 0.4)',
      categoryTabText: '#C29A33',
      categoryTabTextActive: '#FFD84D',
      infoBg: 'rgba(255, 216, 77, 0.08)',
      infoBorder: 'rgba(255, 216, 77, 0.25)',
      infoText: '#C29A33',
      infoTextAccent: '#FFD84D',
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
      pastelBg: '#FFF3E8',
      pastelBgLight: '#FFF9F4',
      pastelBorder: '#FFCCA3',
      pastelText: '#7A3D14',
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
    banner: {
      gradientStart: '#2a1810',
      gradientMid: '#3d2419',
      gradientEnd: '#4a2e1f',
      particleColors: ['#b85d2b', '#8b4513', '#d4693d', '#704214'],
      overlayOpacity: 0.93,
    },
    statCard: {
      variant1: '#FFCCA3',
      variant2: '#FFAD70',
      variant3: '#FF8C42',
      variant4: '#D4693D',
      text: '#7A3D14',
      textValue: '#5C2E0D',
    },
    landing: {
      bgGradientStart: '#1a0f08',
      bgGradientMid: '#2a1810',
      bgGradientEnd: '#4a2e1f',
      sectionBg: 'rgba(212, 105, 61, 0.08)',
      sectionBgLight: 'rgba(212, 105, 61, 0.12)',
      glassBg: 'rgba(212, 105, 61, 0.08)',
      glassBorder: 'rgba(255, 140, 66, 0.15)',
      glassHoverBg: 'rgba(212, 105, 61, 0.12)',
      glassHoverBorder: 'rgba(255, 107, 26, 0.3)',
      iconBg: 'rgba(255, 140, 66, 0.15)',
      iconBorder: 'rgba(255, 140, 66, 0.25)',
      headingPrimary: '#ffffff',
      headingGradientStart: '#ffad70',
      headingGradientMid: '#ff8c42',
      headingGradientEnd: '#d4693d',
      bodyText: '#e8c4a8',
      bodyTextMuted: '#c29d78',
      accentPrimary: '#ff8c42',
      accentSecondary: '#d4693d',
      accentGlow: 'rgba(255, 140, 66, 0.3)',
      categoryColors: {
        agriculture: { bg: 'rgba(142, 217, 105, 0.15)', border: 'rgba(142, 217, 105, 0.3)', iconBg: 'rgba(142, 217, 105, 0.2)' },
        digital: { bg: 'rgba(255, 140, 66, 0.15)', border: 'rgba(255, 140, 66, 0.3)', iconBg: 'rgba(255, 140, 66, 0.2)' },
        it: { bg: 'rgba(212, 105, 61, 0.15)', border: 'rgba(212, 105, 61, 0.3)', iconBg: 'rgba(212, 105, 61, 0.2)' },
        creative: { bg: 'rgba(255, 173, 112, 0.15)', border: 'rgba(255, 173, 112, 0.3)', iconBg: 'rgba(255, 173, 112, 0.2)' },
        construction: { bg: 'rgba(230, 92, 0, 0.15)', border: 'rgba(230, 92, 0, 0.3)', iconBg: 'rgba(230, 92, 0, 0.2)' },
        service: { bg: 'rgba(232, 138, 92, 0.15)', border: 'rgba(232, 138, 92, 0.3)', iconBg: 'rgba(232, 138, 92, 0.2)' },
        skilled: { bg: 'rgba(139, 69, 19, 0.15)', border: 'rgba(139, 69, 19, 0.3)', iconBg: 'rgba(139, 69, 19, 0.2)' },
        other: { bg: 'rgba(153, 102, 51, 0.15)', border: 'rgba(153, 102, 51, 0.3)', iconBg: 'rgba(153, 102, 51, 0.2)' },
      },
    },
    modal: {
      overlay: 'rgba(42, 24, 16, 0.6)',
      background: '#FFFFFF',
      headerBorder: '#FFEEDD',
      sectionBorder: '#FFD9B8',
      buttonClose: '#996633',
      buttonCloseHover: '#5C2E0D',
      accordionBorder: 'rgba(255, 140, 66, 0.25)',
      accordionBorderActive: 'rgba(255, 107, 26, 0.4)',
      accordionBg: 'rgba(255, 140, 66, 0.08)',
      accordionBgActive: 'rgba(255, 107, 26, 0.12)',
      accordionText: '#5C2E0D',
      accordionTextMuted: '#996633',
      categoryTabBg: 'rgba(255, 140, 66, 0.12)',
      categoryTabBgActive: 'rgba(255, 107, 26, 0.2)',
      categoryTabBorder: 'rgba(255, 140, 66, 0.25)',
      categoryTabBorderActive: 'rgba(255, 107, 26, 0.4)',
      categoryTabText: '#996633',
      categoryTabTextActive: '#FF8C42',
      infoBg: 'rgba(255, 140, 66, 0.08)',
      infoBorder: 'rgba(255, 140, 66, 0.25)',
      infoText: '#996633',
      infoTextAccent: '#FF8C42',
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
      pastelBg: '#F0F8FF',
      pastelBgLight: '#F7FCFF',
      pastelBorder: '#CCE5FF',
      pastelText: '#2B6699',
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
    banner: {
      gradientStart: '#1a2332',
      gradientMid: '#243447',
      gradientEnd: '#2d4159',
      particleColors: ['#a8d8ff', '#d1e9ff', '#7ac2ff', '#ffffff'],
      overlayOpacity: 0.94,
    },
    statCard: {
      variant1: '#D6ECFF',
      variant2: '#A3D0FF',
      variant3: '#6BB0FF',
      variant4: '#1A6FE0',
      text: '#2B6699',
      textValue: '#1A4D7A',
    },
    landing: {
      bgGradientStart: '#0a1420',
      bgGradientMid: '#1a2332',
      bgGradientEnd: '#2d4159',
      sectionBg: 'rgba(179, 217, 255, 0.08)',
      sectionBgLight: 'rgba(179, 217, 255, 0.12)',
      glassBg: 'rgba(179, 217, 255, 0.08)',
      glassBorder: 'rgba(107, 176, 255, 0.15)',
      glassHoverBg: 'rgba(179, 217, 255, 0.12)',
      glassHoverBorder: 'rgba(61, 143, 255, 0.3)',
      iconBg: 'rgba(107, 176, 255, 0.15)',
      iconBorder: 'rgba(107, 176, 255, 0.25)',
      headingPrimary: '#ffffff',
      headingGradientStart: '#d1e9ff',
      headingGradientMid: '#a8d8ff',
      headingGradientEnd: '#6bb0ff',
      bodyText: '#d1e9ff',
      bodyTextMuted: '#a8c4e0',
      accentPrimary: '#6bb0ff',
      accentSecondary: '#3d8fff',
      accentGlow: 'rgba(107, 176, 255, 0.3)',
      categoryColors: {
        agriculture: { bg: 'rgba(107, 201, 150, 0.15)', border: 'rgba(107, 201, 150, 0.3)', iconBg: 'rgba(107, 201, 150, 0.2)' },
        digital: { bg: 'rgba(107, 176, 255, 0.15)', border: 'rgba(107, 176, 255, 0.3)', iconBg: 'rgba(107, 176, 255, 0.2)' },
        it: { bg: 'rgba(163, 208, 255, 0.15)', border: 'rgba(163, 208, 255, 0.3)', iconBg: 'rgba(163, 208, 255, 0.2)' },
        creative: { bg: 'rgba(168, 216, 255, 0.15)', border: 'rgba(168, 216, 255, 0.3)', iconBg: 'rgba(168, 216, 255, 0.2)' },
        construction: { bg: 'rgba(122, 194, 255, 0.15)', border: 'rgba(122, 194, 255, 0.3)', iconBg: 'rgba(122, 194, 255, 0.2)' },
        service: { bg: 'rgba(179, 217, 255, 0.15)', border: 'rgba(179, 217, 255, 0.3)', iconBg: 'rgba(179, 217, 255, 0.2)' },
        skilled: { bg: 'rgba(61, 143, 255, 0.15)', border: 'rgba(61, 143, 255, 0.3)', iconBg: 'rgba(61, 143, 255, 0.2)' },
        other: { bg: 'rgba(82, 128, 163, 0.15)', border: 'rgba(82, 128, 163, 0.3)', iconBg: 'rgba(82, 128, 163, 0.2)' },
      },
    },
    modal: {
      overlay: 'rgba(26, 35, 50, 0.6)',
      background: '#FFFFFF',
      headerBorder: '#E8F4FF',
      sectionBorder: '#CCE5FF',
      buttonClose: '#5280A3',
      buttonCloseHover: '#1A4D7A',
      accordionBorder: 'rgba(107, 176, 255, 0.25)',
      accordionBorderActive: 'rgba(61, 143, 255, 0.4)',
      accordionBg: 'rgba(107, 176, 255, 0.08)',
      accordionBgActive: 'rgba(61, 143, 255, 0.12)',
      accordionText: '#1A4D7A',
      accordionTextMuted: '#5280A3',
      categoryTabBg: 'rgba(107, 176, 255, 0.12)',
      categoryTabBgActive: 'rgba(61, 143, 255, 0.2)',
      categoryTabBorder: 'rgba(107, 176, 255, 0.25)',
      categoryTabBorderActive: 'rgba(61, 143, 255, 0.4)',
      categoryTabText: '#5280A3',
      categoryTabTextActive: '#6BB0FF',
      infoBg: 'rgba(107, 176, 255, 0.08)',
      infoBorder: 'rgba(107, 176, 255, 0.25)',
      infoText: '#5280A3',
      infoTextAccent: '#6BB0FF',
    },
  },
};