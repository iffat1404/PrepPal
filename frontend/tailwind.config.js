const { mauve, violet, red, blackA, gray } = require("@radix-ui/colors");

module.exports = {
  darkMode: 'class', // Enables dark mode via `class`
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        arial: ['Arial', 'sans-serif'],
      },
      colors: {
        ...mauve,
        ...violet,
        ...red,
        ...blackA,
        ...gray,
      },
      keyframes: {
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: {
            opacity: "1",
            transform: "translate(-50%, -50%) scale(1)",
          },
        },
        floatZoom: {
          "0%, 100%": {
            transform: "translateY(0) scale(1)",
          },
          "50%": {
            transform: "translateY(-10px) scale(1.05)",
          },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        floatZoom: "floatZoom 3s ease-in-out infinite", // New animation
      },
    },
  },
  plugins: [],
};
