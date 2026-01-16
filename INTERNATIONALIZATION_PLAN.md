# Internationalization (i18n) Implementation Plan for Vizor
**Date:** January 15, 2026  
**Target:** Top 50 Global Languages  
**Status:** Planning Phase

---

## 1. Executive Summary

This plan outlines the comprehensive implementation of internationalization (i18n) for the Vizor data visualization application. The goal is to support 50+ languages, making the app accessible to 90%+ of global internet users.

**Key Objectives:**
- Support 50+ languages with full translation coverage
- Maintain performance (lazy-load translations)
- Enable community-driven translations
- Preserve RTL (Right-to-Left) language support (Arabic, Hebrew, etc.)
- SEO optimization for all languages
- Maintain consistent UX across languages

---

## 2. Technology Stack

### Recommended Library: **react-i18next** (i18next ecosystem)

**Why react-i18next?**
- ✅ Most popular React i18n library (10M+ weekly downloads)
- ✅ Excellent TypeScript support with type-safe translations
- ✅ Lazy loading for performance (load only needed translations)
- ✅ Pluralization and interpolation built-in
- ✅ Date, number, and currency formatting (via i18next)
- ✅ Detection of user language (browser, localStorage, URL)
- ✅ Namespace support (split translations by feature)
- ✅ RTL support out of the box
- ✅ Integration with translation management tools

**Alternative Considered:**
- **react-intl** (FormatJS) - Good but heavier, more complex API
- **next-intl** - Designed for Next.js, not suitable for Vite/React

### Dependencies to Install

```json
{
  "dependencies": {
    "i18next": "^23.7.0",
    "react-i18next": "^14.0.0",
    "i18next-browser-languagedetector": "^7.2.0",
    "i18next-http-backend": "^2.4.0",
    "i18next-resources-to-backend": "^1.2.0"
  },
  "devDependencies": {
    "@types/i18next": "^13.0.0"
  }
}
```

---

## 3. Supported Languages (Top 50)

### Priority Tier 1 (Launch Languages - 15 languages)
**Target: 70% of global internet users**

1. 🇬🇧 **English (en)** - 1.5B users - Base language
2. 🇨🇳 **Chinese Simplified (zh-CN)** - 1.4B users
3. 🇪🇸 **Spanish (es)** - 559M users
4. 🇮🇳 **Hindi (hi)** - 602M users
5. 🇸🇦 **Arabic (ar)** - 274M users - RTL
6. 🇧🇩 **Bengali (bn)** - 272M users
7. 🇵🇹 **Portuguese (pt)** - 264M users
8. 🇷🇺 **Russian (ru)** - 258M users
9. 🇯🇵 **Japanese (ja)** - 125M users
10. 🇩🇪 **German (de)** - 134M users ✅ Requested
11. 🇫🇷 **French (fr)** - 280M users
12. 🇮🇹 **Italian (it)** - 85M users
13. 🇰🇷 **Korean (ko)** - 81M users
14. 🇹🇷 **Turkish (tr)** - 88M users
15. 🇮🇩 **Indonesian (id)** - 199M users

### Priority Tier 2 (Growth Languages - 20 languages)
**Target: Additional 15% of users**

16. 🇻🇳 **Vietnamese (vi)** - 85M users
17. 🇵🇱 **Polish (pl)** - 45M users
18. 🇺🇦 **Ukrainian (uk)** - 41M users
19. 🇳🇱 **Dutch (nl)** - 24M users
20. 🇬🇷 **Greek (el)** - 13M users
21. 🇨🇿 **Czech (cs)** - 12M users
22. 🇸🇪 **Swedish (sv)** - 13M users
23. 🇷🇴 **Romanian (ro)** - 26M users
24. 🇭🇺 **Hungarian (hu)** - 13M users
25. 🇮🇱 **Hebrew (he)** - 9M users - RTL
26. 🇹🇭 **Thai (th)** - 60M users
27. 🇵🇭 **Filipino (fil)** - 28M users
28. 🇲🇾 **Malay (ms)** - 77M users
29. 🇵🇰 **Urdu (ur)** - 231M users - RTL
30. 🇮🇷 **Persian/Farsi (fa)** - 110M users - RTL
31. 🇪🇬 **Egyptian Arabic (ar-EG)** - 110M users - RTL
32. 🇹🇼 **Chinese Traditional (zh-TW)** - 23M users
33. 🇲🇽 **Spanish (Latin America) (es-MX)** - 130M users
34. 🇧🇷 **Portuguese (Brazil) (pt-BR)** - 215M users
35. 🇨🇦 **French (Canada) (fr-CA)** - 7M users

