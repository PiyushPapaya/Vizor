import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  Database, Download, Zap, Palette, Filter, Layers, 
  BarChart2, Edit3, TrendingUp, Share2, Wand2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Features() {
  const { t } = useTranslation();
  
  // Top 3 hero features
  const heroFeatures = [
    {
      icon: Database,
      title: t('features.hero.dropData.title'),
      description: t('features.hero.dropData.description'),
      color: 'text-chart-1'
    },
    {
      icon: Wand2,
      title: t('features.hero.seeLive.title'),
      description: t('features.hero.seeLive.description'),
      color: 'text-accent'
    },
    {
      icon: Download,
      title: t('features.hero.exportGo.title'),
      description: t('features.hero.exportGo.description'),
      color: 'text-chart-3'
    }
  ];

  // Grouped features
  const featureGroups = [
    {
      title: t('features.groups.chartTypes.title'),
      icon: BarChart2,
      color: 'from-blue-500/20 to-blue-600/20',
      features: t('features.groups.chartTypes.features', { returnObjects: true }) as string[]
    },
    {
      title: t('features.groups.customization.title'),
      icon: Palette,
      color: 'from-purple-500/20 to-purple-600/20',
      features: t('features.groups.customization.features', { returnObjects: true }) as string[]
    },
    {
      title: t('features.groups.dataHandling.title'),
      icon: Zap,
      color: 'from-yellow-500/20 to-orange-600/20',
      features: t('features.groups.dataHandling.features', { returnObjects: true }) as string[]
    },
    {
      title: t('features.groups.exportOptions.title'),
      icon: Share2,
      color: 'from-green-500/20 to-emerald-600/20',
      features: t('features.groups.exportOptions.features', { returnObjects: true }) as string[]
    }
  ];

  return (
    <section 
      id="features" 
      className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Enhanced background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background dark:via-primary/5" aria-hidden="true" />
      <div className="absolute top-20 right-20 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-accent/10 dark:bg-accent/10 rounded-full blur-3xl hidden sm:block rtl:right-auto rtl:left-20" aria-hidden="true" />
      <div className="absolute bottom-20 left-20 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl hidden sm:block rtl:left-auto rtl:right-20" aria-hidden="true" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <h2 
            id="features-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
          >
            {t('features.mainTitle')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('features.mainSubtitle')}
          </p>
        </div>

        {/* Top 3 Hero Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20" role="list">
          {heroFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                role="listitem"
                className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-card dark:to-card/80 backdrop-blur-sm border-2 border-slate-200 dark:border-border/50 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden touch-target"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                
                <CardHeader className="relative text-center">
                  <div 
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg ${feature.color}`}
                    aria-hidden="true"
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">{feature.title}</h3>
                </CardHeader>
                <CardContent className="relative text-center">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Grouped Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6" role="list">
          {featureGroups.map((group, index) => {
            const Icon = group.icon;
            return (
              <Card 
                key={index}
                role="listitem"
                className="group bg-gradient-to-br from-white to-slate-50 dark:from-card dark:to-card/80 backdrop-blur-sm border-2 border-slate-200 dark:border-border/50 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg transition-all duration-300 touch-target"
              >
                <CardHeader>
                  <div 
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center mb-2 sm:mb-3`}
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold">{group.title}</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                    {Array.isArray(group.features) && group.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0 rtl:order-last" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
