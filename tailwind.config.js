/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        primary: '#1A1A1A',
        secondary: '#4A4A4A',
        accent: '#FF6B35',
        'accent-purple': '#8B5CF6',
        surface: '#F5F5F5',
        success: '#10B981',
        warning: '#FFB800',
        error: '#FF3B30',
        info: '#007AFF',
      },
      fontFamily: {
        'display': ['DM Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'deep': '0 4px 16px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-success': 'pulseSuccess 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
},
        pulseSuccess: {
          '0%': { transform: 'scale(1)', backgroundColor: '#FF6B35' },
          '50%': { transform: 'scale(1.02)', backgroundColor: '#FF8A65' },
          '100%': { transform: 'scale(1)', backgroundColor: '#FF6B35' },
        },
      },
    },
  },
  plugins: [],
}