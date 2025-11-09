// tailwind.config.js
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
           screens: {
      sm: '640px',
      md: '712px',  // ✅ Set medium to 712px
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
          montserrat: ['var(--font-montserrat)'],
        },
      },
    },
    plugins: [],
  }
  