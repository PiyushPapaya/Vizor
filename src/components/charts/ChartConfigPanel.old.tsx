import { ChartConfig, COLOR_SCHEMES } from '@/types/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useState, memo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from '@/hooks/useDebounce';

interface ChartConfigPanelProps {
  config: ChartConfig;
  onUpdate: (config: ChartConfig) => void;
}

function ChartConfigPanel({ config, onUpdate }: ChartConfigPanelProps) {
  const [labelsOpen, setLabelsOpen] = useState(true);
  const [displayOpen, setDisplayOpen] = useState(true);
  const [styleOpen, setStyleOpen] = useState(false);
  const [behaviorOpen, setBehaviorOpen] = useState(false);
  
  // Local state for inputs with auto-apply via debouncing
  const [localTitle, setLocalTitle] = useState(config.title);
  const [localXLabel, setLocalXLabel] = useState(config.xAxisLabel);
  const [localYLabel, setLocalYLabel] = useState(config.yAxisLabel);
  const [customColors, setCustomColors] = useState<string[]>(
    config.customColors || COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default
  );
  
  // Debounced auto-apply for text inputs (500ms delay)
  const debouncedUpdate = useDebouncedCallback((updates: Partial<ChartConfig>) => {
    onUpdate({ ...config, ...updates });
  }, 500);

  // Sync local state when config changes externally
  useEffect(() => {
    setLocalTitle(config.title);
    setLocalXLabel(config.xAxisLabel);
    setLocalYLabel(config.yAxisLabel);
  }, [config.title, config.xAxisLabel, config.yAxisLabel]);
  
  useEffect(() => {
    if (config.colorScheme !== 'custom') {
      setCustomColors(COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default);
    }
  }, [config.colorScheme]);

  // Immediate update for toggles and selects
  const updateConfig = (key: keyof ChartConfig, value: any) => {
    onUpdate({ ...config, [key]: value });
  };
  
  // Auto-apply labels with debouncing
  const handleTitleChange = (value: string) => {
    setLocalTitle(value);
    debouncedUpdate({ title: value });
  };

  const handleXLabelChange = (value: string) => {
    setLocalXLabel(value);
    debouncedUpdate({ xAxisLabel: value });
  };

  const handleYLabelChange = (value: string) => {
    setLocalYLabel(value);
    debouncedUpdate({ yAxisLabel: value });
  };
  
  const handleColorChange = (index: number, color: string) => {
    const newColors = [...customColors];
    newColors[index] = color;
    setCustomColors(newColors);
    
    // Auto-apply custom colors with debouncing
    debouncedUpdate({ 
      colorScheme: 'custom',
      customColors: newColors
    });
  };

  return (
    <div className="space-y-2">
      {/* Labels Section */}
      <Collapsible open={labelsOpen} onOpenChange={setLabelsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-1 hover:bg-muted/50 rounded-md transition-colors">
          <h4 className="text-sm font-semibold text-foreground">Labels</h4>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", labelsOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2 animate-in">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs text-muted-foreground">Chart Title</Label>
            <Input
              id="title"
              value={localTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter chart title"
              className="bg-background/50 h-9 transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="xAxisLabel" className="text-xs text-muted-foreground">X-Axis</Label>
              <Input
                id="xAxisLabel"
                value={localXLabel}
                onChange={(e) => handleXLabelChange(e.target.value)}
                placeholder="X-Axis"
                className="bg-background/50 h-9"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="yAxisLabel" className="text-xs text-muted-foreground">Y-Axis</Label>
              <Input
                id="yAxisLabel"
                value={localYLabel}
                onChange={(e) => handleYLabelChange(e.target.value)}
                placeholder="Y-Axis"
                className="bg-background/50 h-9"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-1" />

      {/* Display Options */}
      <Collapsible open={displayOpen} onOpenChange={setDisplayOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-1 hover:bg-muted/50 rounded-md transition-colors">
          <h4 className="text-sm font-semibold text-foreground">Display</h4>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", displayOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2 animate-in">
          {[
            { id: 'showLegend', label: 'Show Legend', key: 'showLegend' as const },
            { id: 'showGrid', label: 'Show Grid', key: 'showGrid' as const },
            { id: 'showTooltip', label: 'Show Tooltips', key: 'showTooltip' as const },
            { id: 'showDataLabels', label: 'Data Labels', key: 'showDataLabels' as const },
          ].map(({ id, label, key }) => (
            <div key={id} className="flex items-center justify-between py-1.5 px-1 hover:bg-muted/30 rounded-md transition-colors">
              <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
              <Switch
                id={id}
                checked={config[key] ?? false}
                onCheckedChange={(checked) => updateConfig(key, checked)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          ))}

          <div className="space-y-2 pt-1">
            <Label className="text-xs text-muted-foreground">Legend Position</Label>
            <Select value={config.legendPosition ?? 'bottom'} onValueChange={(v) => updateConfig('legendPosition', v)}>
              <SelectTrigger className="h-9 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={() => onUpdate(config)} className="w-full h-9 mt-2" size="sm">
            Apply Display Settings
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-1" />

      {/* Style Options */}
      <Collapsible open={styleOpen} onOpenChange={setStyleOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-1 hover:bg-muted/50 rounded-md transition-colors">
          <h4 className="text-sm font-semibold text-foreground">Style</h4>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", styleOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2 animate-in">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Color Scheme</Label>
            <Select value={config.colorScheme ?? 'default'} onValueChange={(v) => updateConfig('colorScheme', v)}>
              <SelectTrigger className="h-9 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(COLOR_SCHEMES).map((scheme) => (
                  <SelectItem key={scheme} value={scheme} className="capitalize">{scheme}</SelectItem>
                ))}
                <SelectItem value="custom" className="capitalize">Custom</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1 mt-2">
              {(config.colorScheme === 'custom' && config.customColors ? config.customColors : COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default).slice(0, 6).map((color, i) => (
                <div key={i} className="w-6 h-6 rounded-md shadow-sm ring-1 ring-border/50" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Custom Colors</Label>
            <div className="grid grid-cols-3 gap-2">
              {customColors.slice(0, 6).map((color, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <Label className="text-[10px] text-muted-foreground">Color {i + 1}</Label>
                  <div className="flex gap-1 items-center">
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(i, e.target.value)}
                      className="h-9 w-full cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Stroke Width</Label>
              <span className="text-xs text-muted-foreground font-mono">{config.strokeWidth ?? 2}px</span>
            </div>
            <Slider
              value={[config.strokeWidth ?? 2]}
              onValueChange={([v]) => updateConfig('strokeWidth', v)}
              min={1}
              max={6}
              step={0.5}
              className="py-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Bar Radius</Label>
              <span className="text-xs text-muted-foreground font-mono">{config.barRadius ?? 4}px</span>
            </div>
            <Slider
              value={[config.barRadius ?? 4]}
              onValueChange={([v]) => updateConfig('barRadius', v)}
              min={0}
              max={12}
              step={1}
              className="py-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Opacity</Label>
              <span className="text-xs text-muted-foreground font-mono">{config.opacity ?? 100}%</span>
            </div>
            <Slider
              value={[config.opacity ?? 100]}
              onValueChange={([v]) => updateConfig('opacity', v)}
              min={20}
              max={100}
              step={5}
              className="py-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Font Size</Label>
              <span className="text-xs text-muted-foreground font-mono">{config.fontSize ?? 12}px</span>
            </div>
            <Slider
              value={[config.fontSize ?? 12]}
              onValueChange={([v]) => updateConfig('fontSize', v)}
              min={10}
              max={16}
              step={1}
              className="py-1"
            />
          </div>
          
          <Button onClick={() => onUpdate(config)} className="w-full h-9 mt-2" size="sm">
            Apply Style Settings
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-1" />

      {/* Behavior */}
      <Collapsible open={behaviorOpen} onOpenChange={setBehaviorOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-1 hover:bg-muted/50 rounded-md transition-colors">
          <h4 className="text-sm font-semibold text-foreground">Behavior</h4>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", behaviorOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2 animate-in">
          {[
            { id: 'animated', label: 'Animations', key: 'animated' as const, defaultVal: true },
            { id: 'smooth', label: 'Smooth Lines', key: 'smooth' as const, defaultVal: true },
            { id: 'stacked', label: 'Stacked Mode', key: 'stacked' as const, defaultVal: false },
          ].map(({ id, label, key, defaultVal }) => (
            <div key={id} className="flex items-center justify-between py-1.5 px-1 hover:bg-muted/30 rounded-md transition-colors">
              <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
              <Switch
                id={id}
                checked={config[key] ?? defaultVal}
                onCheckedChange={(checked) => updateConfig(key, checked)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          ))}
          
          <Button onClick={() => onUpdate(config)} className="w-full h-9 mt-2" size="sm">
            Apply Behavior Settings
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default memo(ChartConfigPanel);