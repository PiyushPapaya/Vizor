import { Dataset, CHART_COLORS } from '@/types/chart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash2, Eye, EyeOff } from 'lucide-react';

interface DatasetPanelProps {
  datasets: Dataset[];
  onUpdate: (datasets: Dataset[]) => void;
}

export default function DatasetPanel({ datasets, onUpdate }: DatasetPanelProps) {
  const updateDataset = (id: string, updates: Partial<Dataset>) => {
    onUpdate(datasets.map(ds => ds.id === id ? { ...ds, ...updates } : ds));
  };

  const removeDataset = (id: string) => {
    onUpdate(datasets.filter(ds => ds.id !== id));
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Datasets</Label>
      {datasets.length === 0 ? (
        <p className="text-sm text-muted-foreground">No datasets loaded. Import data to get started.</p>
      ) : (
        <div className="space-y-2">
          {datasets.map((dataset, index) => (
            <div
              key={dataset.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/50"
            >
              <input
                type="color"
                value={dataset.color}
                onChange={(e) => updateDataset(dataset.id, { color: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
              <Input
                value={dataset.name}
                onChange={(e) => updateDataset(dataset.id, { name: e.target.value })}
                className="flex-1 h-8 text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateDataset(dataset.id, { visible: !dataset.visible })}
              >
                {dataset.visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => removeDataset(dataset.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
