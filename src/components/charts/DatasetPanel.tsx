import { Dataset, CHART_COLORS } from '@/types/chart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash2, Eye, EyeOff, Palette, Check } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface DatasetPanelProps {
  datasets: Dataset[];
  onUpdate: (datasets: Dataset[]) => void;
}

// Preset color palettes for quick selection
const COLOR_PRESETS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
];

function ColorPicker({ 
  color, 
  onChange, 
  datasetName 
}: { 
  color: string; 
  onChange: (color: string) => void;
  datasetName: string;
}) {
  const [customColor, setCustomColor] = useState(color);
  
  const displayColor = color.startsWith('hsl') ? '#14b8a6' : color;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-10 h-10 lg:w-8 lg:h-8 p-0 rounded-lg border-2 border-border/50 hover:border-primary/50 transition-all duration-200 hover:scale-105 touch-target-lg lg:touch-target-none"
          style={{ backgroundColor: displayColor }}
        >
          <span className="sr-only">Pick color for {datasetName}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Color for {datasetName}</span>
            <div 
              className="w-6 h-6 rounded-md border-2 border-border" 
              style={{ backgroundColor: displayColor }}
            />
          </div>
          
          {/* Preset Colors */}
          <div className="grid grid-cols-6 gap-1.5">
            {COLOR_PRESETS.map((presetColor) => (
              <button
                key={presetColor}
                className={cn(
                  "w-8 h-8 rounded-md transition-all duration-150 hover:scale-110 flex items-center justify-center",
                  color === presetColor && "ring-2 ring-primary ring-offset-2"
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => onChange(presetColor)}
              >
                {color === presetColor && <Check className="h-4 w-4 text-white drop-shadow-md" />}
              </button>
            ))}
          </div>
          
          {/* Custom Color Input */}
          <div className="flex gap-2 items-center pt-2 border-t">
            <div className="flex items-center gap-2 flex-1">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-10 h-8 p-0 border-0 cursor-pointer"
              />
              <Input
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#000000"
                className="flex-1 h-8 text-xs font-mono"
              />
            </div>
            <Button 
              size="sm" 
              className="h-8 px-3"
              onClick={() => onChange(customColor)}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DatasetPanel({ datasets, onUpdate }: DatasetPanelProps) {
  const updateDataset = useCallback((id: string, updates: Partial<Dataset>) => {
    onUpdate(datasets.map(ds => ds.id === id ? { ...ds, ...updates } : ds));
  }, [datasets, onUpdate]);

  const removeDataset = useCallback((id: string) => {
    onUpdate(datasets.filter(ds => ds.id !== id));
  }, [datasets, onUpdate]);

  // Toggle all datasets visibility
  const toggleAllVisibility = useCallback((visible: boolean) => {
    onUpdate(datasets.map(ds => ({ ...ds, visible })));
  }, [datasets, onUpdate]);

  if (datasets.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p className="text-xs">No datasets yet</p>
      </div>
    );
  }

  const visibleCount = datasets.filter(ds => ds.visible).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Datasets</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px]"
            onClick={() => toggleAllVisibility(visibleCount < datasets.length)}
          >
            {visibleCount < datasets.length ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Show All
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Hide All
              </>
            )}
          </Button>
          <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md">
            {visibleCount}/{datasets.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-2 lg:space-y-1.5">
        {datasets.map((dataset, index) => (
          <div 
            key={dataset.id} 
            className={cn(
              "group flex items-center gap-2 lg:gap-1.5 p-2.5 lg:p-1.5 rounded-xl lg:rounded-lg transition-all duration-300 border border-border/30 hover:border-border/60 hover:shadow-md hover:scale-[1.01]",
              dataset.visible 
                ? "bg-gradient-to-br from-card/80 to-card/50 hover:from-card hover:to-card/80" 
                : "bg-muted/30 opacity-60"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ColorPicker
              color={dataset.color}
              onChange={(color) => updateDataset(dataset.id, { color })}
              datasetName={dataset.name || `Dataset ${index + 1}`}
            />
            <Input
              value={dataset.name}
              onChange={(e) => updateDataset(dataset.id, { name: e.target.value })}
              className="flex-1 h-10 lg:h-8 text-sm lg:text-xs bg-background/50 border-border/50 focus:border-primary/50 rounded-lg lg:rounded-md transition-all duration-300"
              placeholder="Dataset name"
            />
            <span className="text-xs lg:text-[10px] text-muted-foreground font-mono w-10 lg:w-8 text-right hidden xs:block bg-muted/50 px-1.5 py-1 rounded-md">
              {dataset.values.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 lg:h-8 lg:w-8 shrink-0 rounded-lg lg:rounded-md hover:bg-primary/10 transition-all duration-300 hover:scale-110 touch-target-lg lg:touch-target-none"
              onClick={() => updateDataset(dataset.id, { visible: !dataset.visible })}
            >
              {dataset.visible ? (
                <Eye className="h-5 w-5 lg:h-4 lg:w-4 text-primary transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <EyeOff className="h-5 w-5 lg:h-4 lg:w-4 text-muted-foreground transition-transform duration-300 group-hover:scale-110" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 lg:h-8 lg:w-8 shrink-0 rounded-lg lg:rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 hover:scale-110 touch-target-lg lg:touch-target-none"
              onClick={() => removeDataset(dataset.id)}
            >
              <Trash2 className="h-5 w-5 lg:h-4 lg:w-4 transition-transform duration-300 group-hover:scale-110" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(DatasetPanel);
