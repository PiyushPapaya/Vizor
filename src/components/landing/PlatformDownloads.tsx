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
    buttonVariant: 'outline' as const,
    link: '#',
    isExternal: true,
    color: 'from-chart-3 to-chart-4',
    badge: 'Coming Soon'
  },
  {
    name: 'Windows',
    icon: Monitor,
    description: 'Desktop app for Windows 10 and 11.',
    version: 'v1.0.0',
    size: '85 MB',
    requirements: 'Windows 10/11',
    buttonText: 'Download .exe',
    buttonIcon: Download,
    buttonVariant: 'outline' as const,
    link: '#',
    isExternal: true,
    color: 'from-accent to-primary',
    badge: 'Coming Soon'
  }
];

export default function PlatformDownloads() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Use It Anywhere
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Pick what works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            const ButtonIcon = platform.buttonIcon;
            
            return (
              <Card 
                key={index}
                className="bg-card border border-border/60 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {platform.badge && (
                      <Badge variant={platform.badge === 'Recommended' ? 'default' : 'secondary'}>
                        {platform.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{platform.name}</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {platform.version}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {platform.size}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-4">
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
                      disabled={platform.badge === 'Coming Soon'}
                      onClick={() => {
                        if (platform.badge !== 'Coming Soon') {
                          window.location.href = platform.link;
                        }
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
