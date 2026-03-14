/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'space': ['"Space Grotesk"', 'sans-serif'],
                'inter': ['Inter', 'sans-serif'],
            },
            colors: {
                'space-black': '#000000',
                'space-dark': '#0a0a0a',
                'nebula-purple': '#8b5cf6',
                'nebula-blue': '#3b82f6',
                'nebula-pink': '#ec4899',
                'star-white': '#ffffff',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 3s ease-in-out infinite',
            },
            keyframes: {
                shimmer: {
                    '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.05)' },
                }
            }
        },
    },
    plugins: [],
}