### Priority Tier 3 (Extended Coverage - 15 languages)
**Target: Additional 5% of users**

36. 🇩🇰 **Danish (da)** - 6M users
37. 🇫🇮 **Finnish (fi)** - 5M users
38. 🇳🇴 **Norwegian (no)** - 5M users
39. 🇸🇰 **Slovak (sk)** - 5M users
40. 🇧🇬 **Bulgarian (bg)** - 8M users
41. 🇭🇷 **Croatian (hr)** - 5M users
42. 🇷🇸 **Serbian (sr)** - 12M users
43. 🇸🇮 **Slovenian (sl)** - 2M users
44. 🇱🇹 **Lithuanian (lt)** - 3M users
45. 🇱🇻 **Latvian (lv)** - 2M users
46. 🇪🇪 **Estonian (et)** - 1M users
47. 🇮🇸 **Icelandic (is)** - 350K users
48. 🇮🇪 **Irish (ga)** - 170K users
49. 🇿🇦 **Afrikaans (af)** - 7M users
50. 🇦🇲 **Armenian (hy)** - 5M users

**Total Coverage:** ~90-95% of global internet users

---

## 4. File Structure

### Proposed Directory Organization

```
src/
├── i18n/
│   ├── config.ts                     # i18next configuration
│   ├── index.ts                      # Main i18n export
│   ├── types.ts                      # TypeScript types for translations
│   ├── utils.ts                      # Helper functions
│   ├── namespaces.ts                 # Namespace definitions
│   └── languages.ts                  # Language metadata
│
├── locales/                          # Translation files
│   ├── en/                           # English (base)
│   │   ├── common.json               # Common UI strings
│   │   ├── landing.json              # Landing page
│   │   ├── app.json                  # Main app strings
│   │   ├── charts.json               # Chart-specific terms
│   │   ├── export.json               # Export dialog
│   │   ├── errors.json               # Error messages
│   │   ├── dialogs.json              # All dialog strings
│   │   ├── templates.json            # Chart templates
│   │   └── validation.json           # Validation messages
│   │
│   ├── de/                           # German
│   │   ├── common.json
│   │   ├── landing.json
│   │   └── ... (same structure)
│   │
│   ├── es/                           # Spanish
│   │   └── ...
│   │
│   ├── zh-CN/                        # Chinese Simplified
│   │   └── ...
│   │
│   └── ... (50 language folders)
│
├── components/
│   ├── LanguageSelector.tsx          # NEW: Language picker component
│   ├── RTLProvider.tsx               # NEW: RTL wrapper
│   └── ... (existing components)
│
└── hooks/
    ├── useTranslation.ts             # Re-export with types
    └── useDirection.ts               # NEW: LTR/RTL hook
```

---

## 5. Implementation Steps

### Phase 1: Setup & Infrastructure (Week 1)

**Step 1.1: Install Dependencies**
```bash
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
npm install -D @types/i18next
```

**Step 1.2: Create i18n Configuration**

File: `src/i18n/config.ts`
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

export const SUPPORTED_LANGUAGES = [
  'en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'ja', 'ko', 'zh-CN',
  'ar', 'hi', 'bn', 'vi', 'tr', 'pl', 'nl', 'uk', // ... add all 50
];

