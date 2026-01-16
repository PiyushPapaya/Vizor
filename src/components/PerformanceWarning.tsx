import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Zap, Filter, BarChart3, Layers, ArrowRight } from 'lucide-react';
import { ChartData } from '@/types/chart';

interface PerformanceWarningProps {
  data: ChartData;
  onOptimize?: (optimizedData: ChartData) => void;
  onContinue?: () => void;
  threshold?: number;
}

interface PerformanceMetrics {
  rowCount: number;
  datasetCount: number;
  totalDataPoints: number;
  estimatedRenderTime: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

function calculateMetrics(data: ChartData): PerformanceMetrics {
  const rowCount = data.labels.length;
  const datasetCount = data.datasets.length;
  const totalDataPoints = rowCount * datasetCount;
  
  // Estimate render time based on data points (rough approximation)
  const estimatedRenderTime = Math.min(5000, totalDataPoints * 0.5);
  
  let severity: PerformanceMetrics['severity'] = 'low';
  if (totalDataPoints > 10000) severity = 'critical';
  else if (totalDataPoints > 5000) severity = 'high';
  else if (totalDataPoints > 1000) severity = 'medium';
  
  return {
    rowCount,
    datasetCount,
    totalDataPoints,
    estimatedRenderTime,
    severity,
  };
}

const severityColors = {
  low: 'bg-green-500/10 text-green-500 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  critical: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function PerformanceWarning({ 
  data, 
  onOptimize, 
  onContinue,
  threshold = 1000 
}: PerformanceWarningProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const newMetrics = calculateMetrics(data);
    setMetrics(newMetrics);
    
    // Show warning if above threshold
    if (data.labels.length > threshold && newMetrics.severity !== 'low') {
      setOpen(true);
    }
  }, [data, threshold]);

  const handleOptimize = useCallback(() => {
    if (!onOptimize) return;
    
    // Sample data to reduce size
    const targetRows = Math.min(500, Math.floor(data.labels.length / 2));
    const step = Math.ceil(data.labels.length / targetRows);
    
    const sampledIndices = Array.from(
      { length: targetRows }, 
      (_, i) => Math.min(i * step, data.labels.length - 1)
    );
    
    const optimizedData: ChartData = {
      labels: sampledIndices.map(i => data.labels[i]),
      datasets: data.datasets.map(ds => ({
        ...ds,
        values: sampledIndices.map(i => ds.values[i]),
      })),
    };
    
    onOptimize(optimizedData);
    setOpen(false);
  }, [data, onOptimize]);

  const handleContinue = useCallback(() => {
    onContinue?.();
    setOpen(false);
  }, [onContinue]);

  if (!metrics || metrics.severity === 'low') return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-500">
            <AlertTriangle className="h-5 w-5" />
            {t('performance.warning')}
          </DialogTitle>
          <DialogDescription>
            {t('performance.largeDataset')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Metrics Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Layers className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Rows</p>
              <p className="text-lg font-bold">{metrics.rowCount.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <BarChart3 className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Datasets</p>
              <p className="text-lg font-bold">{metrics.datasetCount}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Zap className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Points</p>
              <p className="text-lg font-bold">{metrics.totalDataPoints.toLocaleString()}</p>
            </div>
          </div>

          {/* Severity Indicator */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <span className="text-sm text-muted-foreground">Impact Level</span>
            <Badge className={severityColors[metrics.severity]}>
              {metrics.severity.toUpperCase()}
            </Badge>
          </div>

          {/* Suggestions */}
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertTitle>{t('performance.suggestions.title')}</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  {t('performance.suggestions.aggregate')}
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  {t('performance.suggestions.sample')}
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  {t('performance.suggestions.filter')}
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  {t('performance.suggestions.simplify')}
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleContinue}>
            {t('performance.continueAnyway')}
          </Button>
          <Button onClick={handleOptimize} className="gap-2">
            <Filter className="h-4 w-4" />
            {t('performance.optimize')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook to check performance before operations
export function usePerformanceCheck(data: ChartData, threshold = 1000) {
  const metrics = calculateMetrics(data);
  
  return {
    isLargeDataset: data.labels.length > threshold,
    metrics,
    shouldWarn: metrics.severity !== 'low',
  };
}

export default PerformanceWarning;
