/**
 * PhoneLandscapeLayout - Horizontal split layout for phones in landscape
 * 
 * Features:
 * - Chart (65%) + Controls (35%) horizontal split
 * - Compact header (40px)
 * - Icon-only tabs for Data/Style/Config
 * - Minimal chrome, maximum chart visibility
 * - Swipe gestures for tab navigation
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  BarChart2, 
  Table2, 
  Pencil, 
  Maximize2, 
  Minimize2,
  Database, 
  Palette, 
  Settings, 
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shuffle,
  RefreshCw,
  Download,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic, mobileSpring, swipeTabVariants, GESTURE_THRESHOLDS } from '@/lib/animations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const tabOrder: ConfigTab[] = ['data', 'style', 'config', 'export'];

export interface PhoneLandscapeLayoutProps {
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

export function PhoneLandscapeLayout({
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
}: PhoneLandscapeLayoutProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [activeTab, setActiveTab] = useState<ConfigTab>('data');
  const [tabDirection, setTabDirection] = useState(0);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      triggerHaptic('light');
      setViewMode(mode);
    },
    []
  );

  const handleTabChange = useCallback(
    (tab: ConfigTab) => {
      const currentIndex = tabOrder.indexOf(activeTab);
      const newIndex = tabOrder.indexOf(tab);
      setTabDirection(newIndex > currentIndex ? 1 : -1);
      triggerHaptic('light');
      setActiveTab(tab);
    },
    [activeTab]
  );

  const handleSwipe = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const currentIndex = tabOrder.indexOf(activeTab);
      
      if (info.offset.x < -GESTURE_THRESHOLDS.swipe && currentIndex < tabOrder.length - 1) {
        handleTabChange(tabOrder[currentIndex + 1]);
      } else if (info.offset.x > GESTURE_THRESHOLDS.swipe && currentIndex > 0) {
        handleTabChange(tabOrder[currentIndex - 1]);
      }
    },
    [activeTab, handleTabChange]
  );

  const toggleControls = useCallback(() => {
    triggerHaptic('light');
    setControlsCollapsed(!controlsCollapsed);
  }, [controlsCollapsed]);

  const renderMainContent = () => {
    switch (viewMode) {
      case 'table':
        return <DataTableView data={displayData} />;
      case 'edit':
        return <DatasetEditor data={data} onUpdate={(newData) => onDataUpdate(newData.datasets)} />;
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

  const tabIcons = {
    data: Database,
    style: Palette,
    config: Settings,
    export: Share2,
  };

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full w-full relative p-4">
          <div className="h-full bg-card rounded-xl border shadow-sm p-4">
            {hasData && <ChartRenderer ref={chartRef} data={displayData} config={config} />}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
          >
            <Minimize2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('phone-landscape-container', className)}>
      {/* Chart Area (65% or more when controls collapsed) */}
      <motion.div
        className={cn('h-full relative', controlsCollapsed ? 'w-[90%]' : 'w-[65%]')}
        animate={{ width: controlsCollapsed ? '90%' : '65%' }}
        transition={mobileSpring}
      >
        {/* Compact Header */}
        <div className="phone-landscape-header">
          <div className="flex gap-1">
            <button
              className={cn('h-8 w-8 rounded-lg flex items-center justify-center transition-colors', viewMode === 'chart' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted')}
              onClick={() => handleViewModeChange('chart')}
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <button
              className={cn('h-8 w-8 rounded-lg flex items-center justify-center transition-colors', viewMode === 'table' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted')}
              onClick={() => handleViewModeChange('table')}
            >
              <Table2 className="w-4 h-4" />
            </button>
            <button
              className={cn('h-8 w-8 rounded-lg flex items-center justify-center transition-colors', viewMode === 'edit' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted')}
              onClick={() => handleViewModeChange('edit')}
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-medium text-muted-foreground truncate max-w-[120px]">
            {project.name || 'Untitled'}
          </span>
          <button
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Chart Content */}
        <div className="h-[calc(100%-40px)] p-2">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                className="h-full bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden p-2"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </div>

        {/* Toggle controls button */}
        <button
          className={cn(
            'absolute top-1/2 -translate-y-1/2 z-10',
            'h-12 w-5 rounded-r-lg',
            'bg-card/90 backdrop-blur-sm border border-l-0 border-border/40',
            'flex items-center justify-center',
            controlsCollapsed ? 'right-0' : '-right-2.5'
          )}
          onClick={toggleControls}
        >
          {controlsCollapsed ? <ChevronLeft className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
        </button>
      </motion.div>

      {/* Controls Panel (35%) */}
      <AnimatePresence>
        {!controlsCollapsed && (
          <motion.div
            className="phone-landscape-controls"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '35%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={mobileSpring}
          >
            {/* Tab navigation - icon only */}
            <div className="phone-landscape-tabs">
              {tabOrder.map((tab) => {
                const Icon = tabIcons[tab];
                return (
                  <button
                    key={tab}
                    className={cn('phone-landscape-tab', activeTab === tab ? 'active' : 'inactive')}
                    onClick={() => handleTabChange(tab)}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </button>
                );
              })}
            </div>

            {/* Tab content with swipe */}
            <motion.div
              className="phone-landscape-tab-content phone-landscape-compact"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleSwipe}
            >
              <ScrollArea className="h-full">
                <AnimatePresence mode="wait" custom={tabDirection}>
                  <motion.div
                    key={activeTab}
                    custom={tabDirection}
                    variants={swipeTabVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-2 space-y-2"
                  >
                    {activeTab === 'data' && (
                      <>
                        <Input value={project.name} onChange={(e) => onProjectNameChange(e.target.value)} placeholder="Project name" className="h-9 text-sm" />
                        <ChartTypeSelector selected={config.type} onSelect={onChartTypeChange} />
                        <div className="grid grid-cols-2 gap-1">
                          <Button variant="outline" size="sm" onClick={onLoadSample}><Database className="h-3 w-3 mr-1" />Sample</Button>
                          <Button variant="outline" size="sm" onClick={onRandomData}><Shuffle className="h-3 w-3 mr-1" />Random</Button>
                        </div>
                        {hasData && <DatasetPanel datasets={data.datasets} onUpdate={onDataUpdate} />}
                      </>
                    )}
                    {activeTab === 'style' && hasData && <DatasetPanel datasets={data.datasets} onUpdate={onDataUpdate} />}
                    {activeTab === 'config' && <ChartConfigAccordion config={config} onUpdate={onConfigUpdate} />}
                    {activeTab === 'export' && (
                      <div className="space-y-2">
                        <Button onClick={onExport} className="w-full h-10" disabled={!hasData}><Download className="h-4 w-4 mr-2" />PNG</Button>
                        <Button variant="outline" onClick={onExportSVG} className="w-full h-10" disabled={!hasData}><ImageIcon className="h-4 w-4 mr-2" />SVG</Button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PhoneLandscapeLayout;
