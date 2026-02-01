/**
 * TabletPortraitLayout - Master-detail layout for tablets in portrait mode
 * 
 * Features:
 * - Chart always visible (55% height)
 * - Scrollable config panel below (45% height)
 * - Sticky toolbar for view mode switching
 * - Tab-based navigation for Data/Style/Config
 * - No drawers - inline content
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, Table2, Pencil, Maximize2, Database, Palette, Settings, Share2, Sparkles, Shuffle, RefreshCw, Download, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic, mobileSpring, tabContentVariants } from '@/lib/animations';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChartData, ChartConfig, Project } from '@/types/chart';
import { ProjectVersion } from '@/hooks/useAutosave';
import ChartRenderer, { ChartRendererRef } from '@/components/charts/ChartRenderer';
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

type ViewMode = 'chart' | 'table' | 'edit';
type ConfigTab = 'data' | 'style' | 'config' | 'export';

export interface TabletPortraitLayoutProps {
  // Data
  project: Project;
  data: ChartData;
  config: ChartConfig;
  displayData: ChartData;
  chartRef: React.RefObject<ChartRendererRef>;
  hasData: boolean;

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

  className?: string;
}

export function TabletPortraitLayout({
  project,
  data,
  config,
  displayData,
  chartRef,
  hasData,
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
  className,
}: TabletPortraitLayoutProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [activeTab, setActiveTab] = useState<ConfigTab>('data');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      triggerHaptic('light');
      setViewMode(mode);
    },
    []
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      triggerHaptic('light');
      setActiveTab(tab as ConfigTab);
    },
    []
  );

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">{config.title || 'My Chart'}</span>
            <Badge variant="outline" className="capitalize">{config.type}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(false)}>
            Exit Fullscreen
          </Button>
        </div>
        <div className="flex-1 p-4">
          {hasData && (
            <div className="w-full h-full bg-card rounded-xl border shadow-sm p-4">
              <ChartRenderer ref={chartRef} data={displayData} config={config} />
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (viewMode) {
      case 'table':
        return <DataTableView data={displayData} />;
      case 'edit':
        return (
          <DatasetEditor 
            data={data} 
            onUpdate={(newData) => onDataCleanUpdate(newData)} 
          />
        );
      default:
        return hasData ? (
          <ChartRenderer ref={chartRef} data={displayData} config={config} />
        ) : (
          <NoDataEmptyState 
            onUpload={() => setActiveTab('data')} 
            onCreateTable={() => {
              const blankData = {
                labels: ['Row 1', 'Row 2', 'Row 3', 'Row 4', 'Row 5'],
                datasets: [
                  { id: 'ds-1', name: 'Dataset 1', values: [0, 0, 0, 0, 0], color: '#6366f1', visible: true },
                  { id: 'ds-2', name: 'Dataset 2', values: [0, 0, 0, 0, 0], color: '#8b5cf6', visible: true },
                ],
              };
              onCreateEmpty(blankData);
              setViewMode('edit');
            }}
          />
        );
    }
  };

  return (
    <div className={cn('tablet-portrait-container', className)}>
      {/* Chart Area (55%) */}
      <div className="tablet-portrait-chart">
        <div className="h-full flex flex-col p-3">
          <div className="flex-1 bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden p-4">
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  className="h-full"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {renderMainContent()}
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Sticky Toolbar */}
      <div className="tablet-portrait-toolbar">
        <div className="view-mode-toggle">
          <button
            className={cn('view-mode-button', viewMode === 'chart' ? 'active' : 'inactive')}
            onClick={() => handleViewModeChange('chart')}
          >
            <BarChart2 className="w-4 h-4 mr-1.5" />
            Chart
          </button>
          <button
            className={cn('view-mode-button', viewMode === 'table' ? 'active' : 'inactive')}
            onClick={() => handleViewModeChange('table')}
          >
            <Table2 className="w-4 h-4 mr-1.5" />
            Table
          </button>
          <button
            className={cn('view-mode-button', viewMode === 'edit' ? 'active' : 'inactive')}
            onClick={() => handleViewModeChange('edit')}
          >
            <Pencil className="w-4 h-4 mr-1.5" />
            Edit
          </button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => setIsFullscreen(true)}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Configuration Panel (45%) */}
      <div className="tablet-portrait-controls">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
          <TabsList className="tablet-portrait-tabs h-12 w-full rounded-none justify-start p-0 bg-card/50">
            <TabsTrigger value="data" className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Database className="w-4 h-4 mr-2" />Data
            </TabsTrigger>
            <TabsTrigger value="style" className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Palette className="w-4 h-4 mr-2" />Style
            </TabsTrigger>
            <TabsTrigger value="config" className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Settings className="w-4 h-4 mr-2" />Config
            </TabsTrigger>
            <TabsTrigger value="export" className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Share2 className="w-4 h-4 mr-2" />Export
            </TabsTrigger>
          </TabsList>

          <div className="tablet-portrait-tab-content flex-1">
            <ScrollArea className="h-full">
              <TabsContent value="data" className="mt-0 p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Project Name</label>
                  <Input value={project.name} onChange={(e) => onProjectNameChange(e.target.value)} placeholder="Enter project name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Chart Type</label>
                  <ChartTypeSelector selected={config.type} onSelect={onChartTypeChange} />
                </div>
                <FileDropzone onFileSelect={onFileSelect} onUrlImport={onUrlImport} onCreateEmpty={onCreateEmpty} />
                <div className="grid grid-cols-2 gap-2">
                  {onOpenTemplates && <Button variant="outline" onClick={onOpenTemplates}><Sparkles className="h-4 w-4 mr-1.5" />Templates</Button>}
                  <Button variant="outline" onClick={onLoadSample}><Database className="h-4 w-4 mr-1.5" />Sample</Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={onRandomData}><Shuffle className="h-4 w-4 mr-1.5" />Random</Button>
                  <Button variant="outline" onClick={onClearData} disabled={!hasData}><RefreshCw className="h-4 w-4 mr-1.5" />Clear</Button>
                </div>
                <QuickStats data={displayData} />
                {hasData && <DatasetPanel datasets={data.datasets} onUpdate={onDataUpdate} />}
                <DataCleaningPanel data={data} onUpdate={onDataCleanUpdate} />
                <InteractiveFilters data={data} onFilteredDataChange={onFilteredDataChange} />
              </TabsContent>
              
              <TabsContent value="style" className="mt-0 p-4">
                {hasData ? (
                  <DatasetPanel datasets={data.datasets} onUpdate={onDataUpdate} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Palette className="h-16 w-16 mx-auto mb-3 opacity-30" />
                    <p>Add data to customize styles</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="config" className="mt-0 p-4 space-y-4">
                <ChartConfigAccordion config={config} onUpdate={onConfigUpdate} />
                {versions && onRestoreVersion && onDeleteVersion && onClearVersions && (
                  <VersionHistory 
                    versions={versions}
                    onRestore={onRestoreVersion}
                    onDelete={onDeleteVersion}
                    onClearAll={onClearVersions}
                    lastSaved={lastSaved ?? null}
                    isSaving={isSaving ?? false}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="export" className="mt-0 p-4 space-y-3">
                <Button onClick={onExport} className="w-full h-14 gap-2" disabled={!hasData}>
                  <Download className="h-5 w-5" />Export as PNG
                </Button>
                <Button variant="outline" onClick={onExportSVG} className="w-full h-14 gap-2" disabled={!hasData}>
                  <ImageIcon className="h-5 w-5" />Export as SVG
                </Button>
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default TabletPortraitLayout;
