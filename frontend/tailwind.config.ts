import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "var(--color-brand-soft)",
          500: "var(--color-brand-secondary)",
          900: "var(--color-brand-primary)",
        },
        learning: {
          50: "var(--color-learning-soft)",
          600: "var(--color-learning)",
        },
        surface: {
          app: "var(--color-app-bg)",
          default: "var(--color-surface)",
          muted: "var(--color-surface-muted)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
