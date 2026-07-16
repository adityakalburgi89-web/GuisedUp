const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
        },
        carbon: 'hsl(var(--color-carbon))',
        paper: 'hsl(var(--color-paper-white))',
        linen: 'hsl(var(--color-linen))',
        mist: 'hsl(var(--color-mist))',
        fog: 'hsl(var(--color-fog))',
        ash: 'hsl(var(--color-ash))',
        graphite: 'hsl(var(--color-graphite))',
        lavender: 'hsl(var(--color-lavender))',
        iris: 'hsl(var(--color-iris))',
        mint: 'hsl(var(--color-mint))',
        'mint-wash': 'hsl(var(--color-mint-wash))',
        sky: 'hsl(var(--color-sky))',
        magenta: 'hsl(var(--color-magenta))',
        ember: 'hsl(var(--color-ember))',
      },
      fontFamily: {
        sans: ['DMSans_500Medium', 'System'],
        display: ['DMSans_700Bold', 'System'],
        body: ['DMSans_400Regular', 'System'],
        medium: ['DMSans_500Medium', 'System'],
        bold: ['DMSans_700Bold', 'System'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        card: '16px',
        panel: '24px',
        pill: '9999px',
      },
      letterSpacing: {
        tightest: '-3px',
        display: '-0.34px',
        heading: '-0.61px',
        body: '-0.32px',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
