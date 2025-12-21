import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function LiveDemo() {
  const [showIframe, setShowIframe] = useState(false);

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-muted/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
            Try it right now
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            No downloads. No signup. Just start.
          </p>
        </div>

        <Card className="bg-card border-2 border-border/60 overflow-hidden shadow-xl">
          <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-background to-accent/20">
            {showIframe ? (
              <iframe 
                src="/app" 
                className="w-full h-full border-0"
                title="Vizor Live Demo"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Preview placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 p-8 opacity-30">
                    {/* Mock chart preview */}
                    <div className="h-32 bg-gradient-to-t from-chart-1/50 to-chart-1/20 rounded-lg" />
                    <div className="h-32 bg-gradient-to-t from-chart-2/50 to-chart-2/20 rounded-lg" />
                    <div className="h-32 bg-gradient-to-t from-chart-3/50 to-chart-3/20 rounded-lg" />
                    <div className="h-32 bg-gradient-to-t from-chart-4/50 to-chart-4/20 rounded-lg" />
                    <div className="h-32 bg-gradient-to-t from-chart-5/50 to-chart-5/20 rounded-lg" />
                    <div className="h-32 bg-gradient-to-t from-chart-6/50 to-chart-6/20 rounded-lg" />
                  </div>
                </div>

                {/* Play button */}
                <Button 
                  size="lg" 
                  className="relative z-10 group text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto touch-target"
                  onClick={() => setShowIframe(true)}
                >
                  <Play className="mr-2 w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  Try the demo
                </Button>
                
                <p className="mt-3 md:mt-4 text-xs sm:text-sm text-muted-foreground">
                  Start visualizing in under 10 seconds. No signup needed.
                </p>
              </div>
            )}
          </div>
        </Card>

        <div className="mt-10 md:mt-12 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="group text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 h-auto touch-target">
                Open Vizor
                <ExternalLink className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-12 md:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center p-4">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">✨</div>
            <h4 className="text-base sm:text-lg font-semibold mb-2">Intuitive Interface</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              If you can use a spreadsheet, you can master Vizor in minutes
            </p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">⚡</div>
            <h4 className="text-base sm:text-lg font-semibold mb-2">Blazing Fast</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Real-time updates with zero lag. Your changes appear instantly.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl sm:text-4xl font-bold text-chart-3 mb-2">🎨</div>
            <h4 className="text-base sm:text-lg font-semibold mb-2">Fully Customizable</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Tweak colors, fonts, and layouts however you want
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
