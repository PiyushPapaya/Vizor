import { useState, useRef, memo, useCallback, useEffect } from 'react';
import { ChartData, ChartConfig, Project } from '@/types/chart';
import { ProjectVersion } from '@/hooks/useAutosave';
import ChartRenderer, { ChartRendererRef } from '@/components/charts/ChartRenderer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2, Database, Palette, Settings, Share2, Maximize2,
  Sparkles, Shuffle, RefreshCw, Download, Image as ImageIcon,
  ChevronUp, X
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
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { MobileActionDock, MobileActionDockCompact, DrawerType } from '@/components/mobile/MobileActionDock';
import MobileChartTypeSelector, { MobileChartTypeSelectorCompact } from '@/components/mobile/MobileChartTypeSelector';
import MobileExportFlow from '@/components/mobile/MobileExportFlow';
import TabletPortraitLayout from '@/components/mobile/TabletPortraitLayout';
import PhoneLandscapeLayout from '@/components/mobile/PhoneLandscapeLayout';
import MobileStylePanel from '@/components/mobile/MobileStylePanel';
import { triggerHaptic, ANIMATION_TIMING, mobileSpring } from '@/lib/animations';
import { Drawer } from 'vaul';

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

// Drawer snap points for different states
const DRAWER_SNAP_POINTS = {
  collapsed: '64px',
  half: '50vh',
  expanded: '85vh',
};

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
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [drawerSnapPoint, setDrawerSnapPoint] = useState<string | number>(DRAWER_SNAP_POINTS.half);
  
  const { 
    isVeryTallScreen, 
    layoutMode, 
    isPhoneLandscape, 
    isTabletPortrait,
    getLayoutClasses 
  } = useResponsiveLayout();
  
  const hasData = data.datasets.length > 0;
  const layoutClasses = getLayoutClasses();

  // Handle action dock button press
  const handleActionPress = useCallback((category: DrawerType) => {
    triggerHaptic('selection');
    if (activeDrawer === category) {
      setActiveDrawer(null);
    } else {
      setActiveDrawer(category);
      setDrawerSnapPoint(DRAWER_SNAP_POINTS.half);
    }
  }, [activeDrawer]);

  // Handle export press
  const handleExportPress = useCallback(() => {
    triggerHaptic('light');
    setIsExportOpen(true);
  }, []);

  // Close drawer
  const handleDrawerClose = useCallback(() => {
    setActiveDrawer(null);
  }, []);

  // Render for tablet portrait mode (768-1023px in portrait)
  if (isTabletPortrait) {
    return (
      <TabletPortraitLayout
        project={project}
        data={data}
        config={config}
        displayData={displayData}
        chartRef={chartRef}
        hasData={hasData}
        onProjectNameChange={onProjectNameChange}
        onChartTypeChange={onChartTypeChange}
        onFileSelect={onFileSelect}
        onUrlImport={onUrlImport}
        onCreateEmpty={onCreateEmpty}
        onLoadSample={onLoadSample}
        onRandomData={onRandomData}
        onClearData={onClearData}
        onDataUpdate={onDataUpdate}
        onDataCleanUpdate={onDataCleanUpdate}
        onFilteredDataChange={onFilteredDataChange}
        onConfigUpdate={onConfigUpdate}
        versions={versions}
        onRestoreVersion={onRestoreVersion}
        onDeleteVersion={onDeleteVersion}
        onClearVersions={onClearVersions}
        lastSaved={lastSaved}
        isSaving={isSaving}
        onExport={onExport}
        onExportSVG={onExportSVG}
        onOpenTemplates={onOpenTemplates}
      />
    );
  }

  // Render for phone landscape mode
  if (isPhoneLandscape) {
    return (
      <PhoneLandscapeLayout
        project={project}
        data={data}
        config={config}
        displayData={displayData}
        chartRef={chartRef}
        hasData={hasData}
        onProjectNameChange={onProjectNameChange}
        onChartTypeChange={onChartTypeChange}
        onFileSelect={onFileSelect}
        onUrlImport={onUrlImport}
        onCreateEmpty={onCreateEmpty}
        onLoadSample={onLoadSample}
        onRandomData={onRandomData}
        onClearData={onClearData}
        onDataUpdate={onDataUpdate}
        onDataCleanUpdate={onDataCleanUpdate}
        onFilteredDataChange={onFilteredDataChange}
        onConfigUpdate={onConfigUpdate}
        versions={versions}
        onRestoreVersion={onRestoreVersion}
        onDeleteVersion={onDeleteVersion}
        onClearVersions={onClearVersions}
        lastSaved={lastSaved}
        isSaving={isSaving}
        onExport={onExport}
        onExportSVG={onExportSVG}
        onOpenTemplates={onOpenTemplates}
      />
    );
  }

  // Fullscreen chart view - Enhanced for better visibility
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* Header with gradient and better spacing */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-card via-card/95 to-card shadow-sm safe-area-top">
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
            onClick={() => {
              triggerHaptic('light');
              setIsFullscreen(false);
            }}
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

  const contentPaddingClass = isVeryTallScreen ? 'p-4 space-y-4' : 'p-3 space-y-3';
  const safeBottomPaddingClass = 'pb-[calc(6rem+env(safe-area-inset-bottom))]';

  // NEW: Mobile Portrait Layout with Action Dock and Drawers
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Chart Area - Always visible */}
      <div className="flex-1 flex flex-col min-h-0 pb-20">
        {/* Chart Header - Minimal, elegant */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b bg-card/50 backdrop-blur-sm safe-area-top">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <BarChart2 className="h-4 w-4 text-primary flex-shrink-0" />
            <h2 className="text-sm font-semibold truncate">
              {config.title || 'My Chart'}
            </h2>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize bg-primary/10 text-primary border-primary/20">
              {config.type}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle */}
            {hasData && (
              <>
                <Button
                  variant={chartViewMode === 'chart' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    triggerHaptic('selection');
                    setChartViewMode('chart');
                  }}
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={chartViewMode === 'table' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    triggerHaptic('selection');
                    setChartViewMode('table');
                  }}
                >
                  <Database className="h-3.5 w-3.5" />
                </Button>
                {chartViewMode === 'chart' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                      triggerHaptic('light');
                      setIsFullscreen(true);
                    }}
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chart Content - Fixed aspect ratio and proper sizing */}
        <div className="flex-1 p-3 overflow-hidden">
          <ErrorBoundary>
            {!hasData ? (
              <div className="h-full flex items-center justify-center">
                <NoDataEmptyState 
                  onUpload={() => setActiveDrawer('data')} 
                  onCreateTable={() => {
                    const blankData = {
                      labels: ['Row 1', 'Row 2', 'Row 3', 'Row 4', 'Row 5'],
                      datasets: [
                        { id: 'ds-1', name: 'Dataset 1', values: [0, 0, 0, 0, 0], color: '#6366f1', visible: true },
                        { id: 'ds-2', name: 'Dataset 2', values: [0, 0, 0, 0, 0], color: '#8b5cf6', visible: true },
                      ],
                    };
                    onCreateEmpty(blankData);
                    setChartViewMode('edit');
                  }}
                />
              </div>
            ) : chartViewMode === 'chart' ? (
              <div className="w-full h-full bg-card rounded-lg border shadow-sm p-2 sm:p-3">
                <ChartRenderer ref={chartRef} data={displayData} config={config} />
              </div>
            ) : chartViewMode === 'table' ? (
              <div className="h-full overflow-auto bg-card rounded-lg border shadow-sm">
                <DataTableView data={displayData} />
              </div>
            ) : (
              <div className="h-full overflow-auto bg-card rounded-lg border shadow-sm p-3">
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

      {/* Action Dock - New 3-button design */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur-lg safe-area-bottom">
        <div className="flex items-center justify-evenly gap-2 h-16 px-3">
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveDrawer(activeDrawer === 'data' ? null : 'data');
            }}
            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors min-w-[68px] flex-1 max-w-[90px] ${
              activeDrawer === 'data' ? 'bg-blue-500/10 text-blue-500' : 'text-muted-foreground'
            }`}
          >
            <Database className="h-5 w-5 flex-shrink-0" />
            <span className="text-[10px] font-medium whitespace-nowrap">Data</span>
          </button>
          
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveDrawer(activeDrawer === 'style' ? null : 'style');
            }}
            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors min-w-[68px] flex-1 max-w-[90px] ${
              activeDrawer === 'style' ? 'bg-purple-500/10 text-purple-500' : 'text-muted-foreground'
            }`}
          >
            <Palette className="h-5 w-5 flex-shrink-0" />
            <span className="text-[10px] font-medium whitespace-nowrap">Style</span>
          </button>
          
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveDrawer(activeDrawer === 'config' ? null : 'config');
            }}
            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors min-w-[68px] flex-1 max-w-[90px] ${
              activeDrawer === 'config' ? 'bg-orange-500/10 text-orange-500' : 'text-muted-foreground'
            }`}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span className="text-[10px] font-medium whitespace-nowrap">Config</span>
          </button>
          
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsExportOpen(true);
            }}
            className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors text-muted-foreground min-w-[68px] flex-1 max-w-[90px]"
            disabled={!hasData}
          >
            <Share2 className="h-5 w-5" />
            <span className="text-xs font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Data Drawer */}
      <AnimatePresence>
        {activeDrawer === 'data' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-16 z-50 bg-background rounded-t-3xl shadow-2xl border-t max-h-[75vh]"
          >
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
            
            <div className="flex items-center justify-between px-4 pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Database className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Data</h3>
                  <p className="text-[10px] text-muted-foreground">Import & manage datasets</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setActiveDrawer(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(75vh-80px)]">
              <div className={`${contentPaddingClass} ${safeBottomPaddingClass}`}>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Project Name</label>
                  <Input
                    value={project.name}
                    onChange={(e) => onProjectNameChange(e.target.value)}
                    placeholder="Enter project name"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Chart Type</label>
                  <ChartTypeSelector selected={config.type} onSelect={onChartTypeChange} />
                </div>

                <FileDropzone 
                  onFileSelect={onFileSelect} 
                  onUrlImport={onUrlImport} 
                  onCreateEmpty={onCreateEmpty} 
                />

                <div className="grid grid-cols-2 gap-2">
                  {onOpenTemplates && (
                    <Button variant="outline" onClick={onOpenTemplates} className="h-10">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Templates
                    </Button>
                  )}
                  <Button variant="outline" onClick={onLoadSample} className="h-10">
                    <Database className="h-3.5 w-3.5 mr-1.5" />
                    Sample
                  </Button>
                  <Button variant="outline" onClick={onRandomData} className="h-10">
                    <Shuffle className="h-3.5 w-3.5 mr-1.5" />
                    Random
                  </Button>
                  <Button variant="outline" onClick={onClearData} className="h-10" disabled={!hasData}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Clear
                  </Button>
                </div>

                {hasData && (
                  <>
                    <QuickStats data={displayData} />
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground">Datasets</label>
                      <DatasetPanel datasets={data.datasets} onUpdate={onDataUpdate} />
                    </div>
                    <DataCleaningPanel data={data} onUpdate={onDataCleanUpdate} />
                    <InteractiveFilters data={data} onFilteredDataChange={onFilteredDataChange} />
                  </>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style Drawer */}
      <AnimatePresence>
        {activeDrawer === 'style' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-16 z-50 bg-background rounded-t-3xl shadow-2xl border-t max-h-[65vh]"
          >
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
            
            <div className="flex items-center justify-between px-4 pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Palette className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Style</h3>
                  <p className="text-[10px] text-muted-foreground">Customize appearance</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setActiveDrawer(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(65vh-80px)]">
              <div className={`${contentPaddingClass} ${safeBottomPaddingClass}`}>
                {hasData ? (
                  <MobileStylePanel 
                    config={config}
                    onConfigUpdate={onConfigUpdate}
                    data={data}
                    onDataUpdate={onDataUpdate}
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Palette className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Add data to customize styles</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Config Drawer */}
      <AnimatePresence>
        {activeDrawer === 'config' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-16 z-50 bg-background rounded-t-3xl shadow-2xl border-t max-h-[75vh]"
          >
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
            
            <div className="flex items-center justify-between px-4 pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Settings className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Configuration</h3>
                  <p className="text-[10px] text-muted-foreground">Chart settings & options</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setActiveDrawer(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(75vh-80px)]">
              <div className={`${contentPaddingClass} ${safeBottomPaddingClass}`}>
                <ChartConfigAccordion config={config} onUpdate={onConfigUpdate} />
                
                {versions && onRestoreVersion && onDeleteVersion && onClearVersions && (
                  <div className="pt-4 border-t mt-4">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Flow */}
      <MobileExportFlow
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        chartRef={chartRef}
        onExportPNG={onExport}
        onExportSVG={onExportSVG}
        chartTitle={config.title || 'My Chart'}
        hasData={hasData}
      />
    </div>
  );
});

MobileAppInterface.displayName = 'MobileAppInterface';

export default MobileAppInterface;
