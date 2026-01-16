import { ChartConfig, ChartType, COLOR_SCHEMES } from '@/types/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Type, Palette, Settings2, RotateCcw, Sparkles, TrendingUp, Minimize2, 
  Search, Minus, Plus, PieChart, BarChart2, LineChart, Sliders,
  Eye, Play, Paintbrush, Ruler, Grid3X3, Target, Zap, FileText
} from 'lucide-react';
import { useState, memo, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import { toast } from 'sonner';

interface ChartConfigAccordionProps {
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

// Number input with +/- buttons (mobile-friendly)
function NumberInput({ 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  label,
  suffix = ''
}: { 
  value: number; 
  onChange: (v: number) => void; 
  min: number; 
  max: number; 
  step?: number;
  label: React.ReactNode;
  suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-xs text-muted-foreground flex-1">{label}</Label>
      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-background"
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-xs font-mono w-12 text-center font-semibold text-primary">
          {value}{suffix}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-background"
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// Toggle button group for display options
function ToggleGroup({ 
  items, 
  config, 
  onUpdate 
}: { 
  items: { key: keyof ChartConfig; label: string; tooltip: string }[];
  config: ChartConfig;
  onUpdate: (key: keyof ChartConfig, value: any) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(({ key, label, tooltip }) => (
        <Tooltip key={String(key)}>
          <TooltipTrigger asChild>
            <button
              onClick={() => onUpdate(key, !config[key])}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                config[key] 
                  ? "bg-primary/10 border-primary/30 text-primary" 
                  : "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/50"
              )}
            >
              <span>{label}</span>
              <div className={cn(
                "w-2 h-2 rounded-full transition-colors",
                config[key] ? "bg-primary" : "bg-muted-foreground/30"
              )} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

// Section definitions for accordion
const SECTIONS = [
  { id: 'quick-presets', title: 'Quick Presets', icon: Zap, defaultOpen: false },
  { id: 'basic-info', title: 'Basic Information', icon: FileText, defaultOpen: true },
  { id: 'colors', title: 'Colors & Theme', icon: Palette, defaultOpen: false },
  { id: 'display', title: 'Display Options', icon: Eye, defaultOpen: false },
  { id: 'animation', title: 'Animation & Behavior', icon: Play, defaultOpen: false },
  { id: 'style', title: 'Style & Appearance', icon: Paintbrush, defaultOpen: false },
  { id: 'axes', title: 'Axes Configuration', icon: Ruler, defaultOpen: false },
  { id: 'grid', title: 'Grid Configuration', icon: Grid3X3, defaultOpen: false },
  { id: 'chart-specific', title: 'Chart-Specific Options', icon: Target, defaultOpen: false },
];

function ChartConfigAccordion({ config, onUpdate }: ChartConfigAccordionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingColor, setPendingColor] = useState<string>('#3B82F6');
  
  // Expanded sections - load from localStorage or use defaults
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const saved = localStorage.getItem('dataviz-expanded-sections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['basic-info'];
      }
    }
    return ['basic-info'];
  });

  // Save expanded sections to localStorage
  useEffect(() => {
    localStorage.setItem('dataviz-expanded-sections', JSON.stringify(expandedSections));
  }, [expandedSections]);
  
  // Local state for debounced inputs
  const [localTitle, setLocalTitle] = useState(config.title);
  const [localXLabel, setLocalXLabel] = useState(config.xAxisLabel);
  const [localYLabel, setLocalYLabel] = useState(config.yAxisLabel);

  // Debounced auto-apply for text inputs
  const debouncedUpdate = useDebouncedCallback((updates: Partial<ChartConfig>) => {
    onUpdate({ ...config, ...updates });
  }, 500);

  // Sync local state when config changes externally
  useEffect(() => {
    setLocalTitle(config.title);
    setLocalXLabel(config.xAxisLabel);
    setLocalYLabel(config.yAxisLabel);
  }, [config.title, config.xAxisLabel, config.yAxisLabel]);

  // Immediate update for toggles and selects
  const updateConfig = useCallback((key: keyof ChartConfig, value: any) => {
    onUpdate({ ...config, [key]: value });
  }, [config, onUpdate]);

  // Apply quick preset
  const applyPreset = useCallback((presetKey: keyof typeof QUICK_PRESETS) => {
    const preset = QUICK_PRESETS[presetKey];
    onUpdate({ ...config, ...preset.config, colorScheme: preset.config.colorScheme as ChartConfig['colorScheme'] });
    toast.success(`${preset.name} preset applied`, { duration: 1500 });
  }, [config, onUpdate]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
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
      showXAxis: true,
      showYAxis: true,
      yAxisTickCount: 5,
      axisFormat: 'number',
      xAxisRotation: 0,
      pieStartAngle: 0,
      pieInnerRadius: 0,
      barGap: 4,
      barCategoryGap: 20,
      pointSize: 4,
      fillOpacity: 30,
    };
    onUpdate({ ...config, ...defaults });
    toast.success('Reset to defaults', { duration: 1500 });
  }, [config, onUpdate]);

  // Determine which chart-specific options to show
  const chartTypeCategory = useMemo(() => {
    const type = config.type;
    if (['pie', 'donut', 'radialBar'].includes(type)) return 'pie';
    if (['bar', 'barHorizontal', 'waterfall', 'funnel'].includes(type)) return 'bar';
    if (['line', 'area', 'scatter', 'bubble'].includes(type)) return 'line';
    return 'other';
  }, [config.type]);

  // Filter settings based on search
  const isVisible = useCallback((terms: string[]) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return terms.some(term => term.toLowerCase().includes(query));
  }, [searchQuery]);

  // Get sections that match search
  const matchingSections = useMemo(() => {
    if (!searchQuery) return [];
    
    const matches: string[] = [];
    
    // Check each section for search matches
    if (isVisible(['preset', 'quick', 'professional', 'vibrant', 'minimal'])) {
      matches.push('quick-presets');
    }
    if (isVisible(['title', 'label', 'axis', 'name', 'basic', 'chart title'])) {
      matches.push('basic-info');
    }
    if (isVisible(['color', 'scheme', 'theme', 'palette', 'custom'])) {
      matches.push('colors');
    }
    if (isVisible(['legend', 'grid', 'tooltip', 'label', 'show', 'display', 'values', 'data labels'])) {
      matches.push('display');
    }
    if (isVisible(['animation', 'smooth', 'stack', 'behavior', 'animate', 'stacked'])) {
      matches.push('animation');
    }
    if (isVisible(['stroke', 'width', 'radius', 'opacity', 'font', 'size', 'style', 'bar radius'])) {
      matches.push('style');
    }
    if (isVisible(['axis', 'min', 'max', 'tick', 'format', 'rotation', 'y-axis', 'x-axis'])) {
      matches.push('axes');
    }
    if (isVisible(['grid', 'dash', 'dot', 'solid', 'dashed', 'dotted', 'grid style', 'grid opacity'])) {
      matches.push('grid');
    }
    if (isVisible(['pie', 'donut', 'angle', 'inner radius', 'bar', 'gap', 'category', 'line', 'point', 'fill'])) {
      matches.push('chart-specific');
    }
    
    return matches;
  }, [searchQuery, isVisible]);

  // Auto-expand matching sections when searching
  useEffect(() => {
    if (searchQuery && matchingSections.length > 0) {
      setExpandedSections(prev => {
        const newSections = [...new Set([...prev, ...matchingSections])];
        return newSections;
      });
    }
  }, [searchQuery, matchingSections]);

  // Highlight matching text
  const highlightMatch = useCallback((text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-300/50 rounded px-0.5">{part}</mark> : part
    );
  }, [searchQuery]);

  // Check if chart-specific section should be shown
  const showChartSpecific = chartTypeCategory !== 'other';

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search all settings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 pl-8 text-xs bg-muted/30"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Minus className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Search Results Count */}
      {searchQuery && (
        <div className="text-xs text-muted-foreground px-2">
          Found in {matchingSections.length} section{matchingSections.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Accordion Sections */}
      <Accordion 
        type="multiple" 
        value={expandedSections}
        onValueChange={setExpandedSections}
        className="space-y-2"
      >
        {/* Quick Presets Section */}
        {isVisible(['preset', 'quick', 'professional', 'vibrant', 'minimal']) && (
          <AccordionItem value="quick-presets" className="border rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-primary/5">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{highlightMatch('Quick Presets')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="grid grid-cols-3 gap-1.5">
                {Object.entries(QUICK_PRESETS).map(([key, preset]) => {
                  const Icon = preset.icon;
                  return (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      className="h-auto py-2 px-2 flex flex-col items-center gap-1 hover:bg-primary/10 hover:border-primary/30 transition-all"
                      onClick={() => applyPreset(key as keyof typeof QUICK_PRESETS)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[11px]">{preset.name}</span>
                    </Button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Basic Information Section */}
        {isVisible(['title', 'label', 'axis', 'name', 'basic', 'chart title']) && (
          <AccordionItem value="basic-info" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">{highlightMatch('Basic Information')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="space-y-2.5">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{highlightMatch('Chart Title')}</Label>
                  <Input
                    value={localTitle}
                    onChange={(e) => {
                      setLocalTitle(e.target.value);
                      debouncedUpdate({ title: e.target.value });
                    }}
                    placeholder="Enter chart title"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{highlightMatch('X-Axis Label')}</Label>
                    <Input
                      value={localXLabel}
                      onChange={(e) => {
                        setLocalXLabel(e.target.value);
                        debouncedUpdate({ xAxisLabel: e.target.value });
                      }}
                      placeholder="X-Axis"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{highlightMatch('Y-Axis Label')}</Label>
                    <Input
                      value={localYLabel}
                      onChange={(e) => {
                        setLocalYLabel(e.target.value);
                        debouncedUpdate({ yAxisLabel: e.target.value });
                      }}
                      placeholder="Y-Axis"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Colors & Theme Section */}
        {isVisible(['color', 'scheme', 'theme', 'palette', 'custom']) && (
          <AccordionItem value="colors" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-medium">{highlightMatch('Colors & Theme')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="space-y-3">
                {/* Color Scheme Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{highlightMatch('Color Scheme')}</Label>
                  <Select value={config.colorScheme ?? 'default'} onValueChange={(v) => updateConfig('colorScheme', v)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(COLOR_SCHEMES).map((scheme) => (
                        <SelectItem key={scheme} value={scheme} className="capitalize">{scheme}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Preview for Non-Custom Schemes */}
                {config.colorScheme !== 'custom' && (
                  <div className="space-y-2 p-2 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Preview</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-[10px] px-2"
                        onClick={() => {
                          const currentColors = COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default;
                          updateConfig('customColors', [...currentColors]);
                          setTimeout(() => updateConfig('colorScheme', 'custom'), 50);
                        }}
                      >
                        Customize
                      </Button>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5">
                      {(COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default).slice(0, 6).map((color, i) => (
                        <div 
                          key={i}
                          className="w-full aspect-square rounded-md ring-1 ring-border/50 shadow-sm" 
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Color Editor */}
                {config.colorScheme === 'custom' && (
                  <div className="space-y-2 p-2 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold">{highlightMatch('Custom Colors')}</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[10px] px-2"
                        onClick={() => {
                          updateConfig('customColors', [...COLOR_SCHEMES.default]);
                          toast.success('Reset to defaults');
                        }}
                      >
                        Reset
                      </Button>
                    </div>

                    <div className="grid grid-cols-6 gap-1.5">
                      {(config.customColors?.length ? config.customColors : COLOR_SCHEMES.default).map((color, i) => (
                        <div key={i} className="relative group">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...(config.customColors || COLOR_SCHEMES.default)];
                              newColors[i] = e.target.value.toUpperCase();
                              updateConfig('customColors', newColors);
                            }}
                            className="w-full aspect-square rounded-md ring-1 ring-border hover:ring-primary cursor-pointer"
                            title={`Click to edit: ${color}`}
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if ((config.customColors?.length || 0) <= 3) {
                                toast.error('Need at least 3 colors');
                                return;
                              }
                              const newColors = [...(config.customColors || [])];
                              newColors.splice(i, 1);
                              updateConfig('customColors', newColors);
                            }}
                            className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add New Color */}
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <input
                        type="color"
                        value={pendingColor}
                        onChange={(e) => setPendingColor(e.target.value.toUpperCase())}
                        className="h-7 w-10 rounded cursor-pointer"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs"
                        onClick={() => {
                          const newColors = [...(config.customColors || []), pendingColor];
                          updateConfig('customColors', newColors);
                          toast.success('Color added');
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Color
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Display Options Section */}
        {isVisible(['legend', 'grid', 'tooltip', 'label', 'show', 'display', 'values', 'data labels']) && (
          <AccordionItem value="display" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{highlightMatch('Display Options')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="space-y-3">
                <ToggleGroup
                  items={[
                    { key: 'showLegend', label: 'Legend', tooltip: 'Show chart legend' },
                    { key: 'showGrid', label: 'Grid', tooltip: 'Show background grid' },
                    { key: 'showTooltip', label: 'Tooltips', tooltip: 'Show hover tooltips' },
                    { key: 'showDataLabels', label: 'Values', tooltip: 'Show data labels on chart' },
                  ]}
                  config={config}
                  onUpdate={updateConfig}
                />

                {/* Legend Position (only show if legend is enabled) */}
                {config.showLegend && (
                  <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <Label className="text-xs text-muted-foreground">{highlightMatch('Legend Position')}</Label>
                    <Select value={config.legendPosition ?? 'bottom'} onValueChange={(v) => updateConfig('legendPosition', v)}>
                      <SelectTrigger className="h-8 text-xs">
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
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Animation & Behavior Section */}
        {isVisible(['animation', 'smooth', 'stack', 'behavior', 'animate', 'stacked']) && (
          <AccordionItem value="animation" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">{highlightMatch('Animation & Behavior')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <ToggleGroup
                items={[
                  { key: 'animated', label: 'Animate', tooltip: 'Enable animations' },
                  { key: 'smooth', label: 'Smooth', tooltip: 'Smooth line curves' },
                  { key: 'stacked', label: 'Stacked', tooltip: 'Stack data series' },
                  { key: 'sharedTooltip', label: 'Shared Tip', tooltip: 'Show all values in tooltip' },
                ]}
                config={config}
                onUpdate={updateConfig}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Style & Appearance Section */}
        {isVisible(['stroke', 'width', 'radius', 'opacity', 'font', 'size', 'style', 'bar radius']) && (
          <AccordionItem value="style" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Paintbrush className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">{highlightMatch('Style & Appearance')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="space-y-3">
                <NumberInput
                  label={highlightMatch('Stroke Width')}
                  value={config.strokeWidth ?? 2}
                  onChange={(v) => updateConfig('strokeWidth', v)}
                  min={0.5}
                  max={6}
                  step={0.5}
                  suffix="px"
                />
                <NumberInput
                  label={highlightMatch('Bar Radius')}
                  value={config.barRadius ?? 4}
                  onChange={(v) => updateConfig('barRadius', v)}
                  min={0}
                  max={20}
                  suffix="px"
                />
                <NumberInput
                  label={highlightMatch('Opacity')}
                  value={config.opacity ?? 100}
                  onChange={(v) => updateConfig('opacity', v)}
                  min={20}
                  max={100}
                  step={5}
                  suffix="%"
                />
                <NumberInput
                  label={highlightMatch('Font Size')}
                  value={config.fontSize ?? 12}
                  onChange={(v) => updateConfig('fontSize', v)}
                  min={8}
                  max={18}
                  suffix="px"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Axes Configuration Section */}
        {isVisible(['axis', 'min', 'max', 'tick', 'format', 'rotation', 'y-axis', 'x-axis', 'show', 'hide']) && (
          <AccordionItem value="axes" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-cyan-500" />
                <span className="text-sm font-medium">{highlightMatch('Axes Configuration')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="space-y-3">
                {/* Axis Visibility Toggles */}
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border/50">
                  <button
                    onClick={() => updateConfig('showXAxis', !config.showXAxis)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                      config.showXAxis !== false
                        ? "bg-primary/10 border-primary/30 text-primary" 
                        : "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <span>{highlightMatch('Show X-Axis')}</span>
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      config.showXAxis !== false ? "bg-primary" : "bg-muted-foreground/30"
                    )} />
                  </button>
                  <button
                    onClick={() => updateConfig('showYAxis', !config.showYAxis)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                      config.showYAxis !== false
                        ? "bg-primary/10 border-primary/30 text-primary" 
                        : "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <span>{highlightMatch('Show Y-Axis')}</span>
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      config.showYAxis !== false ? "bg-primary" : "bg-muted-foreground/30"
                    )} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">{highlightMatch('Y-Axis Min')}</Label>
                    <Input
                      type="number"
                      value={config.yAxisMin ?? ''}
                      onChange={(e) => updateConfig('yAxisMin', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Auto"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">{highlightMatch('Y-Axis Max')}</Label>
                    <Input
                      type="number"
                      value={config.yAxisMax ?? ''}
                      onChange={(e) => updateConfig('yAxisMax', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Auto"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{highlightMatch('Number Format')}</Label>
                  <Select value={config.axisFormat ?? 'number'} onValueChange={(v) => updateConfig('axisFormat', v)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number">Number (1,234)</SelectItem>
                      <SelectItem value="currency">Currency ($1,234)</SelectItem>
                      <SelectItem value="percent">Percent (12%)</SelectItem>
                      <SelectItem value="compact">Compact (1.2K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <NumberInput
                  label={highlightMatch('X-Axis Rotation')}
                  value={config.xAxisRotation ?? 0}
                  onChange={(v) => updateConfig('xAxisRotation', v)}
                  min={-90}
                  max={90}
                  step={15}
                  suffix="°"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Grid Configuration Section */}
        {config.showGrid && isVisible(['grid', 'dash', 'dot', 'solid', 'dashed', 'dotted', 'grid style', 'grid opacity']) && (
          <AccordionItem value="grid" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">{highlightMatch('Grid Configuration')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{highlightMatch('Grid Style')}</Label>
                  <Select value={config.gridType ?? 'dashed'} onValueChange={(v) => updateConfig('gridType', v)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <NumberInput
                  label={highlightMatch('Grid Opacity')}
                  value={config.gridOpacity ?? 30}
                  onChange={(v) => updateConfig('gridOpacity', v)}
                  min={5}
                  max={100}
                  step={5}
                  suffix="%"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Chart-Specific Options Section */}
        {showChartSpecific && isVisible(['pie', 'donut', 'angle', 'inner radius', 'bar', 'gap', 'category', 'line', 'point', 'fill']) && (
          <AccordionItem value="chart-specific" className="border rounded-lg overflow-hidden bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-amber-500/5">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">
                  {chartTypeCategory === 'pie' && highlightMatch('Pie/Donut Options')}
                  {chartTypeCategory === 'bar' && highlightMatch('Bar Options')}
                  {chartTypeCategory === 'line' && highlightMatch('Line/Area Options')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              {/* Pie/Donut Options */}
              {chartTypeCategory === 'pie' && (
                <div className="space-y-3">
                  <NumberInput
                    label={highlightMatch('Start Angle')}
                    value={config.pieStartAngle ?? 0}
                    onChange={(v) => updateConfig('pieStartAngle', v)}
                    min={0}
                    max={360}
                    step={15}
                    suffix="°"
                  />
                  <NumberInput
                    label={highlightMatch('Inner Radius')}
                    value={config.pieInnerRadius ?? 0}
                    onChange={(v) => updateConfig('pieInnerRadius', v)}
                    min={0}
                    max={90}
                    step={5}
                    suffix="%"
                  />
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{highlightMatch('Label Position')}</Label>
                    <Select value={config.pieLabelPosition ?? 'outside'} onValueChange={(v) => updateConfig('pieLabelPosition', v)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inside">Inside</SelectItem>
                        <SelectItem value="outside">Outside</SelectItem>
                        <SelectItem value="none">Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Bar Options */}
              {chartTypeCategory === 'bar' && (
                <div className="space-y-3">
                  <NumberInput
                    label={highlightMatch('Bar Gap')}
                    value={config.barGap ?? 4}
                    onChange={(v) => updateConfig('barGap', v)}
                    min={0}
                    max={50}
                    step={2}
                    suffix="%"
                  />
                  <NumberInput
                    label={highlightMatch('Category Gap')}
                    value={config.barCategoryGap ?? 20}
                    onChange={(v) => updateConfig('barCategoryGap', v)}
                    min={0}
                    max={60}
                    step={5}
                    suffix="%"
                  />
                </div>
              )}

              {/* Line/Area Options */}
              {chartTypeCategory === 'line' && (
                <div className="space-y-3">
                  <NumberInput
                    label={highlightMatch('Point Size')}
                    value={config.pointSize ?? 4}
                    onChange={(v) => updateConfig('pointSize', v)}
                    min={0}
                    max={12}
                    suffix="px"
                  />
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{highlightMatch('Point Style')}</Label>
                    <Select value={config.pointStyle ?? 'circle'} onValueChange={(v) => updateConfig('pointStyle', v)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circle">Circle</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="diamond">Diamond</SelectItem>
                        <SelectItem value="triangle">Triangle</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {config.type === 'area' && (
                    <NumberInput
                      label={highlightMatch('Fill Opacity')}
                      value={config.fillOpacity ?? 30}
                      onChange={(v) => updateConfig('fillOpacity', v)}
                      min={0}
                      max={100}
                      step={5}
                      suffix="%"
                    />
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full h-8 gap-2 text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
        onClick={resetToDefaults}
      >
        <RotateCcw className="h-3 w-3" />
        Reset All Settings
      </Button>
    </div>
  );
}

export default memo(ChartConfigAccordion);
