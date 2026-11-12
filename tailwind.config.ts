import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#13293D", // Primary Prussian Navy
          "navy-dark": "#0B1522",
          "navy-light": "#1B3A57",
          amber: "#D97706", // Accent Saffron Amber / Gold
          "amber-light": "#F59E0B",
          "amber-dark": "#B45309",
          emerald: "#059669", // Trust / Discount Green
          "emerald-light": "#10B981",
          canvas: "#F8FAFC", // Clean slate-gray canvas
          card: "#FFFFFF",
          text: "#0F172A", // Slate-900 text
          muted: "#64748B",
          border: "#E2E8F0",
        },
        // Backward compatibility
        fk: {
          blue: "#13293D",
          "blue-dark": "#0B1522",
          yellow: "#D97706",
          orange: "#D97706",
          green: "#059669",
          bg: "#F8FAFC",
        },
        heritage: {
          maroon: "#13293D",
          gold: "#D97706",
          ivory: "#FFFFFF",
          charcoal: "#0F172A",
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(19, 41, 61, 0.08), 0 8px 10px -6px rgba(19, 41, 61, 0.04)',
      }
    },
  },
  plugins: [],
};
export default config;
