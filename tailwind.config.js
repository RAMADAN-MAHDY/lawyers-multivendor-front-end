/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B2A41', // Deep Navy (Authority)
          light: '#324A6D',
          dark: '#0F1A2A',
        },
        secondary: {
          DEFAULT: '#C5A059', // Muted Gold/Bronze (Excellence)
          light: '#D4B982',
          dark: '#A6823E',
        },
        neutral: {
          charcoal: '#2D2D2D', // Professional text
          slate: '#F8FAFC',    // Clean backgrounds
          silver: '#E2E8F0',   // Borders/Dividers
        },
        accent: {
          success: '#10B981',  // Emerald for approvals
          danger: '#EF4444',   // Red for court session alerts
          warning: '#F59E0B',  // Amber for pending cases
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
