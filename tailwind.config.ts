import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    // The design system is a closed set. Anything not listed here is not
    // available to a component, which is the point.
    extend: {
      colors: {
        canvas: "#FBFBF9",
        surface: "#FFFFFF",
        sunken: "#F4F4F1",
        line: { DEFAULT: "#E6E6E1", strong: "#D2D2CB" },
        ink: { DEFAULT: "#191A17", 2: "#4A4C46", 3: "#6B6D65" },
        green: {
          DEFAULT: "#2F6B4F",
          50: "#F1F7F3",
          100: "#E4EEE8",
          600: "#2A5F44",
          700: "#1E4A36",
        },
        clay: { DEFAULT: "#8A5A3B", 100: "#F6EFE8" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
        16: "64px",
        24: "96px",
        32: "128px",
        40: "160px",
      },
      maxWidth: {
        content: "1120px",
        prose: "680px",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        // The only shadow in the system. Demo panel only.
        panel:
          "0 1px 2px rgba(25,26,23,0.04), 0 8px 24px -12px rgba(25,26,23,0.10)",
      },
      transitionTimingFunction: {
        nura: "cubic-bezier(0.2, 0, 0, 1)",
      },
      transitionDuration: {
        150: "150ms",
        220: "220ms",
        400: "400ms",
      },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
      },
      animation: {
        "rise-in": "rise-in 400ms cubic-bezier(0.2, 0, 0, 1) both",
        "slow-pulse": "slow-pulse 1800ms cubic-bezier(0.2, 0, 0, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
