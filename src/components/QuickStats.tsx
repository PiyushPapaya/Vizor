import { ChartData } from '@/types/chart';
import { TrendingUp, TrendingDown, Hash, Activity } from 'lucide-react';
import { memo, useMemo } from 'react';

interface QuickStatsProps {
  data: ChartData;
}

function QuickStats({ data }: QuickStatsProps) {
  const stats = useMemo(() => {
    if (data.datasets.length === 0 || data.labels.length === 0) return null;

    const visibleDatasets = data.datasets.filter(ds => ds.visible);
    const allValues = visibleDatasets.flatMap(ds => ds.values);
    
    if (allValues.length === 0) return null;

    const total = allValues.reduce((sum, v) => sum + v, 0);
    const average = total / allValues.length;
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    
    const firstHalf = allValues.slice(0, Math.floor(allValues.length / 2));
    const secondHalf = allValues.slice(Math.floor(allValues.length / 2));
    const firstAvg = firstHalf.length ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
    const secondAvg = secondHalf.length ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
    const trendPercent = firstAvg ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

    return { total, average, max, min, trendPercent };
  }, [data]);

  if (!stats) return null;

  const formatNum = (n: number) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n.toFixed(0);

  return (
    <div className="grid grid-cols-4 gap-1.5">
      <div className="p-2 rounded-md bg-muted/40 text-center">
        <Hash className="h-3 w-3 mx-auto mb-0.5 text-primary" />
        <p className="text-[10px] text-muted-foreground">Total</p>
        <p className="text-xs font-semibold font-mono">{formatNum(stats.total)}</p>
      </div>
      <div className="p-2 rounded-md bg-muted/40 text-center">
        <Activity className="h-3 w-3 mx-auto mb-0.5 text-blue-500" />
        <p className="text-[10px] text-muted-foreground">Avg</p>
        <p className="text-xs font-semibold font-mono">{formatNum(stats.average)}</p>
      </div>
      <div className="p-2 rounded-md bg-muted/40 text-center">
        <TrendingUp className="h-3 w-3 mx-auto mb-0.5 text-emerald-500" />
        <p className="text-[10px] text-muted-foreground">Max</p>
        <p className="text-xs font-semibold font-mono">{formatNum(stats.max)}</p>
      </div>
      <div className="p-2 rounded-md bg-muted/40 text-center">
        {stats.trendPercent >= 0 ? (
          <TrendingUp className="h-3 w-3 mx-auto mb-0.5 text-emerald-500" />
        ) : (
          <TrendingDown className="h-3 w-3 mx-auto mb-0.5 text-red-500" />
        )}
        <p className="text-[10px] text-muted-foreground">Trend</p>
        <p className={`text-xs font-semibold font-mono ${stats.trendPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {stats.trendPercent >= 0 ? '+' : ''}{stats.trendPercent.toFixed(0)}%
        </p>
      </div>
    </div>
  );
}

export default memo(QuickStats);
