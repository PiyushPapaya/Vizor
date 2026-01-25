// Performance monitoring utilities
import { trackEvent } from './analytics';

export interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  INP?: number; // Interaction to Next Paint
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 },
};

// Rating helper
const getRating = (metric: keyof typeof THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = THRESHOLDS[metric];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
};

// Track Core Web Vitals using Web Vitals API
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Track performance metrics when available
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
        const lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
        
        trackEvent('web_vitals_lcp', {
          value: lcp,
          rating: getRating('LCP', lcp),
          url: window.location.pathname,
        });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          
          trackEvent('web_vitals_fid', {
            value: fid,
            rating: getRating('FID', fid),
            url: window.location.pathname,
          });
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // Report CLS on page hide
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          trackEvent('web_vitals_cls', {
            value: clsValue,
            rating: getRating('CLS', clsValue),
            url: window.location.pathname,
          });
        }
      });

    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
    }
  }

  // Track Navigation Timing API metrics
  if ('performance' in window && 'getEntriesByType' in window.performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigationTiming) {
          // Time to First Byte
          const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
          
          // First Contentful Paint
          const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
          const fcp = fcpEntry ? fcpEntry.startTime : 0;

          trackEvent('performance_metrics', {
            ttfb,
            ttfb_rating: getRating('TTFB', ttfb),
            fcp,
            fcp_rating: fcp ? getRating('FCP', fcp) : 'unknown',
            domComplete: navigationTiming.domComplete,
            domInteractive: navigationTiming.domInteractive,
            loadComplete: navigationTiming.loadEventEnd,
            url: window.location.pathname,
          });
        }
      }, 0);
    });
  }
};

// Measure custom performance marks
export const measurePerformance = (name: string, startMark: string, endMark?: string) => {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  try {
    if (!endMark) {
      performance.mark(name);
    } else {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name, 'measure')[0];
      
      if (measure) {
        trackEvent('custom_performance', {
          name,
          duration: measure.duration,
          url: window.location.pathname,
        });
      }
    }
  } catch (error) {
    console.error('Failed to measure performance:', error);
  }
};

// Track component render time
export const trackRenderTime = (componentName: string, duration: number) => {
  if (duration > 100) { // Only track slow renders (> 100ms)
    trackEvent('slow_render', {
      component: componentName,
      duration,
      url: window.location.pathname,
    });
  }
};

// Track resource loading performance
export const trackResourceTiming = () => {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      // Group by resource type
      const byType: Record<string, { count: number; totalDuration: number; totalSize: number }> = {};
      
      resources.forEach((resource) => {
        const type = resource.initiatorType;
        if (!byType[type]) {
          byType[type] = { count: 0, totalDuration: 0, totalSize: 0 };
        }
        
        byType[type].count++;
        byType[type].totalDuration += resource.duration;
        byType[type].totalSize += resource.transferSize || 0;
      });

      trackEvent('resource_timing', {
        resources: byType,
        totalResources: resources.length,
        url: window.location.pathname,
      });
    }, 1000);
  });
};

// Performance budget checker
export const checkPerformanceBudget = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      // Calculate total transfer size
      const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
      
      // Performance budgets
      const budgets = {
        totalSize: 5 * 1024 * 1024, // 5 MB
        jsSize: 1 * 1024 * 1024, // 1 MB
        cssSize: 500 * 1024, // 500 KB
        imageSize: 2 * 1024 * 1024, // 2 MB
        loadTime: 3000, // 3 seconds
      };

      const jsSize = resources
        .filter(r => r.initiatorType === 'script')
        .reduce((sum, r) => sum + (r.transferSize || 0), 0);
        
      const cssSize = resources
        .filter(r => r.initiatorType === 'link' || r.initiatorType === 'css')
        .reduce((sum, r) => sum + (r.transferSize || 0), 0);
        
      const imageSize = resources
        .filter(r => r.initiatorType === 'img')
        .reduce((sum, r) => sum + (r.transferSize || 0), 0);

      const budgetViolations: string[] = [];
      if (totalSize > budgets.totalSize) budgetViolations.push('total_size');
      if (jsSize > budgets.jsSize) budgetViolations.push('js_size');
      if (cssSize > budgets.cssSize) budgetViolations.push('css_size');
      if (imageSize > budgets.imageSize) budgetViolations.push('image_size');
      if (navigationTiming.loadEventEnd > budgets.loadTime) budgetViolations.push('load_time');

      if (budgetViolations.length > 0) {
        trackEvent('performance_budget_violation', {
          violations: budgetViolations,
          totalSizeMB,
          jsSizeKB: (jsSize / 1024).toFixed(2),
          cssSizeKB: (cssSize / 1024).toFixed(2),
          imageSizeKB: (imageSize / 1024).toFixed(2),
          loadTimeMs: navigationTiming.loadEventEnd,
          url: window.location.pathname,
        });
      }
    }, 2000);
  });
};

// Initialize all performance monitoring
export const initAllPerformanceMonitoring = () => {
  initPerformanceMonitoring();
  trackResourceTiming();
  checkPerformanceBudget();
};

export default {
  initPerformanceMonitoring,
  measurePerformance,
  trackRenderTime,
  trackResourceTiming,
  checkPerformanceBudget,
  initAllPerformanceMonitoring,
};
