const MinWidthScreens = {
  'mobile-S': '320px',
  'mobile-M': '375px',
  'mobile-L': '425px',
  'tablet': '768px',
  'laptop': '1024px',
  'laptop-L': '1440px',
};

module.exports = {
    darkMode: ["class"],
    content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
   	extend: {
      screens: MinWidthScreens,
  		fontFamily: {
  			inter: [
  				'var(--font-inter)',
  				'sans-serif'
  			],
  			alexandria: [
  				'var(--font-alexandria)',
  				'serif'
  			]
  		},
  		fontSize: {
  			hero: '3.125rem',       // 50px
			h1: '2.5rem',           // 40px
			h2: '2rem',             // 32px
			title: '1.875rem',      // 30px
			subtitle: '1.5rem',     // 24px
			h3: '1.625rem',         // 26px 
			lead: '1.25rem',        // 20px
			description: '1.25rem', // 20px
			popup: '1.125rem',      // 18px
			body: '1rem',           // 16px
			small: '0.8125rem',     // 13px
			tiny: '0.75rem',        // 12px
			mini: '0.6875rem'       // 11px
  		},
    		colors: {
  			blue: {
  				default: '#59ACFF',
  				hover: '#3289FF'
  			},
  			blueDark: {
  				default: '#3289FF',
  				hover: '#1C6AF4'
  			},
  			red: {
  				default: '#ED4A4A',
  				hover: '#DA2727'
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
  				neutral950: '#141515'
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
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
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
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
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
  				success900: '#224D1A'
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
  				warning900: '#753012'
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
  				error900: '#7F1D1E'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
    			chart: {
        			'1': 'hsl(var(--chart-1))',
        			'2': 'hsl(var(--chart-2))',
        			'3': 'hsl(var(--chart-3))',
        			'4': 'hsl(var(--chart-4))',
        			'5': 'hsl(var(--chart-5))'
        			}
        ,
        tag: {
          genderText: '#968825',
          genderBg: '#FDF38E',
          genderSelectedBg: '#F2E559',
          genderUnselectedBg: '#F5F0B7',
          experienceText: '#297219',
          experienceBg: '#B9F0A6',
          experienceSelectedBg: '#8DE571',
          experienceUnselectedBg: '#DBF7D0',
          jobText: '#3289FF',
          jobBg: '#D9ECFF',
          jobUnselectedBg: '#BCDEFF'
        }
      },
  		backgroundColor: {
  			default: 'var(--background)'
  		},
  		textColor: {
  			default: 'var(--foreground)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
      require("tailwindcss-animate")
],
}
