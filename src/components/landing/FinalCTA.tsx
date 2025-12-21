import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Create your first chart now
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            No downloads. No signup. Just upload and visualize.
          </p>
          
          <Link to="/app">
            <Button 
              size="lg" 
              className="text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 transition-all hover:scale-105 h-auto"
            >
              Start creating
              <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <p className="mt-6 sm:mt-8 text-sm sm:text-base text-muted-foreground">
            Join thousands making better charts every day
          </p>
        </div>

        {/* Quick preview window */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-border sm:border-2 bg-card shadow-xl sm:shadow-2xl">
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="pt-10 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-8 bg-gradient-to-br from-muted/50 to-background">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {/* Bar Chart */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-end justify-between h-32 sm:h-40 gap-1.5 sm:gap-2">
                    <div className="flex-1 bg-gradient-to-t from-chart-1 to-chart-1/70 rounded-t-md" style={{ height: '75%' }}></div>
                    <div className="flex-1 bg-gradient-to-t from-chart-2 to-chart-2/70 rounded-t-md" style={{ height: '55%' }}></div>
                    <div className="flex-1 bg-gradient-to-t from-chart-3 to-chart-3/70 rounded-t-md" style={{ height: '90%' }}></div>
                    <div className="flex-1 bg-gradient-to-t from-chart-4 to-chart-4/70 rounded-t-md" style={{ height: '65%' }}></div>
                  </div>
                  <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground">Bar Chart</p>
                </div>

                {/* Pie Chart */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-center h-32 sm:h-40">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-32 sm:h-32">
                      <circle cx="50" cy="50" r="40" fill="hsl(var(--chart-1))" />
                      <path d="M 50 50 L 50 10 A 40 40 0 0 1 85 70 Z" fill="hsl(var(--chart-2))" />
                      <path d="M 50 50 L 85 70 A 40 40 0 0 1 30 85 Z" fill="hsl(var(--chart-3))" />
                    </svg>
                  </div>
                  <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground">Pie Chart</p>
                </div>

                {/* Line Chart */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-center h-32 sm:h-40">
                    <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 50 L 25 35 L 50 40 L 75 20 L 100 25" fill="none" stroke="hsl(var(--chart-4))" strokeWidth="2" />
                      <path d="M 0 50 L 25 35 L 50 40 L 75 20 L 100 25 L 100 60 L 0 60 Z" fill="url(#lineGradient)" />
                    </svg>
                  </div>
                  <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground">Line Chart</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
