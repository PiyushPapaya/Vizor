import { Dataset, CHART_COLORS } from '@/types/chart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';

interface DatasetPanelProps {
  datasets: Dataset[];
  onUpdate: (datasets: Dataset[]) => void;
}

export default function DatasetPanel({ datasets, onUpdate }: DatasetPanelProps) {
  const updateDataset = (id: string, updates: Partial<Dataset>) => {
    onUpdate(
      datasets.map((ds) =>
        ds.id === id ? { ...ds, ...updates } : ds
      )
    );
  };

  const removeDataset = (id: string) => {
    onUpdate(datasets.filter((ds) => ds.id !== id));
  };

  if (datasets.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p className="text-sm">No datasets available</p>
        <p className="text-xs mt-1">Import data to see datasets here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Datasets</h4>
        <span className="text-xs text-muted-foreground">{datasets.length} total</span>
      </div>
      
      <div className="space-y-2">
        {datasets.map((dataset, index) => (
          <Card key={dataset.id} className="overflow-hidden bg-background/50">
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
                <input
                  type="color"
                  value={dataset.color.startsWith('hsl') 
                    ? '#14b8a6'
                    : dataset.color
                  }
                  onChange={(e) => updateDataset(dataset.id, { color: e.target.value })}
                  className="w-8 h-8 rounded-md border border-border cursor-pointer"
                  title="Pick color"
                />
                <Input
                  value={dataset.name}
                  onChange={(e) => updateDataset(dataset.id, { name: e.target.value })}
                  placeholder="Dataset name"
                  className="flex-1 h-8 text-sm bg-background"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => updateDataset(dataset.id, { visible: !dataset.visible })}
                  title={dataset.visible ? 'Hide dataset' : 'Show dataset'}
                >
                  {dataset.visible ? (
                    <Eye className="h-4 w-4 text-primary" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeDataset(dataset.id)}
                  title="Remove dataset"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{dataset.values.length} data points</span>
                <span>
                  Range: {Math.min(...dataset.values).toLocaleString()} - {Math.max(...dataset.values).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
