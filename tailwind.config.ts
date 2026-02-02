import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '0.875rem',  // Reduced from 1rem
        sm: '1.25rem',        // Reduced from 1.5rem
        lg: '1.75rem',        // Reduced from 2rem
        xl: '2rem',           // Reduced from 2.5rem
        '2xl': '2.5rem',      // Reduced from 3rem
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
        "18": "3.9375rem",   // Reduced from 4.5rem (87.5%)
        "88": "19.25rem",    // Reduced from 22rem (87.5%)
        // 8px rhythm for consistent spacing - optimized
        "4.5": "0.984375rem",  // Reduced from 1.125rem
        "7": "1.53125rem",     // Reduced from 1.75rem
        "9": "1.96875rem",     // Reduced from 2.25rem
        "11": "2.40625rem",    // Reduced from 2.75rem
        "13": "2.84375rem",    // Reduced from 3.25rem
        "15": "3.28125rem",    // Reduced from 3.75rem
      },
      fontSize: {
        // Fluid typography for all screen sizes - Optimized for 87.5% scale
        'xs': ['clamp(0.6875rem, 0.65rem + 0.2vw, 0.8125rem)', { lineHeight: '1.5' }],
        'sm': ['clamp(0.8125rem, 0.765rem + 0.235vw, 0.9375rem)', { lineHeight: '1.5' }],
        'base': ['clamp(0.9375rem, 0.89rem + 0.235vw, 1.0625rem)', { lineHeight: '1.6' }],
        'lg': ['clamp(1.0625rem, 0.99rem + 0.36vw, 1.1875rem)', { lineHeight: '1.6' }],
        'xl': ['clamp(1.1875rem, 1.09rem + 0.485vw, 1.4375rem)', { lineHeight: '1.5' }],
        '2xl': ['clamp(1.4375rem, 1.29rem + 0.735vw, 1.9375rem)', { lineHeight: '1.4' }],
        '3xl': ['clamp(1.796875rem, 1.58rem + 1.086vw, 2.4375rem)', { lineHeight: '1.3' }],
        '4xl': ['clamp(2.15625rem, 1.87rem + 1.43vw, 2.9375rem)', { lineHeight: '1.2' }],
        '5xl': ['clamp(2.8125rem, 2.4rem + 2.06vw, 3.9375rem)', { lineHeight: '1.1' }],
      },
      boxShadow: {
        // Standardized shadow progression - Cleaner, more subtle
        "depth-sm": "0 1.5px 3px hsl(var(--foreground) / 0.03), 0 3px 10px hsl(var(--foreground) / 0.05)",
        "depth-md": "0 3px 5px hsl(var(--foreground) / 0.04), 0 6px 16px hsl(var(--foreground) / 0.07), 0 16px 32px hsl(var(--foreground) / 0.09)",
        "depth-lg": "0 6px 10px hsl(var(--foreground) / 0.05), 0 16px 32px hsl(var(--foreground) / 0.09), 0 32px 64px hsl(var(--foreground) / 0.11)",
        "glow": "0 0 32px -7px hsl(var(--primary) / 0.22)",
        "glow-lg": "0 0 48px -10px hsl(var(--primary) / 0.3)",
        "glow-primary": "0 3px 12px 0 hsl(var(--primary) / 0.35)",
        "3xl": "0 28px 48px -12px rgba(0, 0, 0, 0.25)",
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
