import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { applyTheme, resolveTheme, type ThemeMode } from '@/lib/theme';

/**
 * Root-only effect: applies the current theme to <html> whenever the
 * preference changes, and re-applies on OS changes while in 'system' mode.
 * Mount exactly once near the app root.
 */
export function useThemeManager(): void {
  const mode = useAppStore((s) => s.settings.theme);

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);
}

/**
 * Consumer hook: read the preference, the resolved light/dark value, and
 * setters. `toggleTheme` flips between explicit light/dark (the common case
 * for a single toggle button), collapsing 'system' to its resolved value first.
 */
export function useTheme() {
  const mode = useAppStore((s) => s.settings.theme);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const resolved = resolveTheme(mode);

  const setTheme = (next: ThemeMode) => updateSettings({ theme: next });
  const toggleTheme = () => updateSettings({ theme: resolved === 'dark' ? 'light' : 'dark' });

  return { mode, resolved, setTheme, toggleTheme };
}
