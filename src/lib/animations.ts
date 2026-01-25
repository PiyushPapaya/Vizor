/**
 * Centralized Animation Library
 * Professional spring-based animations using framer-motion
 * Enhanced with mobile-specific animations, gestures, and haptic patterns
 */

import { Variants } from 'framer-motion';

// =============================================================================
// SPRING CONFIGURATIONS
// =============================================================================

// Smooth spring physics for professional feel
export const springConfig = {
  type: 'spring' as const,
  damping: 25,
  stiffness: 300,
};

export const smoothSpring = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 400,
};

export const gentleSpring = {
  type: 'spring' as const,
  damping: 20,
  stiffness: 250,
};

// Mobile-optimized springs (faster response)
export const mobileSpring = {
  type: 'spring' as const,
  damping: 28,
  stiffness: 350,
  mass: 0.8,
};

export const quickSpring = {
  type: 'spring' as const,
  damping: 35,
  stiffness: 500,
};

export const bouncySpring = {
  type: 'spring' as const,
  damping: 15,
  stiffness: 400,
};

// =============================================================================
// TIMING CONSTANTS (for CSS animations and JS timeouts)
// =============================================================================

export const ANIMATION_TIMING = {
  // Instant feedback
  instant: 50,
  // Quick interactions
  fast: 150,
  // Standard transitions
  normal: 250,
  // Smooth movements
  slow: 400,
  // Drawer/modal transitions
  drawer: 300,
  drawerOpen: 400,
  // Page transitions
  page: 350,
  // Chart animations
  chart: 800,
  // Loading skeletons
  skeleton: 2000,
  // Auto-hide toolbar
  autoHide: 3000,
  // Debounce values
  debounce: {
    search: 300,
    slider: 50,
    autoSave: 2000,
  },
} as const;

// =============================================================================
// EASING FUNCTIONS
// =============================================================================

export const EASING = {
  // Standard smooth easing
  smooth: [0.16, 1, 0.3, 1] as const,
  // Ease out for entrances
  easeOut: [0, 0, 0.2, 1] as const,
  // Ease in for exits
  easeIn: [0.4, 0, 1, 1] as const,
  // Spring-like cubic bezier
  spring: [0.68, -0.55, 0.265, 1.55] as const,
  // Bounce effect
  bounce: [0.34, 1.56, 0.64, 1] as const,
  // Linear
  linear: [0, 0, 1, 1] as const,
} as const;

// =============================================================================
// HAPTIC FEEDBACK PATTERNS (for mobile devices)
// =============================================================================

export const HAPTIC_PATTERNS = {
  // Light tap - button press, toggle
  light: { duration: 10, intensity: 'light' },
  // Medium - selection, navigation
  medium: { duration: 25, intensity: 'medium' },
  // Heavy - destructive actions, confirmations
  heavy: { duration: 50, intensity: 'heavy' },
  // Selection - for radio buttons, checkboxes, pickers
  selection: { duration: 15, intensity: 'light' },
  // Success feedback
  success: { pattern: [10, 50, 10], intensity: 'medium' },
  // Error feedback
  error: { pattern: [10, 100, 10, 100, 10], intensity: 'heavy' },
  // Warning
  warning: { pattern: [25, 50, 25], intensity: 'medium' },
  // Swipe threshold reached
  threshold: { duration: 15, intensity: 'medium' },
} as const;

// Haptic feedback utility function
export const triggerHaptic = (
  pattern: keyof typeof HAPTIC_PATTERNS,
  enabled: boolean = true
): void => {
  if (!enabled || typeof navigator === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  const haptic = HAPTIC_PATTERNS[pattern];
  
  if ('pattern' in haptic) {
    navigator.vibrate(haptic.pattern);
  } else {
    navigator.vibrate(haptic.duration);
  }
};

// =============================================================================
// GESTURE THRESHOLDS
// =============================================================================

export const GESTURE_THRESHOLDS = {
  // Swipe distance to trigger action
  swipe: 50,
  // Pull-to-refresh distance
  pullToRefresh: 80,
  // Pinch zoom minimum scale change
  pinchZoom: 0.1,
  // Velocity threshold for momentum
  velocityThreshold: 500,
  // Long press duration (ms)
  longPress: 500,
  // Double tap max interval (ms)
  doubleTap: 300,
} as const;

// =============================================================================
// ZOOM LIMITS
// =============================================================================

export const ZOOM_LIMITS = {
  min: 0.5,
  max: 2.5,
  default: 1,
  step: 0.25,
} as const;

// =============================================================================
// DIALOG/MODAL ANIMATIONS
// =============================================================================

// Dialog/Modal animations
export const dialogVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springConfig,
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const dialogOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// Popover/Dropdown animations
export const popoverVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: smoothSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.15 },
  },
};

// Tooltip animations
export const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 35,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.1 },
  },
};

// Card/Item animations
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springConfig,
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// List item stagger effect
export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothSpring,
  },
};

// Slide in from side
export const slideInVariants = {
  left: {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: springConfig,
    },
    exit: { x: -50, opacity: 0, transition: { duration: 0.2 } },
  },
  right: {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: springConfig,
    },
    exit: { x: 50, opacity: 0, transition: { duration: 0.2 } },
  },
  top: {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: springConfig,
    },
    exit: { y: -50, opacity: 0, transition: { duration: 0.2 } },
  },
  bottom: {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: springConfig,
    },
    exit: { y: 50, opacity: 0, transition: { duration: 0.2 } },
  },
};

