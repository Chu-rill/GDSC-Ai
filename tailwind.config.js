/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "electric-blue": {
          default: "#0A3196",
        },
        "color-1": {
          default: "hsl(192, 100%, 9%) ",
        },
        "color-2": {
          default: "hsl(207, 100%, 98%) ",
        },
      },
    },
    fontFamily: {
      damion: ["Damion", "cursive"],
      inter: ["Inter", "sans-serif"],
      Poppins: ["Poppins"],
      Roboto: ["Roboto"],
      Montserrat: ["Montserrat"],
    },
  },
  plugins: [],
};
