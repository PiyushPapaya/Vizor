import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 px-4 sm:px-6"
      aria-labelledby="hero-heading"
    >
      {/* Enhanced gradient background with better light mode visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 dark:from-primary/30 dark:via-background dark:to-accent/30" aria-hidden="true" />
      
      {/* Grid pattern overlay for data viz feel */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
           aria-hidden="true" />
      
      {/* Animated floating chart icons - Hidden on mobile for better performance */}
      <div className="absolute top-20 left-[10%] opacity-10 dark:opacity-20 animate-float hidden md:block" style={{ animationDelay: '0s', animationDuration: '8s' }} aria-hidden="true">
        <svg className="w-12 h-12 lg:w-16 lg:h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </div>
      <div className="absolute top-40 right-[15%] opacity-10 dark:opacity-20 animate-float hidden lg:block" style={{ animationDelay: '1s', animationDuration: '10s' }} aria-hidden="true">
        <svg className="w-16 h-16 lg:w-20 lg:h-20 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>
      <div className="absolute bottom-32 left-[20%] opacity-10 dark:opacity-20 animate-float hidden md:block" style={{ animationDelay: '2s', animationDuration: '9s' }} aria-hidden="true">
        <svg className="w-10 h-10 lg:w-14 lg:h-14 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-[12%] opacity-10 dark:opacity-20 animate-float hidden lg:block" style={{ animationDelay: '1.5s', animationDuration: '11s' }} aria-hidden="true">
        <svg className="w-14 h-14 lg:w-18 lg:h-18 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      </div>
      
      {/* Animated data point dots - Reduced on mobile */}
      <div className="absolute top-[30%] left-[8%] w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse opacity-40 hidden sm:block" style={{ animationDelay: '0s' }} aria-hidden="true" />
      <div className="absolute top-[45%] right-[10%] w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-pulse opacity-40 hidden sm:block" style={{ animationDelay: '0.5s' }} aria-hidden="true" />
      <div className="absolute bottom-[35%] left-[15%] w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary rounded-full animate-pulse opacity-40 hidden md:block" style={{ animationDelay: '1s' }} aria-hidden="true" />
      <div className="absolute top-[60%] right-[18%] w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full animate-pulse opacity-40 hidden md:block" style={{ animationDelay: '1.5s' }} aria-hidden="true" />
      
      {/* Animated floating orbs with enhanced light mode opacity - Simplified on mobile */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-primary/20 sm:bg-primary/30 dark:bg-primary/40 rounded-full blur-3xl animate-pulse" 
           style={{ animation: 'pulse 4s ease-in-out infinite, float 8s ease-in-out infinite' }} 
           aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-accent/20 sm:bg-accent/30 dark:bg-accent/40 rounded-full blur-3xl" 
           style={{ animation: 'pulse 5s ease-in-out infinite 1s, float 10s ease-in-out infinite 2s' }} 
           aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-primary/15 to-accent/15 sm:from-primary/20 sm:to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-full blur-3xl" 
           style={{ animation: 'float 12s ease-in-out infinite 1s' }} 
           aria-hidden="true" />
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px]" aria-hidden="true" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full text-center py-12 sm:py-16 md:py-20">
        <h1 
          id="hero-heading"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 leading-tight px-2"
        >
          Create presentation-ready charts in seconds{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient block sm:inline mt-1 sm:mt-0">
            without Excel
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-2 sm:mb-3 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 leading-relaxed px-2">
          Upload your data, choose a chart, export instantly.
        </p>
        
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 mb-6 sm:mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 px-2">
          No credit card. Free forever.
        </p>
        
        {/* Trust indicators with reordered priorities */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-xs sm:text-sm mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 px-2">
          <span className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 dark:border-blue-500/20 backdrop-blur-sm hover:scale-105 hover:shadow-lg transition-all touch-target">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-foreground whitespace-nowrap\">No sign-up</span>
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-green-500/10 dark:bg-green-500/10 border border-green-500/30 dark:border-green-500/20 backdrop-blur-sm hover:scale-105 hover:shadow-lg transition-all touch-target">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-foreground whitespace-nowrap\">100% free</span>
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 dark:bg-purple-500/10 border border-purple-500/30 dark:border-purple-500/20 backdrop-blur-sm hover:scale-105 hover:shadow-lg transition-all touch-target">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-foreground whitespace-nowrap\">Private data</span>
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 px-4 max-w-2xl mx-auto">
          <Link to="/app" className="flex-1 sm:flex-none">
            <Button 
              size="lg" 
              className="w-full text-base sm:text-lg px-6 sm:px-10 py-6 sm:py-7 group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 transition-all hover:scale-105 border-0 touch-target-lg"
              aria-label="Create your first chart in 10 seconds"
            >
              <span className="truncate\">Create your first chart</span>
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" aria-hidden="true" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-10 py-6 sm:py-7 backdrop-blur-sm border-2 hover:border-primary hover:bg-primary/10 transition-all hover:scale-105 touch-target-lg"
            onClick={scrollToFeatures}
            aria-label="See how it works"
          >
            See how it works
          </Button>
        </div>

        {/* Live demo preview */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600 px-2">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-border sm:border-2 bg-card shadow-xl sm:shadow-2xl">
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="pt-10 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-8 bg-gradient-to-br from-muted/50 to-background">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="h-16 sm:h-20 md:h-24 bg-chart-1/20 rounded-lg border border-chart-1/30 flex items-end p-1.5 sm:p-2">
                    <div className="w-full h-10 sm:h-12 md:h-16 bg-gradient-to-t from-chart-1 to-chart-1/50 rounded"></div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-center text-muted-foreground">Bar Chart</div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="h-16 sm:h-20 md:h-24 bg-chart-2/20 rounded-lg border border-chart-2/30 flex items-center justify-center p-1.5 sm:p-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-4 sm:border-6 md:border-8 border-chart-2 border-t-transparent"></div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-center text-muted-foreground">Pie Chart</div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="h-16 sm:h-20 md:h-24 bg-chart-3/20 rounded-lg border border-chart-3/30 flex items-end p-1.5 sm:p-2">
                    <svg className="w-full h-10 sm:h-12 md:h-16" viewBox="0 0 100 50">
                      <polyline points="0,40 25,30 50,20 75,15 100,10" stroke="currentColor" strokeWidth="2" fill="none" className="text-chart-3" />
                    </svg>
                  </div>
                  <div className="text-[10px] sm:text-xs text-center text-muted-foreground">Line Chart</div>
                </div>
              </div>
              <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">Start visualizing in under 10 seconds</p>
            </div>
          </div>
        </div>

        {/* Trust message */}
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground/80 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 px-2">
          Trusted by students, creators, and professionals worldwide
        </p>
      </div>
    </section>
  );
}
