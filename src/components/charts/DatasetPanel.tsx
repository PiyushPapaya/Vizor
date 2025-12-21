import { Dataset, CHART_COLORS } from '@/types/chart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { memo, useCallback } from 'react';

interface DatasetPanelProps {
  datasets: Dataset[];
  onUpdate: (datasets: Dataset[]) => void;
}

function DatasetPanel({ datasets, onUpdate }: DatasetPanelProps) {
  const updateDataset = useCallback((id: string, updates: Partial<Dataset>) => {
    onUpdate(datasets.map(ds => ds.id === id ? { ...ds, ...updates } : ds));
  }, [datasets, onUpdate]);

  const removeDataset = useCallback((id: string) => {
    onUpdate(datasets.filter(ds => ds.id !== id));
  }, [datasets, onUpdate]);

  if (datasets.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p className="text-xs">No datasets yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Datasets</span>
        <span className="text-[10px] text-muted-foreground">{datasets.length}</span>
      </div>
      
      <div className="space-y-2 lg:space-y-0.5">
        {datasets.map((dataset) => (
          <div 
            key={dataset.id} 
            className="flex items-center gap-2 lg:gap-1 p-2 lg:p-1 rounded-lg lg:rounded-md bg-muted/30 hover:bg-muted/50 transition-colors border lg:border-0 border-border/40"
          >
            <input
              type="color"
              value={dataset.color.startsWith('hsl') ? '#14b8a6' : dataset.color}
              onChange={(e) => updateDataset(dataset.id, { color: e.target.value })}
              className="w-11 h-11 lg:w-6 lg:h-6 rounded lg:rounded-sm cursor-pointer border-2 lg:border border-border bg-transparent touch-target-lg lg:touch-target-none"
            />
            <Input
              value={dataset.name}
              onChange={(e) => updateDataset(dataset.id, { name: e.target.value })}
              className="flex-1 h-11 lg:h-7 text-sm lg:text-xs bg-background/50 border-border"
            />
            <span className="text-xs lg:text-[11px] text-muted-foreground font-mono w-10 lg:w-6 text-right hidden xs:block">
              {dataset.values.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 lg:h-7 lg:w-7 shrink-0 touch-target-lg lg:touch-target-none"
              onClick={() => updateDataset(dataset.id, { visible: !dataset.visible })}
            >
              {dataset.visible ? (
                <Eye className="h-5 w-5 lg:h-3.5 lg:w-3.5 text-primary" />
              ) : (
                <EyeOff className="h-5 w-5 lg:h-3.5 lg:w-3.5 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 lg:h-7 lg:w-7 shrink-0 text-muted-foreground hover:text-destructive touch-target-lg lg:touch-target-none"
              onClick={() => removeDataset(dataset.id)}
            >
              <Trash2 className="h-5 w-5 lg:h-3.5 lg:w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(DatasetPanel);
