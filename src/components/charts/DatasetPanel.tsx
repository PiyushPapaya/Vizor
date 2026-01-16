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
        <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md">{datasets.length}</span>
      </div>
      
      <div className="space-y-2 lg:space-y-1.5">
        {datasets.map((dataset, index) => (
          <div 
            key={dataset.id} 
            className="group flex items-center gap-2 lg:gap-1.5 p-2.5 lg:p-1.5 rounded-xl lg:rounded-lg bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm hover:from-card hover:to-card/80 transition-all duration-300 border border-border/30 hover:border-border/60 hover:shadow-md hover:scale-[1.01]"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative">
              <input
                type="color"
                value={dataset.color.startsWith('hsl') ? '#14b8a6' : dataset.color}
                onChange={(e) => updateDataset(dataset.id, { color: e.target.value })}
                className="w-10 h-10 lg:w-7 lg:h-7 rounded-lg lg:rounded-md cursor-pointer border-2 border-border/50 hover:border-primary/50 bg-transparent transition-all duration-300 hover:scale-110 touch-target-lg lg:touch-target-none"
              />
              <div 
                className="absolute inset-0 rounded-lg lg:rounded-md pointer-events-none" 
                style={{ 
                  background: `linear-gradient(135deg, ${dataset.color.startsWith('hsl') ? '#14b8a6' : dataset.color}20, transparent)`,
                  opacity: 0.3
                }}
              />
            </div>
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
