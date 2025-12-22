import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Smartphone, Monitor, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const platforms = [
  {
    name: 'Web App',
    icon: Globe,
    description: 'Use it from any browser. Nothing to install.',
    version: 'Always Latest',
    size: 'No Download',
    requirements: 'Any Modern Browser',
    buttonText: 'Open Web App',
    buttonIcon: ExternalLink,
    buttonVariant: 'default' as const,
    link: '/app',
    isExternal: false,
    color: 'from-chart-1 to-chart-6',
    badge: 'Recommended'
  },
  {
    name: 'Android',
    icon: Smartphone,
    description: 'Native app for Android phones and tablets.',
    version: 'v1.0.0',
    size: '25 MB',
    requirements: 'Android 8.0+',
    buttonText: 'Download APK',
    buttonIcon: Download,
    buttonVariant: 'default' as const,
    link: '/vizor-install-1.0.0.apk',
    isExternal: true,
    color: 'from-chart-3 to-chart-4',
    badge: 'Available'
  },
  {
    name: 'Windows',
    icon: Monitor,
    description: 'Desktop app for Windows 10 and 11.',
    version: 'v1.0.0',
    size: '3.1 MB',
    requirements: 'Windows 10/11',
    buttonText: 'Download .exe',
    buttonIcon: Download,
    buttonVariant: 'default' as const,
    link: '/Vizor_1.0.0_x64-setup.exe',
    isExternal: true,
    color: 'from-accent to-primary',
    badge: 'Available'
  }
];

export default function PlatformDownloads() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Use It Anywhere
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Pick what works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            const ButtonIcon = platform.buttonIcon;
            
            return (
              <Card 
                key={index}
                className="bg-gradient-to-br from-white to-slate-50 dark:from-card dark:to-card/80 border-2 border-slate-200 dark:border-border/60 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <CardHeader className="relative p-5 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    {platform.badge && (
                      <Badge variant={platform.badge === 'Recommended' ? 'default' : 'secondary'} className="text-xs sm:text-sm">
                        {platform.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{platform.name}</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {platform.version}
                    </Badge>
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {platform.size}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-4 p-5 md:p-6">
                  <p className="text-muted-foreground">
                    {platform.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-medium mr-2">Requirements:</span>
                    <span>{platform.requirements}</span>
                  </div>

                  {platform.isExternal ? (
                    <Button 
                      className="w-full" 
                      size="lg" 
                      variant={platform.buttonVariant}
                      disabled={false}
                      onClick={() => {
                        window.location.href = platform.link;
                      }}
                    >
                      <ButtonIcon className="mr-2 w-5 h-5" />
                      {platform.buttonText}
                    </Button>
                  ) : (
                    <Link to={platform.link} className="block">
                      <Button className="w-full" size="lg" variant={platform.buttonVariant}>
                        <ButtonIcon className="mr-2 w-5 h-5" />
                        {platform.buttonText}
                      </Button>
                    </Link>
                  )}

                  {platform.badge === 'Coming Soon' && (
                    <p className="text-xs text-center text-muted-foreground">
                      Release date to be announced
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
