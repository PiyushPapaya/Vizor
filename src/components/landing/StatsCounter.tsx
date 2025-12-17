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
    animateValue(setExports, 100000, 2000);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
      <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
        <div className="text-4xl font-bold text-primary mb-2">{charts.toLocaleString()}+</div>
        <div className="text-sm text-muted-foreground">Charts Created</div>
      </div>
      <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
        <div className="text-4xl font-bold text-primary mb-2">{users.toLocaleString()}+</div>
        <div className="text-sm text-muted-foreground">Happy Users 😊</div>
      </div>
      <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
        <div className="text-4xl font-bold text-primary mb-2">{exports.toLocaleString()}+</div>
        <div className="text-sm text-muted-foreground">Exports</div>
      </div>
    </div>
  );
}
