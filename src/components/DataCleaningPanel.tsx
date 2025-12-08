import { memo, useState, useCallback } from 'react';
import { ChartData, Dataset } from '@/types/chart';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Trash2, Wand2, TrendingUp, AlertTriangle, 
  ChevronDown, Eraser, Scale, Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface DataCleaningPanelProps {
  data: ChartData;
  onUpdate: (data: ChartData) => void;
}

function DataCleaningPanel({ data, onUpdate }: DataCleaningPanelProps) {
  const [outlierThreshold, setOutlierThreshold] = useState(2);
  const [openSections, setOpenSections] = useState({ clean: true, transform: false, outliers: false });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate statistics for outlier detection
  const getStats = useCallback((values: number[]) => {
    const n = values.length;
    if (n === 0) return { mean: 0, std: 0, min: 0, max: 0 };
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const std = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n);
    return { mean, std, min: Math.min(...values), max: Math.max(...values) };
  }, []);

  // Remove empty/zero values
  const removeEmptyRows = useCallback(() => {
    const validIndices = data.labels.map((_, idx) => {
      const hasValue = data.datasets.some(ds => ds.values[idx] !== 0 && ds.values[idx] !== null && ds.values[idx] !== undefined);
      return hasValue ? idx : -1;
    }).filter(idx => idx !== -1);

    if (validIndices.length === data.labels.length) {
      toast.info('No empty rows found');
      return;
    }

    const newData: ChartData = {
      labels: validIndices.map(i => data.labels[i]),
      datasets: data.datasets.map(ds => ({
        ...ds,
        values: validIndices.map(i => ds.values[i]),
      })),
    };

    onUpdate(newData);
    toast.success(`Removed ${data.labels.length - validIndices.length} empty rows`);
  }, [data, onUpdate]);

  // Remove outliers based on z-score
  const removeOutliers = useCallback(() => {
    let removedCount = 0;
    const validIndices: number[] = [];

    data.labels.forEach((_, idx) => {
      let isOutlier = false;
      for (const ds of data.datasets) {
        const stats = getStats(ds.values);
        const zScore = Math.abs((ds.values[idx] - stats.mean) / (stats.std || 1));
        if (zScore > outlierThreshold) {
          isOutlier = true;
          break;
        }
      }
      if (!isOutlier) {
        validIndices.push(idx);
      } else {
        removedCount++;
      }
    });

    if (removedCount === 0) {
      toast.info('No outliers found');
      return;
    }

    const newData: ChartData = {
      labels: validIndices.map(i => data.labels[i]),
      datasets: data.datasets.map(ds => ({
        ...ds,
        values: validIndices.map(i => ds.values[i]),
      })),
    };

    onUpdate(newData);
    toast.success(`Removed ${removedCount} outliers`);
  }, [data, onUpdate, outlierThreshold, getStats]);

  // Normalize data (0-100 scale)
  const normalizeData = useCallback(() => {
    const newDatasets = data.datasets.map(ds => {
      const min = Math.min(...ds.values);
      const max = Math.max(...ds.values);
      const range = max - min || 1;
      return {
        ...ds,
        values: ds.values.map(v => Math.round(((v - min) / range) * 100)),
      };
    });

    onUpdate({ ...data, datasets: newDatasets });
    toast.success('Data normalized (0-100)');
  }, [data, onUpdate]);

  // Scale data (multiply by factor)
  const scaleData = useCallback((factor: number) => {
    const newDatasets = data.datasets.map(ds => ({
      ...ds,
      values: ds.values.map(v => Math.round(v * factor * 100) / 100),
    }));

    onUpdate({ ...data, datasets: newDatasets });
    toast.success(`Data scaled by ${factor}x`);
  }, [data, onUpdate]);

  // Round values
  const roundValues = useCallback((decimals: number = 0) => {
    const factor = Math.pow(10, decimals);
    const newDatasets = data.datasets.map(ds => ({
      ...ds,
      values: ds.values.map(v => Math.round(v * factor) / factor),
    }));

    onUpdate({ ...data, datasets: newDatasets });
    toast.success(`Values rounded to ${decimals} decimals`);
  }, [data, onUpdate]);

  // Fill missing with average
  const fillMissingWithAverage = useCallback(() => {
    let filledCount = 0;
    const newDatasets = data.datasets.map(ds => {
      const validValues = ds.values.filter(v => v !== 0 && v !== null && v !== undefined);
      const avg = validValues.length > 0 ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
      
      return {
        ...ds,
        values: ds.values.map(v => {
          if (v === 0 || v === null || v === undefined) {
            filledCount++;
            return Math.round(avg * 100) / 100;
          }
          return v;
        }),
      };
    });

    if (filledCount === 0) {
      toast.info('No missing values found');
      return;
    }

    onUpdate({ ...data, datasets: newDatasets });
    toast.success(`Filled ${filledCount} missing values with average`);
  }, [data, onUpdate]);

  // Count potential outliers
  const outlierCount = data.datasets.reduce((count, ds) => {
    const stats = getStats(ds.values);
    return count + ds.values.filter(v => Math.abs((v - stats.mean) / (stats.std || 1)) > outlierThreshold).length;
  }, 0);

  // Count empty values
  const emptyCount = data.labels.filter((_, idx) => 
    data.datasets.every(ds => ds.values[idx] === 0 || ds.values[idx] === null || ds.values[idx] === undefined)
  ).length;

  return (
    <div className="space-y-2">
      {/* Clean Data Section */}
      <Collapsible open={openSections.clean} onOpenChange={() => toggleSection('clean')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Eraser className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Clean Data</span>
          </div>
          <div className="flex items-center gap-2">
            {emptyCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {emptyCount} empty
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.clean ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={removeEmptyRows}
            className="w-full justify-start gap-2 h-8 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove Empty Rows
            {emptyCount > 0 && <Badge variant="destructive" className="ml-auto text-[10px] h-4">{emptyCount}</Badge>}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fillMissingWithAverage}
            className="w-full justify-start gap-2 h-8 text-xs"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Fill Missing with Average
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => roundValues(0)}
            className="w-full justify-start gap-2 h-8 text-xs"
          >
            <Filter className="h-3.5 w-3.5" />
            Round to Integers
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Transform Data Section */}
      <Collapsible open={openSections.transform} onOpenChange={() => toggleSection('transform')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Transform</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.transform ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={normalizeData}
            className="w-full justify-start gap-2 h-8 text-xs"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Normalize (0-100)
          </Button>
          <div className="flex gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scaleData(0.5)}
              className="flex-1 h-8 text-xs"
            >
              ×0.5
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scaleData(2)}
              className="flex-1 h-8 text-xs"
            >
              ×2
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scaleData(10)}
              className="flex-1 h-8 text-xs"
            >
              ×10
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Outlier Detection Section */}
      <Collapsible open={openSections.outliers} onOpenChange={() => toggleSection('outliers')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Outliers</span>
          </div>
          <div className="flex items-center gap-2">
            {outlierCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5 bg-amber-500/20 text-amber-600">
                {outlierCount} found
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.outliers ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Z-Score Threshold</Label>
              <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{outlierThreshold}</span>
            </div>
            <Slider
              value={[outlierThreshold]}
              onValueChange={([v]) => setOutlierThreshold(v)}
              min={1}
              max={4}
              step={0.5}
              className="py-2"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={removeOutliers}
            className="w-full justify-start gap-2 h-8 text-xs"
            disabled={outlierCount === 0}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove Outliers
            {outlierCount > 0 && <Badge variant="destructive" className="ml-auto text-[10px] h-4">{outlierCount}</Badge>}
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default memo(DataCleaningPanel);
