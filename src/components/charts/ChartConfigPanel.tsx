import { ChartConfig } from '@/types/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ChartConfigPanelProps {
  config: ChartConfig;
  onUpdate: (config: ChartConfig) => void;
}

export default function ChartConfigPanel({ config, onUpdate }: ChartConfigPanelProps) {
  const update = (updates: Partial<ChartConfig>) => {
    onUpdate({ ...config, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="chart-title" className="text-sm font-medium">Chart Title</Label>
        <Input
          id="chart-title"
          value={config.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Enter chart title"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="x-axis" className="text-sm font-medium">X-Axis Label</Label>
          <Input
            id="x-axis"
            value={config.xAxisLabel}
            onChange={(e) => update({ xAxisLabel: e.target.value })}
            placeholder="X-Axis"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="y-axis" className="text-sm font-medium">Y-Axis Label</Label>
          <Input
            id="y-axis"
            value={config.yAxisLabel}
            onChange={(e) => update({ yAxisLabel: e.target.value })}
            placeholder="Y-Axis"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-legend" className="text-sm">Show Legend</Label>
          <Switch
            id="show-legend"
            checked={config.showLegend}
            onCheckedChange={(checked) => update({ showLegend: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-grid" className="text-sm">Show Grid</Label>
          <Switch
            id="show-grid"
            checked={config.showGrid}
            onCheckedChange={(checked) => update({ showGrid: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-tooltip" className="text-sm">Show Tooltips</Label>
          <Switch
            id="show-tooltip"
            checked={config.showTooltip}
            onCheckedChange={(checked) => update({ showTooltip: checked })}
          />
        </div>
      </div>
    </div>
  );
}
