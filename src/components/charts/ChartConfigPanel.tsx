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
  const [styleOpen, setStyleOpen] = useState(true);
  const [behaviorOpen, setBehaviorOpen] = useState(false);
  
  // Local state for inputs with auto-apply via debouncing
  const [localTitle, setLocalTitle] = useState(config.title);
  const [localXLabel, setLocalXLabel] = useState(config.xAxisLabel);
  const [localYLabel, setLocalYLabel] = useState(config.yAxisLabel);
  const [pendingColor, setPendingColor] = useState<string>('#3B82F6');
  
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

  // Apply quick preset
  const applyPreset = (presetKey: keyof typeof QUICK_PRESETS) => {
    const preset = QUICK_PRESETS[presetKey];
    onUpdate({ ...config, ...preset.config, colorScheme: preset.config.colorScheme as ChartConfig['colorScheme'] });
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
          
          {/* Grid Options */}
          {config.showGrid && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              <Label className="text-xs text-muted-foreground">Grid Style</Label>
              <Select value={config.gridType ?? 'dashed'} onValueChange={(v) => updateConfig('gridType', v)}>
                <SelectTrigger className="h-9 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Grid Thickness</Label>
                  <span className="text-xs text-primary font-mono font-semibold">{config.gridSize ?? 1}px</span>
                </div>
                <Slider
                  value={[config.gridSize ?? 1]}
                  onValueChange={([v]) => updateConfig('gridSize', Number(v))}
                  min={1}
                  max={5}
                  step={0.5}
                  className="py-1"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Grid Opacity</Label>
                  <span className="text-xs text-primary font-mono font-semibold">{config.gridOpacity ?? 30}%</span>
                </div>
                <Slider
                  value={[config.gridOpacity ?? 30]}
                  onValueChange={([v]) => updateConfig('gridOpacity', Number(v))}
                  min={5}
                  max={100}
                  step={5}
                  className="py-1"
                />
              </div>
            </div>
          )}
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
            <Label className="text-xs text-muted-foreground font-semibold">Color Scheme</Label>
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
            
            {/* Color Preview for Non-Custom Schemes */}
            {config.colorScheme !== 'custom' && (
              <div className="space-y-3 p-3.5 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg border-2 border-border/50 shadow-inner">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground">Color Palette Preview</Label>
                  <Button
                    size="sm"
                    className="h-8 text-xs px-4 font-semibold bg-primary hover:bg-primary/90 shadow-md"
                    onClick={() => {
                      const currentColors = COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default;
                      updateConfig('customColors', [...currentColors]);
                      setTimeout(() => updateConfig('colorScheme', 'custom'), 50);
                    }}
                  >
                    Customize
                  </Button>
                </div>
                
                <div className="grid grid-cols-6 gap-2.5">
                  {(COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default).slice(0, 6).map((color, i) => (
                    <div 
                      key={i}
                      className="w-full aspect-square rounded-lg ring-2 ring-border/60 shadow-lg hover:scale-110 hover:shadow-xl transition-all" 
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Custom Color Editor */}
            {config.colorScheme === 'custom' && (
              <div className="space-y-4 p-4 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-xl border-2 border-primary/30 shadow-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-bold text-foreground flex items-center gap-2">
                    Custom Color Editor
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs px-3 hover:bg-destructive/20 hover:text-destructive font-semibold"
                      onClick={() => {
                        const defaults = COLOR_SCHEMES.default;
                        updateConfig('customColors', [...defaults]);
                        toast.success('Reset to defaults', { duration: 1500 });
                      }}
                    >
                      ↺ Reset
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="h-7 text-xs px-4 bg-primary hover:bg-primary/90 font-bold shadow-md"
                      onClick={() => {
                        // Keep colorScheme as 'custom' so colors persist and are applied
                        toast.success('Custom colors saved and applied!', { duration: 2000 });
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-xs text-muted-foreground font-semibold">Your Colors (click to edit)</Label>
                  <div className="grid grid-cols-6 gap-3 p-3 bg-background/50 rounded-lg border border-border/50 max-h-44 overflow-auto">
                    {(config.customColors && config.customColors.length > 0 ? config.customColors : COLOR_SCHEMES.default).map((color, i) => (
                      <div key={i} className="relative group">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...(config.customColors || COLOR_SCHEMES.default)];
                            newColors[i] = e.target.value.toUpperCase();
                            updateConfig('customColors', newColors);
                          }}
                          className="w-full aspect-square rounded-lg ring-2 ring-border hover:ring-primary hover:scale-110 transition-all cursor-pointer shadow-md hover:shadow-xl"
                          title={`Click to edit: ${color}`}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if ((config.customColors?.length || 0) <= 3) {
                              toast.error('Need at least 3 colors', { duration: 1500 });
                              return;
                            }
                            const newColors = [...(config.customColors || COLOR_SCHEMES.default)];
                            newColors.splice(i, 1);
                            updateConfig('customColors', newColors);
                            toast.success('Color removed', { duration: 1000 });
                          }}
                          className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs shadow-xl hover:scale-125 font-bold"
                          title="Remove color"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 pt-3 border-t-2 border-dashed border-border/50">
                    <Label className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                      Add New Color
                    </Label>
                    <div className="flex flex-wrap gap-2 items-center">
                      <input
                        type="color"
                        value={pendingColor}
                        className="h-11 w-16 flex-none rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all shadow-md hover:shadow-lg hover:scale-105 min-w-[56px]"
                        onChange={(e) => setPendingColor(e.target.value.toUpperCase())}
                        title="Pick a color then click Add"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-11 px-4 font-medium hover:bg-primary hover:text-primary-foreground flex-none"
                        onClick={() => {
                          const newColors = [...(config.customColors || []), pendingColor];
                          updateConfig('customColors', newColors);
                          toast.success('Color added', { duration: 1000 });
                        }}
                      >
                        Add from Picker
                      </Button>
                      <Input
                        id="hexInput"
                        placeholder="#FF5733"
                        className="h-11 font-mono text-sm font-semibold shadow-md flex-1 min-w-0"
                        maxLength={7}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.currentTarget;
                            let color = input.value.trim().toUpperCase();
                            if (!color.startsWith('#')) color = '#' + color;
                            if (/^#[0-9A-F]{6}$/i.test(color)) {
                              const newColors = [...(config.customColors || []), color];
                              updateConfig('customColors', newColors);
                              input.value = '';
                              toast.success('Color added', { duration: 1000 });
                            } else {
                              toast.error('Invalid hex (use RRGGBB)', { duration: 1500 });
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="h-11 px-5 font-medium flex-none"
                        onClick={() => {
                          const input = document.getElementById('hexInput') as HTMLInputElement;
                          let color = input.value.trim().toUpperCase();
                          if (!color.startsWith('#')) color = '#' + color;
                          if (/^#[0-9A-F]{6}$/i.test(color)) {
                            const newColors = [...(config.customColors || []), color];
                            updateConfig('customColors', newColors);
                            input.value = '';
                            toast.success('Color added', { duration: 1000 });
                          } else {
                            toast.error('Invalid hex (use RRGGBB)', { duration: 1500 });
                          }
                        }}
                      >
                        # Add Hex
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium italic bg-accent/20 rounded-md px-3 py-2 border border-border/30">
                      Click color squares to edit • Changes auto-save • Click "Done" to finish
                    </p>
                  </div>
                </div>
              </div>
            )}
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
