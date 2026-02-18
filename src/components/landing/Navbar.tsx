import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: t('nav.perfectFor'), href: '#use-cases' },
    { name: t('nav.whyVizor'), href: '#comparison' },
    { name: 'Blog', href: '/blog' },
    { name: t('nav.faq'), href: '#faq' },
    { name: t('nav.demo'), href: '#demo' },
    { name: t('nav.download'), href: '#downloads' },
  ];

  const scrollToSection = (href: string) => {
    closeMobileMenu();
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.startsWith('/')) {
      navigate(href);
    }
  };

  const closeMobileMenu = () => {
    if (!mobileMenuOpen) return;
    setIsClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
    }, 200);
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-card/95 via-card/92 to-card/95 backdrop-blur-2xl border-b border-border/30 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)]">
      {/* Subtle gradient overlay like app header */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-accent/[0.03] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Brand - matching app size (36px) */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group touch-target">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
              <img 
                src="/vizor-logo.jpeg" 
                alt="Vizor" 
                className="relative w-9 h-9 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow flex-shrink-0 border-2 border-border/30"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
              Vizor
            </span>
          </Link>

          {/* Desktop Navigation - styled as app's ghost buttons */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium h-9 px-3 rounded-lg hover:bg-primary/8 hover:text-primary transition-all duration-200"
              >
                {link.name}
              </Button>
            ))}
          </div>

          {/* Language Selector and "Launch App" CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector variant="compact" />
            <Link to="/app">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/15 h-9 px-6 touch-target border-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                Launch App
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector variant="compact" />
            <button
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
              onClick={() => mobileMenuOpen ? closeMobileMenu() : setMobileMenuOpen(true)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                <X className={`absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${mobileMenuOpen && !isClosing ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} />
                <Menu className={`absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${mobileMenuOpen && !isClosing ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with enter/exit animation */}
      {mobileMenuOpen && (
        <div 
          ref={menuRef}
          className={`md:hidden border-t border-border/30 bg-background/98 backdrop-blur-2xl transition-all duration-200 ${
            isClosing 
              ? 'animate-out fade-out slide-out-to-top-2' 
              : 'animate-in fade-in slide-in-from-top-2'
          }`}
        >
          <div className="px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-1 max-h-[calc(100svh-4rem)] overflow-y-auto">
            {navLinks.map((link, index) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left px-4 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-150"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4">
              <Link to="/app" className="block" onClick={() => closeMobileMenu()}>
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-12 text-base font-semibold rounded-xl shadow-lg">
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
