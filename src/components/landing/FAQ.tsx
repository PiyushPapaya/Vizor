import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function FAQ() {
  const { t } = useTranslation();
  
  const faqKeys = [
    'stayFree',
    'dataSecure', 
    'fileFormats',
    'chartTypes',
    'useCase',
    'offline',
    'embed',
    'moreCharts'
  ];

  // Add FAQ schema markup for SEO
  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqKeys.map((key) => ({
        '@type': 'Question',
        name: t(`faq.items.${key}.question`),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t(`faq.items.${key}.answer`),
        },
      })),
    };

    let script = document.querySelector('script[data-schema="faq"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'faq');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqSchema);

    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector('script[data-schema="faq"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [t, faqKeys]);

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 relative overflow-hidden" id="faq">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <Badge className="mb-3 sm:mb-4 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline rtl:mr-0 rtl:ml-1.5 sm:rtl:ml-2" />
            {t('faq.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            {t('faq.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t('faq.subtitle')}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
          {faqKeys.map((key, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-2 border-border/60 rounded-lg px-4 sm:px-5 md:px-6 bg-card hover:border-primary/50 hover:shadow-md transition-all touch-target"
            >
              <AccordionTrigger className="text-left hover:no-underline py-3 sm:py-4 rtl:text-right">
                <span className="font-semibold text-sm sm:text-base md:text-lg pr-4 rtl:pr-0 rtl:pl-4">
                  {t(`faq.items.${key}.question`)}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-3 sm:pb-4 text-sm sm:text-base leading-relaxed">
                {t(`faq.items.${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12 p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-border/60 bg-card shadow-md">
          <h3 className="text-lg sm:text-xl font-bold mb-2">{t('faq.cta.title')}</h3>
          <p className="text-muted-foreground mb-4">{t('faq.cta.description')}</p>
          <Link to="/app">
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              {t('faq.cta.button')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
