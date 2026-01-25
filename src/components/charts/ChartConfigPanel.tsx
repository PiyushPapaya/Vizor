import { ChartConfig, ChartType, COLOR_SCHEMES } from '@/types/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Type, Palette, Settings2, RotateCcw, Sparkles, TrendingUp, Minimize2, 
  Search, Minus, Plus, PieChart, BarChart2, LineChart, Sliders
} from 'lucide-react';
import { useState, memo, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ChartConfigPanelProps {
  config: ChartConfig;
  onUpdate: (config: ChartConfig) => void;
}

// Quick preset configurations
const QUICK_PRESETS = {
  professional: {
    nameKey: 'config.preset.professional',
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
    nameKey: 'config.preset.vibrant',
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
    nameKey: 'config.preset.minimal',
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
  label: string;
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

function ChartConfigPanel({ config, onUpdate }: ChartConfigPanelProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingColor, setPendingColor] = useState<string>('#3B82F6');
  
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
  const updateConfig = (key: keyof ChartConfig, value: any) => {
    onUpdate({ ...config, [key]: value });
  };

  // Apply quick preset
  const applyPreset = (presetKey: keyof typeof QUICK_PRESETS) => {
    const preset = QUICK_PRESETS[presetKey];
    onUpdate({ ...config, ...preset.config, colorScheme: preset.config.colorScheme as ChartConfig['colorScheme'] });
    toast.success(t('config.presetApplied', { name: t(preset.nameKey) }), { duration: 1500 });
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
    toast.success(t('config.resetToDefaults'), { duration: 1500 });
  };

  // Determine which chart-specific options to show
  const chartTypeCategory = useMemo(() => {
    const type = config.type;
    if (['pie', 'donut', 'radialBar'].includes(type)) return 'pie';
    if (['bar', 'barHorizontal', 'waterfall', 'funnel'].includes(type)) return 'bar';
    if (['line', 'area', 'scatter', 'bubble'].includes(type)) return 'line';
    return 'other';
  }, [config.type]);

  // Filter settings based on search
  const isVisible = (terms: string[]) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return terms.some(term => term.toLowerCase().includes(query));
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder={t('config.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 pl-8 text-xs bg-muted/30"
        />
      </div>

      {/* Quick Presets */}
      {isVisible(['preset', 'quick', 'professional', 'vibrant', 'minimal']) && (
        <div className="space-y-2 p-2.5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10">
          <Label className="text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            {t('config.presets')}
          </Label>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.entries(QUICK_PRESETS).map(([key, preset]) => {
              const Icon = preset.icon;
              return (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  className="h-auto py-1.5 px-2 flex flex-col items-center gap-0.5 hover:bg-primary/10 hover:border-primary/30 transition-all"
                  onClick={() => applyPreset(key as keyof typeof QUICK_PRESETS)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-[10px]">{t(preset.nameKey)}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Configuration Tabs */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-8 bg-muted/50 p-0.5">
          <TabsTrigger value="basic" className="text-[11px] gap-1 h-7">
            <Type className="h-3 w-3" />
            {t('config.basic')}
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-[11px] gap-1 h-7">
            <Sliders className="h-3 w-3" />
            {t('config.advanced')}
          </TabsTrigger>
          <TabsTrigger value="colors" className="text-[11px] gap-1 h-7">
            <Palette className="h-3 w-3" />
            {t('config.colors')}
          </TabsTrigger>
        </TabsList>

        {/* BASIC TAB */}
        <TabsContent value="basic" className="mt-3 space-y-4">
          {/* Labels */}
          {isVisible(['title', 'label', 'axis', 'name']) && (
            <div className="space-y-2.5">
              <Label className="text-xs font-semibold text-muted-foreground">{t('config.labels')}</Label>
              <Input
                value={localTitle}
                onChange={(e) => {
                  setLocalTitle(e.target.value);
                  debouncedUpdate({ title: e.target.value });
                }}
                placeholder={t('config.chartTitle')}
                className="h-8 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={localXLabel}
                  onChange={(e) => {
                    setLocalXLabel(e.target.value);
                    debouncedUpdate({ xAxisLabel: e.target.value });
                  }}
                  placeholder={t('config.showXAxis')}
                  className="h-8 text-xs"
                />
                <Input
                  value={localYLabel}
                  onChange={(e) => {
                    setLocalYLabel(e.target.value);
                    debouncedUpdate({ yAxisLabel: e.target.value });
                  }}
                  placeholder={t('config.showYAxis')}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          )}

          {/* Display Options */}
          {isVisible(['legend', 'grid', 'tooltip', 'label', 'show', 'display']) && (
            <div className="space-y-2.5">
              <Label className="text-xs font-semibold text-muted-foreground">{t('config.display')}</Label>
              <ToggleGroup
                items={[
                  { key: 'showLegend', label: t('config.showLegend').replace('Show ', ''), tooltip: t('config.tooltip.showLegend') },
                  { key: 'showGrid', label: t('config.showGrid').replace('Show ', ''), tooltip: t('config.tooltip.showGrid') },
                  { key: 'showTooltip', label: t('config.showTooltip').replace('Show ', ''), tooltip: t('config.tooltip.showTooltip') },
                  { key: 'showDataLabels', label: t('config.showDataLabels').replace('Show ', ''), tooltip: t('config.tooltip.showDataLabels') },
                ]}
                config={config}
                onUpdate={updateConfig}
              />
            </div>
          )}

          {/* Legend Position (only show if legend is enabled) */}
          {config.showLegend && isVisible(['legend', 'position']) && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t('config.legendPosition')}</Label>
              <Select value={config.legendPosition ?? 'bottom'} onValueChange={(v) => updateConfig('legendPosition', v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">{t('config.position.top')}</SelectItem>
                  <SelectItem value="bottom">{t('config.position.bottom')}</SelectItem>
                  <SelectItem value="left">{t('config.position.left')}</SelectItem>
                  <SelectItem value="right">{t('config.position.right')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Behavior Toggles */}
          {isVisible(['animation', 'smooth', 'stack', 'behavior']) && (
            <div className="space-y-2.5">
              <Label className="text-xs font-semibold text-muted-foreground">{t('config.behavior')}</Label>
              <ToggleGroup
                items={[
                  { key: 'animated', label: t('config.animated'), tooltip: t('config.tooltip.animated') },
                  { key: 'smooth', label: t('config.smooth'), tooltip: t('config.tooltip.smooth') },
                  { key: 'stacked', label: t('config.stacked'), tooltip: t('config.tooltip.stacked') },
                  { key: 'sharedTooltip', label: t('config.sharedTooltip'), tooltip: t('config.tooltip.sharedTooltip') },
                ]}
                config={config}
                onUpdate={updateConfig}
              />
            </div>
          )}
        </TabsContent>

        {/* ADVANCED TAB */}
        <TabsContent value="advanced" className="mt-3 space-y-4">
          {/* Axis Options */}
          {isVisible(['axis', 'min', 'max', 'tick', 'format', 'rotation']) && (
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground">{t('config.axis')}</Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">{t('config.yAxisMin')}</Label>
                  <Input
                    type="number"
                    value={config.yAxisMin ?? ''}
                    onChange={(e) => updateConfig('yAxisMin', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Auto"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">{t('config.yAxisMax')}</Label>
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
                <Label className="text-xs text-muted-foreground">{t('config.axisFormat')}</Label>
                <Select value={config.axisFormat ?? 'number'} onValueChange={(v) => updateConfig('axisFormat', v)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="number">{t('config.format.number')} (1,234)</SelectItem>
                    <SelectItem value="currency">{t('config.format.currency')} ($1,234)</SelectItem>
                    <SelectItem value="percent">{t('config.format.percent')} (12%)</SelectItem>
                    <SelectItem value="compact">{t('config.format.compact')} (1.2K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <NumberInput
                label={t('config.xAxisRotation')}
                value={config.xAxisRotation ?? 0}
                onChange={(v) => updateConfig('xAxisRotation', v)}
                min={-90}
                max={90}
                step={15}
                suffix="°"
              />
            </div>
          )}

          {/* Grid Options (only show if grid is enabled) */}
          {config.showGrid && isVisible(['grid', 'style', 'dash', 'dot']) && (
            <div className="space-y-3 pt-3 border-t border-border/50">
              <Label className="text-xs font-semibold text-muted-foreground">{t('config.gridType')}</Label>
              <Select value={config.gridType ?? 'dashed'} onValueChange={(v) => updateConfig('gridType', v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">{t('config.gridStyle.solid')}</SelectItem>
                  <SelectItem value="dashed">{t('config.gridStyle.dashed')}</SelectItem>
                  <SelectItem value="dotted">{t('config.gridStyle.dotted')}</SelectItem>
                </SelectContent>
              </Select>
              <NumberInput
                label={t('config.gridOpacity')}
                value={config.gridOpacity ?? 30}
                onChange={(v) => updateConfig('gridOpacity', v)}
                min={5}
                max={100}
                step={5}
                suffix="%"
              />
            </div>
          )}

          {/* Chart-Specific: Pie/Donut */}
          {chartTypeCategory === 'pie' && isVisible(['pie', 'donut', 'angle', 'radius', 'inner']) && (
            <div className="space-y-3 pt-3 border-t border-border/50">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <PieChart className="h-3 w-3" />
                {t('config.pie.title')}
              </Label>
              <NumberInput
                label={t('config.pie.startAngle')}
                value={config.pieStartAngle ?? 0}
                onChange={(v) => updateConfig('pieStartAngle', v)}
                min={0}
                max={360}
                step={15}
                suffix="°"
              />
              <NumberInput
                label={t('config.pie.innerRadius')}
                value={config.pieInnerRadius ?? 0}
                onChange={(v) => updateConfig('pieInnerRadius', v)}
                min={0}
                max={90}
                step={5}
                suffix="%"
              />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t('config.pie.labelPosition')}</Label>
                <Select value={config.pieLabelPosition ?? 'outside'} onValueChange={(v) => updateConfig('pieLabelPosition', v)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inside">{t('config.pie.inside')}</SelectItem>
                    <SelectItem value="outside">{t('config.pie.outside')}</SelectItem>
                    <SelectItem value="none">{t('config.pie.none')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Chart-Specific: Bar */}
          {chartTypeCategory === 'bar' && isVisible(['bar', 'gap', 'spacing', 'category']) && (
            <div className="space-y-3 pt-3 border-t border-border/50">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <BarChart2 className="h-3 w-3" />
                {t('config.bar.title')}
              </Label>
              <NumberInput
                label={t('config.bar.gap')}
                value={config.barGap ?? 4}
                onChange={(v) => updateConfig('barGap', v)}
                min={0}
                max={50}
                step={2}
                suffix="%"
              />
              <NumberInput
                label={t('config.bar.categoryGap')}
                value={config.barCategoryGap ?? 20}
                onChange={(v) => updateConfig('barCategoryGap', v)}
                min={0}
                max={60}
                step={5}
                suffix="%"
              />
            </div>
          )}

          {/* Chart-Specific: Line/Area */}
          {chartTypeCategory === 'line' && isVisible(['line', 'point', 'fill', 'area', 'dot']) && (
            <div className="space-y-3 pt-3 border-t border-border/50">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <LineChart className="h-3 w-3" />
                {t('config.line.title')}
              </Label>
              <NumberInput
                label={t('config.line.pointSize')}
                value={config.pointSize ?? 4}
                onChange={(v) => updateConfig('pointSize', v)}
                min={0}
                max={12}
                suffix="px"
              />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t('config.line.pointStyle')}</Label>
                <Select value={config.pointStyle ?? 'circle'} onValueChange={(v) => updateConfig('pointStyle', v)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="circle">{t('config.line.pointStyles.circle')}</SelectItem>
                    <SelectItem value="square">{t('config.line.pointStyles.square')}</SelectItem>
                    <SelectItem value="diamond">{t('config.line.pointStyles.diamond')}</SelectItem>
                    <SelectItem value="triangle">{t('config.line.pointStyles.triangle')}</SelectItem>
                    <SelectItem value="none">{t('config.line.pointStyles.none')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {config.type === 'area' && (
                <NumberInput
                  label={t('config.line.fillOpacity')}
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
        </TabsContent>

        {/* COLORS TAB */}
        <TabsContent value="colors" className="mt-3 space-y-4">
          {/* Note about color scheme moved to Style tab */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground">
              💡 <span className="font-medium">Color scheme settings</span> have been moved to the <span className="font-semibold text-primary">Style</span> tab for easier access to visual controls.
            </p>
          </div>

          {/* Custom Color Editor */}
          {config.colorScheme === 'custom' && (
            <div className="space-y-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold">{t('config.customColors')}</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-xs px-2"
                  onClick={() => {
                    updateConfig('customColors', [...COLOR_SCHEMES.default]);
                    toast.success(t('config.resetToDefaults'));
                  }}
                >
                  {t('config.resetAllSettings').split(' ')[0]}
                </Button>
              </div>

              <div className="grid grid-cols-6 gap-2">
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
                          toast.error(t('config.needMinColors'));
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
                  className="h-8 w-12 rounded cursor-pointer"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs"
                  onClick={() => {
                    const newColors = [...(config.customColors || []), pendingColor];
                    updateConfig('customColors', newColors);
                    toast.success(t('config.colorAdded'));
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {t('config.addColor')}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full h-8 gap-2 text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
        onClick={resetToDefaults}
      >
        <RotateCcw className="h-3 w-3" />
        {t('config.resetAllSettings')}
      </Button>
    </div>
  );
}

export default memo(ChartConfigPanel);
