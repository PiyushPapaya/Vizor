import { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ChartData } from '@/types/chart';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Filter, ChevronDown, RotateCcw, SlidersHorizontal, Tag
} from 'lucide-react';

interface InteractiveFiltersProps {
  data: ChartData;
  onFilteredDataChange: (filteredData: ChartData) => void;
}

interface FilterState {
  valueRange: [number, number];
  selectedLabels: Set<string>;
}

function InteractiveFilters({ data, onFilteredDataChange }: InteractiveFiltersProps) {
  const [openSections, setOpenSections] = useState({ range: true, labels: false });
  const prevDataRef = useRef<ChartData | null>(null);

  // Calculate min/max across all datasets
  const { minValue, maxValue } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    data.datasets.forEach(ds => {
      ds.values.forEach(v => {
        if (v < min) min = v;
        if (v > max) max = v;
      });
    });
    return { 
      minValue: min === Infinity ? 0 : Math.floor(min), 
      maxValue: max === -Infinity ? 100 : Math.ceil(max) 
    };
  }, [data]);

  const [filters, setFilters] = useState<FilterState>({
    valueRange: [minValue, maxValue],
    selectedLabels: new Set(data.labels),
  });

  // Reset filters when data changes significantly (new import/dataset)
  useEffect(() => {
    const prevData = prevDataRef.current;
    
    // Check if this is a significant data change (not just a minor update)
    const isSignificantChange = 
      !prevData ||
      prevData.labels.length !== data.labels.length ||
      prevData.datasets.length !== data.datasets.length ||
      // Check if labels are completely different (new dataset)
      (data.labels.length > 0 && prevData.labels.length > 0 && 
       !data.labels.some(label => prevData.labels.includes(label)));
    
    if (isSignificantChange) {
      // Reset filters for new data
      setFilters({
        valueRange: [minValue, maxValue],
        selectedLabels: new Set(data.labels),
      });
    }
    
    prevDataRef.current = data;
  }, [data, minValue, maxValue]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Memoize filtered indices calculation (expensive for large datasets)
  const filteredIndices = useMemo(() => {
    return data.labels.map((label, idx) => {
      // Check if label is selected
      if (!filters.selectedLabels.has(label)) return -1;
      
      // Check if any dataset value is within range
      const hasValueInRange = data.datasets.some(ds => {
        const val = ds.values[idx];
        return val >= filters.valueRange[0] && val <= filters.valueRange[1];
      });
      
      return hasValueInRange ? idx : -1;
    }).filter(idx => idx !== -1);
  }, [data.labels, data.datasets, filters.valueRange, filters.selectedLabels]);

  // Memoize filtered data construction
  const filteredData = useMemo((): ChartData => ({
    labels: filteredIndices.map(i => data.labels[i]),
    datasets: data.datasets.map(ds => ({
      ...ds,
      values: filteredIndices.map(i => ds.values[i]),
    })),
  }), [filteredIndices, data.labels, data.datasets]);

  // Debounce the filter application to reduce re-renders
  const debouncedFilteredData = useDebounce(filteredData, 150);

  // Apply filters when debounced data changes
  // Skip if filtered data has same length as original (no filtering applied)
  useEffect(() => {
    // Don't apply filters if no actual filtering is happening
    // This prevents resetting filteredData to a partial result during data changes
    const isFullyUnfiltered = 
      debouncedFilteredData.labels.length === data.labels.length &&
      filters.valueRange[0] === minValue &&
      filters.valueRange[1] === maxValue &&
      filters.selectedLabels.size === data.labels.length;
    
    if (isFullyUnfiltered) {
      // No filtering applied - pass original data to avoid any transformation artifacts
      onFilteredDataChange(data);
    } else {
      onFilteredDataChange(debouncedFilteredData);
    }
  }, [debouncedFilteredData, onFilteredDataChange, data, filters, minValue, maxValue]);

  // Handle range change
  const handleRangeChange = useCallback((values: number[]) => {
    setFilters(prev => ({ ...prev, valueRange: [values[0], values[1]] as [number, number] }));
  }, []);

  // Handle label toggle
  const handleLabelToggle = useCallback((label: string, checked: boolean) => {
    setFilters(prev => {
      const newSelected = new Set(prev.selectedLabels);
      if (checked) {
        newSelected.add(label);
      } else {
        newSelected.delete(label);
      }
      return { ...prev, selectedLabels: newSelected };
    });
  }, []);

  // Select/deselect all labels
  const handleSelectAll = useCallback((selectAll: boolean) => {
    setFilters(prev => ({
      ...prev,
      selectedLabels: selectAll ? new Set(data.labels) : new Set<string>()
    }));
  }, [data.labels]);

  // Reset filters
  const resetFilters = useCallback(() => {
    const defaultFilters: FilterState = {
      valueRange: [minValue, maxValue],
      selectedLabels: new Set(data.labels),
    };
    setFilters(defaultFilters);
    onFilteredDataChange(data);
  }, [minValue, maxValue, data, onFilteredDataChange]);

  const activeFiltersCount = 
    (filters.valueRange[0] !== minValue || filters.valueRange[1] !== maxValue ? 1 : 0) +
    (filters.selectedLabels.size !== data.labels.length ? 1 : 0);

  const filteredCount = filters.selectedLabels.size;

  return (
    <div className="space-y-2">
      {/* Header with reset */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
          disabled={activeFiltersCount === 0}
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      {/* Value Range Filter */}
      <Collapsible open={openSections.range} onOpenChange={() => toggleSection('range')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Value Range</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              {filters.valueRange[0]} - {filters.valueRange[1]}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.range ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 px-2 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Min: {minValue}</span>
            <span>Max: {maxValue}</span>
          </div>
          <Slider
            value={filters.valueRange}
            onValueChange={handleRangeChange}
            min={minValue}
            max={maxValue}
            step={1}
            className="py-2"
          />
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Badge variant="outline" className="font-mono">{filters.valueRange[0]}</Badge>
            <span className="text-muted-foreground">to</span>
            <Badge variant="outline" className="font-mono">{filters.valueRange[1]}</Badge>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Label/Category Filter */}
      <Collapsible open={openSections.labels} onOpenChange={() => toggleSection('labels')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Categories</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] h-5">
              {filteredCount}/{data.labels.length}
            </Badge>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.labels ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <div className="flex gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSelectAll(true)}
              className="flex-1 h-7 text-xs"
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSelectAll(false)}
              className="flex-1 h-7 text-xs"
            >
              Clear All
            </Button>
          </div>
          <ScrollArea className="h-32">
            <div className="space-y-1 pr-3">
              {data.labels.map((label) => (
                <div 
                  key={label} 
                  className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`label-${label}`}
                    checked={filters.selectedLabels.has(label)}
                    onCheckedChange={(checked) => handleLabelToggle(label, checked === true)}
                    className="h-4 w-4"
                  />
                  <Label 
                    htmlFor={`label-${label}`} 
                    className="text-xs cursor-pointer flex-1 truncate"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default memo(InteractiveFilters);
