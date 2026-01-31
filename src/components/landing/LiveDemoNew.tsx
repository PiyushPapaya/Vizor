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
  
  // Use the correct path based on the base URL
  const baseUrl = import.meta.env.BASE_URL || '/';
  const appPath = typeof window !== 'undefined' 
    ? `${window.location.origin}${baseUrl === '/' ? '' : baseUrl}app` 
    : `${baseUrl}app`;

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
    // Force iframe reload
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
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
    <section className="relative min-h-screen bg-background">
      {/* Gradient overlays for depth */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />

      {/* Floating toolbar - responsive positioning and sizing */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 sm:gap-3">
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="bg-card/95 backdrop-blur-xl border-2 border-border/40 hover:border-primary/40 shadow-lg h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
        >
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="hidden sm:inline">Reset Demo</span>
        </Button>
        <a href={appPath} target="_blank" rel="noopener noreferrer">
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
          >
            <span className="hidden md:inline">Open Full App</span>
            <span className="md:hidden">Open App</span>
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
          </Button>
        </a>
      </div>

      {/* Live tooltips - fade out after animation, hidden on mobile to prevent overlap */}
      {showTooltips && (
        <>
          {/* Tooltip 1 - Chart type selector */}
          <div 
            className="hidden md:block absolute top-32 left-1/4 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500"
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
            className="hidden md:block absolute top-24 right-1/4 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000"
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
            className="hidden md:block absolute bottom-32 left-1/3 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1500"
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
            <div className="w-full h-screen flex items-center justify-center bg-muted/20">
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
              className="w-full h-screen border-0"
              title="Vizor Live Demo"
              loading="lazy"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              allow="clipboard-write"
            />
          )}
        </>
      ) : (
        <div className="w-full h-screen flex items-center justify-center bg-muted/20">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading demo...</p>
          </div>
        </div>
      )}
    </section>
  );
}
