/**
 * Centralized Responsive Configuration
 * 
 * This file contains all responsive breakpoints, chart sizing, spacing,
 * and device-specific settings used throughout the application.
 * 
 * Benefits:
 * - Single source of truth for responsive values
 * - Easy to maintain and update
 * - Consistent across all components
 * - Type-safe configuration
 */

/**
 * Breakpoint values in pixels
 * Must match tailwind.config.ts breakpoints
 */
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const;

/**
 * Device categories based on screen width
 */
export type DeviceCategory = 
  | 'mobile'           // < 640px
  | 'mobileLg'         // 640px - 767px
  | 'tabletPortrait'   // 768px - 1023px
  | 'tabletLandscape'  // Same as tabletPortrait but different orientation
  | 'laptop'           // 1024px - 1279px
  | 'desktop'          // 1280px - 1919px
  | 'ultraWide';       // >= 1920px

/**
 * Chart-specific responsive settings
 * Used by ChartRenderer and chart components
 */
export const CHART_CONFIG = {
  mobile: {
    fontSize: 9,
    strokeWidth: 1.5,
    pointRadius: 2,
    barRadius: 3,
    margin: { top: 10, right: 10, bottom: 20, left: 10 },
    legendHeight: 30,
    tooltipFontSize: 10,
  },
  mobileLg: {
    fontSize: 10,
    strokeWidth: 1.5,
    pointRadius: 2.5,
    barRadius: 4,
    margin: { top: 15, right: 15, bottom: 25, left: 15 },
    legendHeight: 32,
    tooltipFontSize: 11,
  },
  tablet: {
    fontSize: 11,
    strokeWidth: 2,
    pointRadius: 3,
    barRadius: 4,
    margin: { top: 20, right: 20, bottom: 30, left: 20 },
    legendHeight: 35,
    tooltipFontSize: 12,
  },
  laptop: {
    fontSize: 12,
    strokeWidth: 2,
    pointRadius: 3,
    barRadius: 4,
    margin: { top: 20, right: 30, bottom: 30, left: 30 },
    legendHeight: 40,
    tooltipFontSize: 12,
  },
  desktop: {
    fontSize: 12,
    strokeWidth: 2,
    pointRadius: 4,
    barRadius: 4,
    margin: { top: 25, right: 40, bottom: 35, left: 40 },
    legendHeight: 45,
    tooltipFontSize: 13,
  },
  ultraWide: {
    fontSize: 16,
    strokeWidth: 3,
    pointRadius: 5,
    barRadius: 6,
    margin: { top: 30, right: 50, bottom: 40, left: 50 },
    legendHeight: 50,
    tooltipFontSize: 14,
  },
} as const;

/**
 * Touch target sizes for accessibility
 * Minimum recommended: 44x44px (iOS), 48x48px (Android)
 */
export const TOUCH_TARGETS = {
  minimum: 44,        // Minimum touch target size in pixels
  recommended: 48,    // Recommended for better UX
  comfortable: 56,    // Extra comfortable for primary actions
} as const;

/**
 * Responsive spacing scale
 * Based on 8px grid system
 */
export const SPACING = {
  mobile: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
  },
  tablet: {
    xs: 6,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  desktop: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    '2xl': 64,
  },
} as const;

/**
 * Container max widths
 */
export const CONTAINER = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  full: '100%',
} as const;

/**
 * Responsive panel sizes for resizable layouts
 */
export const PANEL_SIZES = {
  mobile: {
    min: '100%',    // Full width on mobile
    max: '100%',
    default: '100%',
  },
  tablet: {
    min: '30%',
    max: '70%',
    default: '50%',
  },
  desktop: {
    min: '25%',
    max: '75%',
    default: '35%',
  },
} as const;

/**
 * Chart height configurations for different contexts
 */
export const CHART_HEIGHTS = {
  preview: {
    mobile: 140,
    tablet: 180,
    desktop: 220,
  },
  editor: {
    mobile: 200,
    tablet: 300,
    desktop: 400,
  },
  fullscreen: {
    mobile: '60vh',
    tablet: '70vh',
    desktop: '80vh',
  },
} as const;

/**
 * Gallery and grid configurations
 */
export const GRID_CONFIG = {
  gallery: {
    mobile: 1,      // 1 column on mobile
    tablet: 2,      // 2 columns on tablet
    desktop: 3,     // 3 columns on desktop
    ultraWide: 4,   // 4 columns on ultra-wide
  },
  features: {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
  testimonials: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
} as const;

/**
 * Font size scales
 */
export const FONT_SIZES = {
  mobile: {
    xs: '0.625rem',   // 10px
    sm: '0.75rem',    // 12px
    base: '0.875rem', // 14px
    lg: '1rem',       // 16px
    xl: '1.125rem',   // 18px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    '4xl': '1.875rem',// 30px
  },
  desktop: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
} as const;

/**
 * Helper function to get device category from window width
 */
export function getDeviceCategory(width: number): DeviceCategory {
  if (width >= BREAKPOINTS['3xl']) return 'ultraWide';
  if (width >= BREAKPOINTS.xl) return 'desktop';
  if (width >= BREAKPOINTS.lg) return 'laptop';
  if (width >= BREAKPOINTS.md) return 'tabletPortrait';
  if (width >= BREAKPOINTS.sm) return 'mobileLg';
  return 'mobile';
}

/**
 * Helper function to get chart config for current device
 */
export function getChartConfigForDevice(width: number) {
  const device = getDeviceCategory(width);
  
  switch (device) {
    case 'mobile':
      return CHART_CONFIG.mobile;
    case 'mobileLg':
      return CHART_CONFIG.mobileLg;
    case 'tabletPortrait':
    case 'tabletLandscape':
      return CHART_CONFIG.tablet;
    case 'laptop':
      return CHART_CONFIG.laptop;
    case 'desktop':
      return CHART_CONFIG.desktop;
    case 'ultraWide':
      return CHART_CONFIG.ultraWide;
    default:
      return CHART_CONFIG.mobile;
  }
}

/**
 * Helper function to get chart height for context and device
 */
export function getChartHeight(
  context: keyof typeof CHART_HEIGHTS,
  width: number
): number | string {
  const device = getDeviceCategory(width);
  const heights = CHART_HEIGHTS[context];
  
  if (device === 'mobile' || device === 'mobileLg') {
    return heights.mobile;
  } else if (device === 'tabletPortrait' || device === 'tabletLandscape' || device === 'laptop') {
    return heights.tablet;
  } else {
    return heights.desktop;
  }
}

/**
 * Helper to check if device is mobile
 */
export function isMobileDevice(width: number): boolean {
  return width < BREAKPOINTS.md;
}

/**
 * Helper to check if device is tablet
 */
export function isTabletDevice(width: number): boolean {
  return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
}

/**
 * Helper to check if device is desktop
 */
export function isDesktopDevice(width: number): boolean {
  return width >= BREAKPOINTS.lg;
}

/**
 * Export all as a single config object
 */
export const RESPONSIVE_CONFIG = {
  breakpoints: BREAKPOINTS,
  chart: CHART_CONFIG,
  touchTargets: TOUCH_TARGETS,
  spacing: SPACING,
  container: CONTAINER,
  panelSizes: PANEL_SIZES,
  chartHeights: CHART_HEIGHTS,
  grid: GRID_CONFIG,
  fontSizes: FONT_SIZES,
  helpers: {
    getDeviceCategory,
    getChartConfigForDevice,
    getChartHeight,
    isMobileDevice,
    isTabletDevice,
    isDesktopDevice,
  },
} as const;

export default RESPONSIVE_CONFIG;
