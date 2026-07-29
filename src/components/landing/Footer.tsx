import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

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
    <footer className="border-t border-border/30 bg-gradient-to-b from-card to-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
              <img
                src="/vizor-logo.jpeg"
                alt="Vizor"
                loading="lazy"
                decoding="async"
                className="relative w-9 h-9 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Vizor
              </h3>
              <p className="text-xs text-muted-foreground/70">
                {t('footer.tagline')}
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            {essentialLinks.map((link) => (
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-all duration-200"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-all duration-200"
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelector variant="compact" />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/20">
          <p className="text-center text-xs text-muted-foreground/60">
            Copyright {currentYear} Vizor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
