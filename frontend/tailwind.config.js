/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mint: {
          50: "#f0fdf9",
          100: "#ccfdf2",
          200: "#99fbe6",
          300: "#5df4d6",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        sage: {
          50: "#f8faf8",
          100: "#f1f5f1",
          200: "#e3ebe3",
          300: "#cdd7cd",
          400: "#a8b8a8",
          500: "#8a9c8a",
          600: "#6f7f6f",
          700: "#5a685a",
          800: "#4a554a",
          900: "#3d463d",
        },
        cream: {
          50: "#fefefe",
          100: "#fdfdfc",
          200: "#fbfbf8",
          300: "#f8f8f4",
          400: "#f3f3ec",
          500: "#eeede4",
          600: "#d6d4c8",
          700: "#b3b0a4",
          800: "#8f8c80",
          900: "#757268",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        mint: "0 4px 14px 0 rgba(20, 184, 166, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-mint": "pulseMint 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseMint: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: ".8",
          },
        },
      },
    },
  },
  plugins: [],
};
