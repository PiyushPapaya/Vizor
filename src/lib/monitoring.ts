import * as Sentry from '@sentry/react';

// Initialize Sentry error monitoring
export const initSentry = () => {
  // Skip initialization if DSN is not configured
  const dsn = 'https://YOUR_SENTRY_DSN@sentry.io/YOUR_PROJECT_ID';
  
  if (!dsn || dsn.includes('YOUR_SENTRY_DSN')) {
    console.log('Sentry not configured - skipping initialization');
    return;
  }

  try {
    Sentry.init({
      dsn,
      
      // Set environment
      environment: process.env.NODE_ENV || 'development',
      
      // Sample rate for performance monitoring (0.0 - 1.0)
      tracesSampleRate: 1.0,
      
      // Before sending, filter out sensitive data
      beforeSend(event) {
        // Don't send events in development
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        return event;
      },
      
      // Ignore certain errors
      ignoreErrors: [
        // Browser extension errors
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        // Network errors
        'NetworkError',
        'Failed to fetch',
      ],
    });
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
};

// Capture exception manually - with safety check
export const captureException = (error: Error, context?: Record<string, any>) => {
  try {
    Sentry.captureException(error, {
      extra: context,
    });
  } catch (e) {
    console.error('Failed to capture exception:', e);
  }
};

// Capture message - with safety check
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  try {
    Sentry.captureMessage(message, level);
  } catch (e) {
    console.error('Failed to capture message:', e);
  }
};

// Set user context - with safety check
export const setUser = (user: { id: string; email?: string; username?: string }) => {
  try {
    Sentry.setUser(user);
  } catch (e) {
    console.error('Failed to set user:', e);
  }
};

// Clear user context - with safety check
export const clearUser = () => {
  try {
    Sentry.setUser(null);
  } catch (e) {
    console.error('Failed to clear user:', e);
  }
};

// Add breadcrumb - with safety check
export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  try {
    Sentry.addBreadcrumb(breadcrumb);
  } catch (e) {
    console.error('Failed to add breadcrumb:', e);
  }
};

// Set context - with safety check
export const setContext = (name: string, context: Record<string, any>) => {
  try {
    Sentry.setContext(name, context);
  } catch (e) {
    console.error('Failed to set context:', e);
  }
};

export default Sentry;
