/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-native-gesture-handler/lib/typescript/components/Pressable/Pressable.d.ts",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        highlight: "var(--highlight)",
        pop: "var(--pop)",
        shadow: "#916813",
        odbm: {
          gold: "#FAB432",
          "gold-shadow": "#cc8c14",
          pale: "#E5DBB8",
          light: "#f5f5f5",
          "blue-300": "#6DACDE",
          "blue-500": "#25538a",
          "blue-600": "#173A64",
          "blue-700": "#334155",
          "blue-800": "#1e293b",
          gray: "#58595B",
          "gray-light": "#D5E2E9",
          "gray-digital": "#222222",
          "gray-digital-dark": "#1c1c1c",
          "gray-dark": "#0f0f0f",
        },
        textColor: {
          primary: "var(--text-primary)",
          title: "var(--text-title)",
          body: "var(--text-body)",
        },
        bgColor: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
        },
        borderColor: {
          primary: "var(--border-primary)",
        },
      },
      fontFamily: {
        "bounded-black": ["Black", "sans-serif"],
        "bounded-regular": ["Regular", "sans-serif"],
        "bounded-extralight": ["ExtraLight", "sans-serif"],
      },
    },
  },
  plugins: [],
};
