import * as Sentry from '@sentry/react';
import { logger } from './logger';

// Initialize Sentry error monitoring
export const initSentry = () => {
  // Use environment variable or fall back to placeholder
  const dsn = import.meta.env.VITE_SENTRY_DSN || 'https://YOUR_SENTRY_DSN@sentry.io/YOUR_PROJECT_ID';
  
  if (!dsn || dsn.includes('YOUR_SENTRY_DSN')) {
    logger.info('Sentry not configured - skipping initialization. Set VITE_SENTRY_DSN in .env file.');
    return;
  }

  try {
    Sentry.init({
      dsn,
      
      // Set environment
      environment: import.meta.env.MODE || 'development',
      
      // Sample rate for performance monitoring (0.0 - 1.0)
      tracesSampleRate: 1.0,
      
      // Before sending, filter out sensitive data
      beforeSend(event) {
        // Don't send events in development
        if (import.meta.env.DEV) {
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
    logger.error('Failed to initialize Sentry', error, { component: 'monitoring' });
  }
};

// Capture exception manually - with safety check
export const captureException = (error: Error, context?: Record<string, unknown>) => {
  try {
    Sentry.captureException(error, {
      extra: context,
    });
  } catch (e) {
    logger.error('Failed to capture exception in Sentry', e, { originalError: error });
  }
};

// Capture message - with safety check
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  try {
    Sentry.captureMessage(message, level);
  } catch (e) {
    logger.error('Failed to capture message in Sentry', e, { message });
  }
};

// Set user context - with safety check
export const setUser = (user: { id: string; email?: string; username?: string }) => {
  try {
    Sentry.setUser(user);
  } catch (e) {
    logger.error('Failed to set user in Sentry', e);
  }
};

// Clear user context - with safety check
export const clearUser = () => {
  try {
    Sentry.setUser(null);
  } catch (e) {
    logger.error('Failed to clear user in Sentry', e);
  }
};

// Add breadcrumb - with safety check
export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  try {
    Sentry.addBreadcrumb(breadcrumb);
  } catch (e) {
    logger.error('Failed to add breadcrumb in Sentry', e);
  }
};

// Set context - with safety check
export const setContext = (name: string, context: Record<string, unknown>) => {
  try {
    Sentry.setContext(name, context);
  } catch (e) {
    logger.error('Failed to set context in Sentry', e, { contextName: name });
  }
};

export default Sentry;
