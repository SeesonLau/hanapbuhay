module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        alexandria: ['var(--font-alexandria)', 'serif'],
      },
      fontSize: { 
        hero: '3.125rem',       // 50px
        h1: '2.5rem',           // 40px
        h2: '2rem',             // 32px
        h3: '1.625rem',         // 26px
        lead: '1.25rem',        // 20px
        title: '1.875rem',      // 30px
        description: '1.25rem', // 20px
        body: '1rem',           // 16px
        small: '0.8125rem',     // 13px
        tiny: '0.75rem',        // 12px
        popup: '1.125rem',      // 18px
        mini: '0.6875rem',      // 10px
      },
      colors: {
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
        gray: {
          default: '#e6e7e7',
          hover: '#858b8a',
          border: '#3B3E3E',
          neutral50: '#FAFAFA',
          neutral100: '#E6E7E7',
          neutral200: '#CFD2D1',
          neutral300: '#AEB2B1',
          neutral400: '#858B8A',
          neutral500: '#6A706F',
          neutral600: '#5A605F',
          neutral700: '#4D5151',
          neutral800: '#444645',
          neutral900: '#3B3E3E',
        },
        primary: {
          primary50: '#EEF7FF',
          primary100: '#D9ECFF',
          primary200: '#BCDEFF',
          primary300: '#8ECAFF',
          primary400: '#59ACFF',
          primary500: '#3289FF',
          primary600: '#1C6AF4',
          primary700: '#1453E1',
          primary800: '#1743B6',
          primary900: '#193D8F',
        },
        secondary: {
          secondary50: '#ECF0FF',
          secondary100: '#DDE4FF',
          secondary200: '#C2CCFF',
          secondary300: '#9CAAFF',
          secondary400: '#757CFF',
          secondary500: '#4A46FF',
          secondary600: '#4936F5',
          secondary700: '#3E2AD8',
          secondary800: '#3325AE',
          secondary900: '#2D2689',
        },
        success: {
          success50: '#EFFCE9',
          success100: '#DBF7D0',
          success200: '#B9F0A6',
          success300: '#8DE571',
          success400: '#71D852',
          success500: '#46BB27',
          success600: '#33951B',
          success700: '#297219',
          success800: '#255A1A',
          success900: '#224D1A',
        },
        warning: {
          warning50: '#FFFAEB',
          warning100: '#FDEFC8',
          warning200: '#FBE39F',
          warning300: '#F8C751',
          warning400: '#F6B129',
          warning500: '#EF8F11',
          warning600: '#D46B0B',
          warning700: '#B04A0D',
          warning800: '#8F3911',
          warning900: '#753012',
        },
        error: {
          error50: '#FEF2F2',
          error100: '#FEE2E2',
          error200: '#FECACA',
          error300: '#FCA5A6',
          error400: '#F87172',
          error500: '#EE4546',
          error600: '#DD3031',
          error700: '#B91C1D',
          error800: '#991B1C',
          error900: '#7F1D1E',
        },
      },
      backgroundColor: {
        default: 'var(--background)',
      },
      textColor: {
        default: 'var(--foreground)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
