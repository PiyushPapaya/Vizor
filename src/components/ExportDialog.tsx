import { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Download, Image, FileImage, FileCode, Palette, 
  Maximize, Settings2, Eye, Check, Copy, Loader2,
  Monitor, Smartphone, Presentation, Printer, Twitter, Linkedin,
  Instagram, Pipette, RefreshCw, AlertCircle, X
} from 'lucide-react';
import { ChartConfig, ChartData } from '@/types/chart';
import { ExportService, ExportOptions, EXPORT_PRESETS, ExportPreset } from '@/lib/export-service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chartElement: HTMLElement | null;
  chartConfig: ChartConfig;
  chartData: ChartData;
}

type ExportFormat = 'png' | 'svg' | 'pdf' | 'json';
type BackgroundType = 'transparent' | 'white' | 'dark' | 'theme' | 'custom';

interface ExportSettings {
  format: ExportFormat;
  backgroundType: BackgroundType;
  customColor: string;
  width: number;
  height: number;
  quality: number;
  scale: number;
  includeTitle: boolean;
  customTitle: string;
  customSubtitle: string;
  titleColor: string;
  titleFontSize: number;
  titlePosition: 'top' | 'center' | 'bottom' | 'none';
  preset: string | null;
}

const DEFAULT_SETTINGS: ExportSettings = {
  format: 'png',
  backgroundType: 'white',
  customColor: '#1e293b',
  width: 1200,
  height: 800,
  quality: 1.0,
  scale: 2,
  includeTitle: true,
  customTitle: '',
  customSubtitle: '',
  titleColor: '#1e293b',
  titleFontSize: 24,
  titlePosition: 'top',
  preset: null,
};

const BACKGROUND_OPTIONS: { value: BackgroundType; label: string; color: string; icon: string }[] = [
  { value: 'transparent', label: 'Transparent', color: 'transparent', icon: '' },
  { value: 'white', label: 'White', color: '#ffffff', icon: '' },
  { value: 'dark', label: 'Dark', color: '#1e293b', icon: '' },
  { value: 'theme', label: 'Match Theme', color: 'theme', icon: '' },
  { value: 'custom', label: 'Custom', color: 'custom', icon: '' },
];

const FORMAT_INFO: Record<ExportFormat, { name: string; description: string; best: string }> = {
  png: { 
    name: 'PNG Image', 
    description: 'High-quality raster image with transparency support',
    best: 'Best for: Web, presentations, social media'
  },
  svg: { 
    name: 'SVG Vector', 
    description: 'Scalable vector graphics, perfect for any size',
    best: 'Best for: Print, high-resolution displays, editing'
  },
  pdf: { 
    name: 'PDF Document', 
    description: 'Universal document format with embedded fonts',
    best: 'Best for: Reports, printing, sharing'
  },
  json: { 
    name: 'JSON Data', 
    description: 'Raw chart data and configuration export',
    best: 'Best for: Backup, data transfer, API integration'
  },
};

