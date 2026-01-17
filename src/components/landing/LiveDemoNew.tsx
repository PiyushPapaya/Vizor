import { Button } from '@/components/ui/button';
import { RotateCcw, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LiveDemoNew() {
  const { t } = useTranslation();
  const [key, setKey] = useState(0);
  const [showTooltips, setShowTooltips] = useState(true);

  useEffect(() => {
    // Auto-hide tooltips after 8 seconds
    const timer = setTimeout(() => {
      setShowTooltips(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [key]);

  const handleReset = () => {
    setKey(prev => prev + 1);
    setShowTooltips(true);
  };

  return (
    <section className="relative min-h-screen bg-background">
      {/* Gradient overlays for depth */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />

      {/* Floating toolbar */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="bg-card/95 backdrop-blur-xl border-2 border-border/40 hover:border-primary/40 shadow-lg"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Demo
        </Button>
        <a href="/app" target="_blank" rel="noopener noreferrer">
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl"
          >
            Open Full App
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </a>
      </div>

      {/* Live tooltips - fade out after animation */}
      {showTooltips && (
        <>
          {/* Tooltip 1 - Chart type selector */}
          <div 
            className="absolute top-32 left-1/4 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500"
            style={{ animation: 'fadeIn 0.7s ease-out 0.5s forwards, fadeOut 1s ease-out 7s forwards' }}
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
                14 chart types
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-accent" />
            </div>
          </div>

          {/* Tooltip 2 - Export button */}
          <div 
            className="absolute top-24 right-1/4 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000"
            style={{ animation: 'fadeIn 0.7s ease-out 1s forwards, fadeOut 1s ease-out 7s forwards' }}
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
                Download PNG in one click
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-accent" />
            </div>
          </div>

          {/* Tooltip 3 - Color picker */}
          <div 
            className="absolute bottom-32 left-1/3 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1500"
            style={{ animation: 'fadeIn 0.7s ease-out 1.5s forwards, fadeOut 1s ease-out 7s forwards' }}
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
                Customize everything
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-accent" />
            </div>
          </div>
        </>
      )}

      {/* Fullscreen iframe */}
      <iframe
        key={key}
        src="/app?demo=true"
        className="w-full h-screen border-0"
        title="Vizor Live Demo"
        loading="lazy"
      />
    </section>
  );
}