export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ar-EG'];

export const DEFAULT_LANGUAGE = 'en';
export const FALLBACK_LANGUAGE = 'en';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    
    ns: ['common', 'landing', 'app', 'charts', 'export', 'errors', 'dialogs', 'templates', 'validation'],
    defaultNS: 'common',
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'vizor-language',
    },
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    react: {
      useSuspense: true,
    },
  });

export default i18n;
```

**Step 1.3: Create Language Metadata**

File: `src/i18n/languages.ts`
```typescript
export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  tier: 1 | 2 | 3;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', rtl: false, tier: 1 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false, tier: 1 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false, tier: 1 },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false, tier: 1 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false, tier: 1 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false, tier: 1 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false, tier: 1 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false, tier: 1 },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false, tier: 1 },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', rtl: false, tier: 1 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true, tier: 1 },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false, tier: 1 },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', rtl: false, tier: 1 },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false, tier: 1 },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false, tier: 1 },
  // ... add all 50 languages
];
```

**Step 1.4: Initialize i18n in App**

File: `src/main.tsx`
```typescript
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n/config'; // Initialize i18n

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);
```

---

### Phase 2: Base Translation Files (Week 1-2)

**Step 2.1: Create English Base Translations**

File: `src/locales/en/common.json`
```json
{
  "app": {
    "name": "Vizor",
    "tagline": "Beautiful Data Visualizations",
    "description": "Create stunning charts in seconds"
  },
  "navigation": {
    "home": "Home",
    "features": "Features",
    "pricing": "Pricing",
    "blog": "Blog",
    "docs": "Documentation",
    "app": "Launch App"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "export": "Export",
    "import": "Import",
    "new": "New",
    "open": "Open",
    "close": "Close",
    "copy": "Copy",
    "paste": "Paste",
    "undo": "Undo",
    "redo": "Redo",
    "download": "Download",
    "upload": "Upload",
    "refresh": "Refresh",
    "search": "Search"
  },
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "warning": "Warning",
    "info": "Information",
    "yes": "Yes",
    "no": "No",
    "ok": "OK",
    "apply": "Apply"
  },
  "language": {
    "select": "Select Language",
    "current": "Current Language"
  }
}
```

File: `src/locales/en/app.json`
```json
{
  "project": {
    "name": "Project Name",
    "untitled": "Untitled Project",
    "new": "New Project",
    "save": "Save Project",
    "saveAs": "Save As...",
    "load": "Load Project",
    "export": "Export Project"
  },
  "data": {
    "import": "Import Data",
    "importFromFile": "Import from File",
    "importFromURL": "Import from URL",
    "importFromAPI": "Connect to API",
    "sample": "Load Sample Data",
    "random": "Generate Random Data",
    "clear": "Clear Data",
    "noData": "No data to display",
    "datasets": "Datasets",
    "labels": "Labels",
    "values": "Values"
  },
  "chart": {
    "title": "Chart Title",
    "type": "Chart Type",
    "types": {
      "line": "Line Chart",
      "bar": "Bar Chart",
      "barHorizontal": "Horizontal Bar",
      "pie": "Pie Chart",
      "donut": "Donut Chart",
      "area": "Area Chart",
      "scatter": "Scatter Plot",
      "bubble": "Bubble Chart",
      "radar": "Radar Chart",
      "radialBar": "Radial Bar",
      "composed": "Composed Chart",
      "funnel": "Funnel Chart",
      "treemap": "Treemap",
      "waterfall": "Waterfall Chart"
    }
  },
  "config": {
    "title": "Configuration",
    "style": "Style",
    "data": "Data",
    "advanced": "Advanced",
    "labels": {
      "title": "Chart Title",
      "xAxis": "X-Axis Label",
      "yAxis": "Y-Axis Label"
    },
    "display": {
      "legend": "Show Legend",
      "grid": "Show Grid",
      "tooltips": "Show Tooltips",
      "dataLabels": "Show Data Labels"
    },
    "colors": {
      "scheme": "Color Scheme",
      "custom": "Custom Colors",
      "schemes": {
        "default": "Default",
        "vibrant": "Vibrant",
        "pastel": "Pastel",
        "monochrome": "Monochrome",
        "ocean": "Ocean",
        "sunset": "Sunset",
        "neon": "Neon",
        "earth": "Earth",
        "candy": "Candy"
      }
    }
  }
}
```

File: `src/locales/en/export.json`
```json
{
  "dialog": {
    "title": "Export Chart",
    "description": "Customize your export settings and preview before downloading"
  },
  "format": {
    "title": "Export Format",
    "png": "PNG Image",
    "svg": "SVG Vector",
    "pdf": "PDF Document",
    "json": "JSON Data",
    "descriptions": {
      "png": "High-quality raster image with transparency support",
      "svg": "Scalable vector graphics, perfect for any size",
      "pdf": "Universal document format with embedded fonts",
      "json": "Raw chart data and configuration export"
    },
    "bestFor": {
      "png": "Best for: Web, presentations, social media",
      "svg": "Best for: Print, high-resolution displays, editing",
      "pdf": "Best for: Reports, printing, sharing",
      "json": "Best for: Backup, data transfer, API integration"
    }
  },
  "background": {
    "title": "Background Color",
    "transparent": "Transparent",
    "white": "White",
    "dark": "Dark",
    "theme": "Match Theme",
    "custom": "Custom",
    "customColor": "Custom Color"
  },
  "size": {
    "title": "Size & Quality",
    "presets": "Presets",
    "custom": "Custom Dimensions",
    "width": "Width (px)",
    "height": "Height (px)",
    "quality": "Quality",
    "scale": "Scale (for sharpness)"
  },
  "presets": {
    "hd": "HD (1280×720)",
    "fullHd": "Full HD (1920×1080)",
    "presentation": "Presentation (1600×900)",
    "print": "Print (2400×1800)",
    "twitter": "Twitter/X (1200×675)",
    "linkedin": "LinkedIn (1200×628)",
    "instagram": "Instagram (1080×1080)",
    "story": "Story (1080×1920)"
  },
  "preview": {
    "title": "Preview",
    "generating": "Generating preview...",
    "noPreview": "Preview will appear here",
    "jsonNoPreview": "JSON export has no visual preview",
    "refresh": "Refresh"
  },
  "actions": {
    "export": "Export {{format}}",
    "exporting": "Exporting...",
    "copyToClipboard": "Copy to Clipboard"
  },
  "warnings": {
    "darkMode": "You're in dark mode but exporting with a white background. Consider using \"Match Theme\" or \"Dark\" for consistency."
  },
  "success": {
    "exported": "Exported as {{format}}",
    "copied": "Copied to clipboard"
  }
}
```

File: `src/locales/en/errors.json`
```json
{
  "general": "An error occurred",
  "network": "Network error. Please check your connection.",
  "fileTooBig": "File is too large. Maximum size: {{size}}",
  "invalidFormat": "Invalid file format. Supported: {{formats}}",
  "parseError": "Failed to parse file",
  "exportFailed": "Export failed. Please try again.",
  "clipboardError": "Failed to copy to clipboard",
  "noData": "No data to export",
  "invalidData": "Invalid data format"
}
```

**Step 2.2: Create Translation Template Script**

File: `scripts/generate-translation-template.js`
```javascript
// Script to generate empty translation files for new languages
// Usage: node scripts/generate-translation-template.js de
```

---

### Phase 3: Component Updates (Week 2-3)

**Step 3.1: Create Language Selector Component**

File: `src/components/LanguageSelector.tsx`
```typescript
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LANGUAGES } from '@/i18n/languages';
import { cn } from '@/lib/utils';

