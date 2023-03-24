/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#b46262",
        secondary: "#6e3131",
      },

      minHeight: {
        0: "0",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
      },

      maxHeight: {
        0: "0",
        130: "40rem",
      },

      backgroundImage: {
        hero: "url('/public/images/img-home1.jpg')",
      },
    },
  },
  plugins: [],
};
