import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./stores/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        fg: "hsl(var(--fg))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        primary: "hsl(var(--primary))",
        danger: "hsl(var(--danger))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
      },
      boxShadow: {
        soft: "0 16px 48px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        lg: "0.9rem",
        xl: "1.15rem",
      },
    },
  },
  plugins: [],
};

export default config;