export function LanguageSelector() {
  const { i18n, t } = useTranslation('common');
  const [open, setOpen] = useState(false);

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    document.documentElement.lang = langCode;
    
    // Handle RTL
    const isRTL = LANGUAGES.find(l => l.code === langCode)?.rtl;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    setOpen(false);
  };

  // Group languages by tier
  const tier1 = LANGUAGES.filter(l => l.tier === 1);
  const tier2 = LANGUAGES.filter(l => l.tier === 2);
  const tier3 = LANGUAGES.filter(l => l.tier === 3);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-[400px] overflow-y-auto">
        <div className="px-2 py-1.5 text-sm font-semibold">
          {t('language.select')}
        </div>
        <DropdownMenuSeparator />
        
        {/* Tier 1 - Most Popular */}
        {tier1.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="gap-2 cursor-pointer"
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="flex-1">{lang.nativeName}</span>
            <span className="text-xs text-muted-foreground">{lang.name}</span>
            {i18n.language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        
        {tier2.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs text-muted-foreground">More Languages</div>
            {tier2.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="gap-2 cursor-pointer"
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="flex-1">{lang.nativeName}</span>
                {i18n.language === lang.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Step 3.2: Update Components to Use Translations**

Example: Update Export Dialog
```typescript
// Before
<DialogTitle>Export Chart</DialogTitle>

// After
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('export');
<DialogTitle>{t('dialog.title')}</DialogTitle>
```

**Step 3.3: Create RTL Support Hook**

File: `src/hooks/useDirection.ts`
```typescript
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RTL_LANGUAGES } from '@/i18n/config';

export function useDirection() {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const isRTL = RTL_LANGUAGES.includes(i18n.language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [i18n.language]);
  
  return {
    isRTL: RTL_LANGUAGES.includes(i18n.language),
    direction: RTL_LANGUAGES.includes(i18n.language) ? 'rtl' : 'ltr',
  };
}
```

---

### Phase 4: Translation Process (Week 3-6)

**Step 4.1: Professional Translation**

**Option A: Translation Agency** (Recommended for Quality)
- Hire professional translators via Upwork, Fiverr, or translation agency
- Cost: ~$0.08-0.15 per word
- Estimated cost for 50 languages: $15,000-30,000
- Timeline: 4-8 weeks
- Quality: Highest (native speakers, context-aware)

**Option B: AI Translation + Human Review** (Faster, Lower Cost)
- Use GPT-4 or Claude for initial translation
- Hire native speakers for review/editing
- Cost: ~$0.02-0.05 per word
- Estimated cost: $5,000-12,000
- Timeline: 2-4 weeks
- Quality: Good (requires review)

**Option C: Community Translation** (Slowest, Lowest Cost)
- Use Crowdin, Lokalise, or Weblate
- Open-source community contributions
- Cost: Free to $500/month for platform
- Timeline: 3-12 months
- Quality: Variable (needs moderation)

**Recommended Approach:**
1. **Tier 1 languages** (15): Professional translation ($8,000-12,000)
2. **Tier 2 languages** (20): AI + Human review ($3,000-6,000)
3. **Tier 3 languages** (15): Community translation (ongoing)

**Step 4.2: Translation Workflow**

1. **Extract strings** from components → JSON files
2. **Send to translators** with context notes
3. **Review translations** with native speakers
4. **Test in app** for UI overflow, truncation
5. **Iterate and refine**

**Step 4.3: Translation Management Platform**

**Recommended: Crowdin**
- Integrates with GitHub
- In-context translation preview
- Translation memory (reuse translations)
- Community collaboration
- Cost: $40/month (Pro plan)

Alternative: Lokalise, Weblate, POEditor

---

### Phase 5: Testing & QA (Week 6-7)

**Step 5.1: Automated Testing**

File: `src/__tests__/i18n.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import i18n from '@/i18n/config';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';

describe('i18n Configuration', () => {
  it('should load all supported languages', async () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      await i18n.changeLanguage(lang);
      expect(i18n.language).toBe(lang);
    }
  });

  it('should have all required namespaces', () => {
    const namespaces = ['common', 'app', 'export', 'errors'];
    namespaces.forEach(ns => {
      expect(i18n.hasResourceBundle('en', ns)).toBe(true);
    });
  });

  it('should fallback to English for missing translations', async () => {
    await i18n.changeLanguage('de');
    const text = i18n.t('common:actions.save');
    expect(text).toBeTruthy();
  });
});
```

**Step 5.2: Visual Testing**

Test checklist per language:
- [ ] No text overflow in buttons
- [ ] No truncated labels
- [ ] Proper line breaks
- [ ] Correct date/number formatting
- [ ] RTL layout for Arabic, Hebrew, etc.
- [ ] Flag icons display correctly
- [ ] No broken placeholders ({{variable}})

**Step 5.3: Screenshot Testing**

Use Playwright or Cypress to capture screenshots in each language:
```typescript
import { test, expect } from '@playwright/test';
import { SUPPORTED_LANGUAGES } from '../src/i18n/config';

for (const lang of SUPPORTED_LANGUAGES) {
  test(`Homepage renders correctly in ${lang}`, async ({ page }) => {
    await page.goto(`/?lng=${lang}`);
    await expect(page).toHaveScreenshot(`homepage-${lang}.png`);
  });
}
```

---

### Phase 6: SEO & Performance (Week 7-8)

**Step 6.1: SEO Optimization**

Update `src/lib/seo.ts`:
```typescript
import { useTranslation } from 'react-i18next';

export function updateMetaTags(config: SEOConfig) {
  const { t, i18n } = useTranslation();
  
  document.title = t(config.titleKey);
  document.documentElement.lang = i18n.language;
  
  // Add hreflang tags for SEO
  const head = document.head;
  const existingLinks = head.querySelectorAll('link[rel="alternate"]');
  existingLinks.forEach(link => link.remove());
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = `${window.location.origin}?lng=${lang}`;
    head.appendChild(link);
  });
}
```

**Step 6.2: Performance Optimization**

- **Lazy load translations:** Only load namespaces when needed
- **Bundle splitting:** Separate translation files per route
- **Caching:** Cache translations in localStorage
- **CDN:** Serve translation files from CDN

**Step 6.3: Add Language Selector to UI**

Update Navbar:
```typescript
// In Navbar.tsx
import { LanguageSelector } from '@/components/LanguageSelector';

// Add before theme toggle
<LanguageSelector />
<ThemeToggle />
```

Update AppHeader:
```typescript
// In AppHeader.tsx
import { LanguageSelector } from '@/components/LanguageSelector';

// Add to header actions
<LanguageSelector />
```

---

### Phase 7: Deployment & Monitoring (Week 8)

**Step 7.1: Build Configuration**

Update `vite.config.ts`:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate i18n from main bundle
          'i18n': ['i18next', 'react-i18next'],
        },
      },
    },
  },
});
```

**Step 7.2: Analytics Tracking**

Track language usage:
```typescript
// In src/i18n/config.ts
i18n.on('languageChanged', (lng) => {
  trackEvent('language_changed', { language: lng });
  
  // Track to analytics
  if (window.posthog) {
    window.posthog.capture('language_changed', { language: lng });
  }
});
```

**Step 7.3: Monitoring**

Track metrics:
- Language distribution (which languages are used most)
- Missing translation errors
- Load times per language
- Translation quality feedback

**Step 7.4: User Feedback**

Add "Report Translation Issue" button:
```typescript
<Button 
  variant="ghost" 
  size="sm"
  onClick={() => {
    window.open(
      `https://github.com/yourusername/vizor/issues/new?title=Translation Issue - ${i18n.language}`,
      '_blank'
    );
  }}