export function ExportDialog({
  open,
  onOpenChange,
  chartElement,
  chartConfig,
  chartData,
}: ExportDialogProps) {
  const [settings, setSettings] = useState<ExportSettings>(DEFAULT_SETTINGS);
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'format' | 'title' | 'appearance' | 'size'>('format');
  const previewRef = useRef<HTMLDivElement>(null);

  // Detect current theme
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  // Initialize custom title from config
  useEffect(() => {
    if (open && chartConfig.title) {
      setSettings(prev => ({
        ...prev,
        customTitle: prev.customTitle || chartConfig.title || '',
        customSubtitle: prev.customSubtitle || chartConfig.subtitle || '',
      }));
    }
  }, [open, chartConfig.title, chartConfig.subtitle]);

  // Get actual background color based on settings
  const getBackgroundColor = useCallback((): string | null => {
    switch (settings.backgroundType) {
      case 'transparent':
        return 'transparent';
      case 'white':
        return '#ffffff';
      case 'dark':
        return '#1e293b';
      case 'theme':
        return isDarkMode ? '#1e293b' : '#ffffff';
      case 'custom':
        return settings.customColor;
      default:
        return '#ffffff';
    }
  }, [settings.backgroundType, settings.customColor, isDarkMode]);

  // Generate preview when settings change
  const generatePreview = useCallback(async () => {
    if (!chartElement || !open) {
      return;
    }
    
    // Verify chart has SVG content
    const svg = chartElement.querySelector('svg');
    if (!svg) {
      console.error('No SVG found in chart element');
      toast.error('Chart not ready for export. Please wait for the chart to load.');
      return;
    }
    
    setIsGeneratingPreview(true);
    try {
      const backgroundColor = getBackgroundColor();
      
      // Generate preview (captures full chart)
      const previewDataUrl = await ExportService.generatePreview(chartElement, {
        backgroundColor,
        quality: 0.8,
        scale: 1,
      });
      
      setPreviewUrl(previewDataUrl);
    } catch (error) {
      console.error('Preview generation failed:', error);
      toast.error('Failed to generate preview. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [chartElement, open, getBackgroundColor]);

  // Regenerate preview when settings change
  useEffect(() => {
    if (open && settings.format !== 'json') {
      const timeoutId = setTimeout(generatePreview, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [open, settings.backgroundType, settings.customColor, generatePreview]);

  // Reset settings when dialog opens
  useEffect(() => {
    if (open) {
      setSettings(DEFAULT_SETTINGS);
      setPreviewUrl(null);
    }
  }, [open]);

  // Apply preset
  const applyPreset = (presetKey: string) => {
    const preset = EXPORT_PRESETS[presetKey as keyof typeof EXPORT_PRESETS];
    if (preset) {
      setSettings(prev => ({
        ...prev,
        width: preset.width,
        height: preset.height,
        scale: preset.scale || 2,
        quality: preset.quality || 1.0,
        preset: presetKey,
      }));
    }
  };

  // Handle export
  const handleExport = async () => {
    if (!chartElement) {
      toast.error('No chart to export. Please wait for the chart to load.');
      return;
    }

    // Verify chart has content
    const svg = chartElement.querySelector('svg');
    if (!svg) {
      toast.error('Chart not ready. Please wait for the chart to fully render.');
      return;
    }

    setIsExporting(true);
    try {
      const backgroundColor = getBackgroundColor();
      const filename = `${chartConfig.title || 'chart'}`;

      switch (settings.format) {
        case 'png':
          await ExportService.exportToPNG(chartElement, {
            filename: `${filename}.png`,
            backgroundColor,
            width: settings.width,
            height: settings.height,
            quality: settings.quality,
            scale: settings.scale,
          });
          break;
        case 'svg':
          ExportService.exportToSVG(chartElement, {
            filename: `${filename}.svg`,
            backgroundColor,
          });
          break;
        case 'pdf':
          await ExportService.exportToPDF(chartElement, {
            filename: `${filename}.pdf`,
            backgroundColor,
            quality: settings.quality,
          });
          break;
        case 'json':
          ExportService.exportToJSON(chartData, chartConfig, {
            filename: `${filename}.json`,
          });
          break;
      }
      
      toast.success(`Exported as ${settings.format.toUpperCase()}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to clipboard
  const handleCopyToClipboard = async () => {
    if (!chartElement) return;
    
    setIsExporting(true);
    try {
      const backgroundColor = getBackgroundColor();
      await ExportService.copyToClipboard(chartElement, { backgroundColor });
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    } finally {
      setIsExporting(false);
    }
  };

  // Preview background style
  const previewBgStyle = (): React.CSSProperties => {
    const bgColor = getBackgroundColor();
    if (!bgColor) {
      return {
        backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      };
    }
    return { backgroundColor: bgColor };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border/30">
          <DialogTitle className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Download className="w-4 h-4 text-primary" />
            </div>
            Export Chart
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground/80">
            Customize your export settings and preview before downloading
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 px-6 pb-6">
          {/* Preview Section */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Eye className="w-4 h-4" />
                Preview
              </Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={generatePreview}
                disabled={isGeneratingPreview || settings.format === 'json'}
              >
                <RefreshCw className={cn("w-4 h-4 mr-1", isGeneratingPreview && "animate-spin")} />
                Refresh
              </Button>
            </div>
            
            <div 
              ref={previewRef}
              className="relative aspect-[4/3] rounded-xl border border-border/30 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              style={previewBgStyle()}
            >
              {settings.format === 'json' ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                  <div className="text-center space-y-2">
                    <FileCode className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">JSON export has no visual preview</p>
                  </div>
                </div>
              ) : isGeneratingPreview ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <div className="text-center space-y-2">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Generating preview...</p>
                  </div>
                </div>
              ) : previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Export preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Image className="w-12 h-12 mx-auto text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Preview will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick info about current settings */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {settings.width} × {settings.height}
              </Badge>
              <Badge variant="secondary">
                {FORMAT_INFO[settings.format].name}
              </Badge>
              {settings.format === 'png' && (
                <Badge variant="secondary">
                  {Math.round(settings.quality * 100)}% quality
                </Badge>
              )}
              {settings.preset && (
                <Badge variant="default">
                  {EXPORT_PRESETS[settings.preset as keyof typeof EXPORT_PRESETS]?.name}
                </Badge>
              )}
            </div>

            {/* Dark mode warning */}
            {isDarkMode && settings.backgroundType === 'white' && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-xs">
                  You're in dark mode but exporting with a white background. 
                  Consider using "Match Theme" or "Dark" for consistency.
                </p>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="w-full lg:w-1/2 space-y-4 mt-4 lg:mt-0">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="grid w-full grid-cols-4 bg-muted/40 p-1 rounded-xl">
                <TabsTrigger value="format" className="gap-1 text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <FileImage className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Format</span>
                </TabsTrigger>
                <TabsTrigger value="title" className="gap-1 text-xs">
                  <Settings2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Title</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="gap-1 text-xs">
                  <Palette className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Style</span>
                </TabsTrigger>
                <TabsTrigger value="size" className="gap-1 text-xs">
                  <Maximize className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Size</span>
                </TabsTrigger>
              </TabsList>

              {/* Format Tab */}
              <TabsContent value="format" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(FORMAT_INFO) as ExportFormat[]).map((format) => (
                    <button
                      key={format}
                      onClick={() => setSettings(prev => ({ ...prev, format }))}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all duration-200 hover:border-primary/40 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
                        settings.format === format 
                          ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30 shadow-[0_2px_8px_rgba(0,0,0,0.06)]" 
                          : "border-border/40 hover:bg-muted/30"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {format === 'png' && <Image className="w-4 h-4" />}
                        {format === 'svg' && <FileCode className="w-4 h-4" />}
                        {format === 'pdf' && <FileImage className="w-4 h-4" />}
                        {format === 'json' && <FileCode className="w-4 h-4" />}
                        <span className="font-medium text-sm">{format.toUpperCase()}</span>
                        {settings.format === format && (
                          <Check className="w-4 h-4 ml-auto text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {FORMAT_INFO[format].best}
                      </p>
                    </button>
                  ))}
                </div>

                {settings.format === 'png' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Quality</Label>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(settings.quality * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[settings.quality]}
                      onValueChange={([v]) => setSettings(prev => ({ ...prev, quality: v }))}
                      min={0.5}
                      max={1}
                      step={0.1}
                    />
                  </div>
                )}
              </TabsContent>

              {/* Title Customization Tab */}
              <TabsContent value="title" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Include Title</Label>
                    <Switch
                      checked={settings.includeTitle}
                      onCheckedChange={(checked) => setSettings(prev => ({ 
                        ...prev, 
                        includeTitle: checked 
                      }))}
                    />
                  </div>
                  
                  {settings.includeTitle && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Main Title</Label>
                        <Input
                          value={settings.customTitle}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            customTitle: e.target.value 
                          }))}
                          placeholder={chartConfig.title || "Chart Title"}
                          className="font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Subtitle (Optional)</Label>
                        <Input
                          value={settings.customSubtitle}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            customSubtitle: e.target.value 
                          }))}
                          placeholder="Add a subtitle..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Title Color</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={settings.titleColor}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              titleColor: e.target.value 
                            }))}
                            className="w-12 h-10 rounded-lg border cursor-pointer"
                          />
                          <Input
                            value={settings.titleColor}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              titleColor: e.target.value 
                            }))}
                            placeholder="#000000"
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                        {/* Quick color presets */}
                        <div className="flex gap-2">
                          {['#1e293b', '#000000', '#ffffff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                            <button
                              key={color}
                              onClick={() => setSettings(prev => ({ ...prev, titleColor: color }))}
                              className={cn(
                                "w-8 h-8 rounded-md border-2 transition-all hover:scale-110",
                                settings.titleColor === color ? "border-primary ring-2 ring-primary/30" : "border-border"
                              )}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">Title Size</Label>
                          <span className="text-xs font-medium">{settings.titleFontSize}px</span>
                        </div>
                        <Slider
                          value={[settings.titleFontSize]}
                          onValueChange={([v]) => setSettings(prev => ({ ...prev, titleFontSize: v }))}
                          min={16}
                          max={48}
                          step={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Title Position</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { value: 'top', label: 'Top' },
                            { value: 'center', label: 'Center' },
                            { value: 'bottom', label: 'Bottom' },
                            { value: 'none', label: 'Hidden' },
                          ].map(pos => (
                            <button
                              key={pos.value}
                              onClick={() => setSettings(prev => ({ 
                                ...prev, 
                                titlePosition: pos.value as any 
                              }))}
                              className={cn(
                                "p-2 text-xs rounded-lg border transition-all",
                                settings.titlePosition === pos.value
                                  ? "border-primary bg-primary/10 text-primary font-medium"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Background Color</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {BACKGROUND_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSettings(prev => ({ 
                          ...prev, 
                          backgroundType: option.value 
                        }))}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all hover:border-primary/50",
                          settings.backgroundType === option.value 
                            ? "border-primary bg-primary/5 ring-1 ring-primary" 
                            : "border-border"
                        )}
                      >
                        <div 
                          className="w-8 h-8 rounded-md border flex items-center justify-center"
                          style={option.value === 'transparent' 
                            ? { 
                                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                backgroundSize: '8px 8px',
                                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                              }
                            : option.value === 'theme'
                            ? { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }
                            : option.value === 'custom'
                            ? { backgroundColor: settings.customColor }
                            : { backgroundColor: option.color }
                          }
                        >
                          {settings.backgroundType === option.value && (
                            <Check className={cn(
                              "w-4 h-4",
                              option.value === 'white' || (option.value === 'theme' && !isDarkMode)
                                ? "text-gray-800" 
                                : "text-white"
                            )} />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground text-center leading-tight">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {settings.backgroundType === 'custom' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Custom Color</Label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <input
                          type="color"
                          value={settings.customColor}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            customColor: e.target.value 
                          }))}
                          className="w-12 h-10 rounded-lg border cursor-pointer"
                        />
                      </div>
                      <Input
                        value={settings.customColor}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          customColor: e.target.value 
                        }))}
                        placeholder="#000000"
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Size Tab */}
              <TabsContent value="size" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Presets</Label>
                  <ScrollArea className="h-[180px]">
                    <div className="grid grid-cols-2 gap-2 pr-4">
                      {Object.entries(EXPORT_PRESETS).map(([key, preset]) => (
                        <button
                          key={key}
                          onClick={() => applyPreset(key)}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-lg border text-left transition-all hover:border-primary/50",
                            settings.preset === key 
                              ? "border-primary bg-primary/5 ring-1 ring-primary" 
                              : "border-border"
                          )}
                        >
                          {preset.icon === 'monitor' && <Monitor className="w-4 h-4 shrink-0" />}
                          {preset.icon === 'presentation' && <Presentation className="w-4 h-4 shrink-0" />}
                          {preset.icon === 'printer' && <Printer className="w-4 h-4 shrink-0" />}
                          {preset.icon === 'twitter' && <Twitter className="w-4 h-4 shrink-0" />}
                          {preset.icon === 'linkedin' && <Linkedin className="w-4 h-4 shrink-0" />}
                          {preset.icon === 'instagram' && <Instagram className="w-4 h-4 shrink-0" />}
                          {preset.icon === 'smartphone' && <Smartphone className="w-4 h-4 shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{preset.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {preset.width}×{preset.height}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Custom Dimensions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Width (px)</Label>
                      <Input
                        type="number"
                        value={settings.width}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          width: parseInt(e.target.value) || 800,
                          preset: null 
                        }))}
                        min={200}
                        max={4000}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Height (px)</Label>
                      <Input
                        type="number"
                        value={settings.height}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          height: parseInt(e.target.value) || 600,
                          preset: null 
                        }))}
                        min={200}
                        max={4000}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Scale (for sharpness)</Label>
                    <span className="text-sm text-muted-foreground">{settings.scale}x</span>
                  </div>
                  <Slider
                    value={[settings.scale]}
                    onValueChange={([v]) => setSettings(prev => ({ ...prev, scale: v }))}
                    min={1}
                    max={4}
                    step={0.5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher scale = sharper image but larger file size
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-border/30 p-4 flex flex-col sm:flex-row gap-3 justify-between bg-muted/20 backdrop-blur-sm">
          <Button 
            variant="outline" 
            onClick={handleCopyToClipboard}
            disabled={isExporting || settings.format === 'json'}
            className="rounded-lg border-border/40 hover:border-primary/30"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
          <div className="flex gap-2.5">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting} className="rounded-lg px-6 font-semibold shadow-sm shadow-primary/10 hover:shadow-md hover:shadow-primary/15 transition-all">
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export {settings.format.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ExportDialog;