// Fade animations
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// Scale animations
export const scaleVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: springConfig,
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Hover animations (for use with whileHover)
export const hoverScale = {
  scale: 1.02,
  transition: { type: 'spring', damping: 20, stiffness: 400 },
};

export const hoverLift = {
  y: -2,
  scale: 1.01,
  transition: { type: 'spring', damping: 20, stiffness: 400 },
};

export const hoverGlow = {
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  transition: { duration: 0.2 },
};

// Tap animations (for use with whileTap)
export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const tapPress = {
  scale: 0.96,
  transition: { duration: 0.05 },
};

// Chart transition animations
export const chartTransitionVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Button group stagger
export const buttonGroupVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const buttonItemVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: smoothSpring,
  },
};

// Utility function for reduced motion preference
export const getReducedMotionVariants = (variants: Variants): Variants => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.01 } },
      exit: { opacity: 0, transition: { duration: 0.01 } },
    };
  }

  return variants;
};

// =============================================================================
// MOBILE-SPECIFIC ANIMATIONS
// =============================================================================

// Bottom sheet / drawer animations
export const bottomSheetVariants: Variants = {
  hidden: {
    y: '100%',
    opacity: 0.8,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 350,
    },
  },
  exit: {
    y: '100%',
    opacity: 0.8,
    transition: {
      duration: 0.25,
      ease: EASING.easeIn,
    },
  },
};

// Mobile drawer with snap points
export const drawerSnapVariants = {
  collapsed: { y: 'calc(100% - 64px)' },
  half: { y: '50%' },
  expanded: { y: '10%' },
  full: { y: 0 },
};

// Context toolbar (auto-hide)
export const contextToolbarVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: quickSpring,
  },
  exit: {
    y: 20,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: EASING.easeIn,
    },
  },
};

// Tab content transitions
export const tabContentVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: mobileSpring,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.15,
    },
  },
};

// Swipe navigation between tabs
export const swipeTabVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: mobileSpring,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  }),
};

// FAB (Floating Action Button) animations
export const fabVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: bouncySpring,
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
  pressed: {
    scale: 0.9,
    transition: {
      duration: 0.1,
    },
  },
};

// FAB menu expansion
export const fabMenuVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export const fabMenuItemVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: bouncySpring,
  },
  exit: {
    y: 10,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.1,
    },
  },
};

// Pull-to-refresh indicator
export const pullToRefreshVariants: Variants = {
  pulling: (progress: number) => ({
    opacity: Math.min(progress, 1),
    scale: Math.min(0.5 + progress * 0.5, 1),
    rotate: progress * 180,
  }),
  refreshing: {
    opacity: 1,
    scale: 1,
    rotate: 360,
    transition: {
      rotate: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },
  complete: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
    },
  },
};

// Card swipe actions (delete/duplicate)
export const swipeActionVariants: Variants = {
  idle: {
    x: 0,
  },
  swipingLeft: (x: number) => ({
    x: Math.max(x, -120),
  }),
  swipingRight: (x: number) => ({
    x: Math.min(x, 120),
  }),
  dismissed: (direction: 'left' | 'right') => ({
    x: direction === 'left' ? '-100%' : '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  }),
};

// Pinch zoom animation helper
export const zoomTransition = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 200,
};

// =============================================================================
// PHONE LANDSCAPE ANIMATIONS
// =============================================================================

export const splitViewVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const splitPanelVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: mobileSpring,
  },
};

// =============================================================================
// TABLET PORTRAIT ANIMATIONS
// =============================================================================

export const masterDetailVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const masterPanelVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothSpring,
  },
};

export const detailPanelVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...smoothSpring,
      delay: 0.1,
    },
  },
};

// =============================================================================
// EXPORT FLOW ANIMATIONS
// =============================================================================

export const stepWizardVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: mobileSpring,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  }),
};

export const exportPreviewVariants: Variants = {
  loading: {
    opacity: 0.5,
    scale: 0.98,
  },
  ready: {
    opacity: 1,
    scale: 1,
    transition: smoothSpring,
  },
  error: {
    opacity: 0.7,
    scale: 1,
  },
};

// =============================================================================
// ONBOARDING ANIMATIONS
// =============================================================================

export const spotlightVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const onboardingTooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: bouncySpring,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

// =============================================================================
// LOADING STATE ANIMATIONS
// =============================================================================

export const skeletonPulse = {
  opacity: [0.4, 0.7, 0.4],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const progressBarVariants: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  animate: (progress: number) => ({
    scaleX: progress,
    transition: smoothSpring,
  }),
  complete: {
    scaleX: 1,
    transition: smoothSpring,
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get appropriate animation based on device/preference
export const getResponsiveAnimation = <T extends Variants>(
  standard: T,
  reduced?: Partial<T>
): T => {
  if (prefersReducedMotion()) {
    return {
      ...standard,
      ...reduced,
      visible: {
        opacity: 1,
        transition: { duration: 0.01 },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.01 },
      },
    } as T;
  }
  return standard;
};

// Create staggered animation with configurable delay
export const createStaggerVariants = (
  staggerDelay: number = 0.05,
  initialDelay: number = 0
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

// Create item variants for staggered lists
export const createStaggerItemVariants = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance: number = 20
): Variants => {
  if (direction === 'up' || direction === 'down') {
    const value = direction === 'up' ? distance : -distance;
    return {
      hidden: {
        opacity: 0,
        y: value,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: mobileSpring,
      },
    };
  } else {
    const value = direction === 'left' ? distance : -distance;
    return {
      hidden: {
        opacity: 0,
        x: value,
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: mobileSpring,
      },
    };
  }
};