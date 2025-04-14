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
        highlight: "#FAB432",
        shadow: "#916813",
        odbm: {
          gold: "#FAB432",
          pale: "#E5DBB8",
          light: "#f5f5f5",
          gray: "#58595B",
          "gray-light": "#D5E2E9",
          "gray-digital": "#222222",
          "gray-dark": "#0f0f0f"
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