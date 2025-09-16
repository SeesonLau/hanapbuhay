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
        'hero': '50px',
        'h1': '40px',
        'h2': '32px',
        'h3': '26px',
        'lead': '20px',
        'body': '16px',
        'small': '13px',
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
          neutral100: '#F5F5F5',
          neutral300: '#AEB2B1',
          neutral400: '#858B8A',
          neutral600: '#5A605F',
        },
        primary500: '#3289FF',
        primary700: '#1453E1',
      },
      backgroundColor: {
        default: 'var(--background)',
      },
      textColor: {
        default: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}
