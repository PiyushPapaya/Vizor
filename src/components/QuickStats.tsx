import { ChartData } from '@/types/chart';
import { TrendingUp, TrendingDown, Hash, Activity, AlertTriangle, CheckCircle2, Database, BarChart3 } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface QuickStatsProps {
  data: ChartData;
}

// Mini sparkline component
function Sparkline({ values, className }: { values: number[]; className?: string }) {
  if (values.length < 2) return null;
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  
  const width = 60;
  const height = 20;
  const padding = 2;
  
  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((v - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const trend = values[values.length - 1] > values[0];
  
  return (
    <svg width={width} height={height} className={className}>
      <polyline
        points={points}
        fill="none"
        stroke={trend ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuickStats({ data }: QuickStatsProps) {
  const { t } = useTranslation();
  
  const stats = useMemo(() => {
    if (data.datasets.length === 0 || data.labels.length === 0) return null;

    const visibleDatasets = data.datasets.filter(ds => ds.visible);
    const allValues = visibleDatasets.flatMap(ds => ds.values);
    
    if (allValues.length === 0) return null;

    const total = allValues.reduce((sum, v) => sum + v, 0);
    const average = total / allValues.length;
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    
    // Get values for sparkline (first visible dataset)
    const sparklineValues = visibleDatasets[0]?.values || [];
    
    const firstHalf = allValues.slice(0, Math.floor(allValues.length / 2));
    const secondHalf = allValues.slice(Math.floor(allValues.length / 2));
    const firstAvg = firstHalf.length ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
    const secondAvg = secondHalf.length ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
    const trendPercent = firstAvg ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

    // Data health checks
    const issues: string[] = [];
    const warnings: string[] = [];
    
    // Check for zeros
    const zeroCount = allValues.filter(v => v === 0).length;
    if (zeroCount > 0) {
      warnings.push(t(zeroCount > 1 ? 'quickStats.issues.zeroValuesPlural' : 'quickStats.issues.zeroValues', { count: zeroCount }));
    }
    
    // Check for negative values
    const negativeCount = allValues.filter(v => v < 0).length;
    if (negativeCount > 0) {
      warnings.push(t(negativeCount > 1 ? 'quickStats.issues.negativeValuesPlural' : 'quickStats.issues.negativeValues', { count: negativeCount }));
    }
    
    // Check for outliers (values > 3 std deviations from mean)
    const stdDev = Math.sqrt(allValues.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / allValues.length);
    const outlierCount = allValues.filter(v => Math.abs(v - average) > 3 * stdDev).length;
    if (outlierCount > 0) {
      warnings.push(t(outlierCount > 1 ? 'quickStats.issues.outliersPlural' : 'quickStats.issues.outliers', { count: outlierCount }));
    }
    
    // Check for empty labels
    const emptyLabels = data.labels.filter(l => !l || l.trim() === '').length;
    if (emptyLabels > 0) {
      issues.push(t(emptyLabels > 1 ? 'quickStats.issues.emptyLabelsPlural' : 'quickStats.issues.emptyLabels', { count: emptyLabels }));
    }

    const healthScore = Math.max(0, 100 - (issues.length * 20) - (warnings.length * 5));

    return { 
      total, average, max, min, trendPercent,
      rowCount: data.labels.length,
      datasetCount: data.datasets.length,
      healthScore, issues, warnings,
      sparklineValues
    };
  }, [data, t]);

  if (!stats) return null;

  const formatNum = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(1)}k` : n.toFixed(0);

  return (
    <div className="space-y-2" data-tour="quick-stats">
      {/* Data Summary Header */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5">
          <Database className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium">
            {stats.rowCount} {t('quickStats.rows')} × {stats.datasetCount} {t('quickStats.datasets')}
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <Badge 
              variant={stats.healthScore >= 80 ? 'default' : stats.healthScore >= 50 ? 'secondary' : 'destructive'}
              className="h-5 text-[10px] gap-1"
            >
              {stats.healthScore >= 80 ? (
                <CheckCircle2 className="h-2.5 w-2.5" />
              ) : (
                <AlertTriangle className="h-2.5 w-2.5" />
              )}
              {stats.healthScore}% {t('quickStats.healthy')}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            {stats.issues.length === 0 && stats.warnings.length === 0 ? (
              <p className="text-xs">{t('quickStats.dataLooksGood')}</p>
            ) : (
              <div className="space-y-1">
                {stats.issues.map((issue, i) => (
                  <p key={i} className="text-xs text-destructive">• {issue}</p>
                ))}
                {stats.warnings.map((warning, i) => (
                  <p key={i} className="text-xs text-yellow-500">• {warning}</p>
                ))}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Sparkline */}
      {stats.sparklineValues.length > 2 && (
        <div className="flex items-center justify-center gap-2 py-1">
          <BarChart3 className="h-3 w-3 text-muted-foreground" />
          <Sparkline values={stats.sparklineValues} />
          <span className={`text-[10px] font-medium ${stats.trendPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {stats.trendPercent >= 0 ? '↑' : '↓'} {Math.abs(stats.trendPercent).toFixed(0)}%
          </span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        <div className="group relative overflow-hidden p-2 rounded-lg bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm text-center border border-border/30 hover:border-border/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Hash className="relative h-3 w-3 mx-auto mb-0.5 text-primary transition-transform duration-300 group-hover:scale-110" />
          <p className="relative text-[10px] text-muted-foreground font-medium">{t('quickStats.total')}</p>
          <p className="relative text-xs font-semibold font-mono">{formatNum(stats.total)}</p>
        </div>
        <div className="group relative overflow-hidden p-2 rounded-lg bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm text-center border border-border/30 hover:border-border/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Activity className="relative h-3 w-3 mx-auto mb-0.5 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
          <p className="relative text-[10px] text-muted-foreground font-medium">{t('quickStats.average')}</p>
          <p className="relative text-xs font-semibold font-mono">{formatNum(stats.average)}</p>
        </div>
        <div className="group relative overflow-hidden p-2 rounded-lg bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm text-center border border-border/30 hover:border-border/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <TrendingUp className="relative h-3 w-3 mx-auto mb-0.5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
          <p className="relative text-[10px] text-muted-foreground font-medium">{t('quickStats.max')}</p>
          <p className="relative text-xs font-semibold font-mono">{formatNum(stats.max)}</p>
        </div>
        <div className="group relative overflow-hidden p-2 rounded-lg bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm text-center border border-border/30 hover:border-border/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
          <div className={`absolute inset-0 bg-gradient-to-br ${stats.trendPercent >= 0 ? 'from-emerald-500/5' : 'from-red-500/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          {stats.trendPercent >= 0 ? (
            <TrendingUp className="relative h-3 w-3 mx-auto mb-0.5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <TrendingDown className="relative h-3 w-3 mx-auto mb-0.5 text-red-500 transition-transform duration-300 group-hover:scale-110" />
          )}
          <p className="relative text-[10px] text-muted-foreground font-medium">{t('quickStats.trend')}</p>
          <p className={`relative text-xs font-semibold font-mono ${stats.trendPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {stats.trendPercent >= 0 ? '+' : ''}{stats.trendPercent.toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(QuickStats);
