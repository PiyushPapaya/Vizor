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
}: MobileAppInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('chart');
  const [chartViewMode, setChartViewMode] = useState<ChartViewMode>('chart');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const hasData = data.datasets.length > 0;

  // Fullscreen chart view
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {config.type}
            </Badge>
            <span className="text-sm font-semibold truncate max-w-[150px]">
              {config.title || 'My Chart'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(false)}
          >
            Exit
          </Button>
        </div>
        <div className="flex-1 p-4">
          {hasData && <ChartRenderer ref={chartRef} data={displayData} config={config} />}
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
              {/* Chart Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b bg-card/50">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <h2 className="text-sm font-semibold truncate">
                    {config.title || 'My Chart'}
                  </h2>
                  <Badge variant="outline" className="text-[10px] px-1.5">
                    {config.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {/* View Mode Toggle */}
                  <div className="flex bg-muted/60 rounded-md p-0.5">
                    <Button
                      variant={chartViewMode === 'chart' ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setChartViewMode('chart')}
                    >
                      <BarChart2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant={chartViewMode === 'table' ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setChartViewMode('table')}
                    >
                      <Database className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {hasData && chartViewMode === 'chart' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setIsFullscreen(true)}
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Chart Content */}
              <div className="flex-1 overflow-hidden p-3">
                <ErrorBoundary>
                  {!hasData ? (
                    <NoDataEmptyState onUpload={() => setActiveTab('data')} />
                  ) : chartViewMode === 'chart' ? (
                    <div className="w-full h-full">
                      <ChartRenderer ref={chartRef} data={displayData} config={config} />
                    </div>
                  ) : chartViewMode === 'table' ? (
                    <div className="h-full overflow-auto">
                      <DataTableView data={displayData} />
                    </div>
                  ) : (
                    <div className="h-full overflow-auto">
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
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" onClick={onLoadSample} className="h-11">
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Sample
                  </Button>
                  <Button variant="outline" onClick={onRandomData} className="h-11">
                    <Shuffle className="h-4 w-4 mr-1.5" />
                    Random
                  </Button>
                  <Button variant="outline" onClick={onClearData} className="h-11">
                    <RefreshCw className="h-4 w-4" />
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
                    className="w-full h-12 gap-2"
                    disabled={!hasData}
                  >
                    <Download className="h-5 w-5" />
                    Export as PNG
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={onExportSVG}
                    className="w-full h-12 gap-2"
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

        {/* Bottom Tab Navigation - Fixed */}
        <div className="border-t bg-background/95 backdrop-blur-lg safe-area-bottom">
          <TabsList className="w-full h-14 grid grid-cols-5 bg-transparent rounded-none p-0">
            <TabsTrigger 
              value="chart" 
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none"
            >
              <BarChart2 className="h-5 w-5" />
              <span className="text-[10px] font-medium">Chart</span>
            </TabsTrigger>
            <TabsTrigger 
              value="data"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none"
            >
              <Database className="h-5 w-5" />
              <span className="text-[10px] font-medium">Data</span>
            </TabsTrigger>
            <TabsTrigger 
              value="style"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none"
            >
              <Palette className="h-5 w-5" />
              <span className="text-[10px] font-medium">Style</span>
            </TabsTrigger>
            <TabsTrigger 
              value="config"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none"
            >
              <Settings className="h-5 w-5" />
              <span className="text-[10px] font-medium">Config</span>
            </TabsTrigger>
            <TabsTrigger 
              value="export"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none"
              disabled={!hasData}
            >
              <Share2 className="h-5 w-5" />
              <span className="text-[10px] font-medium">Export</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
});

MobileAppInterface.displayName = 'MobileAppInterface';

export default MobileAppInterface;
