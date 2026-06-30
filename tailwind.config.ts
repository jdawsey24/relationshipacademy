import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette
        "midnight-navy": "#1C3557",
        "coral-rose": "#D9777D",
        plum: "#7B5878",
        "sage-green": "#8A9D8F",
        "warm-ivory": "#F7F4EF",
        charcoal: "#333333",
        // Secondary palette
        "soft-coral": "#E7A2A4",
        "dusty-plum": "#9C7A97",
        "light-sage": "#B7C4B5",
        "slate-blue": "#6B7C97",
        "light-gray": "#E5E5E5",
        // Results-page status accents
        "amber-warm": "#C9A96E", // "Some Risk Indicators"
        "deep-red": "#9E3B38", // "High Risk"
      },
      fontFamily: {
        // Display / Headings
        display: ["var(--font-cormorant)", "serif"],
        // Body
        body: ["var(--font-source-sans)", "sans-serif"],
        // UI / Data
        ui: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
