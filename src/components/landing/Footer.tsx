import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const essentialLinks = [
    { name: t('footer.features'), href: '#features' },
    { name: t('footer.templates'), href: '/app' },
    { name: 'Help', href: '/docs' },
    { name: 'GitHub', href: 'https://github.com/PiyushPapaya/Vizor', external: true },
    { name: t('footer.privacy'), href: '/privacy' },
  ];

  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/vizor-logo.jpeg"
              alt="Vizor"
              loading="lazy"
              decoding="async"
              className="w-8 h-8 rounded-lg shadow-md"
            />
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Vizor
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('footer.tagline')}
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {essentialLinks.map((link) => (
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector variant="compact" />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground">
            Copyright {currentYear} Vizor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
