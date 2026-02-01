import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-scroll-area',
          ],
          'chart-vendor': ['recharts'],
          'utils-vendor': ['clsx', 'tailwind-merge', 'date-fns', 'zustand'],
        },
      },
    },
    // Increase chunk size warning limit (default is 500kb)
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize source maps for production
    sourcemap: mode === 'development',
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'recharts',
      'framer-motion',
      'lucide-react',
      'zustand',
    ],
    exclude: ['@lovable-tagger'],
  },
}));
