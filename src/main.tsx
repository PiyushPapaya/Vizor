import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n"; // Initialize i18n before app renders
import { initPostHog } from "./lib/analytics";
import { initSentry } from "./lib/monitoring";
import { initAllPerformanceMonitoring } from "./lib/performance";
import { generateStructuredData } from "./lib/seo";
import { logger } from "./lib/logger";
import { applyTheme, getStoredThemeMode } from "./lib/theme";
import { initializeAccessibility } from "./components/AccessibilitySettings";

// Apply the persisted theme before first paint to avoid a flash of the wrong theme.
applyTheme(getStoredThemeMode());

// Apply saved + system accessibility preferences (high contrast, reduced motion, etc.)
try {
  initializeAccessibility();
} catch (error) {
  logger.error('Failed to initialize accessibility preferences', error);
}

// Initialize analytics and monitoring (with error handling)
try {
  initPostHog();
} catch (error) {
  console.error('Failed to initialize analytics:', error);
}

try {
  initSentry();
} catch (error) {
  logger.error('Failed to initialize error monitoring', error);
}

try {
  initAllPerformanceMonitoring();
} catch (error) {
  logger.error('Failed to initialize performance monitoring', error);
}

// Add structured data for SEO
try {
  generateStructuredData();
} catch (error) {
  console.error('Failed to add structured data:', error);
}

createRoot(document.getElementById("root")!).render(<App />);
