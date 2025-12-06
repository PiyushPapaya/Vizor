import { ChartData } from '@/types/chart';
import { TrendingUp, TrendingDown, BarChart2, Hash } from 'lucide-react';

interface QuickStatsProps {
  data: ChartData;
}

export default function QuickStats({ data }: QuickStatsProps) {
  if (data.datasets.length === 0 || data.labels.length === 0) {
    return null;
  }

  const visibleDatasets = data.datasets.filter(ds => ds.visible);
  const allValues = visibleDatasets.flatMap(ds => ds.values);
  
  const total = allValues.reduce((sum, v) => sum + v, 0);
  const average = total / allValues.length;
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  
  // Calculate trend (compare first half vs second half)
  const firstHalf = allValues.slice(0, Math.floor(allValues.length / 2));
  const secondHalf = allValues.slice(Math.floor(allValues.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const trendPercent = ((secondAvg - firstAvg) / firstAvg) * 100;
  const isPositiveTrend = trendPercent > 0;

  const stats = [
    { 
      label: 'Total', 
      value: total.toLocaleString(undefined, { maximumFractionDigits: 0 }), 
      icon: Hash,
      color: 'text-primary'
    },
    { 
      label: 'Average', 
      value: average.toLocaleString(undefined, { maximumFractionDigits: 1 }), 
      icon: BarChart2,
      color: 'text-blue-500'
    },
    { 
      label: 'Max', 
      value: max.toLocaleString(), 
      icon: TrendingUp,
      color: 'text-emerald-500'
    },
    { 
      label: 'Min', 
      value: min.toLocaleString(), 
      icon: TrendingDown,
      color: 'text-amber-500'
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Quick Stats</h4>
        <div className={`flex items-center gap-1 text-xs ${isPositiveTrend ? 'text-emerald-500' : 'text-red-500'}`}>
          {isPositiveTrend ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trendPercent).toFixed(1)}% trend
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div 
            key={stat.label}
            className="p-2.5 rounded-lg bg-background/50 border border-border/50"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon className={`h-3 w-3 ${stat.color}`} />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <p className="text-sm font-semibold font-mono">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
