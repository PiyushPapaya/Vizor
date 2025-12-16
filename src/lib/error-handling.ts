/**
 * Enhanced error handling utilities for ChartForge
 * Provides retry logic, better error messages, and error tracking
 */

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxAttempts) {
        const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
        onRetry?.(attempt, lastError);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new EnhancedError(
    `Failed after ${maxAttempts} attempts: ${lastError!.message}`,
    'RETRY_EXHAUSTED',
    lastError!
  );
}

/**
 * Enhanced error class with context and error codes
 */
export class EnhancedError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'EnhancedError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Error codes for common scenarios
 */
export const ErrorCodes = {
  // Data errors
  INVALID_DATA_FORMAT: 'INVALID_DATA_FORMAT',
  DATA_PARSING_FAILED: 'DATA_PARSING_FAILED',
  DATA_VALIDATION_FAILED: 'DATA_VALIDATION_FAILED',
  
  // File errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE_TYPE: 'UNSUPPORTED_FILE_TYPE',
  FILE_READ_FAILED: 'FILE_READ_FAILED',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  TIMEOUT: 'TIMEOUT',
  
  // Export errors
  EXPORT_FAILED: 'EXPORT_FAILED',
  CLIPBOARD_ERROR: 'CLIPBOARD_ERROR',
  
  // Storage errors
  STORAGE_FULL: 'STORAGE_FULL',
  STORAGE_ERROR: 'STORAGE_ERROR',
  
  // Retry/system errors
  RETRY_EXHAUSTED: 'RETRY_EXHAUSTED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * User-friendly error messages
 */
export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.INVALID_DATA_FORMAT]: 'The data format is invalid. Please check your file and try again.',
  [ErrorCodes.DATA_PARSING_FAILED]: 'Failed to parse data. Ensure your file is properly formatted.',
  [ErrorCodes.DATA_VALIDATION_FAILED]: 'Data validation failed. Some values may be missing or incorrect.',
  
  [ErrorCodes.FILE_TOO_LARGE]: 'File is too large. Maximum size is 10MB.',
  [ErrorCodes.UNSUPPORTED_FILE_TYPE]: 'Unsupported file type. Please use CSV, JSON, or Excel files.',
  [ErrorCodes.FILE_READ_FAILED]: 'Failed to read file. Please try again.',
  
  [ErrorCodes.NETWORK_ERROR]: 'Network error. Please check your connection and try again.',
  [ErrorCodes.API_ERROR]: 'API request failed. Please try again later.',
  [ErrorCodes.TIMEOUT]: 'Request timed out. Please try again.',
  
  [ErrorCodes.EXPORT_FAILED]: 'Export failed. Please try again.',
  [ErrorCodes.CLIPBOARD_ERROR]: 'Failed to copy to clipboard. Please check your browser permissions.',
  
  [ErrorCodes.STORAGE_FULL]: 'Storage is full. Please delete some projects to free up space.',
  [ErrorCodes.STORAGE_ERROR]: 'Storage error occurred. Please try again.',
  
  [ErrorCodes.RETRY_EXHAUSTED]: 'Operation failed after multiple attempts.',
  [ErrorCodes.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
};

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error | EnhancedError): string {
  if (error instanceof EnhancedError && error.code in ErrorMessages) {
    return ErrorMessages[error.code];
  }
  
  // Try to match error message patterns
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch')) {
    return ErrorMessages[ErrorCodes.NETWORK_ERROR];
  }
  
  if (message.includes('parse') || message.includes('json')) {
    return ErrorMessages[ErrorCodes.DATA_PARSING_FAILED];
  }
  
  if (message.includes('quota') || message.includes('storage')) {
    return ErrorMessages[ErrorCodes.STORAGE_FULL];
  }
  
  return ErrorMessages[ErrorCodes.UNKNOWN_ERROR];
}

/**
 * Safe async function wrapper with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler?: (error: Error) => void
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const enhancedError = error instanceof EnhancedError
        ? error
        : new EnhancedError(
            (error as Error).message,
            ErrorCodes.UNKNOWN_ERROR,
            error as Error
          );
      
      errorHandler?.(enhancedError);
      throw enhancedError;
    }
  }) as T;
}

/**
 * Validate file size and type
 */
export function validateFile(file: File, maxSizeMB: number = 10): void {
  const maxBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxBytes) {
    throw new EnhancedError(
      `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${maxSizeMB}MB`,
      ErrorCodes.FILE_TOO_LARGE,
      undefined,
      { fileSize: file.size, maxSize: maxBytes }
    );
  }
  
  const allowedTypes = ['.csv', '.json', '.xlsx', '.xls'];
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  if (!allowedTypes.includes(extension)) {
    throw new EnhancedError(
      `File type ${extension} is not supported`,
      ErrorCodes.UNSUPPORTED_FILE_TYPE,
      undefined,
      { fileName: file.name, allowedTypes }
    );
  }
}

/**
 * Async operation with timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new EnhancedError(
        `Operation timed out after ${timeoutMs}ms`,
        ErrorCodes.TIMEOUT
      ));
    }, timeoutMs);
  });
  
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

/**
 * Error logger for debugging
 */
export class ErrorLogger {
  private static errors: Array<{
    timestamp: Date;
    error: Error;
    context?: Record<string, any>;
  }> = [];

  static log(error: Error, context?: Record<string, any>): void {
    this.errors.push({
      timestamp: new Date(),
      error,
      context,
    });
    
    // Keep only last 50 errors
    if (this.errors.length > 50) {
      this.errors.shift();
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ChartForge Error]', error, context);
    }
  }

  static getErrors() {
    return this.errors;
  }

  static clear() {
    this.errors = [];
  }

  static exportLogs(): string {
    return JSON.stringify(this.errors, null, 2);
  }
}
