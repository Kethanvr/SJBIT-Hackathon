/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
      },
      keyframes: {
        blink: {
          '0%': { opacity: '0.2' },
          '20%': { opacity: '1' },
          '100%': { opacity: '0.2' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },      animation: {
        'blink': 'blink 1.4s infinite both',
        'blink-delay-1': 'blink 1.4s infinite both 0.2s',
        'blink-delay-2': 'blink 1.4s infinite both 0.4s',
        'float': 'float 0.6s ease-in-out infinite',
        'float-delay-1': 'float 0.6s ease-in-out infinite 0.2s',
        'float-delay-2': 'float 0.6s ease-in-out infinite 0.4s',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(to right, #4285f4, #db4437)',
      },
    },
  },
  plugins: [],
};