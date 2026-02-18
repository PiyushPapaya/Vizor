import { Button } from '@/components/ui/button';
import { RotateCcw, ExternalLink, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function LiveDemoNew() {
  const { t } = useTranslation();
  const [key, setKey] = useState(0);
  const [showTooltips, setShowTooltips] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Use absolute path for iframe to ensure it loads correctly
  const appPath = typeof window !== 'undefined' ? `${window.location.origin}/app` : '/app';

  // Lazy load iframe when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { rootMargin: '100px' } // Start loading 100px before section is visible
    );

    const section = iframeRef.current?.parentElement;
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    // Auto-hide tooltips after 8 seconds
    const timer = setTimeout(() => {
      setShowTooltips(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [key]);

  useEffect(() => {
    // Fallback timeout in case iframe never fires onLoad
    if (isLoading) {
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 10000); // 10 second timeout
      return () => clearTimeout(loadingTimeout);
    }
  }, [isLoading]);

  const handleReset = () => {
    setKey(prev => prev + 1);
    setShowTooltips(true);
    setHasError(false);
    setIsLoading(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <section className="relative min-h-[100svh] bg-background">
      {/* Gradient overlays for depth */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />

      {/* Floating toolbar - responsive positioning and sizing */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-auto sm:right-4 md:top-6 md:right-6 z-20 flex items-center justify-end gap-2 sm:gap-3">
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="bg-card/95 backdrop-blur-2xl border border-border/30 hover:border-primary/40 shadow-lg shadow-black/5 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm rounded-xl"
        >
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="hidden sm:inline">Reset Demo</span>
        </Button>
        <a href={appPath} target="_blank" rel="noopener noreferrer">
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/25 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm rounded-xl font-semibold"
          >
            <span className="hidden md:inline">Open Full App</span>
            <span className="md:hidden">Open App</span>
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
          </Button>
        </a>
      </div>

      {/* Info banner - replaces fragile floating tooltips */}
      {showTooltips && (
        <div 
          className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-20 hidden md:block animate-in fade-in slide-in-from-top-2 duration-500"
          style={{ animation: 'fadeIn 0.7s ease-out 0.5s forwards, fadeOut 1s ease-out 7s forwards' }}
        >
          <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs sm:text-sm font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-xl whitespace-nowrap flex items-center gap-3">
            <span>14 chart types</span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/50" />
            <span>One-click export</span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/50" />
            <span>Fully customizable</span>
          </div>
        </div>
      )}

      {/* Fullscreen iframe - lazy loaded */}
      {isVisible ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/20 z-10">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading demo...</p>
              </div>
            </div>
          )}
          {hasError ? (
            <div className="w-full h-[100svh] flex items-center justify-center bg-muted/20">
              <div className="text-center space-y-4 max-w-md px-4">
                <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
                <h3 className="text-xl font-semibold">Demo Unavailable</h3>
                <p className="text-muted-foreground">The live demo couldn't load. Please try opening the full app instead.</p>
                <a href={appPath} target="_blank" rel="noopener noreferrer">
                  <Button className="mt-4">
                    Open Full App
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <iframe
              key={key}
              ref={iframeRef}
              src={`${appPath}?demo=true`}
              className="w-full h-[100svh] border-0"
              title="Vizor Live Demo"
              loading="lazy"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </>
      ) : (
        <div className="w-full h-[100svh] flex items-center justify-center bg-muted/20">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading demo...</p>
          </div>
        </div>
      )}
    </section>
  );
}
