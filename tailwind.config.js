/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // BullSheet Design System Colors
        paper: "#FDFCF7", // Off-white base
        graphite: "#2E2E2E", // Text color
        "paper-blue": "#3B82F6", // Primary blue
        "finance-green": "#4CAF50", // Profit/XP green
        "coral-red": "#EF5350", // Loss red
        "muted-lilac": "#9FA8DA", // Neutral UI
        "grid-blue": "#E3EAF2", // Faint grid lines
        
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3B82F6",
          foreground: "#FDFCF7",
        },
        secondary: {
          DEFAULT: "#9FA8DA",
          foreground: "#2E2E2E",
        },
        destructive: {
          DEFAULT: "#EF5350",
          foreground: "#FDFCF7",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#4CAF50",
          foreground: "#FDFCF7",
        },
        popover: {
          DEFAULT: "#FDFCF7",
          foreground: "#2E2E2E",
        },
        card: {
          DEFAULT: "#FDFCF7",
          foreground: "#2E2E2E",
        },
      },
      borderRadius: {
        lg: "12px", // Cartoony rounded corners
        md: "8px",
        sm: "6px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        rounded: ["Nunito", "system-ui", "sans-serif"],
        handwrite: ["Caveat", "cursive"],
      },
      boxShadow: {
        paper: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "paper-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "bounce-in": "bounce-in 0.6s ease-out",
        "peel-sticker": "peel-sticker 0.8s ease-out",
        "confetti": "confetti 2s ease-out",
      },
      keyframes: {
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "peel-sticker": {
          "0%": { transform: "rotateY(-90deg) scale(0.8)", opacity: "0" },
          "50%": { transform: "rotateY(-45deg) scale(1.05)" },
          "100%": { transform: "rotateY(0deg) scale(1)", opacity: "1" },
        },
        "confetti": {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
      },
      backgroundImage: {
        "squared-paper": `
          linear-gradient(to right, #E3EAF2 1px, transparent 1px),
          linear-gradient(to bottom, #E3EAF2 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        "grid": "20px 20px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}