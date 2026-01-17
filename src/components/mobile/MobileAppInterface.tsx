import { useState, useRef, memo } from 'react';
import { ChartData, ChartConfig, Project } from '@/types/chart';
import { ProjectVersion } from '@/hooks/useAutosave';
import ChartRenderer, { ChartRendererRef } from '@/components/charts/ChartRenderer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  BarChart2, Database, Palette, Settings, Share2, Maximize2,
  Sparkles, Shuffle, RefreshCw, Download, Image as ImageIcon
} from 'lucide-react';
import ChartTypeSelector from '@/components/charts/ChartTypeSelector';
import DatasetPanel from '@/components/charts/DatasetPanel';
import ChartConfigAccordion from '@/components/charts/ChartConfigAccordion';
import FileDropzone from '@/components/FileDropzone';
import QuickStats from '@/components/QuickStats';
import DataCleaningPanel from '@/components/DataCleaningPanel';
import InteractiveFilters from '@/components/InteractiveFilters';
import VersionHistory from '@/components/VersionHistory';
import DataTableView from '@/components/DataTableView';
import DatasetEditor from '@/components/DatasetEditor';
import ErrorBoundary from '@/components/ErrorBoundary';
import { NoDataEmptyState } from '@/components/EmptyState';

interface MobileAppInterfaceProps {
  // Data
  project: Project;
  data: ChartData;
  config: ChartConfig;
  displayData: ChartData;
  chartRef: React.RefObject<ChartRendererRef>;

  // Actions
  onProjectNameChange: (name: string) => void;
  onChartTypeChange: (type: string) => void;
  onFileSelect: (file: File) => void;
  onUrlImport: (data: ChartData) => void;
  onCreateEmpty: (data: ChartData) => void;
  onLoadSample: () => void;
  onRandomData: () => void;
  onClearData: () => void;
  onDataUpdate: (datasets: ChartData['datasets']) => void;
  onDataCleanUpdate: (data: ChartData) => void;
  onFilteredDataChange: (data: ChartData | null) => void;
  onConfigUpdate: (config: Partial<ChartConfig>) => void;
  
  // Version History
  versions?: ProjectVersion[];
  onRestoreVersion?: (id: string) => void;
  onDeleteVersion?: (id: string) => void;
  onClearVersions?: () => void;
  lastSaved?: Date | null;
  isSaving?: boolean;
  
  // Export
  onExport?: () => void;
  onExportSVG?: () => void;
  
  // Templates
  onOpenTemplates?: () => void;
}

type MobileTab = 'chart' | 'data' | 'style' | 'config' | 'export';
type ChartViewMode = 'chart' | 'table' | 'edit';

