/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0a0a0a",
        secondary: "#d46124",
        highlight: "#f5ae1e",
        shadow: "#916813",
        odbm: {
          gold: "#FAB432",
          pale: "#E5DBB8",
          gray: "#58595B",
          "gray-light": "#D5E2E9",
          "gray-digital": "#222222",
        }
      },
      fontFamily: {
        "bounded-black": ["Black", "sans-serif"],
        "bounded-regular": ["Regular", "sans-serif"],
        "bounded-extralight": ["ExtraLight", "sans-serif"],
      }
    },
  },
  plugins: [],
}