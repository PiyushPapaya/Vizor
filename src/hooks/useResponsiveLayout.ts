import { useState, useEffect, useCallback, useMemo } from 'react';

export type ScreenSize = 'mobile' | 'mobileLg' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';
export type AspectRatioCategory = 'normal' | 'tall' | 'extraTall' | 'wide';
export type MobileViewMode = 'view' | 'edit' | 'fullscreen';

interface LayoutState {
  screenSize: ScreenSize;
  orientation: Orientation;
  aspectRatio: number;
  aspectRatioCategory: AspectRatioCategory;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isVeryTallScreen: boolean;
}

interface ResponsiveLayoutConfig {
  drawerHeights: {
    data: string;
    style: string;
    config: string;
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
  };
}

const breakpoints = {
  mobile: { max: 640 },
  mobileLg: { min: 641, max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024 },
};

const getScreenSize = (width: number): ScreenSize => {
  if (width <= breakpoints.mobile.max) return 'mobile';
  if (width <= breakpoints.mobileLg.max) return 'mobileLg';
  if (width <= breakpoints.tablet.max) return 'tablet';
  return 'desktop';
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
        isDesktop: true,
        isTouchDevice: false,
        isVeryTallScreen: false,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = height / width;
    const screenSize = getScreenSize(width);

    return {
      screenSize,
      orientation: getOrientation(width, height),
      aspectRatio,
      aspectRatioCategory: getAspectRatioCategory(aspectRatio),
      width,
      height,
      isMobile: screenSize === 'mobile' || screenSize === 'mobileLg',
      isTablet: screenSize === 'tablet',
      isDesktop: screenSize === 'desktop',
      isTouchDevice: isTouchDeviceCheck(),
      isVeryTallScreen: aspectRatio > 2,
    };
  });

  const [mobileViewMode, setMobileViewMode] = useState<MobileViewMode>('view');

  const updateLayout = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = height / width;
    const screenSize = getScreenSize(width);

    setState({
      screenSize,
      orientation: getOrientation(width, height),
      aspectRatio,
      aspectRatioCategory: getAspectRatioCategory(aspectRatio),
      width,
      height,
      isMobile: screenSize === 'mobile' || screenSize === 'mobileLg',
      isTablet: screenSize === 'tablet',
      isDesktop: screenSize === 'desktop',
      isTouchDevice: isTouchDeviceCheck(),
      isVeryTallScreen: aspectRatio > 2,
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
    const { screenSize, isVeryTallScreen, width } = state;

    // Drawer heights - adaptive based on content type
    const drawerHeights = {
      data: isVeryTallScreen ? 'max-h-[65vh]' : 'max-h-[70vh]',
      style: isVeryTallScreen ? 'max-h-[55vh]' : 'max-h-[60vh]',
      config: isVeryTallScreen ? 'max-h-[60vh]' : 'max-h-[65vh]',
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
    const spacing = {
      padding: screenSize === 'mobile' ? 8 : screenSize === 'mobileLg' ? 12 : 16,
      gap: screenSize === 'mobile' ? 6 : screenSize === 'mobileLg' ? 8 : 12,
    };

    return {
      drawerHeights,
      chartAreaHeight,
      fontSize,
      spacing,
    };
  }, [state]);

  // Mobile chart config helper
  const getMobileChartConfig = useCallback((baseConfig: Record<string, unknown>) => {
    const { width } = state;
    const isMobileScreen = width < 640;
    const isSmallMobile = width < 375;

    return {
      ...baseConfig,
      fontSize: isSmallMobile ? 9 : isMobileScreen ? 10 : 12,
      strokeWidth: isMobileScreen ? 1.5 : 2,
      pointSize: isSmallMobile ? 2 : isMobileScreen ? 3 : 5,
      barRadius: isMobileScreen ? 2 : 4,
      margin: {
        top: 10,
        right: isMobileScreen ? 10 : 20,
        bottom: isMobileScreen ? 35 : 30,
        left: isMobileScreen ? 25 : 40,
      },
    };
  }, [state]);

  return {
    ...state,
    mobileViewMode,
    setMobileViewMode,
    config,
    getMobileChartConfig,
    breakpoints,
  };
}

// Helper hook for drawer height based on active tab
export function useAdaptiveDrawerHeight(activeTab: 'data' | 'style' | 'config', isOpen: boolean) {
  const { config } = useResponsiveLayout();
  
  if (!isOpen) {
    return config.drawerHeights.collapsed;
  }
  
  return config.drawerHeights[activeTab];
}

// Export types for use in other components
export type { LayoutState, ResponsiveLayoutConfig };
