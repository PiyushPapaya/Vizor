import posthog from 'posthog-js';

// Initialize PostHog analytics
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    // Replace with your actual PostHog API key and host
    const apiKey = 'phc_YOUR_PROJECT_API_KEY';
    
    // Skip initialization if API key is not configured
    if (!apiKey || apiKey.includes('YOUR_PROJECT_API_KEY')) {
      console.log('PostHog not configured - skipping initialization');
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
