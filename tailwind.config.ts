import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
        "3xl": "1920px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
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
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
          6: "hsl(var(--chart-6))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
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
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        // 8px rhythm for consistent spacing
        "4.5": "1.125rem",  // 18px
        "7": "1.75rem",     // 28px
        "9": "2.25rem",     // 36px
        "11": "2.75rem",    // 44px
        "13": "3.25rem",    // 52px
        "15": "3.75rem",    // 60px
      },
      fontSize: {
        // Fluid typography for all screen sizes
        'xs': ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.5' }],
        'sm': ['clamp(0.875rem, 0.825rem + 0.25vw, 1rem)', { lineHeight: '1.5' }],
        'base': ['clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', { lineHeight: '1.6' }],
        'lg': ['clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem)', { lineHeight: '1.6' }],
        'xl': ['clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)', { lineHeight: '1.5' }],
        '2xl': ['clamp(1.5rem, 1.35rem + 0.75vw, 2rem)', { lineHeight: '1.4' }],
        '3xl': ['clamp(1.875rem, 1.65rem + 1.125vw, 2.5rem)', { lineHeight: '1.3' }],
        '4xl': ['clamp(2.25rem, 1.95rem + 1.5vw, 3rem)', { lineHeight: '1.2' }],
        '5xl': ['clamp(3rem, 2.5rem + 2.5vw, 4rem)', { lineHeight: '1.1' }],
      },
      boxShadow: {
        // Standardized shadow progression matching landing page
        "depth-sm": "0 2px 4px hsl(var(--foreground) / 0.04), 0 4px 12px hsl(var(--foreground) / 0.06)",
        "depth-md": "0 4px 6px hsl(var(--foreground) / 0.05), 0 8px 20px hsl(var(--foreground) / 0.08), 0 20px 40px hsl(var(--foreground) / 0.10)",
        "depth-lg": "0 8px 12px hsl(var(--foreground) / 0.06), 0 20px 40px hsl(var(--foreground) / 0.10), 0 40px 80px hsl(var(--foreground) / 0.12)",
        "glow": "0 0 40px -8px hsl(var(--primary) / 0.25)",
        "glow-lg": "0 0 60px -12px hsl(var(--primary) / 0.35)",
        "glow-primary": "0 4px 14px 0 hsl(var(--primary) / 0.4)",
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
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
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "float-subtle": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px -8px hsl(var(--primary) / 0.3)" },
          "50%": { boxShadow: "0 0 30px -4px hsl(var(--primary) / 0.5)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "orb-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.15" },
          "33%": { transform: "translate(10px, -10px) scale(1.02)", opacity: "0.2" },
          "66%": { transform: "translate(-5px, 5px) scale(0.98)", opacity: "0.12" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.15s ease-out",
        "accordion-up": "accordion-up 0.15s ease-out",
        shimmer: "shimmer 2s linear infinite",
        pulse: "pulse 2s ease-in-out infinite",
        "float-subtle": "float-subtle 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "orb-float": "orb-float 8s ease-in-out infinite",
      },
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
        "250": "250ms",
        "300": "300ms",
        "400": "400ms",
        "500": "500ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "spring-smooth": "cubic-bezier(0.25, 1, 0.5, 1)",
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-out-back": "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
