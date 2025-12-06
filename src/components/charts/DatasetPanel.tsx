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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Datasets</span>
        <span className="text-[10px] text-muted-foreground">{datasets.length}</span>
      </div>
      
      <div className="space-y-1">
        {datasets.map((dataset) => (
          <div 
            key={dataset.id} 
            className="flex items-center gap-1.5 p-1.5 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <input
              type="color"
              value={dataset.color.startsWith('hsl') ? '#14b8a6' : dataset.color}
              onChange={(e) => updateDataset(dataset.id, { color: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
            <Input
              value={dataset.name}
              onChange={(e) => updateDataset(dataset.id, { name: e.target.value })}
              className="flex-1 h-6 text-xs bg-transparent border-0 p-1"
            />
            <span className="text-[10px] text-muted-foreground font-mono w-8 text-right">
              {dataset.values.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => updateDataset(dataset.id, { visible: !dataset.visible })}
            >
              {dataset.visible ? (
                <Eye className="h-3 w-3 text-primary" />
              ) : (
                <EyeOff className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeDataset(dataset.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(DatasetPanel);
