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
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React and UI framework
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Chart library - large dependency
          'recharts-vendor': ['recharts'],
          
          // Animation library
          'animation-vendor': ['framer-motion'],
          
          // Radix UI components - split into groups
          'radix-ui-core': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
          ],
          'radix-ui-extended': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-popover',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
          ],
          
          // Export utilities - lazy loaded
          'export-utils': ['html2canvas', 'jspdf'],
          
          // Data processing
          'data-utils': ['xlsx'],
          
          // Internationalization
          'i18n-vendor': ['i18next', 'react-i18next'],
          
          // Icons
          'icons-vendor': ['lucide-react'],
        },
      },
    },
    // Increase chunk size warning limit for better optimization
    chunkSizeWarningLimit: 1000,
    
    // Enable source maps for production debugging (optional)
    sourcemap: mode === 'production' ? false : true,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'recharts',
      'framer-motion',
      'i18next',
      'react-i18next',
    ],
    exclude: [
      // Exclude heavy dependencies that should be lazy-loaded
      'html2canvas',
      'jspdf',
    ],
  },
}));
