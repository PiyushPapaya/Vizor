/**
 * Centralized logging utility with environment-aware levels
 * Replaces scattered console.log statements throughout the app
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, context || '');
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || '');
    }
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context || '');
    
    if (this.isProduction) {
      this.sendToMonitoring('warning', message, context);
    }
  }

  /**
   * Log error messages (always logged, sent to monitoring in production)
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    console.error(`[ERROR] ${message}`, error, context || '');
    
    if (this.isProduction) {
      this.sendToMonitoring('error', message, {
        ...context,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : error,
      });
    }
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, duration: number, context?: LogContext): void {
    const message = `${metric}: ${duration.toFixed(2)}ms`;
    
    if (this.isDevelopment) {
      console.log(`[PERF] ${message}`, context || '');
    }
    
    if (this.isProduction && duration > 1000) {
      this.sendToMonitoring('performance', message, { ...context, duration });
    }
  }

  /**
   * Send logs to external monitoring service (Sentry, PostHog, etc.)
   */
  private sendToMonitoring(level: string, message: string, context?: any): void {
    // Integration point for Sentry, PostHog, or other monitoring
    // Currently a no-op, but can be extended when monitoring is configured
    try {
      // Example: Sentry.captureMessage(message, { level, extra: context });
      // Example: posthog.capture('log_event', { level, message, ...context });
    } catch (err) {
      // Fail silently to not break app if monitoring is unavailable
      console.error('Failed to send log to monitoring:', err);
    }
  }

  /**
   * Measure execution time of async functions
   */
  async measure<T>(
    label: string,
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.performance(label, duration, context);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`${label} failed after ${duration.toFixed(2)}ms`, error, context);
      throw error;
    }
  }

  /**
   * Measure execution time of sync functions
   */
  measureSync<T>(
    label: string,
    fn: () => T,
    context?: LogContext
  ): T {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      this.performance(label, duration, context);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`${label} failed after ${duration.toFixed(2)}ms`, error, context);
      throw error;
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience exports
export const logDebug = logger.debug.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logError = logger.error.bind(logger);
export const logPerformance = logger.performance.bind(logger);
export const measureAsync = logger.measure.bind(logger);
export const measureSync = logger.measureSync.bind(logger);
