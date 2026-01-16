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

// 50 Global Languages organized by tier
export const LANGUAGES: LanguageConfig[] = [
  // Tier 1 - 15 Major Languages (90%+ internet coverage)
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', tier: 1 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', tier: 1 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', tier: 1 },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', tier: 1 },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', tier: 1 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', tier: 1 },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', tier: 1 },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', tier: 1 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', tier: 1 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', tier: 1 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true, tier: 1 },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', tier: 1 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', tier: 1 },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', tier: 1 },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', tier: 1 },

  // Tier 2 - 20 Secondary Languages
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', tier: 2 },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', tier: 2 },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', tier: 2 },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', tier: 2 },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', tier: 2 },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', tier: 2 },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', tier: 2 },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', tier: 2 },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true, tier: 2 },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', tier: 2 },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', tier: 2 },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', tier: 2 },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', rtl: true, tier: 2 },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', tier: 2 },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', tier: 2 },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', tier: 2 },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', tier: 2 },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', tier: 2 },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', tier: 2 },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', tier: 2 },

  // Tier 3 - 15 Additional Languages
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', tier: 3 },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', tier: 3 },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', tier: 3 },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', tier: 3 },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', tier: 3 },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', tier: 3 },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true, tier: 3 },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭', tier: 3 },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', tier: 3 },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', tier: 3 },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸', tier: 3 },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸', tier: 3 },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸', tier: 3 },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', tier: 3 },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹', tier: 3 },
];

// RTL language codes
export const RTL_LANGUAGES = LANGUAGES.filter(l => l.rtl).map(l => l.code);

// Get language config by code
export const getLanguageConfig = (code: string): LanguageConfig | undefined => {
  return LANGUAGES.find(l => l.code === code || l.code.startsWith(code.split('-')[0]));
};

// Check if a language is RTL
export const isRTL = (langCode: string): boolean => {
  return RTL_LANGUAGES.includes(langCode) || RTL_LANGUAGES.some(rtl => langCode.startsWith(rtl));
};

// Import all translation files - Tier 1 (Major Languages)
import en from '@/locales/en.json';
import de from '@/locales/de.json';
import es from '@/locales/es.json';
import zh from '@/locales/zh.json';
import zhTW from '@/locales/zh-TW.json';
import ja from '@/locales/ja.json';
import ko from '@/locales/ko.json';
import fr from '@/locales/fr.json';
import pt from '@/locales/pt.json';
import ru from '@/locales/ru.json';
import ar from '@/locales/ar.json';
import hi from '@/locales/hi.json';
import it from '@/locales/it.json';
import nl from '@/locales/nl.json';
import tr from '@/locales/tr.json';

// Import Tier 2 translations
import vi from '@/locales/vi.json';
import pl from '@/locales/pl.json';
import uk from '@/locales/uk.json';
import ro from '@/locales/ro.json';
import cs from '@/locales/cs.json';
import el from '@/locales/el.json';
import hu from '@/locales/hu.json';
import sv from '@/locales/sv.json';
import he from '@/locales/he.json';
import th from '@/locales/th.json';
import id from '@/locales/id.json';
import ms from '@/locales/ms.json';
import fa from '@/locales/fa.json';
import bn from '@/locales/bn.json';
import ta from '@/locales/ta.json';
import no from '@/locales/no.json';
import fi from '@/locales/fi.json';
import da from '@/locales/da.json';
import sk from '@/locales/sk.json';
import bg from '@/locales/bg.json';

// Resources object for i18n
const resources = {
  // Tier 1
  en: { translation: en },
  de: { translation: de },
  es: { translation: es },
  zh: { translation: zh },
  'zh-TW': { translation: zhTW },
  ja: { translation: ja },
  ko: { translation: ko },
  fr: { translation: fr },
  pt: { translation: pt },
  ru: { translation: ru },
  ar: { translation: ar },
  hi: { translation: hi },
  it: { translation: it },
  nl: { translation: nl },
  tr: { translation: tr },
  // Tier 2
  vi: { translation: vi },
  pl: { translation: pl },
  uk: { translation: uk },
  ro: { translation: ro },
  cs: { translation: cs },
  el: { translation: el },
  hu: { translation: hu },
  sv: { translation: sv },
  he: { translation: he },
  th: { translation: th },
  id: { translation: id },
  ms: { translation: ms },
  fa: { translation: fa },
  bn: { translation: bn },
  ta: { translation: ta },
  no: { translation: no },
  fi: { translation: fi },
  da: { translation: da },
  sk: { translation: sk },
  bg: { translation: bg },
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: LANGUAGES.map(l => l.code),
    
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

// Update document direction when language changes
i18n.on('languageChanged', (lng) => {
  const isRtl = isRTL(lng);
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  
  // Add/remove RTL class for Tailwind
  if (isRtl) {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
});

// Set initial direction
const currentLang = i18n.language || 'en';
document.documentElement.dir = isRTL(currentLang) ? 'rtl' : 'ltr';
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
