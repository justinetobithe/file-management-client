/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT';

module.exports = withMT({
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          /* '50': 'hsl(55, 92%, 95%)',
          '100': 'hsl(55, 93%, 88%)',
          '200': 'hsl(53, 93%, 77%)',
          '300': 'hsl(50, 94%, 64%)',
          '400': 'hsl(48, 92%, 53%)',
          '500': 'hsl(45, 89%, 47%)',
          '600': 'hsl(40, 92%, 40%)',
          '700': 'hsl(35, 88%, 33%)',
          '800': 'hsl(32, 77%, 29%)',
          '900': 'hsl(28, 69%, 26%)',
          '950': 'hsl(26, 81%, 14%)', */
          '50': 'hsl(351, 100%, 97%)',
          '100': 'hsl(351, 100%, 95%)',
          '200': 'hsl(350, 100%, 88%)',
          '300': 'hsl(349, 100%, 82%)',
          '400': 'hsl(348, 99%, 71%)',
          '500': 'hsl(346, 93%, 60%)',
          '600': 'hsl(344, 80%, 50%)',
          '700': 'hsl(342, 87%, 41%)',
          '800': 'hsl(340, 83%, 35%)',
          '900': 'hsl(339, 78%, 30%)',
          '950': 'hsl(340, 90%, 16%)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        sans: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
});
