module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          400: 'var(--color-secondary-blue-400)',
          500: 'var(--color-secondary-blue-500)',
          600: 'var(--color-secondary-blue-600)',
        },
        green: {
          100: 'var(--color-primary-blackgreen-100)',
          200: 'var(--color-primary-blackgreen-200)',
          300: 'var(--color-primary-blackgreen-300)',
          400: 'var(--color-primary-blackgreen-400)',
          900: 'var(--color-primary-blackgreen-900)',
        },
      },
    },
  },
  darkMode: 'class', 
  plugins: [],
}
