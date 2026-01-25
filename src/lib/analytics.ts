import posthog from 'posthog-js';
import { logger } from './logger';

// Initialize PostHog analytics
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    // Use environment variable or fall back to placeholder
    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY || 'phc_YOUR_PROJECT_API_KEY';
    
    // Skip initialization if API key is not configured
    if (!apiKey || apiKey.includes('YOUR_PROJECT_API_KEY')) {
      console.log('PostHog not configured - skipping initialization. Set VITE_POSTHOG_API_KEY in .env file.');
      return;
    }

    try {
      posthog.init(apiKey, {
        api_host: 'https://app.posthog.com',
        // Capture pageviews automatically
        capture_pageview: true,
        // Capture performance metrics
        capture_performance: true,
        // Disable in development
        autocapture: process.env.NODE_ENV === 'production',
        // Respect user privacy
        opt_out_capturing_by_default: false,
      });
    } catch (error) {
      console.error('Failed to initialize PostHog:', error);
    }
  }
};

// Track custom events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      // Silently fail if PostHog not initialized
    }
  }
};

// Identify user
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, properties);
  }
};

// Reset user (on logout)
export const resetUser = () => {
  if (typeof window !== 'undefined') {
    posthog.reset();
  }
};

// Track page views
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined') {
    posthog.capture('$pageview', { path });
  }
};

export default posthog;
