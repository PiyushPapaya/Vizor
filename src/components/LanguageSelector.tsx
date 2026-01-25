import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { LANGUAGES, getLanguageConfig } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const { i18n } = useTranslation();
  const currentLanguage = getLanguageConfig(i18n.language);

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    localStorage.setItem('vizor-language', languageCode);
    document.documentElement.lang = languageCode;
    document.documentElement.dir = 'ltr';
  };

  const renderLanguageItem = (lang: typeof LANGUAGES[0]) => {
    const isSelected = lang.code === i18n.language;
    const isComingSoon = lang.code === 'de'; // German is coming soon

    return (
      <DropdownMenuItem
        key={lang.code}
        onClick={() => !isComingSoon && handleLanguageChange(lang.code)}
        className={cn(
          'flex items-center justify-between gap-3 py-2.5',
          isComingSoon ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          isSelected && !isComingSoon && 'bg-accent'
        )}
        disabled={isComingSoon}
      >
        <div className='flex items-center gap-3 flex-1'>
          {showFlag && <span className='text-lg'>{lang.flag}</span>}
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <span className='font-medium'>{lang.name}</span>
              {isComingSoon && (
                <span className='text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium uppercase'>Coming Soon</span>
              )}
            </div>
            {showNativeName && lang.name !== lang.nativeName && (
              <span className='text-xs text-muted-foreground'>{lang.nativeName}</span>
            )}
          </div>
        </div>
        {isSelected && !isComingSoon && <Check className='h-4 w-4 text-primary' />}
      </DropdownMenuItem>
    );
  };

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className={cn('h-9 w-9', className)}
            aria-label='Select language'
          >
            <span className='text-lg'>{currentLanguage?.flag || ''}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {LANGUAGES.map(renderLanguageItem)}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn('gap-2', className)}
          aria-label='Select language'
        >
          {showFlag && (
            <span className='text-base'>{currentLanguage?.flag || ''}</span>
          )}
          <span className={variant === 'full' ? 'font-medium' : 'uppercase text-xs font-medium'}>
            {variant === 'full' ? currentLanguage?.nativeName : currentLanguage?.code || 'DE'}
          </span>
          <Globe className='h-3.5 w-3.5 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {LANGUAGES.map(renderLanguageItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function useLanguage() {
  const { i18n } = useTranslation();
  
  return {
    currentLanguage: getLanguageConfig(i18n.language),
    changeLanguage: (code: string) => i18n.changeLanguage(code),
    availableLanguages: LANGUAGES,
  };
}

export default LanguageSelector;
