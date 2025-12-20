import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, BarChart3, LineChart, PieChart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatsCounter } from './StatsCounter';

export default function Hero() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Enhanced gradient background with better light mode visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 dark:from-primary/30 dark:via-background dark:to-accent/30" aria-hidden="true" />
      
      {/* Grid pattern overlay for data viz feel */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
           aria-hidden="true" />
      
      {/* Animated floating chart icons */}
      <div className="absolute top-20 left-[10%] opacity-20 dark:opacity-30 animate-float" style={{ animationDelay: '0s', animationDuration: '8s' }} aria-hidden="true">
        <BarChart3 className="w-16 h-16 text-primary" />
      </div>
      <div className="absolute top-40 right-[15%] opacity-20 dark:opacity-30 animate-float" style={{ animationDelay: '1s', animationDuration: '10s' }} aria-hidden="true">
        <LineChart className="w-20 h-20 text-accent" />
      </div>
      <div className="absolute bottom-32 left-[20%] opacity-20 dark:opacity-30 animate-float" style={{ animationDelay: '2s', animationDuration: '9s' }} aria-hidden="true">
        <PieChart className="w-14 h-14 text-primary" />
      </div>
      <div className="absolute bottom-20 right-[12%] opacity-20 dark:opacity-30 animate-float" style={{ animationDelay: '1.5s', animationDuration: '11s' }} aria-hidden="true">
        <TrendingUp className="w-18 h-18 text-accent" />
      </div>
      
      {/* Animated data point dots */}
      <div className="absolute top-[30%] left-[8%] w-3 h-3 bg-primary rounded-full animate-pulse opacity-40" style={{ animationDelay: '0s' }} aria-hidden="true" />
      <div className="absolute top-[45%] right-[10%] w-2 h-2 bg-accent rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} aria-hidden="true" />
      <div className="absolute bottom-[35%] left-[15%] w-2.5 h-2.5 bg-primary rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} aria-hidden="true" />
      <div className="absolute top-[60%] right-[18%] w-3 h-3 bg-accent rounded-full animate-pulse opacity-40" style={{ animationDelay: '1.5s' }} aria-hidden="true" />
      
      {/* Animated floating orbs with enhanced light mode opacity */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 dark:bg-primary/40 rounded-full blur-3xl animate-pulse" 
           style={{ animation: 'pulse 4s ease-in-out infinite, float 8s ease-in-out infinite' }} 
           aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/30 dark:bg-accent/40 rounded-full blur-3xl" 
           style={{ animation: 'pulse 5s ease-in-out infinite 1s, float 10s ease-in-out infinite 2s' }} 
           aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-full blur-3xl" 
           style={{ animation: 'float 12s ease-in-out infinite 1s' }} 
           aria-hidden="true" />
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px]" aria-hidden="true" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center py-20">
        <Badge className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-sm px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 backdrop-blur-sm shadow-lg shadow-primary/20" role="status">
          <Sparkles className="w-4 h-4 mr-2 inline animate-pulse" aria-hidden="true" />
          Turn your data into clear visuals
        </Badge>
        
        <h1 
          id="hero-heading"
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 bg-[length:200%_auto] animate-gradient drop-shadow-2xl"
          style={{ animation: 'gradient 8s ease infinite, fadeIn 0.7s ease-out 0.1s both, slideInFromBottom 0.7s ease-out 0.1s both' }}
        >
          Vizor
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 leading-relaxed">
          Create stunning charts in seconds. No spreadsheet skills required.
        </p>
        
        <p className="text-base md:text-lg text-muted-foreground/80 mb-2 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          Upload your data, pick a chart type, and you're done. We make data visualization simple for everyone.
        </p>
        
        {/* Trust indicators with enhanced light mode styling */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 dark:bg-green-500/10 border border-green-500/30 dark:border-green-500/20 backdrop-blur-sm hover:scale-105 hover:shadow-lg transition-all">
            <svg className="w-4 h-4 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-foreground">100% Free Forever</span>
          </span>
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 dark:border-blue-500/20 backdrop-blur-sm hover:scale-105 hover:shadow-lg transition-all">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-foreground">No Sign-up Required</span>
          </span>
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 dark:bg-purple-500/10 border border-purple-500/30 dark:border-purple-500/20 backdrop-blur-sm hover:scale-105 hover:shadow-lg transition-all">
            <svg className="w-4 h-4 text-purple-600 dark:text-purple-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-foreground">Data Stays Private</span>
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <Link to="/app">
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 transition-all hover:scale-105 border-0"
              aria-label="Start creating charts for free"
            >
              Start creating for free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-10 py-7 backdrop-blur-sm border-2 hover:border-primary hover:bg-primary/10 transition-all hover:scale-105"
            onClick={scrollToFeatures}
            aria-label="Scroll to see how Vizor works"
          >
            See how it works
          </Button>
        </div>

        {/* Animated Stats Counter */}
        <StatsCounter />
      </div>
    </section>
  );
}
