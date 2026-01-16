import { memo, useState, useCallback } from 'react';
import { ChartData } from '@/types/chart';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trash2, Wand2, TrendingUp, AlertTriangle, 
  ChevronDown, Eraser, Scale, Filter, Copy,
  Search, Replace, SplitSquareHorizontal, Merge,
  ArrowUpDown, Calculator, FileCheck, Download,
  Upload, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface DataCleaningPanelProps {
  data: ChartData;
  onUpdate: (data: ChartData) => void;
}

function DataCleaningPanel({ data, onUpdate }: DataCleaningPanelProps) {
  const { t } = useTranslation();
  const [outlierThreshold, setOutlierThreshold] = useState(2);
  const [openSections, setOpenSections] = useState({ 
    clean: true, 
    transform: false, 
    outliers: false,
    findReplace: false,
    duplicates: false,
    sort: false
  });

  // Find & Replace state
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

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
      toast.info(t('dataCleaning.messages.noEmptyRows'));
      return;
    }

    const removedCount = data.labels.length - validIndices.length;
    const newData: ChartData = {
      labels: validIndices.map(i => data.labels[i]),
      datasets: data.datasets.map(ds => ({
        ...ds,
        values: validIndices.map(i => ds.values[i]),
      })),
    };

    onUpdate(newData);
    toast.success(t('dataCleaning.messages.removedRows', { count: removedCount }));
  }, [data, onUpdate, t]);

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
      toast.info(t('dataCleaning.messages.noOutliers'));
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
    toast.success(t('dataCleaning.messages.removedOutliers', { count: removedCount }));
  }, [data, onUpdate, outlierThreshold, getStats, t]);

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
    toast.success(t('dataCleaning.messages.dataNormalized'));
  }, [data, onUpdate, t]);

  // Scale data (multiply by factor)
  const scaleData = useCallback((factor: number) => {
    const newDatasets = data.datasets.map(ds => ({
      ...ds,
      values: ds.values.map(v => Math.round(v * factor * 100) / 100),
    }));

    onUpdate({ ...data, datasets: newDatasets });
    toast.success(t('dataCleaning.messages.dataScaled', { factor }));
  }, [data, onUpdate, t]);

  // Round values
  const roundValues = useCallback((decimals: number = 0) => {
    const factor = Math.pow(10, decimals);
    const newDatasets = data.datasets.map(ds => ({
      ...ds,
      values: ds.values.map(v => Math.round(v * factor) / factor),
    }));

    onUpdate({ ...data, datasets: newDatasets });
    toast.success(t('dataCleaning.messages.valuesRounded', { decimals }));
  }, [data, onUpdate, t]);

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
      toast.info(t('dataCleaning.messages.noMissingValues'));
      return;
    }

    onUpdate({ ...data, datasets: newDatasets });
    toast.success(t('dataCleaning.messages.filledValues', { count: filledCount }));
  }, [data, onUpdate, t]);

  // Find and replace in labels
  const findAndReplace = useCallback(() => {
    if (!findText) {
      toast.error(t('dataCleaning.messages.noMatchesFound'));
      return;
    }

    let replacedCount = 0;
    let pattern: RegExp;

    try {
      if (useRegex) {
        pattern = new RegExp(findText, caseSensitive ? 'g' : 'gi');
      } else {
        const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        pattern = new RegExp(escaped, caseSensitive ? 'g' : 'gi');
      }
    } catch (e) {
      toast.error('Invalid regex pattern');
      return;
    }

    const newLabels = data.labels.map(label => {
      if (pattern.test(label)) {
        replacedCount++;
        return label.replace(pattern, replaceText);
      }
      return label;
    });

    if (replacedCount === 0) {
      toast.info(t('dataCleaning.messages.noMatchesFound'));
      return;
    }

    onUpdate({ ...data, labels: newLabels });
    toast.success(t('dataCleaning.messages.replacedValues', { count: replacedCount }));
  }, [data, onUpdate, findText, replaceText, useRegex, caseSensitive, t]);

  // Find duplicates
  const findDuplicates = useCallback(() => {
    const labelCounts: Record<string, number> = {};
    data.labels.forEach(label => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });

    const duplicateCount = Object.values(labelCounts).filter(count => count > 1).reduce((a, b) => a + b - 1, 0);
    
    if (duplicateCount === 0) {
      toast.info(t('dataCleaning.messages.noDuplicates'));
    } else {
      toast.warning(t('dataCleaning.messages.duplicatesFound', { count: duplicateCount }));
    }
  }, [data, t]);

  // Remove duplicates (keep first occurrence)
  const removeDuplicates = useCallback(() => {
    const seen = new Set<string>();
    const validIndices: number[] = [];

    data.labels.forEach((label, idx) => {
      if (!seen.has(label)) {
        seen.add(label);
        validIndices.push(idx);
      }
    });

    const removedCount = data.labels.length - validIndices.length;

    if (removedCount === 0) {
      toast.info(t('dataCleaning.messages.noDuplicates'));
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
    toast.success(t('dataCleaning.messages.removedDuplicates', { count: removedCount }));
  }, [data, onUpdate, t]);

  // Sort data
  const sortData = useCallback((ascending: boolean = true) => {
    const indices = data.labels.map((_, idx) => idx);
    indices.sort((a, b) => {
      const labelA = data.labels[a];
      const labelB = data.labels[b];
      const comparison = labelA.localeCompare(labelB, undefined, { numeric: true });
      return ascending ? comparison : -comparison;
    });

    const newData: ChartData = {
      labels: indices.map(i => data.labels[i]),
      datasets: data.datasets.map(ds => ({
        ...ds,
        values: indices.map(i => ds.values[i]),
      })),
    };

    onUpdate(newData);
    toast.success(t('dataCleaning.messages.dataSorted'));
  }, [data, onUpdate, t]);

  // Sort by value
  const sortByValue = useCallback((datasetIndex: number = 0, ascending: boolean = true) => {
    if (data.datasets.length === 0) return;

    const ds = data.datasets[Math.min(datasetIndex, data.datasets.length - 1)];
    const indices = data.labels.map((_, idx) => idx);
    indices.sort((a, b) => {
      const comparison = ds.values[a] - ds.values[b];
      return ascending ? comparison : -comparison;
    });

    const newData: ChartData = {
      labels: indices.map(i => data.labels[i]),
      datasets: data.datasets.map(dataset => ({
        ...dataset,
        values: indices.map(i => dataset.values[i]),
      })),
    };

    onUpdate(newData);
    toast.success(t('dataCleaning.messages.dataSorted'));
  }, [data, onUpdate, t]);

  // Count potential outliers
  const outlierCount = data.datasets.reduce((count, ds) => {
    const stats = getStats(ds.values);
    return count + ds.values.filter(v => Math.abs((v - stats.mean) / (stats.std || 1)) > outlierThreshold).length;
  }, 0);

  // Count empty values
  const emptyCount = data.labels.filter((_, idx) => 
    data.datasets.every(ds => ds.values[idx] === 0 || ds.values[idx] === null || ds.values[idx] === undefined)
  ).length;

  // Count duplicates
  const labelCounts: Record<string, number> = {};
  data.labels.forEach(label => {
    labelCounts[label] = (labelCounts[label] || 0) + 1;
  });
  const duplicateCount = Object.values(labelCounts).filter(count => count > 1).reduce((a, b) => a + b - 1, 0);

  return (
    <div className="space-y-2" data-tour="data-cleaning">
      {/* Clean Data Section */}
      <Collapsible open={openSections.clean} onOpenChange={() => toggleSection('clean')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Eraser className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{t('dataCleaning.cleanData')}</span>
          </div>
          <div className="flex items-center gap-2">
            {emptyCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {t('dataCleaning.empty', { count: emptyCount })}
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
            {t('dataCleaning.removeEmptyRows')}
            {emptyCount > 0 && <Badge variant="destructive" className="ml-auto text-[10px] h-4">{emptyCount}</Badge>}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fillMissingWithAverage}
            className="w-full justify-start gap-2 h-8 text-xs"
          >
            <Wand2 className="h-3.5 w-3.5" />
            {t('dataCleaning.fillMissingAverage')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => roundValues(0)}
            className="w-full justify-start gap-2 h-8 text-xs"
          >
            <Filter className="h-3.5 w-3.5" />
            {t('dataCleaning.roundToIntegers')}
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Transform Data Section */}
      <Collapsible open={openSections.transform} onOpenChange={() => toggleSection('transform')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{t('dataCleaning.transform')}</span>
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
            {t('dataCleaning.normalize')}
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

      {/* Find & Replace Section */}
      <Collapsible open={openSections.findReplace} onOpenChange={() => toggleSection('findReplace')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{t('dataCleaning.findReplace')}</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.findReplace ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <Input
            placeholder={t('dataCleaning.find')}
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            className="h-8 text-xs"
          />
          <Input
            placeholder={t('dataCleaning.replace')}
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className="h-8 text-xs"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Switch
                id="useRegex"
                checked={useRegex}
                onCheckedChange={setUseRegex}
                className="scale-75"
              />
              <Label htmlFor="useRegex" className="text-[10px] text-muted-foreground">
                {t('dataCleaning.useRegex')}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="caseSensitive"
                checked={caseSensitive}
                onCheckedChange={setCaseSensitive}
                className="scale-75"
              />
              <Label htmlFor="caseSensitive" className="text-[10px] text-muted-foreground">
                {t('dataCleaning.caseSensitive')}
              </Label>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={findAndReplace}
            className="w-full justify-start gap-2 h-8 text-xs"
          >
            <Replace className="h-3.5 w-3.5" />
            {t('dataCleaning.replaceAll')}
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Duplicates Section */}
      <Collapsible open={openSections.duplicates} onOpenChange={() => toggleSection('duplicates')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Copy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{t('dataCleaning.duplicateDetection')}</span>
          </div>
          <div className="flex items-center gap-2">
            {duplicateCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5 bg-amber-500/20 text-amber-600">
                {t('dataCleaning.found', { count: duplicateCount })}
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.duplicates ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={findDuplicates}
            className="w-full justify-start gap-2 h-8 text-xs"
          >
            <Search className="h-3.5 w-3.5" />
            {t('dataCleaning.findDuplicates')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={removeDuplicates}
            className="w-full justify-start gap-2 h-8 text-xs"
            disabled={duplicateCount === 0}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('dataCleaning.removeDuplicates')}
            {duplicateCount > 0 && <Badge variant="destructive" className="ml-auto text-[10px] h-4">{duplicateCount}</Badge>}
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Sort Section */}
      <Collapsible open={openSections.sort} onOpenChange={() => toggleSection('sort')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{t('dataCleaning.sortData')}</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.sort ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <div className="flex gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => sortData(true)}
              className="flex-1 h-8 text-xs"
            >
              A→Z
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => sortData(false)}
              className="flex-1 h-8 text-xs"
            >
              Z→A
            </Button>
          </div>
          <div className="flex gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => sortByValue(0, true)}
              className="flex-1 h-8 text-xs"
            >
              1→9
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => sortByValue(0, false)}
              className="flex-1 h-8 text-xs"
            >
              9→1
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Outlier Detection Section */}
      <Collapsible open={openSections.outliers} onOpenChange={() => toggleSection('outliers')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{t('dataCleaning.outliers')}</span>
          </div>
          <div className="flex items-center gap-2">
            {outlierCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5 bg-amber-500/20 text-amber-600">
                {t('dataCleaning.found', { count: outlierCount })}
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.outliers ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">{t('dataCleaning.zScoreThreshold')}</Label>
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
            {t('dataCleaning.removeOutliers')}
            {outlierCount > 0 && <Badge variant="destructive" className="ml-auto text-[10px] h-4">{outlierCount}</Badge>}
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default memo(DataCleaningPanel);
