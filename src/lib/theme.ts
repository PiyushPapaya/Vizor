/**
 * Single source of truth for theme application.
 *
 * The persisted user preference lives in the app store (`settings.theme`) as
 * 'light' | 'dark' | 'system'. This module resolves that preference (honouring
 * the OS setting when 'system') and applies it to <html>. It is intentionally
 * dependency-free so it can run before React mounts (in main.tsx) to avoid a
 * flash of the wrong theme (FOUC).
 */

export type ThemeMode = 'light' | 'dark' | 'system';

const APP_STORAGE_KEY = 'vizor-app-storage';

export const getSystemTheme = (): 'light' | 'dark' =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

export const resolveTheme = (mode: ThemeMode): 'light' | 'dark' =>
  mode === 'system' ? getSystemTheme() : mode;

export const applyTheme = (mode: ThemeMode): void => {
  if (typeof document === 'undefined') return;
  const resolved = resolveTheme(mode);
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  // Keeps native form controls / scrollbars in step with the theme.
  document.documentElement.style.colorScheme = resolved;
};

/**
 * Reads the persisted theme preference directly from the zustand-persisted
 * blob, without importing the store (so it is safe to call pre-render).
 * Falls back to 'system'.
 */
export const getStoredThemeMode = (): ThemeMode => {
  try {
    const raw = localStorage.getItem(APP_STORAGE_KEY);
    if (!raw) return 'system';
    const parsed = JSON.parse(raw);
    const theme = parsed?.state?.settings?.theme;
    if (theme === 'light' || theme === 'dark' || theme === 'system') return theme;
    return 'system';
  } catch {
    return 'system';
  }
};
