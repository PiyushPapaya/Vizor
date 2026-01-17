import { memo, useMemo, useCallback } from 'react';
import { Drawer } from 'vaul';
import { ChartData, ChartConfig, Project } from '@/types/chart';
import { ProjectVersion } from '@/hooks/useAutosave';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Database, Palette, Settings, ChevronDown, Sparkles, 
  Shuffle, RefreshCw, Share2, Download, Image
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import ChartTypeSelector from '@/components/charts/ChartTypeSelector';
import DatasetPanel from '@/components/charts/DatasetPanel';
import ChartConfigAccordion from '@/components/charts/ChartConfigAccordion';
import FileDropzone from '@/components/FileDropzone';
import QuickStats from '@/components/QuickStats';
import DataCleaningPanel from '@/components/DataCleaningPanel';
import InteractiveFilters from '@/components/InteractiveFilters';
import VersionHistory from '@/components/VersionHistory';

type DrawerTab = 'data' | 'style' | 'config' | 'share';

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: DrawerTab;
  
  // Data
  project: Project;
  data: ChartData;
  config: ChartConfig;
  displayData: ChartData;
  
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

const MobileDrawer = memo(({
  open,
  onOpenChange,
  activeTab,
  project,
  data,
  config,
  displayData,
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
  versions = [],
  onRestoreVersion,
  onDeleteVersion,
  onClearVersions,
  lastSaved,
  isSaving,
  onExport,
  onExportSVG,
}: MobileDrawerProps) => {
  const { config: layoutConfig, isVeryTallScreen } = useResponsiveLayout();
  
  // Determine drawer height based on tab
  const drawerHeight = useMemo(() => {
    if (activeTab === 'share') return isVeryTallScreen ? '50vh' : '55vh';
    return layoutConfig.drawerHeights[activeTab] || '70vh';
  }, [activeTab, layoutConfig.drawerHeights, isVeryTallScreen]);

  const getTabIcon = useCallback((tab: DrawerTab) => {
    switch (tab) {
      case 'data': return <Database className="h-5 w-5 text-primary" />;
      case 'style': return <Palette className="h-5 w-5 text-primary" />;
      case 'config': return <Settings className="h-5 w-5 text-primary" />;
      case 'share': return <Share2 className="h-5 w-5 text-primary" />;
    }
  }, []);

  const getTabTitle = useCallback((tab: DrawerTab) => {
    switch (tab) {
      case 'data': return 'Data';
      case 'style': return 'Style';
      case 'config': return 'Configuration';
      case 'share': return 'Share & Export';
    }
  }, []);

  const hasData = data.datasets.length > 0;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content 
          className={cn(
            "bg-background flex flex-col rounded-t-[20px] fixed bottom-0 left-0 right-0 z-50",
            "shadow-[0_-4px_20px_rgba(0,0,0,0.15)]",
            "animate-mobile-slide-up"
          )}
          style={{ maxHeight: drawerHeight }}
        >
          {/* Drawer Handle */}
          <div className="p-3 bg-background rounded-t-[20px] flex-shrink-0 border-b border-border/40">
            <div className="mobile-drawer-handle" />
            
            {/* Header */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                {getTabIcon(activeTab)}
                <h3 className="text-base font-semibold">{getTabTitle(activeTab)}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 touch-target-secondary"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-4 pb-8 space-y-4">
              {activeTab === 'data' && (
                <>
                  {/* Project Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Project Name</label>
                    <Input
                      value={project.name}
                      onChange={(e) => onProjectNameChange(e.target.value)}
                      placeholder="Enter project name"
                      className="mobile-input"
                    />
                  </div>
                  
                  {/* Chart Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Chart Type</label>
                    <ChartTypeSelector selected={config.type} onSelect={onChartTypeChange} />
                  </div>

                  {/* File Dropzone */}
                  <FileDropzone 
                    onFileSelect={onFileSelect} 
                    onUrlImport={onUrlImport} 
                    onCreateEmpty={onCreateEmpty} 
                  />
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={onLoadSample} 
                      className="mobile-btn gap-1.5"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Sample</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={onRandomData} 
                      className="mobile-btn gap-1.5"
                    >
                      <Shuffle className="h-4 w-4" />
                      <span>Random</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={onClearData} 
                      className="mobile-btn"
                    >
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
                </>
              )}

              {activeTab === 'style' && (
                <>
                  {hasData ? (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Dataset Colors</label>
                      <DatasetPanel datasets={data.datasets} onUpdate={onDataUpdate} />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Palette className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Add data to customize chart styles</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'config' && (
                <>
                  <ChartConfigAccordion config={config} onUpdate={onConfigUpdate} />
                  
                  {/* Version History */}
                  {versions && onRestoreVersion && onDeleteVersion && onClearVersions && (
                    <div className="pt-4 border-t space-y-4">
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
                </>
              )}

              {activeTab === 'share' && (
                <>
                  <div className="space-y-3">
                    <Button 
                      onClick={onExport}
                      className="w-full mobile-btn-lg gap-2"
                      disabled={!hasData}
                    >
                      <Download className="h-5 w-5" />
                      Export as PNG
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={onExportSVG}
                      className="w-full mobile-btn-lg gap-2"
                      disabled={!hasData}
                    >
                      <Image className="h-5 w-5" />
                      Export as SVG
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          More options
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground text-center py-4">
                      More export formats and sharing options coming soon!
                    </p>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
});

MobileDrawer.displayName = 'MobileDrawer';

export default MobileDrawer;
