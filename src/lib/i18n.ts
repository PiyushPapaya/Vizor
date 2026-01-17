import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Language configuration with metadata
export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
  tier: 1 | 2 | 3;
}

// German and English only
export const LANGUAGES: LanguageConfig[] = [
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', tier: 1 },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', tier: 1 },
];

// RTL language codes - none for German/English
export const RTL_LANGUAGES: string[] = [];

// Get language config by code
export const getLanguageConfig = (code: string): LanguageConfig | undefined => {
  return LANGUAGES.find(l => l.code === code || l.code.startsWith(code.split('-')[0]));
};

// Check if a language is RTL
export const isRTL = (langCode: string): boolean => {
  return RTL_LANGUAGES.includes(langCode) || RTL_LANGUAGES.some(rtl => langCode.startsWith(rtl));
};

// Import translation files
import en from '@/locales/en.json';
import de from '@/locales/de.json';

// Resources object for i18n
const resources = {
  de: { translation: de },
  en: { translation: en },
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'de', // German as default
    supportedLngs: ['de', 'en'],
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'vizor-language',
    },
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    // React options
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    },
  });

// Update document direction when language changes (no RTL for German/English)
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = lng;
  document.documentElement.classList.remove('rtl');
});

// Set initial direction
const currentLang = i18n.language || 'de';
document.documentElement.dir = 'ltr';
document.documentElement.lang = currentLang;

// Translation coverage checker utility
export function getTranslationCoverage(languageCode: string): {
  total: number;
  translated: number;
  missing: string[];
  percentage: number;
} {
  const enTranslations = resources.en?.translation || {};
  const targetTranslations = resources[languageCode as keyof typeof resources]?.translation || {};
  
  const getAllKeys = (obj: any, prefix = ''): string[] => {
    const keys: string[] = [];
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys.push(...getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  const enKeys = getAllKeys(enTranslations);
  const missing: string[] = [];

  for (const key of enKeys) {
    const targetValue = getNestedValue(targetTranslations, key);
    const enValue = getNestedValue(enTranslations, key);
    
    // Check if translation is missing or same as English (likely untranslated)
    if (targetValue === undefined || targetValue === null || targetValue === '') {
      missing.push(key);
    }
  }

  return {
    total: enKeys.length,
    translated: enKeys.length - missing.length,
    missing,
    percentage: Math.round(((enKeys.length - missing.length) / enKeys.length) * 100),
  };
}

// Check all languages coverage
export function getAllTranslationCoverage(): Record<string, { percentage: number; missing: number }> {
  const coverage: Record<string, { percentage: number; missing: number }> = {};
  
  for (const lang of LANGUAGES) {
    if (lang.code !== 'en') {
      const result = getTranslationCoverage(lang.code);
      coverage[lang.code] = {
        percentage: result.percentage,
        missing: result.missing.length,
      };
    }
  }
  
  return coverage;
}

// Developer mode: highlight untranslated strings
let devModeEnabled = false;

export function enableTranslationDevMode(enabled: boolean): void {
  devModeEnabled = enabled;
  if (enabled) {
    console.log('[i18n] Translation dev mode enabled. Untranslated strings will be highlighted.');
  }
}

export function isTranslationDevMode(): boolean {
  return devModeEnabled;
}

export default i18n;
