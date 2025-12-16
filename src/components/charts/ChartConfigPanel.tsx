import { ChartConfig, COLOR_SCHEMES } from '@/types/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChevronDown, Type, Eye, Palette, Zap, Copy, Check, 
  RotateCcw, Sparkles, TrendingUp, Minimize2 
} from 'lucide-react';
import { useState, memo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import { toast } from 'sonner';

interface ChartConfigPanelProps {
  config: ChartConfig;
  onUpdate: (config: ChartConfig) => void;
}

// Quick preset configurations
const QUICK_PRESETS = {
  professional: {
    name: 'Professional',
    icon: TrendingUp,
    config: {
      colorScheme: 'ocean',
      strokeWidth: 2,
      barRadius: 4,
      opacity: 90,
      fontSize: 12,
      showGrid: true,
      showLegend: true,
      animated: true,
    }
  },
  vibrant: {
    name: 'Vibrant',
    icon: Sparkles,
    config: {
      colorScheme: 'vibrant',
      strokeWidth: 3,
      barRadius: 8,
      opacity: 100,
      fontSize: 13,
      showGrid: false,
      showLegend: true,
      animated: true,
    }
  },
  minimal: {
    name: 'Minimal',
    icon: Minimize2,
    config: {
      colorScheme: 'default',
      strokeWidth: 1.5,
      barRadius: 2,
      opacity: 80,
      fontSize: 11,
      showGrid: true,
      showLegend: false,
      animated: false,
    }
  },
};

function ChartConfigPanel({ config, onUpdate }: ChartConfigPanelProps) {
  const [labelsOpen, setLabelsOpen] = useState(true);
  const [displayOpen, setDisplayOpen] = useState(true);
  const [styleOpen, setStyleOpen] = useState(false);
  const [behaviorOpen, setBehaviorOpen] = useState(false);
  
  // Local state for inputs with auto-apply via debouncing
  const [localTitle, setLocalTitle] = useState(config.title);
  const [localXLabel, setLocalXLabel] = useState(config.xAxisLabel);
  const [localYLabel, setLocalYLabel] = useState(config.yAxisLabel);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  // Debounced auto-apply for text inputs (500ms delay)
  const debouncedUpdate = useDebouncedCallback((updates: Partial<ChartConfig>) => {
    onUpdate({ ...config, ...updates });
    toast.success('Settings updated', { duration: 1500 });
  }, 500);

  // Sync local state when config changes externally
  useEffect(() => {
    setLocalTitle(config.title);
    setLocalXLabel(config.xAxisLabel);
    setLocalYLabel(config.yAxisLabel);
  }, [config.title, config.xAxisLabel, config.yAxisLabel]);

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

  // Copy color to clipboard
  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast.success(`Copied ${color}`, { duration: 1500 });
    setTimeout(() => setCopiedColor(null), 1500);
  };

  // Apply quick preset
  const applyPreset = (presetKey: keyof typeof QUICK_PRESETS) => {
    const preset = QUICK_PRESETS[presetKey];
    onUpdate({ ...config, ...preset.config });
    toast.success(`${preset.name} preset applied`, { duration: 2000 });
  };

  // Reset to defaults
  const resetToDefaults = () => {
    const defaults: Partial<ChartConfig> = {
      showGrid: true,
      showLegend: true,
      showTooltip: true,
      showDataLabels: false,
      colorScheme: 'default',
      strokeWidth: 2,
      barRadius: 4,
      opacity: 100,
      fontSize: 12,
      animated: true,
      smooth: true,
      stacked: false,
      legendPosition: 'bottom',
    };
    onUpdate({ ...config, ...defaults });
    toast.success('Reset to default settings', { duration: 2000 });
  };

  return (
    <div className="space-y-2">
      {/* Quick Presets */}
      <div className="space-y-2 p-3 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <Label className="text-xs font-semibold text-foreground">Quick Presets</Label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(QUICK_PRESETS).map(([key, preset]) => {
            const Icon = preset.icon;
            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-2 flex flex-col items-center gap-1 hover:bg-primary/10 hover:border-primary/30 transition-all"
                    onClick={() => applyPreset(key as keyof typeof QUICK_PRESETS)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[10px]">{preset.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Apply {preset.name} preset</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Labels Section */}
      <Collapsible open={labelsOpen} onOpenChange={setLabelsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-1 hover:bg-muted/50 rounded-md transition-colors group">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Labels</h4>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:text-primary", labelsOpen && "rotate-180")} />
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
          <p className="text-[10px] text-muted-foreground italic">Changes apply automatically</p>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-1" />

      {/* Display Options */}
      <Collapsible open={displayOpen} onOpenChange={setDisplayOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-1 hover:bg-muted/50 rounded-md transition-colors group">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Display</h4>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:text-primary", displayOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2 animate-in">
          {[
            { id: 'showLegend', label: 'Show Legend', key: 'showLegend' as const, tooltip: 'Display chart legend' },
            { id: 'showGrid', label: 'Show Grid', key: 'showGrid' as const, tooltip: 'Show background grid lines' },
            { id: 'showTooltip', label: 'Show Tooltips', key: 'showTooltip' as const, tooltip: 'Interactive data tooltips' },
            { id: 'showDataLabels', label: 'Data Labels', key: 'showDataLabels' as const, tooltip: 'Show values on chart' },
          ].map(({ id, label, key, tooltip }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-between py-1.5 px-1 hover:bg-muted/30 rounded-md transition-colors">
                  <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
                  <Switch
                    id={id}
                    checked={config[key] ?? false}
                    onCheckedChange={(checked) => updateConfig(key, checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
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
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-1" />

      {/* Style Options */}
      <Collapsible open={styleOpen} onOpenChange={setStyleOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-1 hover:bg-muted/50 rounded-md transition-colors group">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Style</h4>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:text-primary", styleOpen && "rotate-180")} />
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
              </SelectContent>
            </Select>
            
            {/* Enhanced Color Preview with Copy */}
            <div className="grid grid-cols-6 gap-1.5 p-2.5 bg-muted/30 rounded-lg border border-border/50">
              {(COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default).slice(0, 6).map((color, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => copyColor(color)}
                      className="relative group"
                    >
                      <div 
                        className="w-full aspect-square rounded-md shadow-md ring-1 ring-border/50 transition-all hover:scale-110 hover:shadow-lg hover:ring-2 hover:ring-primary/50" 
                        style={{ backgroundColor: color }}
                      />
                      {copiedColor === color ? (
                        <Check className="absolute inset-0 m-auto h-3 w-3 text-white drop-shadow-lg" />
                      ) : (
                        <Copy className="absolute inset-0 m-auto h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-mono">{color}</p>
                    <p className="text-[10px] text-muted-foreground">Click to copy</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger>
                  <Label className="text-xs text-muted-foreground cursor-help">Stroke Width</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Line thickness for charts</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-xs text-primary font-mono font-semibold">{config.strokeWidth ?? 2}px</span>
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
              <Tooltip>
                <TooltipTrigger>
                  <Label className="text-xs text-muted-foreground cursor-help">Bar Radius</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Corner rounding for bars</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-xs text-primary font-mono font-semibold">{config.barRadius ?? 4}px</span>
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
              <span className="text-xs text-primary font-mono font-semibold">{config.opacity ?? 100}%</span>
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
              <span className="text-xs text-primary font-mono font-semibold">{config.fontSize ?? 12}px</span>
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
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-1" />

      {/* Behavior */}
      <Collapsible open={behaviorOpen} onOpenChange={setBehaviorOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-1 hover:bg-muted/50 rounded-md transition-colors group">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Behavior</h4>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:text-primary", behaviorOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2 animate-in">
          {[
            { id: 'animated', label: 'Animations', key: 'animated' as const, defaultVal: true, tooltip: 'Smooth chart animations' },
            { id: 'smooth', label: 'Smooth Lines', key: 'smooth' as const, defaultVal: true, tooltip: 'Curved line charts' },
            { id: 'stacked', label: 'Stacked Mode', key: 'stacked' as const, defaultVal: false, tooltip: 'Stack data series' },
          ].map(({ id, label, key, defaultVal, tooltip }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-between py-1.5 px-1 hover:bg-muted/30 rounded-md transition-colors">
                  <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
                  <Switch
                    id={id}
                    checked={config[key] ?? defaultVal}
                    onCheckedChange={(checked) => updateConfig(key, checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Reset Button */}
      <div className="pt-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-9 gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
              onClick={resetToDefaults}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset to Defaults
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Restore all settings to default values</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default memo(ChartConfigPanel);