const MobileAppInterface = memo(({
  project,
  data,
  config,
  displayData,
  chartRef,
  onProjectNameChange,
  onChartTypeChange,
  onFileSelect,
  onUrlImport,
  onCreateEmpty,
  onLoadSample,
  onRandomData,
  onClearData,
  onDataUpdate,
  onDataCleanUpdate,
  onFilteredDataChange,
  onConfigUpdate,
  versions,
  onRestoreVersion,
  onDeleteVersion,
  onClearVersions,
  lastSaved,
  isSaving,
  onExport,
  onExportSVG,
  onOpenTemplates,
}: MobileAppInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('chart');
  const [chartViewMode, setChartViewMode] = useState<ChartViewMode>('chart');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const hasData = data.datasets.length > 0;

  // Fullscreen chart view - Enhanced for better visibility
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* Header with gradient and better spacing */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-card via-card/95 to-card shadow-sm">
          <div className="flex items-center gap-3">
            <BarChart2 className="h-5 w-5 text-primary" />
            <div>
              <span className="text-base font-semibold">
                {config.title || 'My Chart'}
              </span>
              <Badge variant="outline" className="ml-2 text-xs capitalize">
                {config.type}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(false)}
            className="h-9 px-4"
          >
            Exit Fullscreen
          </Button>
        </div>
        {/* Full chart area with proper padding */}
        <div className="flex-1 p-4 sm:p-6 bg-gradient-to-b from-background to-muted/20">
          {hasData && (
            <div className="w-full h-full bg-card rounded-xl border shadow-sm p-4">
              <ChartRenderer ref={chartRef} data={displayData} config={config} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MobileTab)} className="flex flex-col h-full">
        {/* Tab Content Area - Takes full height */}
        <div className="flex-1 overflow-hidden">
          {/* CHART TAB */}
          <TabsContent value="chart" className="h-full m-0 p-0">
            <div className="flex flex-col h-full">
              {/* Chart Header - Enhanced with gradient and better spacing */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-primary/5 via-card to-accent/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <BarChart2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <h2 className="text-sm font-semibold truncate">
                    {config.title || 'My Chart'}
                  </h2>
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 capitalize bg-primary/10 text-primary border-primary/20">
                    {config.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* View Mode Toggle - More prominent */}
                  <div className="flex bg-muted rounded-lg p-1 shadow-sm">
                    <Button
                      variant={chartViewMode === 'chart' ? 'secondary' : 'ghost'}
                      size="icon"
                      className={`h-8 w-8 transition-all rounded-md ${chartViewMode === 'chart' ? 'bg-background shadow-sm' : ''}`}
                      onClick={() => setChartViewMode('chart')}
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartViewMode === 'table' ? 'secondary' : 'ghost'}
                      size="icon"
                      className={`h-8 w-8 transition-all rounded-md ${chartViewMode === 'table' ? 'bg-background shadow-sm' : ''}`}
                      onClick={() => setChartViewMode('table')}
                    >
                      <Database className="h-4 w-4" />
                    </Button>
                  </div>
                  {hasData && chartViewMode === 'chart' && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                      onClick={() => setIsFullscreen(true)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Chart Content - Better padding and container */}
              <div className="flex-1 overflow-hidden p-3 sm:p-4 bg-gradient-to-b from-background to-muted/10">
                <ErrorBoundary>
                  {!hasData ? (
                    <NoDataEmptyState onUpload={() => setActiveTab('data')} />
                  ) : chartViewMode === 'chart' ? (
                    <div className="w-full h-full bg-card rounded-xl border shadow-sm p-3 sm:p-4">
                      <ChartRenderer ref={chartRef} data={displayData} config={config} />
                    </div>
                  ) : chartViewMode === 'table' ? (
                    <div className="h-full overflow-auto bg-card rounded-xl border shadow-sm">
                      <DataTableView data={displayData} />
                    </div>
                  ) : (
                    <div className="h-full overflow-auto bg-card rounded-xl border shadow-sm p-3">
                      <DatasetEditor 
                        data={data} 
                        onUpdate={(newData) => {
                          onDataUpdate(newData.datasets);
                        }} 
                      />
                    </div>
                  )}
                </ErrorBoundary>
              </div>
            </div>
          </TabsContent>

          {/* DATA TAB */}
          <TabsContent value="data" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4 pb-20">
                {/* Project Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Project Name</label>
                  <Input
                    value={project.name}
                    onChange={(e) => onProjectNameChange(e.target.value)}
                    placeholder="Enter project name"
                    className="h-11"
                  />
                </div>

                {/* Chart Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Chart Type</label>
                  <ChartTypeSelector selected={config.type} onSelect={onChartTypeChange} />
                </div>

                {/* File Upload */}
                <FileDropzone 
                  onFileSelect={onFileSelect} 
                  onUrlImport={onUrlImport} 
                  onCreateEmpty={onCreateEmpty} 
                />

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {onOpenTemplates && (
                    <Button variant="outline" onClick={onOpenTemplates} className="h-12 touch-target-critical">
                      <Sparkles className="h-4 w-4 mr-1.5" />
                      Templates
                    </Button>
                  )}
                  <Button variant="outline" onClick={onLoadSample} className="h-12 touch-target-critical">
                    <Database className="h-4 w-4 mr-1.5" />
                    Sample
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={onRandomData} className="h-12 touch-target-critical">
                    <Shuffle className="h-4 w-4 mr-1.5" />
                    Random
                  </Button>
                  <Button variant="outline" onClick={onClearData} className="h-12 touch-target-critical" disabled={!hasData}>
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                    Clear
                  </Button>
                </div>

                {/* Quick Stats */}
                <QuickStats data={displayData} />

                {/* Datasets */}
                {hasData && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Datasets</label>
                    <DatasetPanel datasets={data.datasets} onUpdate={onDataUpdate} />
                  </div>
                )}

                {/* Data Cleaning & Filters */}
                <div className="pt-4 border-t space-y-4">
                  <DataCleaningPanel data={data} onUpdate={onDataCleanUpdate} />
                  <InteractiveFilters data={data} onFilteredDataChange={onFilteredDataChange} />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* STYLE TAB */}
          <TabsContent value="style" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4 pb-20">
                {hasData ? (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Dataset Colors</label>
                    <DatasetPanel datasets={data.datasets} onUpdate={onDataUpdate} />
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Palette className="h-16 w-16 mx-auto mb-3 opacity-30" />
                    <p>Add data to customize styles</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* CONFIG TAB */}
          <TabsContent value="config" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4 pb-20">
                <ChartConfigAccordion config={config} onUpdate={onConfigUpdate} />
                
                {versions && onRestoreVersion && onDeleteVersion && onClearVersions && (
                  <div className="pt-4 border-t">
                    <VersionHistory 
                      versions={versions}
                      onRestore={onRestoreVersion}
                      onDelete={onDeleteVersion}
                      onClearAll={onClearVersions}
                      lastSaved={lastSaved ?? null}
                      isSaving={isSaving ?? false}
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* EXPORT TAB */}
          <TabsContent value="export" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4 pb-20">
                <div className="space-y-3">
                  <Button 
                    onClick={onExport}
                    className="w-full h-14 gap-2 touch-target-critical text-base font-semibold"
                    disabled={!hasData}
                  >
                    <Download className="h-5 w-5" />
                    Export as PNG
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={onExportSVG}
                    className="w-full h-14 gap-2 touch-target-critical text-base font-semibold"
                    disabled={!hasData}
                  >
                    <ImageIcon className="h-5 w-5" />
                    Export as SVG
                  </Button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Share Options
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center py-8">
                    More export formats and sharing options coming soon!
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>

        {/* Bottom Tab Navigation - Enhanced with better visuals */}
        <div className="border-t-2 border-border/50 bg-card/98 backdrop-blur-xl safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <TabsList className="w-full h-[68px] grid grid-cols-5 bg-transparent rounded-none p-1 gap-1">
            <TabsTrigger 
              value="chart" 
              className="flex-col gap-0.5 h-full rounded-xl data-[state=active]:bg-gradient-to-b data-[state=active]:from-primary/15 data-[state=active]:to-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <BarChart2 className="h-5 w-5" />
              <span className="text-[11px] font-semibold">Chart</span>
            </TabsTrigger>
            <TabsTrigger 
              value="data"
              className="flex-col gap-0.5 h-full rounded-xl data-[state=active]:bg-gradient-to-b data-[state=active]:from-primary/15 data-[state=active]:to-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <Database className="h-5 w-5" />
              <span className="text-[11px] font-semibold">Data</span>
            </TabsTrigger>
            <TabsTrigger 
              value="style"
              className="flex-col gap-0.5 h-full rounded-xl data-[state=active]:bg-gradient-to-b data-[state=active]:from-primary/15 data-[state=active]:to-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <Palette className="h-5 w-5" />
              <span className="text-[11px] font-semibold">Style</span>
            </TabsTrigger>
            <TabsTrigger 
              value="config"
              className="flex-col gap-0.5 h-full rounded-xl data-[state=active]:bg-gradient-to-b data-[state=active]:from-primary/15 data-[state=active]:to-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <Settings className="h-5 w-5" />
              <span className="text-[11px] font-semibold">Config</span>
            </TabsTrigger>
            <TabsTrigger 
              value="export"
              className="flex-col gap-0.5 h-full rounded-xl data-[state=active]:bg-gradient-to-b data-[state=active]:from-primary/15 data-[state=active]:to-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all disabled:opacity-40"
              disabled={!hasData}
            >
              <Share2 className="h-5 w-5" />
              <span className="text-[11px] font-semibold">Export</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
});

MobileAppInterface.displayName = 'MobileAppInterface';

export default MobileAppInterface;
