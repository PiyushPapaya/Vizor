import { useEffect, useState } from 'react';

export function StatsCounter() {
  const [charts, setCharts] = useState(0);
  const [users, setUsers] = useState(0);
  const [exports, setExports] = useState(0);

  useEffect(() => {
    const animateValue = (setter: (value: number) => void, end: number, duration: number) => {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    animateValue(setCharts, 50000, 2000);
    animateValue(setUsers, 10000, 2000);
    animateValue(setExports, 10000, 2000);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto mt-12 md:mt-16 lg:mt-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
      <div className="group text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/30 dark:border-primary/20 hover:border-primary/50 dark:hover:border-primary/40 hover:shadow-[var(--shadow-xl)] hover:shadow-primary/30 dark:hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2 md:mb-3 group-hover:scale-110 transition-transform">{charts.toLocaleString()}+</div>
        <div className="text-xs sm:text-sm font-medium text-muted-foreground">Charts Created</div>
      </div>
      <div className="group text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border-2 border-accent/30 dark:border-accent/20 hover:border-accent/50 dark:hover:border-accent/40 hover:shadow-[var(--shadow-xl)] hover:shadow-accent/30 dark:hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary mb-2 md:mb-3 group-hover:scale-110 transition-transform">{users.toLocaleString()}+</div>
        <div className="text-xs sm:text-sm font-medium text-muted-foreground">Happy Users 😊</div>
      </div>
      <div className="group text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-2 border-purple-500/30 dark:border-purple-500/20 hover:border-purple-500/50 dark:hover:border-purple-500/40 hover:shadow-[var(--shadow-xl)] hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-accent mb-2 md:mb-3 group-hover:scale-110 transition-transform">{exports.toLocaleString()}+</div>
        <div className="text-xs sm:text-sm font-medium text-muted-foreground">Exports</div>
      </div>
    </div>
  );
}
