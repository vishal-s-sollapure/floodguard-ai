/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0a0f1e",
        cardBg: "#111827",
        accentBlue: "#3b82f6",
        accentRed: "#ef4444",
      },
      keyframes: {
        raindrop: {
          '0%': { transform: 'translateY(-100px)', opacity: '0.8' },
          '100%': { transform: 'translateY(100vh)', opacity: '0.2' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        raindrop: 'raindrop 2s linear infinite',
        pulseGlow: 'pulseGlow 1.5s ease-in-out infinite',
        ticker: 'ticker 25s linear infinite',
      }
    },
  },
  plugins: [],
}
