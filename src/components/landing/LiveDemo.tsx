import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function LiveDemo() {
  const [showIframe, setShowIframe] = useState(false);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-muted/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Experience Vizor Live
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            No sign-up required, no downloads needed. Start creating beautiful charts instantly.
          </p>
        </div>

        <Card className="bg-card border border-border/60 overflow-hidden shadow-xl">
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
                  className="relative z-10 group text-lg px-8 py-6"
                  onClick={() => setShowIframe(true)}
                >
                  <Play className="mr-2 w-6 h-6 group-hover:scale-110 transition-transform" />
                  Load Interactive Demo
                </Button>
                
                <p className="mt-4 text-sm text-muted-foreground">
                  Click to load the full Vizor application
                </p>
              </div>
            )}
          </div>
        </Card>

        <div className="mt-12 text-center space-y-4">
          <p className="text-muted-foreground">
            Ready to transform your data into insights?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="group">
                Open Full App
                <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">✨</div>
            <h4 className="font-semibold mb-2">Intuitive Interface</h4>
            <p className="text-sm text-muted-foreground">
              If you can use a spreadsheet, you can master Vizor in minutes
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">⚡</div>
            <h4 className="font-semibold mb-2">Blazing Fast</h4>
            <p className="text-sm text-muted-foreground">
              Real-time updates with zero lag. Your changes appear instantly.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-chart-3 mb-2">🎨</div>
            <h4 className="font-semibold mb-2">Fully Customizable</h4>
            <p className="text-sm text-muted-foreground">
              Tweak colors, fonts, and layouts however you want
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
