import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                sans: [
                    'Inter var',
                    'Inter',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Oxygen',
                    'Ubuntu',
                    'Cantarell',
                    'sans-serif'
                ],
            },
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
                sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
                base: ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
                lg: ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
                xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
                '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
                '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
                '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
                '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '800',
            },
            letterSpacing: {
                tighter: '-0.04em',
                tight: '-0.02em',
                normal: '0',
                wide: '0.01em',
                wider: '0.02em',
            },
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                success: {
                    DEFAULT: 'oklch(var(--success) / <alpha-value>)',
                    foreground: 'oklch(var(--success-foreground))'
                },
                warning: {
                    DEFAULT: 'oklch(var(--warning) / <alpha-value>)',
                    foreground: 'oklch(var(--warning-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                neutral: {
                    50: 'oklch(var(--neutral-50))',
                    100: 'oklch(var(--neutral-100))',
                    200: 'oklch(var(--neutral-200))',
                    300: 'oklch(var(--neutral-300))',
                    400: 'oklch(var(--neutral-400))',
                    500: 'oklch(var(--neutral-500))',
                    600: 'oklch(var(--neutral-600))',
                    700: 'oklch(var(--neutral-700))',
                    800: 'oklch(var(--neutral-800))',
                    900: 'oklch(var(--neutral-900))',
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar))',
                    foreground: 'oklch(var(--sidebar-foreground))',
                    primary: 'oklch(var(--sidebar-primary))',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
                    accent: 'oklch(var(--sidebar-accent))',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
                    border: 'oklch(var(--sidebar-border))',
                    ring: 'oklch(var(--sidebar-ring))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: 'calc(var(--radius) + 4px)',
                '2xl': 'calc(var(--radius) + 8px)',
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                sm: '0 2px 4px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
                DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
                md: '0 6px 12px -2px rgba(0, 0, 0, 0.10), 0 3px 6px -2px rgba(0, 0, 0, 0.05)',
                lg: '0 10px 20px -3px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.06)',
                xl: '0 20px 30px -5px rgba(0, 0, 0, 0.15), 0 8px 12px -4px rgba(0, 0, 0, 0.08)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                soft: '0 4px 20px rgba(16, 185, 129, 0.12)',
                'soft-lg': '0 8px 30px rgba(16, 185, 129, 0.15)',
            },
            transitionDuration: {
                DEFAULT: '200ms',
                fast: '150ms',
                slow: '300ms',
            },
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'spin': {
                    to: { transform: 'rotate(360deg)' }
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' }
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-in': {
                    from: { transform: 'translateX(-100%)' },
                    to: { transform: 'translateX(0)' }
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'spin': 'spin 1s linear infinite',
                'shimmer': 'shimmer 2s infinite linear',
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-in': 'slide-in 0.3s ease-out',
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
