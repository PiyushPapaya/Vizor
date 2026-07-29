import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonGroupVariants, buttonItemVariants, chartTransitionVariants, hoverScale, tapScale } from '@/lib/animations';
import TrustBadges from './TrustBadges';

const sampleData = [
  { name: 'Jan', value: 4200 },
  { name: 'Feb', value: 3800 },
  { name: 'Mar', value: 5100 },
  { name: 'Apr', value: 4600 },
  { name: 'May', value: 6300 },
  { name: 'Jun', value: 5900 },
];

const pieData = [
  { name: 'Product A', value: 35 },
  { name: 'Product B', value: 25 },
  { name: 'Product C', value: 20 },
  { name: 'Product D', value: 15 },
  { name: 'Product E', value: 5 },
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
  const [selectedType, setSelectedType] = useState<'bar' | 'line' | 'area' | 'pie' | 'donut'>('bar');

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-24 lg:pt-32 pb-14 sm:pb-16 lg:pb-20 bg-background">
      <div className="absolute inset-0 gradient-mesh-vizor" aria-hidden="true" />

      <div
        className="absolute inset-0 opacity-[0.02] hero-grid hidden sm:block"
        style={{
          backgroundImage: 'linear-gradient(hsl(220,10%,25%) 1px, transparent 1px), linear-gradient(90deg, hsl(220,10%,25%) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay hero-noise hidden sm:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute top-[16%] -left-[10%] w-[48vw] h-[48vw] max-w-[500px] max-h-[500px] bg-primary rounded-full blur-3xl opacity-10 hero-orb pointer-events-none"
        style={{ animation: 'orb-float 16s ease-in-out infinite' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[12%] -right-[10%] w-[48vw] h-[48vw] max-w-[500px] max-h-[500px] bg-accent rounded-full blur-3xl opacity-10 hero-orb pointer-events-none"
        style={{ animation: 'orb-float 20s ease-in-out infinite reverse' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.08] text-foreground px-2 sm:px-0 tracking-tight">
              Transform data into{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                beautiful charts
              </span>
              <br />
              <span className="text-foreground/90">instantly</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 px-2 sm:px-0 leading-relaxed">
              No signup, no downloads, no complexity. Your data never leaves your browser.
            </p>

            <TrustBadges />

            <div className="space-y-3 px-4 sm:px-0">
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-center justify-center lg:justify-start">
                <Link to="/app" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] h-12 sm:h-14 px-7 sm:px-10 text-sm sm:text-base font-bold rounded-xl"
                  >
                    <span className="hidden sm:inline">Start Creating — Free Forever</span>
                    <span className="sm:hidden">Start Creating — Free</span>
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Button
                  onClick={scrollToDemo}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 sm:h-14 px-6 text-sm sm:text-base font-semibold rounded-xl border-border/60 bg-card/40 backdrop-blur-sm hover:bg-card/70 hover:border-primary/40"
                >
                  Try it live
                  <ChevronDown className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center lg:text-left">
                Create your first chart in 10 seconds — right in your browser.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.3)] p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 relative group hover:shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition-all duration-500 shine-on-hover">
              <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] sm:text-xs font-bold px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-lg shadow-primary/20 whitespace-nowrap z-10 tracking-wide uppercase">
                <span className="hidden sm:inline">Live Preview — 14 Chart Types</span>
                <span className="sm:hidden">Live Preview</span>
              </div>

              <motion.div
                className="flex items-center justify-center gap-2 flex-wrap"
                variants={buttonGroupVariants}
                initial="hidden"
                animate="visible"
              >
                {['bar', 'line', 'area', 'pie', 'donut'].map((type) => (
                  <motion.div key={type} variants={buttonItemVariants} whileHover={hoverScale} whileTap={tapScale}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedType(type as 'bar' | 'line' | 'area' | 'pie' | 'donut')}
                      className={`
                        text-xs capitalize rounded-lg transition-all duration-300
                        ${
                          selectedType === type
                            ? 'bg-gradient-to-r from-primary/20 to-accent/10 text-foreground font-semibold border border-primary/30'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        }
                      `}
                    >
                      {type}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              <div className="h-[240px] sm:h-64 md:h-72 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border/30 p-2 sm:p-3 md:p-4 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedType}
                    variants={chartTransitionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="h-full w-full"
                  >
                    {selectedType === 'bar' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sampleData}>
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '11px' }} />
                          <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '11px' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {sampleData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    {selectedType === 'line' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sampleData}>
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '11px' }} />
                          <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '11px' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={chartColors[0]}
                            strokeWidth={3}
                            dot={{ fill: chartColors[0], r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                    {selectedType === 'area' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sampleData}>
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '11px' }} />
                          <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '11px' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={chartColors[0]}
                            strokeWidth={2}
                            fill={chartColors[0]}
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                    {(selectedType === 'pie' || selectedType === 'donut') && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="45%"
                            labelLine={false}
                            outerRadius={selectedType === 'donut' ? 65 : 75}
                            innerRadius={selectedType === 'donut' ? 35 : 0}
                            fill="#8884d8"
                            dataKey="value"
                            style={{ fontSize: '10px' }}
                          >
                            {pieData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Legend 
                            wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }}
                            iconSize={8}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="text-center text-xs text-muted-foreground/70">
                Pre-loaded: Monthly sales data · <span className="text-primary font-medium">Fully interactive</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
