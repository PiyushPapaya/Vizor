import { ChartConfig } from '@/types/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface ChartConfigPanelProps {
  config: ChartConfig;
  onUpdate: (config: ChartConfig) => void;
}

export default function ChartConfigPanel({ config, onUpdate }: ChartConfigPanelProps) {
  const updateConfig = (key: keyof ChartConfig, value: any) => {
    onUpdate({ ...config, [key]: value });
  };

  return (
    <div className="space-y-5">
      {/* Labels Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Labels</h4>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs text-muted-foreground">Chart Title</Label>
            <Input
              id="title"
              value={config.title}
              onChange={(e) => updateConfig('title', e.target.value)}
              placeholder="Enter chart title"
              className="bg-background h-9"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="xAxisLabel" className="text-xs text-muted-foreground">X-Axis</Label>
              <Input
                id="xAxisLabel"
                value={config.xAxisLabel}
                onChange={(e) => updateConfig('xAxisLabel', e.target.value)}
                placeholder="X-Axis"
                className="bg-background h-9"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="yAxisLabel" className="text-xs text-muted-foreground">Y-Axis</Label>
              <Input
                id="yAxisLabel"
                value={config.yAxisLabel}
                onChange={(e) => updateConfig('yAxisLabel', e.target.value)}
                placeholder="Y-Axis"
                className="bg-background h-9"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Display Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Display</h4>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between py-1">
            <Label htmlFor="showLegend" className="text-sm cursor-pointer">Show Legend</Label>
            <Switch
              id="showLegend"
              checked={config.showLegend}
              onCheckedChange={(checked) => updateConfig('showLegend', checked)}
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <Label htmlFor="showGrid" className="text-sm cursor-pointer">Show Grid</Label>
            <Switch
              id="showGrid"
              checked={config.showGrid}
              onCheckedChange={(checked) => updateConfig('showGrid', checked)}
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <Label htmlFor="showTooltip" className="text-sm cursor-pointer">Show Tooltips</Label>
            <Switch
              id="showTooltip"
              checked={config.showTooltip}
              onCheckedChange={(checked) => updateConfig('showTooltip', checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Behavior */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Behavior</h4>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between py-1">
            <Label htmlFor="animated" className="text-sm cursor-pointer">Animations</Label>
            <Switch
              id="animated"
              checked={config.animated}
              onCheckedChange={(checked) => updateConfig('animated', checked)}
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <Label htmlFor="smooth" className="text-sm cursor-pointer">Smooth Lines</Label>
            <Switch
              id="smooth"
              checked={config.smooth ?? true}
              onCheckedChange={(checked) => updateConfig('smooth', checked)}
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <Label htmlFor="stacked" className="text-sm cursor-pointer">Stacked Mode</Label>
            <Switch
              id="stacked"
              checked={config.stacked ?? false}
              onCheckedChange={(checked) => updateConfig('stacked', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
