import { toast } from 'sonner';
import { logger } from './logger';

/**
 * Detects the browser's "storage is full" error across engines. Chrome/Safari
 * throw a DOMException named `QuotaExceededError` (code 22); Firefox uses
 * `NS_ERROR_DOM_QUOTA_REACHED` (code 1014).
 */
export const isQuotaError = (error: unknown): boolean =>
  error instanceof DOMException &&
  (error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    error.code === 22 ||
    error.code === 1014);

/**
 * Writes to localStorage without letting a QuotaExceededError bubble up and
 * crash the app. On quota overflow it optionally runs `onQuota` (to free space)
 * and retries once, otherwise it surfaces a toast and returns false so callers
 * can degrade gracefully.
 *
 * @returns true if the value was persisted, false otherwise.
 */
export const safeSetItem = (
  key: string,
  value: string,
  onQuota?: () => void
): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (isQuotaError(error)) {
      logger.warn('localStorage quota exceeded', { key });
      if (onQuota) {
        try {
          onQuota();
          localStorage.setItem(key, value);
          return true;
        } catch {
          // fall through to the user-facing warning below
        }
      }
      toast.error(
        'Storage is full — some data could not be saved. Clear old projects or version history to free up space.'
      );
      return false;
    }
    logger.error('localStorage write failed', error as Error, { key });
    return false;
  }
};
