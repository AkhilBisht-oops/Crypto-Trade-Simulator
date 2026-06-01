/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bgMain: 'var(--bg-main)',
        bgSub: 'var(--bg-sub)',
        bgCard: 'var(--bg-card)',
        bgInput: 'var(--bg-input)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted: 'var(--text-muted)',
        borderAccent: 'var(--border)',
        borderAccentHover: 'var(--border-hover)',
        accentColor: 'var(--accent)',
        accentColorLight: 'var(--accent-light)',
        accentColorHover: 'var(--accent-hover)',
        successColor: 'var(--success)',
        successColorLight: 'var(--success-light)',
        dangerColor: 'var(--danger)',
        dangerColorLight: 'var(--danger-light)',
        dark: {
          50: '#f8fafc',
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#31353e',
          600: '#262a33',
          700: '#1c1f28',
          800: '#121721',
          900: '#0b0e16',
          950: '#060911',
        },
        neon: {
          green: '#00ffa3',
          red: '#ff3b5c',
          blue: '#3b82f6',
          purple: '#a855f7',
          yellow: '#fbbf24',
          cyan: '#00e0ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 163, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 163, 0.4)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
