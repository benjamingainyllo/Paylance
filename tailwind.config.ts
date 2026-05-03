import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", "[data-theme=\"dark\"]"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        primary: "#000000",
        eclipse: {
          light: "#A1A1AA", // Gray-400
          medium: "#18181B", // Gray-900
          dark: "#09090B", // Almost Black
          darkest: "#000000" // Pure Black
        },
        success: "#22C55E",
        text: "rgb(var(--text) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)"
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  },
  plugins: []
};

export default config;
