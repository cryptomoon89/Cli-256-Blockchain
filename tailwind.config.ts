import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glitch": {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        "neon-flicker": {
          "0%, 100%": {
            textShadow: "0 0 5px hsl(270 100% 60%), 0 0 10px hsl(270 100% 60%), 0 0 15px hsl(270 100% 60%), 0 0 20px hsl(270 100% 60%)"
          },
          "50%": {
            textShadow: "0 0 2px hsl(270 100% 60%), 0 0 5px hsl(270 100% 60%), 0 0 8px hsl(270 100% 60%)"
          },
        },
        "cyber-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 10px hsl(270 100% 60%), 0 0 20px hsl(270 100% 60%), inset 0 0 10px hsl(270 100% 60% / 0.2)"
          },
          "50%": {
            boxShadow: "0 0 20px hsl(270 100% 60%), 0 0 30px hsl(270 100% 60%), 0 0 40px hsl(270 100% 60%), inset 0 0 20px hsl(270 100% 60% / 0.3)"
          },
        },
        "pixel-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "terminal-cursor": {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        "scan-line": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
            opacity: "0.3"
          },
          "50%": {
            transform: "translateY(-20px) rotate(180deg)",
            opacity: "1"
          },
        },
        "glow-rotate": {
          "0%": {
            transform: "rotate(0deg)",
            filter: "hue-rotate(0deg)"
          },
          "100%": {
            transform: "rotate(360deg)",
            filter: "hue-rotate(360deg)"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glitch": "glitch 2s infinite",
        "neon-flicker": "neon-flicker 3s infinite alternate",
        "pixel-pulse": "pixel-pulse 2s ease-in-out infinite",
        "terminal-cursor": "terminal-cursor 1s infinite",
        "scan-line": "scan-line 0.8s ease-in-out infinite",
        "cyber-pulse": "cyber-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-rotate": "glow-rotate 8s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
