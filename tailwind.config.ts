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
      // Semantic type scale. These name the intentional, off-default sizes the
      // site had been expressing as one-off `text-[Npx]` arbitrary values, each
      // bundling its line-height (and tracking, for the eyebrow) so callers pick
      // one token instead of re-tuning size + leading by hand. Tailwind's default
      // steps (text-xs … text-6xl) are preserved for structural headings.
      fontSize: {
        eyebrow: ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.15em" }], // 11px — kickers / labels
        micro: ["0.8125rem", { lineHeight: "1.5" }], // 13px — helper / meta text
        body: ["0.9375rem", { lineHeight: "1.6" }], // 15px — default card / body copy
        reading: ["1.0625rem", { lineHeight: "1.7" }], // 17px — long-form reading
        hero: ["2.5rem", { lineHeight: "1.05" }], // 40px — display hero base (pair with sm:text-5xl/6xl)
      },
    },
  },
  plugins: [],
};

export default config;
