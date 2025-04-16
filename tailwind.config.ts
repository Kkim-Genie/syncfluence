/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff8ed",
          100: "#ffefd5",
          200: "#ffe0b0",
          300: "#ffd080",
          400: "#ffb845",
          500: "#ff9500", // Brighter orange from logo
          600: "#ff7a00",
          700: "#f06000",
          800: "#cc4d00",
          900: "#a83c00",
          950: "#5a1e00",
        },
        secondary: {
          500: "#FF6B4A", // Brighter star/mascot orange-red
          600: "#FF4520",
        },
        background: "#FFD199", // Brighter light orange background
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
