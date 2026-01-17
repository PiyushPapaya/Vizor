import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const sampleData = [
  { name: 'Jan', value: 4200 },
  { name: 'Feb', value: 3800 },
  { name: 'Mar', value: 5100 },
  { name: 'Apr', value: 4600 },
  { name: 'May', value: 6300 },
  { name: 'Jun', value: 5900 },
];

const chartColors = [
  'hsl(175, 70%, 48%)',
  'hsl(160, 75%, 42%)',
  'hsl(145, 70%, 42%)',
  'hsl(190, 75%, 48%)',
  'hsl(200, 80%, 52%)',
  'hsl(155, 65%, 48%)',
];

export default function HeroNew() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<'bar' | 'line' | 'area' | 'pie' | 'donut'>('bar');

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 lg:pt-32 pb-16 lg:pb-20">
      {/* Simplified background - only 2 large orbs at 10% opacity */}
      <div className="absolute inset-0 bg-[hsl(220,15%,10%)]" aria-hidden="true" />
      
      {/* Grid pattern - 80px, very subtle */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{ 
          backgroundImage: 'linear-gradient(hsl(220,10%,25%) 1px, transparent 1px), linear-gradient(90deg, hsl(220,10%,25%) 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }}
        aria-hidden="true" 
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />
      
      {/* Floating orbs - large, subtle */}
      <div 
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-3xl opacity-10" 
        style={{ animation: 'orb-float 16s ease-in-out infinite' }}
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent rounded-full blur-3xl opacity-10" 
        style={{ animation: 'orb-float 20s ease-in-out infinite reverse' }}
        aria-hidden="true" 
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Split screen layout: 40% left / 60% right */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Content (40%) */}
          <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
            {/* Logo */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <img 
                src="/vizor-logo.jpeg" 
                alt="Vizor" 
                className="w-10 h-10 rounded-xl shadow-lg"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Vizor
              </span>
            </div>

            {/* Headline - gradient only on "insights" */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-white">
              Turn spreadsheets into{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                insights
              </span>
              <br />
              in under 10 seconds
            </h1>

            {/* Small trust text */}
            <p className="text-sm text-muted-foreground">
              No signup. No downloads. No limits.
            </p>

            {/* Single CTA */}
            <Button 
              onClick={scrollToDemo}
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] h-12 px-8 text-base font-semibold"
            >
              Try it now — it's already loaded below
              <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>

          {/* Right Side - Interactive Preview (60%) */}
          <div className="lg:col-span-3">
            <Card className="bg-card/95 backdrop-blur-xl border-2 border-border/40 rounded-2xl shadow-depth-lg p-6 space-y-4 relative group hover:shadow-depth-lg transition-all duration-500">
              {/* Tooltip badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                This is the real app. Keep scrolling to use the full version.
              </div>

              {/* Mini chart type selector */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {['bar', 'line', 'area', 'pie', 'donut'].map((type) => (
                  <Button
                    key={type}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedType(type as any)}
                    className={`
                      text-xs capitalize rounded-lg transition-all duration-300
                      ${selectedType === type 
                        ? 'bg-gradient-to-r from-primary/20 to-accent/10 text-foreground font-semibold border border-primary/30' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }
                    `}
                  >
                    {type}
                  </Button>
                ))}
              </div>

              {/* Live chart preview */}
              <div className="h-64 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border/30 p-4">
                {selectedType === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sampleData}>
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {sampleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {selectedType !== 'bar' && (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} chart preview
                  </div>
                )}
              </div>

              {/* Sample data indicator */}
              <div className="text-center text-xs text-muted-foreground">
                Pre-loaded: Monthly Sales Data • <span className="text-primary">Fully interactive</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
