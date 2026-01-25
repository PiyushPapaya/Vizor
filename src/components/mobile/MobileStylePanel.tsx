/**
 * MobileStylePanel - Visual styling settings for mobile
 * 
 * Includes settings that affect visual appearance:
 * - Dataset colors
 * - Chart titles and labels
 * - Legend settings
 * - Grid settings
 * - Font sizes
 * - Stroke widths
 * - Bar radius
 * - Opacity
 * - Color schemes
 */

import { ChartConfig } from '@/types/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ChartData } from '@/types/chart';
import DatasetPanel from '@/components/charts/DatasetPanel';
import { Palette, Type, Eye, Grid3X3, Sparkles, Ruler } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MobileStylePanelProps {
  config: ChartConfig;
  onConfigUpdate: (config: ChartConfig) => void;
  data: ChartData;
  onDataUpdate: (datasets: ChartData['datasets']) => void;
}

const COLOR_SCHEMES = [
  { value: 'default', label: 'Default' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'forest', label: 'Forest' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'monochrome', label: 'Monochrome' },
];

const LEGEND_POSITIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

export default function MobileStylePanel({ config, onConfigUpdate, data, onDataUpdate }: MobileStylePanelProps) {
  const [localTitle, setLocalTitle] = useState(config.title);
  const [localXLabel, setLocalXLabel] = useState(config.xAxisLabel);
  const [localYLabel, setLocalYLabel] = useState(config.yAxisLabel);

  useEffect(() => {
    setLocalTitle(config.title);
    setLocalXLabel(config.xAxisLabel);
    setLocalYLabel(config.yAxisLabel);
  }, [config.title, config.xAxisLabel, config.yAxisLabel]);

  const updateConfig = (key: keyof ChartConfig, value: any) => {
    onConfigUpdate({ ...config, [key]: value });
  };

  const handleTitleBlur = () => {
    if (localTitle !== config.title) {
      updateConfig('title', localTitle);
    }
  };

  const handleXLabelBlur = () => {
    if (localXLabel !== config.xAxisLabel) {
      updateConfig('xAxisLabel', localXLabel);
    }
  };

  const handleYLabelBlur = () => {
    if (localYLabel !== config.yAxisLabel) {
      updateConfig('yAxisLabel', localYLabel);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dataset Colors */}
      {data.datasets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-purple-500" />
            <Label className="text-sm font-semibold">Dataset Colors</Label>
          </div>
          <DatasetPanel datasets={data.datasets} onUpdate={onDataUpdate} />
        </div>
      )}

      <Separator />

      {/* Titles & Labels */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-blue-500" />
          <Label className="text-sm font-semibold">Titles & Labels</Label>
        </div>
        
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-muted-foreground">Chart Title</Label>
            <Input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Enter chart title"
              className="h-9 text-sm"
            />
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground">X-Axis Label</Label>
            <Input
              value={localXLabel}
              onChange={(e) => setLocalXLabel(e.target.value)}
              onBlur={handleXLabelBlur}
              placeholder="X-axis"
              className="h-9 text-sm"
            />
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground">Y-Axis Label</Label>
            <Input
              value={localYLabel}
              onChange={(e) => setLocalYLabel(e.target.value)}
              onBlur={handleYLabelBlur}
              placeholder="Y-axis"
              className="h-9 text-sm"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Color Scheme */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <Label className="text-sm font-semibold">Color Scheme</Label>
        </div>
        <Select value={config.colorScheme} onValueChange={(value) => updateConfig('colorScheme', value)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COLOR_SCHEMES.map((scheme) => (
              <SelectItem key={scheme.value} value={scheme.value}>
                {scheme.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Display Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-green-500" />
          <Label className="text-sm font-semibold">Display</Label>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Show Legend</Label>
            <Switch
              checked={config.showLegend}
              onCheckedChange={(checked) => updateConfig('showLegend', checked)}
            />
          </div>
          
          {config.showLegend && (
            <div>
              <Label className="text-xs text-muted-foreground">Legend Position</Label>
              <Select value={config.legendPosition} onValueChange={(value) => updateConfig('legendPosition', value)}>
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEGEND_POSITIONS.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Show Data Labels</Label>
            <Switch
              checked={config.showDataLabels}
              onCheckedChange={(checked) => updateConfig('showDataLabels', checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Grid Settings */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-4 w-4 text-cyan-500" />
          <Label className="text-sm font-semibold">Grid</Label>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Show Grid</Label>
            <Switch
              checked={config.showGrid}
              onCheckedChange={(checked) => updateConfig('showGrid', checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Style Properties */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-orange-500" />
          <Label className="text-sm font-semibold">Style Properties</Label>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Font Size</Label>
              <span className="text-xs font-medium text-foreground">{config.fontSize}px</span>
            </div>
            <Slider
              value={[config.fontSize]}
              onValueChange={([value]) => updateConfig('fontSize', value)}
              min={8}
              max={20}
              step={1}
              className="py-2"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Stroke Width</Label>
              <span className="text-xs font-medium text-foreground">{config.strokeWidth}px</span>
            </div>
            <Slider
              value={[config.strokeWidth]}
              onValueChange={([value]) => updateConfig('strokeWidth', value)}
              min={1}
              max={6}
              step={0.5}
              className="py-2"
            />
          </div>
          
          {['bar', 'barHorizontal'].includes(config.type) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-muted-foreground">Bar Radius</Label>
                <span className="text-xs font-medium text-foreground">{config.barRadius}px</span>
              </div>
              <Slider
                value={[config.barRadius]}
                onValueChange={([value]) => updateConfig('barRadius', value)}
                min={0}
                max={16}
                step={1}
                className="py-2"
              />
            </div>
          )}
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Opacity</Label>
              <span className="text-xs font-medium text-foreground">{config.opacity}%</span>
            </div>
            <Slider
              value={[config.opacity]}
              onValueChange={([value]) => updateConfig('opacity', value)}
              min={10}
              max={100}
              step={5}
              className="py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
