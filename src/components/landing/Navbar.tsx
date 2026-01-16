import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function Navbar() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t('nav.perfectFor'), href: '#use-cases' },
    { name: t('nav.whyVizor'), href: '#comparison' },
    { name: t('nav.faq'), href: '#faq' },
    { name: t('nav.demo'), href: '#demo' },
    { name: t('nav.download'), href: '#downloads' },
  ];

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group touch-target">
            <img 
              src="/vizor-logo.jpeg" 
              alt="Vizor" 
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0"
            />
            <span className="text-lg sm:text-xl font-bold text-foreground whitespace-nowrap">
              Vizor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer touch-target"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Language Selector and CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector variant="compact" />
            <Link to="/app">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 touch-target">
                {t('nav.getStarted')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector variant="compact" />
            <button
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors touch-target-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors touch-target"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-2">
              <Link to="/app" className="block">
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 touch-target">
                  {t('nav.getStarted')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
