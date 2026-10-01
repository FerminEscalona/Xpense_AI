/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#f6f4ef', panel: '#fffefa', ink: '#21233a', muted: '#7e8091',
        line: '#e9e7e2', purple: '#6759d8', lavender: '#eeebff',
        mint: '#d5f5e7', green: '#138965', peach: '#ffe8db', orange: '#e77b46',
        navy: '#252443', blue: '#e5f2fc',
      },
    },
  },
  plugins: [],
};
