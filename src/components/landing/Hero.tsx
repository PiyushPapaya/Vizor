import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatsCounter } from './StatsCounter';

export default function Hero() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 animate-in fade-in duration-1000" />
      
      {/* Decorative blur circles - Turquoise/Teal theme */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" style={{ animation: 'pulse 4s ease-in-out infinite, float 6s ease-in-out infinite' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" style={{ animation: 'pulse 3s ease-in-out infinite 1s, float 8s ease-in-out infinite 2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl" style={{ animation: 'float 10s ease-in-out infinite 1s' }} />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center py-20">
        <Badge className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-sm px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2 inline" />
          Transform Your Data Into Art
        </Badge>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 bg-[length:200%_auto] animate-shimmer">
          Vizor
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 leading-relaxed">
          Turn spreadsheets into stunning visuals that actually get your point across
        </p>
        
        <p className="text-base md:text-lg text-muted-foreground/80 mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          No design degree needed. Just drag your data in, pick a chart, and boom — you've got something worth sharing.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <Link to="/app">
            <Button size="lg" className="text-lg px-8 py-6 group hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
              Start Creating (It's Free)
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 backdrop-blur-xl hover:scale-105 transition-transform hover:bg-primary/10"
            onClick={scrollToFeatures}
          >
            See What It Can Do
          </Button>
        </div>

        {/* Animated Stats Counter */}
        <StatsCounter />
      </div>
    </section>
  );
}
