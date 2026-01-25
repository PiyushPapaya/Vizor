import { useState, useEffect, useCallback, useMemo } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type ScreenSize = 'mobile' | 'mobileLg' | 'tabletPortrait' | 'tabletLandscape' | 'laptop' | 'desktop' | 'ultraWide';
export type Orientation = 'portrait' | 'landscape';
export type AspectRatioCategory = 'normal' | 'tall' | 'extraTall' | 'wide';
export type MobileViewMode = 'view' | 'edit' | 'fullscreen';
export type DeviceType = 'phone' | 'tablet' | 'laptop' | 'desktop' | 'ultraWide';

interface LayoutState {
  screenSize: ScreenSize;
  orientation: Orientation;
  aspectRatio: number;
  aspectRatioCategory: AspectRatioCategory;
  width: number;
  height: number;
  // Device category flags
  isMobile: boolean;        // Phone (any orientation)
  isTablet: boolean;        // Tablet (any orientation)
  isLaptop: boolean;        // Laptop/small desktop (1024-1279px)
  isDesktop: boolean;       // Desktop (1280-1919px)
  isUltraWide: boolean;     // Ultra-wide/4K (1920px+)
  // More specific flags
  isPhonePortrait: boolean;
  isPhoneLandscape: boolean;
  isTabletPortrait: boolean;
  isTabletLandscape: boolean;
  // Capability flags
  isTouchDevice: boolean;
  isVeryTallScreen: boolean;
  // Layout mode (determines which layout to render)
  layoutMode: 'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'laptop' | 'desktop' | 'ultra-wide';
  deviceType: DeviceType;
}

interface ResponsiveLayoutConfig {
  drawerHeights: {
    data: string;
    style: string;
    config: string;
    export: string;
    collapsed: string;
  };
  chartAreaHeight: {
    drawerOpen: string;
    drawerClosed: string;
  };
  fontSize: {
    base: number;
    heading: number;
    chart: number;
    small: number;
  };
  spacing: {
    padding: number;
    gap: number;
    containerPadding: string;
  };
  // Mobile-specific config
  bottomNavHeight: number;
  headerHeight: number;
  actionDockHeight: number;
  safeAreaBottom: boolean;
}

// =============================================================================
// BREAKPOINTS
// =============================================================================

const breakpoints = {
  mobile: { max: 640 },
  mobileLg: { min: 641, max: 767 },
  tabletPortrait: { min: 768, max: 1023 },
  tabletLandscape: { min: 768, max: 1023 }, // Same width range, but landscape
  laptop: { min: 1024, max: 1279 },
  desktop: { min: 1280, max: 1919 },
  ultraWide: { min: 1920 },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getScreenSize = (width: number, height: number): ScreenSize => {
  const orientation = getOrientation(width, height);
  
  if (width <= breakpoints.mobile.max) return 'mobile';
  if (width <= breakpoints.mobileLg.max) return 'mobileLg';
  
  // Tablet range - differentiate by orientation
  if (width >= breakpoints.tabletPortrait.min && width <= breakpoints.tabletPortrait.max) {
    return orientation === 'portrait' ? 'tabletPortrait' : 'tabletLandscape';
  }
  
  // Laptop range (1024-1279px)
  if (width >= breakpoints.laptop.min && width <= breakpoints.laptop.max!) return 'laptop';
  
  // Desktop range (1280-1919px)
  if (width >= breakpoints.desktop.min && width <= breakpoints.desktop.max!) return 'desktop';
  
  // Ultra-wide (1920px+)
  return 'ultraWide';
};

const getOrientation = (width: number, height: number): Orientation => {
  return height > width ? 'portrait' : 'landscape';
};

const getAspectRatioCategory = (ratio: number): AspectRatioCategory => {
  // ratio = height / width
  if (ratio < 1) return 'wide';      // Landscape/wide screens
  if (ratio < 1.8) return 'normal';   // Normal portrait (like 9:16)
  if (ratio < 2.2) return 'tall';     // Tall screens (like 9:19.5)
  return 'extraTall';                 // Very tall screens (like 9:21+)
};

const isTouchDeviceCheck = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const getDeviceType = (width: number): DeviceType => {
  if (width <= breakpoints.mobileLg.max) return 'phone';
  if (width <= breakpoints.tabletPortrait.max) return 'tablet';
  if (width <= breakpoints.laptop.max!) return 'laptop';
  if (width <= breakpoints.desktop.max!) return 'desktop';
  return 'ultraWide';
};

const getLayoutMode = (screenSize: ScreenSize): 'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'laptop' | 'desktop' | 'ultra-wide' => {
  switch (screenSize) {
    case 'mobile':
    case 'mobileLg':
      return 'mobile';
    case 'tabletPortrait':
      return 'tablet-portrait';
    case 'tabletLandscape':
      return 'tablet-landscape';
    case 'laptop':
      return 'laptop';
    case 'desktop':
      return 'desktop';
    case 'ultraWide':
      return 'ultra-wide';
    default:
      return 'desktop';
  }
};