>
  Report Translation Issue
</Button>
```

---

## 6. Code Changes Summary

### Files to Create (12 new files)

1. `src/i18n/config.ts` - i18next configuration
2. `src/i18n/index.ts` - Main export
3. `src/i18n/types.ts` - TypeScript types
4. `src/i18n/languages.ts` - Language metadata
5. `src/i18n/utils.ts` - Helper functions
6. `src/components/LanguageSelector.tsx` - Language picker
7. `src/hooks/useDirection.ts` - RTL support hook
8. `src/locales/en/*.json` - 8 namespace files
9. `scripts/generate-translation-template.js` - Translation helper

### Files to Modify (20+ files)

1. `src/main.tsx` - Initialize i18n
2. `src/App.tsx` - Add language detection
3. `src/components/ExportDialog.tsx` - Use t() function
4. `src/components/layout/AppHeader.tsx` - Add LanguageSelector
5. `src/components/landing/Navbar.tsx` - Add LanguageSelector
6. `src/pages/Index.tsx` - Translate all strings
7. `src/pages/Landing.tsx` - Translate all strings
8. All dialog components (10+ files)
9. All landing page sections (10+ files)
10. Error messages, toasts, validation

### TypeScript Types

File: `src/i18n/types.ts`
```typescript
import { resources } from './config';

export type TranslationResources = typeof resources;
export type LanguageCode = keyof TranslationResources;
export type Namespace = keyof TranslationResources['en'];

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: TranslationResources['en'];
  }
}
```

---

## 7. Best Practices

### Do's ✅

1. **Always use translation keys**, never hardcode strings
2. **Use namespaces** to organize translations by feature
3. **Add context** in translation files (comments)
4. **Use interpolation** for dynamic values: `t('greeting', { name: 'John' })`
5. **Handle pluralization**: `t('items', { count: 5 })`
6. **Test RTL languages** thoroughly
7. **Keep keys descriptive**: `export.dialog.title` not `exp.dlg.t`
8. **Version translations** with the app
9. **Monitor missing translations** in production
10. **Provide fallbacks** for all keys

### Don'ts ❌

1. **Don't concatenate translated strings** (word order varies)
2. **Don't translate programmatic values** (variable names, IDs)
3. **Don't use Google Translate alone** (context matters)
4. **Don't forget date/number formatting**
5. **Don't assume LTR layout** (support RTL)
6. **Don't hardcode text in images**
7. **Don't forget accessibility** (screen readers in different languages)
8. **Don't mix languages** in one component
9. **Don't forget error messages**
10. **Don't neglect mobile UI** (shorter text for small screens)

---

## 8. Cost Breakdown

### Development Costs

| Task | Time | Cost @ $100/hr |
|------|------|----------------|
| Setup & Infrastructure | 40 hours | $4,000 |
| Base Translation Files | 20 hours | $2,000 |
| Component Updates | 80 hours | $8,000 |
| Testing & QA | 40 hours | $4,000 |
| SEO & Performance | 20 hours | $2,000 |
| Documentation | 10 hours | $1,000 |
| **Total Development** | **210 hours** | **$21,000** |

### Translation Costs

| Category | Languages | Words | Cost/Word | Total |
|----------|-----------|-------|-----------|-------|
| Tier 1 (Professional) | 15 | 50,000 | $0.10 | $7,500 |
| Tier 2 (AI + Review) | 20 | 40,000 | $0.04 | $1,600 |
| Tier 3 (Community) | 15 | 30,000 | Free | $0 |
| **Total Translation** | **50** | **120,000** | - | **$9,100** |

### Ongoing Costs

| Item | Cost/Month |
|------|------------|
| Translation Platform (Crowdin) | $40 |
| Native Speaker Reviews | $200 |
| Community Moderation | $100 |
| **Total Monthly** | **$340** |

### Grand Total

- **One-time:** $30,100 (development + translation)
- **Monthly:** $340 (maintenance)
- **Per language:** ~$600 (average)

---

## 9. Timeline

### Estimated 8-Week Implementation

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1 | Setup | i18n config, language selector, base files |
| 2-3 | Component Updates | Translate all UI components |
| 3-4 | Translation (Tier 1) | Professional translation of 15 languages |
| 4-5 | Translation (Tier 2) | AI + review for 20 languages |
| 6 | Testing | QA all 35 languages, fix issues |
| 7 | SEO & Performance | Optimize, add hreflang, lazy loading |
| 8 | Deployment | Launch, monitor, gather feedback |
| Ongoing | Tier 3 + Maintenance | Community translations for 15 more languages |

---

## 10. Success Metrics

### KPIs to Track

1. **Adoption Rate:** % of users switching from English
2. **Language Distribution:** Most popular non-English languages
3. **Completion Rate:** % of features used per language
4. **Translation Coverage:** % of strings translated per language
5. **Error Rate:** Missing translation errors in production
6. **Performance:** Load time impact per language
7. **User Satisfaction:** Feedback rating per language
8. **Conversion Rate:** Sign-ups by language
9. **Retention Rate:** Active users by language
10. **Community Contributions:** Translations submitted

### Target Goals (6 months)

- ✅ 50+ languages supported
- ✅ 95%+ translation coverage for Tier 1
- ✅ 30%+ of users use non-English
- ✅ <100ms load time increase
- ✅ 4.5+ star rating for translations
- ✅ 100+ community contributions

---

## 11. Maintenance Plan

### Ongoing Tasks

1. **Weekly:** Review community translation submissions
2. **Monthly:** Update translations for new features
3. **Quarterly:** Native speaker review of top 10 languages
4. **Annually:** Full audit of all translations

### Version Control

- Use Git for translation files
- Tag releases with language versions
- Maintain changelog for translation updates

### Documentation

- Translation guidelines for contributors
- Style guide per language
- Glossary of technical terms

---

## 12. Risk Mitigation

### Potential Issues & Solutions

| Risk | Impact | Mitigation |
|------|--------|------------|
| Poor translation quality | High | Professional review for Tier 1 languages |
| UI overflow in long languages (German, Finnish) | Medium | Use flexible layouts, test thoroughly |
| RTL layout bugs | Medium | Dedicated RTL testing, use RTL-aware CSS |
| Performance degradation | Low | Lazy load translations, bundle splitting |
| Missing translations | Medium | Fallback to English, log missing keys |
| Community spam/vandalism | Low | Moderation, review process |
| SEO issues | Low | Proper hreflang tags, sitemap per language |
| Cultural insensitivity | High | Native speaker review, cultural consultation |

---

## 13. Next Steps (Action Items)

### Immediate (This Week)

1. ✅ Review and approve this plan
2. ✅ Install i18next dependencies
3. ✅ Create i18n configuration
4. ✅ Extract all English strings to JSON files
5. ✅ Create language selector component

### Short-term (This Month)

1. ✅ Update 20+ core components to use translations
2. ✅ Create German translation (pilot language)
3. ✅ Test German version thoroughly
4. ✅ Set up Crowdin account
5. ✅ Hire professional translators for Tier 1

### Long-term (Next 3 Months)

1. ✅ Complete all 50 language translations
2. ✅ Launch multilingual version
3. ✅ Monitor adoption and gather feedback
4. ✅ Iterate based on user feedback
5. ✅ Expand to 100+ languages (if successful)

---

## 14. Conclusion

Implementing internationalization for 50+ languages is a significant undertaking, but it will:

- **Increase global reach** by 10-50x (depending on current user base)
- **Improve user satisfaction** (users prefer native language)
- **Boost SEO** (rank in local search results)
- **Demonstrate professionalism** (enterprise-ready product)
- **Enable market expansion** (Asia, Latin America, Middle East)

**Recommendation:** Start with Tier 1 languages (15), validate the approach, then expand to Tier 2 and 3.

**Investment:** $30,000 one-time + $340/month maintenance

**ROI:** Estimated 3-5x increase in international users within 12 months

---

**Questions or need clarification?** Let me know which phase to start with! 🚀
