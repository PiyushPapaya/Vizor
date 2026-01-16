import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Search, Check, ChevronDown } from 'lucide-react';
import { LANGUAGES, getLanguageConfig, isRTL, type LanguageConfig } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'full';
  showFlag?: boolean;
  showNativeName?: boolean;
  className?: string;
}

export function LanguageSelector({
  variant = 'default',
  showFlag = true,
  showNativeName = true,
  className,
}: LanguageSelectorProps) {
  const { i18n, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = getLanguageConfig(i18n.language);

  // Group languages by tier for organized display
  const groupedLanguages = useMemo(() => {
    const filtered = LANGUAGES.filter((lang) => {
      const query = searchQuery.toLowerCase();
      return (
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
      );
    });

    return {
      tier1: filtered.filter((l) => l.tier === 1),
      tier2: filtered.filter((l) => l.tier === 2),
      tier3: filtered.filter((l) => l.tier === 3),
    };
  }, [searchQuery]);

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    setIsOpen(false);
    setSearchQuery('');
    
    // Store preference
    localStorage.setItem('vizor-language', languageCode);
    
    // Update HTML lang and dir attributes
    const isRtlLang = isRTL(languageCode);
    document.documentElement.lang = languageCode;
    document.documentElement.dir = isRtlLang ? 'rtl' : 'ltr';
    
    // Force body class update for RTL styling
    if (isRtlLang) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  const renderLanguageItem = (lang: LanguageConfig) => {
    const isSelected = lang.code === i18n.language;
    const isRtlLang = isRTL(lang.code);

    return (
      <DropdownMenuItem
        key={lang.code}
        onClick={() => handleLanguageChange(lang.code)}
        className={cn(
          'flex items-center gap-2 cursor-pointer py-2',
          isSelected && 'bg-primary/10'
        )}
      >
        {showFlag && <span className="text-lg">{lang.flag}</span>}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-medium truncate">
            {showNativeName ? lang.nativeName : lang.name}
          </span>
          {showNativeName && (
            <span className="text-xs text-muted-foreground truncate">
              {lang.name}
            </span>
          )}
        </div>
        {isRtlLang && (
          <span className="text-xs px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
            RTL
          </span>
        )}
        {isSelected && <Check className="h-4 w-4 text-primary ml-auto" />}
      </DropdownMenuItem>
    );
  };

  // Compact variant - just icon
  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-9 w-9', className)}
            aria-label={t('aria.languageSelector')}
          >
            <span className="text-lg">{currentLanguage?.flag || '🌐'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('actions.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
          <ScrollArea className="h-[300px]">
            {groupedLanguages.tier1.length > 0 && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Popular
                </DropdownMenuLabel>
                {groupedLanguages.tier1.map(renderLanguageItem)}
              </>
            )}
            {groupedLanguages.tier2.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  More Languages
                </DropdownMenuLabel>
                {groupedLanguages.tier2.map(renderLanguageItem)}
              </>
            )}
            {groupedLanguages.tier3.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Other
                </DropdownMenuLabel>
                {groupedLanguages.tier3.map(renderLanguageItem)}
              </>
            )}
            {groupedLanguages.tier1.length === 0 &&
              groupedLanguages.tier2.length === 0 &&
              groupedLanguages.tier3.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t('empty.noResults')}
                </div>
              )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant - flag + language code
  if (variant === 'default') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('gap-2', className)}
            aria-label={t('aria.languageSelector')}
          >
            {showFlag && (
              <span className="text-base">{currentLanguage?.flag || '🌐'}</span>
            )}
            <span className="uppercase text-xs font-medium">
              {currentLanguage?.code || 'EN'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('actions.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
          <ScrollArea className="h-[350px]">
            {groupedLanguages.tier1.length > 0 && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                  Popular Languages
                </DropdownMenuLabel>
                {groupedLanguages.tier1.map(renderLanguageItem)}
              </>
            )}
            {groupedLanguages.tier2.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                  More Languages
                </DropdownMenuLabel>
                {groupedLanguages.tier2.map(renderLanguageItem)}
              </>
            )}
            {groupedLanguages.tier3.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                  Other Languages
                </DropdownMenuLabel>
                {groupedLanguages.tier3.map(renderLanguageItem)}
              </>
            )}
            {groupedLanguages.tier1.length === 0 &&
              groupedLanguages.tier2.length === 0 &&
              groupedLanguages.tier3.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t('empty.noResults')}
                </div>
              )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Full variant - complete display with native name
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn('gap-2 justify-between min-w-[180px]', className)}
          aria-label={t('aria.languageSelector')}
        >
          <div className="flex items-center gap-2">
            {showFlag && (
              <span className="text-lg">{currentLanguage?.flag || '🌐'}</span>
            )}
            <span className="font-medium">
              {currentLanguage?.nativeName || 'English'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{t('settings.language')}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`${t('actions.search')} (${LANGUAGES.length} ${t('settings.language').toLowerCase()}s)`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          {groupedLanguages.tier1.length > 0 && (
            <div className="p-1">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                🌟 Popular Languages ({groupedLanguages.tier1.length})
              </DropdownMenuLabel>
              {groupedLanguages.tier1.map(renderLanguageItem)}
            </div>
          )}
          {groupedLanguages.tier2.length > 0 && (
            <div className="p-1">
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                🌍 More Languages ({groupedLanguages.tier2.length})
              </DropdownMenuLabel>
              {groupedLanguages.tier2.map(renderLanguageItem)}
            </div>
          )}
          {groupedLanguages.tier3.length > 0 && (
            <div className="p-1">
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                🗺️ Other Languages ({groupedLanguages.tier3.length})
              </DropdownMenuLabel>
              {groupedLanguages.tier3.map(renderLanguageItem)}
            </div>
          )}
          {groupedLanguages.tier1.length === 0 &&
            groupedLanguages.tier2.length === 0 &&
            groupedLanguages.tier3.length === 0 && (
              <div className="p-8 text-center">
                <Globe className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('empty.noResults')}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {t('empty.noResultsDescription')}
                </p>
              </div>
            )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export a simple hook for language utilities
export function useLanguage() {
  const { i18n } = useTranslation();
  
  return {
    currentLanguage: getLanguageConfig(i18n.language),
    isRTL: isRTL(i18n.language),
    changeLanguage: (code: string) => i18n.changeLanguage(code),
    availableLanguages: LANGUAGES,
  };
}

export default LanguageSelector;
