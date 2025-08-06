/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#4318FF",
        primary_landing: "#174871",
        background: "#F4F7FE",
        primaryText: "#2B3674",
        secondaryText: "#A3AED0",
        lightText: "#A3AED0",
      },

      fontFamily: {
        sans: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [],
};
