import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: '#2E3192',
          light: '#4B4FD4',
          dark: '#1E2070',
          hover: '#3D41B8',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        navy: {
          50: 'hsl(220, 35%, 96%)',
          100: 'hsl(220, 35%, 92%)',
          200: 'hsl(220, 35%, 88%)',
          300: 'hsl(220, 35%, 78%)',
          400: 'hsl(220, 35%, 68%)',
          500: 'hsl(220, 35%, 58%)',
          600: 'hsl(220, 35%, 48%)',
          700: 'hsl(220, 35%, 38%)',
          800: '#1a1c5e',
          900: 'hsl(220, 35%, 10%)',
        },
        sidebar: {
          bg: '#1a1c5e',
          active: '#2E3192',
          hover: '#3D41B8',
          text: '#ffffff',
          subtext: '#a0a3d0',
        },
        gold: {
          50: 'hsl(38, 92%, 96%)',
          100: 'hsl(38, 92%, 92%)',
          200: 'hsl(38, 92%, 88%)',
          300: 'hsl(38, 92%, 78%)',
          400: 'hsl(38, 92%, 68%)',
          500: 'hsl(38, 92%, 58%)',
          600: 'hsl(38, 92%, 48%)',
          700: 'hsl(38, 92%, 38%)',
          800: 'hsl(38, 92%, 28%)',
          900: 'hsl(38, 92%, 18%)',
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')],
}