// =============================================================================
// MAIN HOOK
// =============================================================================

export function useResponsiveLayout() {
  const [state, setState] = useState<LayoutState>(() => {
    if (typeof window === 'undefined') {
      return {
        screenSize: 'desktop',
        orientation: 'landscape',
        aspectRatio: 16 / 9,
        aspectRatioCategory: 'wide',
        width: 1920,
        height: 1080,
        isMobile: false,
        isTablet: false,
        isLaptop: false,
        isDesktop: false,
        isUltraWide: true,
        isPhonePortrait: false,
        isPhoneLandscape: false,
        isTabletPortrait: false,
        isTabletLandscape: false,
        isTouchDevice: false,
        isVeryTallScreen: false,
        layoutMode: 'ultra-wide',
        deviceType: 'ultraWide',
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = height / width;
    const orientation = getOrientation(width, height);
    const screenSize = getScreenSize(width, height);
    const deviceType = getDeviceType(width);

    return {
      screenSize,
      orientation,
      aspectRatio,
      aspectRatioCategory: getAspectRatioCategory(aspectRatio),
      width,
      height,
      isMobile: deviceType === 'phone',
      isTablet: deviceType === 'tablet',
      isLaptop: deviceType === 'laptop',
      isDesktop: deviceType === 'desktop',
      isUltraWide: deviceType === 'ultraWide',
      isPhonePortrait: deviceType === 'phone' && orientation === 'portrait',
      isPhoneLandscape: deviceType === 'phone' && orientation === 'landscape',
      isTabletPortrait: deviceType === 'tablet' && orientation === 'portrait',
      isTabletLandscape: deviceType === 'tablet' && orientation === 'landscape',
      isTouchDevice: isTouchDeviceCheck(),
      isVeryTallScreen: aspectRatio > 2,
      layoutMode: getLayoutMode(screenSize),
      deviceType,
    };
  });

  const [mobileViewMode, setMobileViewMode] = useState<MobileViewMode>('view');
  const [activeDrawer, setActiveDrawer] = useState<'data' | 'style' | 'config' | 'export' | null>(null);

  const updateLayout = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = height / width;
    const orientation = getOrientation(width, height);
    const screenSize = getScreenSize(width, height);
    const deviceType = getDeviceType(width);

    setState({
      screenSize,
      orientation,
      aspectRatio,
      aspectRatioCategory: getAspectRatioCategory(aspectRatio),
      width,
      height,
      isMobile: deviceType === 'phone',
      isTablet: deviceType === 'tablet',
      isLaptop: deviceType === 'laptop',
      isDesktop: deviceType === 'desktop',
      isUltraWide: deviceType === 'ultraWide',
      isPhonePortrait: deviceType === 'phone' && orientation === 'portrait',
      isPhoneLandscape: deviceType === 'phone' && orientation === 'landscape',
      isTabletPortrait: deviceType === 'tablet' && orientation === 'portrait',
      isTabletLandscape: deviceType === 'tablet' && orientation === 'landscape',
      isTouchDevice: isTouchDeviceCheck(),
      isVeryTallScreen: aspectRatio > 2,
      layoutMode: getLayoutMode(screenSize),
      deviceType,
    });
  }, []);

  useEffect(() => {
    updateLayout();

    const handleResize = () => {
      requestAnimationFrame(updateLayout);
    };

    const handleOrientationChange = () => {
      // Delay to allow browser to update dimensions
      setTimeout(updateLayout, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Listen for visual viewport changes (mobile keyboards, etc.)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [updateLayout]);

  // Get responsive configuration based on current state
  const config = useMemo((): ResponsiveLayoutConfig => {
    const { screenSize, isVeryTallScreen, width, layoutMode, orientation } = state;

    // Drawer heights - adaptive based on content type and screen
    const drawerHeights = {
      data: isVeryTallScreen ? 'max-h-[65vh]' : 'max-h-[70vh]',
      style: isVeryTallScreen ? 'max-h-[55vh]' : 'max-h-[65vh]',
      config: isVeryTallScreen ? 'max-h-[65vh]' : 'max-h-[75vh]',
      export: isVeryTallScreen ? 'max-h-[75vh]' : 'max-h-[85vh]',
      collapsed: 'max-h-[8vh]',
    };

    // Chart area heights
    const chartAreaHeight = {
      drawerOpen: isVeryTallScreen ? 'h-[35vh]' : 'h-[30vh]',
      drawerClosed: 'h-[calc(100vh-120px)]',
    };

    // Font sizes - responsive
    const baseFontSize = width < 375 ? 12 : width < 640 ? 13 : 14;
    const fontSize = {
      base: baseFontSize,
      heading: baseFontSize + 2,
      chart: Math.max(9, baseFontSize - 3),
      small: Math.max(10, baseFontSize - 2),
    };

    // Spacing
    const getSpacing = () => {
      if (screenSize === 'mobile') return { padding: 8, gap: 6, containerPadding: 'p-3' };
      if (screenSize === 'mobileLg') return { padding: 12, gap: 8, containerPadding: 'p-3' };
      if (screenSize === 'tabletPortrait') return { padding: 16, gap: 12, containerPadding: 'p-4' };
      return { padding: 16, gap: 12, containerPadding: 'p-4' };
    };

    const spacing = getSpacing();

    // Component dimensions based on layout mode
    const getComponentDimensions = () => {
      if (layoutMode === 'mobile') {
        return {
          bottomNavHeight: 68, // Plus safe area
          headerHeight: 56,
          actionDockHeight: 64,
          safeAreaBottom: true,
        };
      }
      if (layoutMode === 'tablet-portrait') {
        return {
          bottomNavHeight: 0, // No bottom nav in tablet portrait
          headerHeight: 64,
          actionDockHeight: 0,
          safeAreaBottom: false,
        };
      }
      return {
        bottomNavHeight: 0,
        headerHeight: 64,
        actionDockHeight: 0,
        safeAreaBottom: false,
      };
    };

    return {
      drawerHeights,
      chartAreaHeight,
      fontSize,
      spacing,
      ...getComponentDimensions(),
    };
  }, [state]);

  // Mobile chart config helper
  const getMobileChartConfig = useCallback((baseConfig: Record<string, unknown>) => {
    const { width, layoutMode, orientation } = state;
    const isMobileScreen = width < 640;
    const isSmallMobile = width < 375;
    const isLandscape = orientation === 'landscape';

    // Landscape phone gets different margins
    if (isMobileScreen && isLandscape) {
      return {
        ...baseConfig,
        fontSize: 9,
        strokeWidth: 1.5,
        pointSize: 2,
        barRadius: 2,
        margin: {
          top: 5,
          right: 8,
          bottom: 25,
          left: 20,
        },
      };
    }

    // Portrait phone
    if (isMobileScreen) {
      return {
        ...baseConfig,
        fontSize: isSmallMobile ? 9 : 10,
        strokeWidth: 1.5,
        pointSize: isSmallMobile ? 2 : 3,
        barRadius: 2,
        margin: {
          top: 10,
          right: 10,
          bottom: 35,
          left: 25,
        },
      };
    }

    // Tablet portrait - more room
    if (layoutMode === 'tablet-portrait') {
      return {
        ...baseConfig,
        fontSize: 11,
        strokeWidth: 2,
        pointSize: 4,
        barRadius: 3,
        margin: {
          top: 15,
          right: 15,
          bottom: 30,
          left: 35,
        },
      };
    }

    // Desktop/tablet landscape
    return {
      ...baseConfig,
      fontSize: 12,
      strokeWidth: 2,
      pointSize: 5,
      barRadius: 4,
      margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40,
      },
    };
  }, [state]);

  // Get layout-specific class names
  const getLayoutClasses = useCallback(() => {
    const { layoutMode, isPhoneLandscape } = state;

    if (isPhoneLandscape) {
      return {
        container: 'flex flex-row h-screen',
        chartArea: 'w-[65%] h-full',
        controlsArea: 'w-[35%] h-full border-l border-border/40',
        header: 'h-14',
      };
    }

    if (layoutMode === 'tablet-portrait') {
      return {
        container: 'flex flex-col h-screen',
        chartArea: 'h-[55vh] w-full',
        controlsArea: 'h-[45vh] w-full border-t border-border/50',
        header: 'h-16',
      };
    }

    if (layoutMode === 'tablet-landscape') {
      return {
        container: 'flex flex-row h-screen',
        chartArea: 'w-[65%] h-full',
        controlsArea: 'w-[35%] h-full border-l border-border/40',
        header: 'h-16',
      };
    }

    if (layoutMode === 'mobile') {
      return {
        container: 'flex flex-col h-screen',
        chartArea: 'flex-1 w-full',
        controlsArea: 'w-full', // Controlled by drawers
        header: 'h-14',
      };
    }

    if (layoutMode === 'laptop') {
      return {
        container: 'flex flex-row h-screen',
        chartArea: 'flex-1 h-full',
        controlsArea: 'w-[32%] min-w-[300px] max-w-[380px] h-full',
        header: 'h-16',
      };
    }

    if (layoutMode === 'ultra-wide') {
      return {
        container: 'flex flex-row h-screen max-w-[1920px] mx-auto',
        chartArea: 'flex-1 h-full max-w-[1400px]',
        controlsArea: 'w-[28%] min-w-[320px] max-w-[450px] h-full',
        header: 'h-16',
      };
    }

    // Desktop (1280-1919px)
    return {
      container: 'flex flex-row h-screen',
      chartArea: 'flex-1 h-full',
      controlsArea: 'w-[28%] min-w-[280px] max-w-[400px] h-full',
      header: 'h-16',
    };
  }, [state]);

  return {
    ...state,
    mobileViewMode,
    setMobileViewMode,
    activeDrawer,
    setActiveDrawer,
    config,
    getMobileChartConfig,
    getLayoutClasses,
    breakpoints,
  };
}

// Helper hook for drawer height based on active tab
export function useAdaptiveDrawerHeight(activeTab: 'data' | 'style' | 'config' | 'export', isOpen: boolean) {
  const { config } = useResponsiveLayout();
  
  if (!isOpen) {
    return config.drawerHeights.collapsed;
  }
  
  return config.drawerHeights[activeTab];
}

// Helper hook for determining if we should use mobile gestures
export function useShouldUseMobileGestures() {
  const { isTouchDevice, layoutMode } = useResponsiveLayout();
  return isTouchDevice && (layoutMode === 'mobile' || layoutMode === 'tablet-portrait');
}

// Helper hook for getting safe area insets
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !CSS.supports('padding-top', 'env(safe-area-inset-top)')) {
      return;
    }

    const updateInsets = () => {
      const style = getComputedStyle(document.documentElement);
      setInsets({
        top: parseInt(style.getPropertyValue('--sat') || '0', 10),
        bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
        left: parseInt(style.getPropertyValue('--sal') || '0', 10),
        right: parseInt(style.getPropertyValue('--sar') || '0', 10),
      });
    };

    // Set CSS custom properties for safe area insets
    document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
    document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)');
    document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)');

    updateInsets();
    window.addEventListener('resize', updateInsets);
    window.addEventListener('orientationchange', updateInsets);

    return () => {
      window.removeEventListener('resize', updateInsets);
      window.removeEventListener('orientationchange', updateInsets);
    };
  }, []);

  return insets;
}

// Export types for use in other components
export type { LayoutState, ResponsiveLayoutConfig };
