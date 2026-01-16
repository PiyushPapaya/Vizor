/**
 * Theme utilities for exporting charts with correct colors
 */

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  ring: string;
}

/**
 * Get the current theme mode
 */
export function isDarkMode(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

/**
 * Get computed HSL color from CSS variable
 */
export function getHSLColor(cssVar: string): string {
  if (typeof document === 'undefined') return '';
  
  const style = getComputedStyle(document.documentElement);
  const value = style.getPropertyValue(cssVar).trim();
  
  // If it's already an HSL value, wrap it
  if (value && !value.startsWith('hsl')) {
    return `hsl(${value})`;
  }
  
  return value;
}

/**
 * Convert CSS variable to actual RGB/HSL color
 */
export function resolveColor(color: string): string {
  if (typeof document === 'undefined') return color;
  
  // Check if it's a CSS variable reference
  if (color.includes('var(')) {
    // Extract variable name
    const match = color.match(/var\((--[\w-]+)\)/);
    if (match) {
      const varName = match[1];
      const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      
      // If the original color was hsl(var(...)), reconstruct it
      if (color.startsWith('hsl(')) {
        return `hsl(${value})`;
      }
      return value;
    }
  }
  
  return color;
}

/**
 * Get all theme colors as resolved values
 */
export function getThemeColors(): ThemeColors {
  return {
    background: getHSLColor('--background'),
    foreground: getHSLColor('--foreground'),
    card: getHSLColor('--card'),
    cardForeground: getHSLColor('--card-foreground'),
    primary: getHSLColor('--primary'),
    primaryForeground: getHSLColor('--primary-foreground'),
    secondary: getHSLColor('--secondary'),
    secondaryForeground: getHSLColor('--secondary-foreground'),
    muted: getHSLColor('--muted'),
    mutedForeground: getHSLColor('--muted-foreground'),
    accent: getHSLColor('--accent'),
    accentForeground: getHSLColor('--accent-foreground'),
    border: getHSLColor('--border'),
    ring: getHSLColor('--ring'),
  };
}

/**
 * Get appropriate export background based on current theme
 */
export function getExportBackground(preference: 'transparent' | 'white' | 'dark' | 'theme'): string | null {
  switch (preference) {
    case 'transparent':
      return null;
    case 'white':
      return '#ffffff';
    case 'dark':
      return '#1e293b';
    case 'theme':
      return isDarkMode() ? '#1e293b' : '#ffffff';
    default:
      return '#ffffff';
  }
}

/**
 * Convert HSL to hex color
 */
export function hslToHex(hsl: string): string {
  // Parse HSL values
  const match = hsl.match(/hsl\((\d+\.?\d*),?\s*(\d+\.?\d*)%?,?\s*(\d+\.?\d*)%?\)/);
  if (!match) return hsl;

  const h = parseFloat(match[1]) / 360;
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default {
  isDarkMode,
  getHSLColor,
  resolveColor,
  getThemeColors,
  getExportBackground,
  hslToHex,
};
