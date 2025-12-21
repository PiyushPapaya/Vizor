import { useState, useRef, useCallback, useMemo, memo, useEffect } from 'react';
import { toast } from 'sonner';
import { ChartData, ChartConfig, Project, ChartAnnotation } from '@/types/chart';
import { ChartTemplate } from '@/lib/templates';
import { parseFile, generateSampleData, generateRandomData } from '@/lib/data-parser';
import { saveProject, createNewProject } from '@/lib/project-storage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutosave } from '@/hooks/useAutosave';
import { trackEvent } from '@/lib/analytics';
import { updateMetaTags, SEO_CONFIGS } from '@/lib/seo';
import { Drawer } from 'vaul';
import AppHeader from '@/components/layout/AppHeader';
import ChartRenderer, { ChartRendererRef } from '@/components/charts/ChartRenderer';
import ChartTypeSelector from '@/components/charts/ChartTypeSelector';
import DatasetPanel from '@/components/charts/DatasetPanel';
import ChartConfigPanel from '@/components/charts/ChartConfigPanel';
import FileDropzone from '@/components/FileDropzone';
import ProjectsDialog from '@/components/ProjectsDialog';
import KeyboardShortcutsDialog from '@/components/KeyboardShortcutsDialog';
import DataTableView from '@/components/DataTableView';
import DatasetEditor from '@/components/DatasetEditor';
import QuickStats from '@/components/QuickStats';
import DataCleaningPanel from '@/components/DataCleaningPanel';
import InteractiveFilters from '@/components/InteractiveFilters';
import ChartAnnotations from '@/components/ChartAnnotations';
import VersionHistory from '@/components/VersionHistory';
import TemplateGallery from '@/components/TemplateGallery';
import DataConnector from '@/components/DataConnector';
import ErrorBoundary from '@/components/ErrorBoundary';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import { LoadingState } from '@/components/LoadingState';
import { NoDataEmptyState } from '@/components/EmptyState';
import { DataPreviewDialog } from '@/components/DataPreviewDialog';
import { HelpDialog } from '@/components/HelpDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { 
  Database, Settings, Palette, Sparkles, RefreshCw, 
  Shuffle, Table2, BarChart2, Wand2, Edit3, ChevronUp, Plus
} from 'lucide-react';

// Memoized components for performance
const MemoizedChartTypeSelector = memo(ChartTypeSelector);
const MemoizedDatasetPanel = memo(DatasetPanel);
const MemoizedChartConfigPanel = memo(ChartConfigPanel);
const MemoizedQuickStats = memo(QuickStats);
const MemoizedDataCleaningPanel = memo(DataCleaningPanel);
const MemoizedInteractiveFilters = memo(InteractiveFilters);
const MemoizedChartAnnotations = memo(ChartAnnotations);
const MemoizedVersionHistory = memo(VersionHistory);

export default function Index() {
  const chartRef = useRef<ChartRendererRef>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [dataConnectorOpen, setDataConnectorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'edit'>('chart');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [previewData, setPreviewData] = useState<{ data: ChartData; fileName: string } | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'data' | 'style' | 'config'>('data');
  
  const [project, setProject] = useState<Project>(() => createNewProject());
  const [data, setData] = useState<ChartData>(() => project.data);
  const [filteredData, setFilteredData] = useState<ChartData | null>(null);
  const [config, setConfig] = useState<ChartConfig>(() => project.config);
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);
  
  // Simplified history
  const [history, setHistory] = useState<{ data: ChartData; config: ChartConfig }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('Vizor-onboarding-completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
      trackEvent('onboarding_started');
    }
    
    // Update SEO meta tags for app
    updateMetaTags(SEO_CONFIGS.app);
  }, []);

  // Autosave hook
  const { 
    versions, 
    lastSaved, 
    isSaving, 
    manualSave, 
    restoreVersion, 
    deleteVersion, 
    clearVersions 
  } = useAutosave(
    { ...project, data, config: { ...config, annotations } },
    (p) => saveProject(p),
    true
  );

  // Sync annotations with config
  useEffect(() => {
    setConfig(c => ({ ...c, annotations }));
  }, [annotations]);

  const pushHistory = useCallback((newData: ChartData, newConfig: ChartConfig) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), { data: newData, config: newConfig }].slice(-20));
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [historyIndex]);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const parsedData = await parseFile(file);
      // Show preview dialog instead of immediately importing
      setPreviewData({ data: parsedData, fileName: file.name });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse file');
    }
  }, []);

  const handleUrlImport = useCallback(async (parsedData: ChartData) => {
    setPreviewData({ data: parsedData, fileName: 'URL Import' });
  }, []);

  const handleConfirmImport = useCallback(() => {
    if (!previewData) return;
    setData(previewData.data);
    setFilteredData(null);
    pushHistory(previewData.data, config);
    toast.success(`Imported ${previewData.data.datasets.length} dataset(s)`);
    setPreviewData(null);
    trackEvent('data_imported', { datasets: previewData.data.datasets.length });
  }, [previewData, config, pushHistory]);

  const handleSave = useCallback(() => {
    manualSave();
    toast.success('Saved');
  }, [manualSave]);

  const handleNew = useCallback(() => {
    const newProject = createNewProject();
    setProject(newProject);
    setData(newProject.data);
    setFilteredData(null);
    setConfig(newProject.config);
    setAnnotations([]);
    setHistory([]);
    setHistoryIndex(-1);
    toast.success('New project');
  }, []);

  const handleExport = useCallback(async () => {
    const dataUrl = await chartRef.current?.exportToPNG();
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${config.title || 'chart'}.png`;
      a.click();
      toast.success('Exported PNG');
    }
  }, [config.title]);

  const handleExportSVG = useCallback(() => {
    const svgData = chartRef.current?.exportToSVG();
    if (svgData) {
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.title || 'chart'}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Exported SVG');
    }
  }, [config.title]);

  const handleLoadProject = useCallback((loadedProject: Project) => {
    setProject(loadedProject);
    setData(loadedProject.data);
    setFilteredData(null);
    setConfig(loadedProject.config);
    setAnnotations(loadedProject.config.annotations || []);
    setHistory([]);
    setHistoryIndex(-1);
    toast.success(`Loaded: ${loadedProject.name}`);
  }, []);

  const handleRestoreVersion = useCallback((versionId: string) => {
    const restored = restoreVersion(versionId);
    if (restored) {
      setProject(restored);
      setData(restored.data);
      setFilteredData(null);
      setConfig(restored.config);
      setAnnotations(restored.config.annotations || []);
      toast.success('Version restored');
    }
  }, [restoreVersion]);

  const updateProjectName = useCallback((name: string) => {
    setProject(prev => ({ ...prev, name }));
    setConfig(prev => ({ ...prev, title: name }));
  }, []);

  const handleLoadSampleData = useCallback(() => {
    const sampleData = generateSampleData();
    setData(sampleData);
    setFilteredData(null);
    pushHistory(sampleData, config);
    toast.success('Sample loaded');
  }, [config, pushHistory]);

  const handleRandomData = useCallback(() => {
    const randomData = generateRandomData(8, 3);
    setData(randomData);
    setFilteredData(null);
    pushHistory(randomData, config);
    toast.success('Random data');
  }, [config, pushHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setData(prev.data);
      setConfig(prev.config);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setData(next.data);
      setConfig(next.config);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.toggle('dark');
  }, []);

  const shortcuts = useMemo(() => [
    { key: 's', ctrl: true, action: () => { handleSave(); toast.success('💾 Saved'); }, description: 'Save project' },
    { key: 'n', ctrl: true, action: () => { handleNew(); toast.success('📄 New project'); }, description: 'New project' },
    { key: 'e', ctrl: true, action: () => { handleExport(); toast.success('📥 Exporting...'); }, description: 'Export PNG' },
    { key: 'o', ctrl: true, action: () => { setProjectsOpen(true); toast.info('📁 Projects'); }, description: 'Open projects' },
    { key: 'z', ctrl: true, action: () => { handleUndo(); toast.info('↶ Undo'); }, description: 'Undo' },
    { key: 'z', ctrl: true, shift: true, action: () => { handleRedo(); toast.info('↷ Redo'); }, description: 'Redo' },
    { key: 'y', ctrl: true, action: () => { handleRedo(); toast.info('↷ Redo'); }, description: 'Redo (alternative)' },
    { key: 'd', ctrl: true, action: () => { toggleTheme(); toast.success('🌓 Theme toggled'); }, description: 'Toggle theme' },
    { key: 't', ctrl: true, action: () => { setTemplatesOpen(true); toast.info('🎨 Templates'); }, description: 'Templates' },
    { key: 'i', ctrl: true, action: () => { setDataConnectorOpen(true); toast.info('📊 Import data'); }, description: 'Import data' },
    { key: ',', ctrl: true, action: () => { setShowOnboarding(true); toast.info('⚙️ Settings'); }, description: 'Settings/Tutorial' },
    { key: '/', ctrl: true, action: () => { setHelpOpen(true); toast.info('❓ Help'); }, description: 'Help' },
    { key: '?', action: () => { setShortcutsOpen(true); toast.info('⌨️ Shortcuts'); }, description: 'Show shortcuts' },
  ], [handleSave, handleNew, handleExport, handleUndo, handleRedo, toggleTheme]);

  useKeyboardShortcuts(shortcuts);

  const handleConfigUpdate = useCallback((newConfig: ChartConfig) => {
    setConfig(newConfig);
    pushHistory(data, newConfig);
  }, [data, pushHistory]);
  
  const handleDataUpdate = useCallback((datasets: typeof data.datasets) => {
    const newData = { ...data, datasets };
    setData(newData);
    setFilteredData(null);
    pushHistory(newData, config);
  }, [data, config, pushHistory]);
  
  const handleClearData = useCallback(() => {
    setData({ labels: [], datasets: [] });
    setFilteredData(null);
    pushHistory({ labels: [], datasets: [] }, config);
  }, [config, pushHistory]);

  const handleTypeChange = useCallback((type: ChartConfig['type']) => {
    const newConfig = { ...config, type };
    setConfig(newConfig);
    pushHistory(data, newConfig);
  }, [config, data, pushHistory]);

  const handleDataCleanUpdate = useCallback((newData: ChartData) => {
    setData(newData);
    setFilteredData(null);
    pushHistory(newData, config);
  }, [config, pushHistory]);

  const handleFilteredDataChange = useCallback((filtered: ChartData) => {
    setFilteredData(filtered);
  }, []);

  const handleTemplateSelect = useCallback((template: ChartTemplate) => {
    const templateData = template.sampleData || { labels: [], datasets: [] };
    const templateConfig = { ...config, ...template.config, id: config.id };
    setData(templateData);
    setConfig(templateConfig);
    setFilteredData(null);
    pushHistory(templateData, templateConfig);
    setTemplatesOpen(false);
    toast.success('Template applied');
  }, [config, pushHistory]);

  const handleDataConnectorLoad = useCallback((connectedData: ChartData) => {
    setData(connectedData);
    setFilteredData(null);
    pushHistory(connectedData, config);
    setDataConnectorOpen(false);
    toast.success('Data connected');
  }, [config, pushHistory]);

  // Use filtered data if available, otherwise use original - memoized for performance
  const displayData = useMemo(() => filteredData || data, [filteredData, data]);

  return (
    <TooltipProvider delayDuration={200}>
      {/* Onboarding Tutorial */}
      {showOnboarding && (
        <OnboardingTutorial 
          onComplete={() => {
            setShowOnboarding(false);
            trackEvent('onboarding_completed');
          }} 
        />
      )}

      <div className="h-screen bg-background flex flex-col overflow-hidden">
        <AppHeader
          projectName={project.name}
          onSave={handleSave}
          onNew={handleNew}
          onExport={handleExport}
          onExportSVG={handleExportSVG}
          onOpenProjects={() => setProjectsOpen(true)}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onShowShortcuts={() => setShortcutsOpen(true)}
          onShowHelp={() => setHelpOpen(true)}
          onOpenTemplates={() => setTemplatesOpen(true)}
          onOpenDataConnector={() => setDataConnectorOpen(true)}
        />

        {/* Desktop/Laptop Layout - Original Design (1024px and above) */}
        <div className="hidden lg:flex flex-1 flex-col lg:flex-row overflow-hidden gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4">
          {/* Sidebar - Original Desktop Layout */}
          <aside className="w-full lg:w-80 xl:w-96 bg-card rounded-lg sm:rounded-xl border border-border/60 shadow-lg hover:shadow-xl transition-all flex flex-col shrink-0 lg:max-h-none overflow-hidden relative">
            <div className="p-3 sm:p-4 border-b border-border/40">
              <div className="space-y-2 sm:space-y-3">
                {/* Project Name */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground">Project Name</label>
                    <Badge variant="secondary" className="text-[10px] font-mono h-5 px-2">
                      {displayData.datasets.length} × {displayData.labels.length}
                    </Badge>
                  </div>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="h-9 text-sm"
                  />
                </div>

                {/* Chart Type */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Chart Type</label>
                  <MemoizedChartTypeSelector selected={config.type} onSelect={handleTypeChange} />
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 sm:p-4">
                {/* Tabs */}
                <Tabs defaultValue="data" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 h-9 sm:h-10 bg-muted/50 p-0.5">
                    <TabsTrigger value="data" className="text-xs sm:text-sm gap-1 sm:gap-1.5 h-8 sm:h-9 transition-all hover:scale-105">
                      <Database className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>Data</span>
                    </TabsTrigger>
                    <TabsTrigger value="style" className="text-xs sm:text-sm gap-1 sm:gap-1.5 h-8 sm:h-9 transition-all hover:scale-105">
                      <Palette className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>Style</span>
                    </TabsTrigger>
                    <TabsTrigger value="config" className="text-xs sm:text-sm gap-1 sm:gap-1.5 h-8 sm:h-9 transition-all hover:scale-105">
                      <Settings className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>Config</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="data" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                    <div data-tour="file-dropzone">
                      <FileDropzone onFileSelect={handleFileSelect} onUrlImport={handleUrlImport} />
                    </div>
                    
                    <div className="flex flex-wrap sm:flex-nowrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleLoadSampleData} 
                        className="flex-1 min-w-[100px] h-9 sm:h-10 text-xs gap-1.5 hover:scale-105 transition-transform"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Sample</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRandomData} 
                        className="flex-1 min-w-[100px] h-9 sm:h-10 text-xs gap-1.5 hover:scale-105 transition-transform"
                      >
                        <Shuffle className="h-3.5 w-3.5" />
                        <span>Random</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleClearData} 
                        className="h-9 sm:h-10 w-9 sm:w-10 p-0"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <MemoizedQuickStats data={displayData} />

                    {data.datasets.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground">Datasets</label>
                        <MemoizedDatasetPanel datasets={data.datasets} onUpdate={handleDataUpdate} />
                      </div>
                    )}

                    <div className="pt-4 border-t space-y-3">
                      <MemoizedDataCleaningPanel data={data} onUpdate={handleDataCleanUpdate} />
                      <MemoizedInteractiveFilters data={data} onFilteredDataChange={handleFilteredDataChange} />
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="mt-4 space-y-4">
                    {data.datasets.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground">Dataset Colors</label>
                        <MemoizedDatasetPanel datasets={data.datasets} onUpdate={handleDataUpdate} />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="config" className="mt-4 space-y-4">
                    <div data-tour="config-panel">
                      <MemoizedChartConfigPanel config={config} onUpdate={handleConfigUpdate} />
                    </div>
                    
                    <div className="pt-4 border-t space-y-3">
                      <MemoizedVersionHistory 
                        versions={versions}
                        onRestore={handleRestoreVersion}
                        onDelete={deleteVersion}
                        onClearAll={clearVersions}
                        lastSaved={lastSaved}
                        isSaving={isSaving}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </aside>

          {/* Main Chart Area - Original Desktop Design */}
          <main className="flex-1 overflow-hidden flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col overflow-hidden shadow-lg sm:shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg sm:rounded-xl border-border/60">
              <CardHeader className="py-2 sm:py-3 px-3 sm:px-5 flex-shrink-0 border-b border-border/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                  <h2 className="text-base sm:text-lg font-semibold truncate max-w-full">{config.title || 'Untitled Chart'}</h2>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex bg-muted/60 rounded-lg p-0.5 flex-1 sm:flex-none">
                      <Button
                        variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 sm:h-8 px-2 sm:px-3 text-xs gap-1 sm:gap-1.5 rounded-md flex-1 sm:flex-none"
                        onClick={() => setViewMode('chart')}
                      >
                        <BarChart2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>Chart</span>
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 sm:h-8 px-2 sm:px-3 text-xs gap-1 sm:gap-1.5 rounded-md flex-1 sm:flex-none"
                        onClick={() => setViewMode('table')}
                      >
                        <Table2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>Table</span>
                      </Button>
                      <Button
                        variant={viewMode === 'edit' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 sm:h-8 px-2 sm:px-3 text-xs gap-1 sm:gap-1.5 rounded-md flex-1 sm:flex-none"
                        onClick={() => setViewMode('edit')}
                      >
                        <Edit3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>Edit</span>
                      </Button>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs h-7 sm:h-8 px-2 sm:px-3 font-medium">
                      {config.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-3 sm:p-4 md:p-6 overflow-hidden min-h-0">
                <ErrorBoundary onReset={() => setViewMode('chart')}>
                  {data.datasets.length === 0 ? (
                    <NoDataEmptyState onUpload={() => {
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                      fileInput?.click();
                    }} />
                  ) : viewMode === 'chart' ? (
                    <ChartRenderer ref={chartRef} data={displayData} config={config} />
                  ) : viewMode === 'table' ? (
                    <DataTableView data={displayData} />
                  ) : (
                    <DatasetEditor data={data} onUpdate={(newData) => {
                      setData(newData);
                      pushHistory(newData, config);
                    }} />
                  )}
                </ErrorBoundary>
              </CardContent>
            </Card>
          </main>
            
            {/* Scroll indicator - shown when sidebar content extends below viewport */}
            <div className="hidden lg:block absolute bottom-4 left-4 pointer-events-none z-10">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 animate-bounce">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
        </div>

          {/* Mobile Layout - Full screen chart with bottom sheet */}
          <div className="lg:hidden flex-1 flex flex-col overflow-hidden relative">
            {/* Mobile Chart Area - Full viewport */}
            <main className="flex-1 overflow-hidden flex flex-col p-2 pb-20">
              <Card className="flex-1 flex flex-col overflow-hidden shadow-lg rounded-lg border-border/60">
                <CardHeader className="py-2 px-3 flex-shrink-0 border-b border-border/40">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold truncate flex-1">{config.title || 'Untitled Chart'}</h2>
                    <Badge variant="outline" className="capitalize text-xs h-6 px-2 text-[10px]">
                      {config.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-3 overflow-hidden min-h-0">
                  <ErrorBoundary onReset={() => setViewMode('chart')}>
                    {data.datasets.length === 0 ? (
                      <NoDataEmptyState onUpload={() => setMobileDrawerOpen(true)} />
                    ) : viewMode === 'chart' ? (
                      <ChartRenderer ref={chartRef} data={displayData} config={config} />
                    ) : viewMode === 'table' ? (
                      <DataTableView data={displayData} />
                    ) : (
                      <DatasetEditor data={data} onUpdate={(newData) => {
                        setData(newData);
                        pushHistory(newData, config);
                      }} />
                    )}
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </main>

            {/* Mobile Bottom Tab Bar - Fixed */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-border/60 shadow-2xl z-50 safe-area-bottom">
              <div className="grid grid-cols-4 h-14">
                <button
                  onClick={() => {
                    setActiveTab('data');
                    setMobileDrawerOpen(true);
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 touch-target transition-colors ${
                    activeTab === 'data' && mobileDrawerOpen ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  }`}
                >
                  <Database className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Data</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('style');
                    setMobileDrawerOpen(true);
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 touch-target transition-colors ${
                    activeTab === 'style' && mobileDrawerOpen ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  }`}
                >
                  <Palette className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Style</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('config');
                    setMobileDrawerOpen(true);
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 touch-target transition-colors ${
                    activeTab === 'config' && mobileDrawerOpen ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Config</span>
                </button>
                <button
                  onClick={() => setViewMode(viewMode === 'chart' ? 'table' : viewMode === 'table' ? 'edit' : 'chart')}
                  className="flex flex-col items-center justify-center gap-0.5 touch-target text-muted-foreground transition-colors hover:text-primary"
                >
                  {viewMode === 'chart' ? <BarChart2 className="h-5 w-5" /> : viewMode === 'table' ? <Table2 className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
                  <span className="text-[10px] font-medium capitalize">{viewMode}</span>
                </button>
              </div>
            </div>

            {/* Mobile Bottom Sheet Drawer */}
            <Drawer.Root open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
                <Drawer.Content className="bg-background flex flex-col rounded-t-[20px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 shadow-2xl">
                  <div className="p-4 bg-background rounded-t-[20px] flex-shrink-0 border-b border-border/40">
                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/30 mb-4" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {activeTab === 'data' && <Database className="h-5 w-5 text-primary" />}
                        {activeTab === 'style' && <Palette className="h-5 w-5 text-primary" />}
                        {activeTab === 'config' && <Settings className="h-5 w-5 text-primary" />}
                        <h3 className="text-base font-semibold capitalize">{activeTab}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="h-8 w-8 p-0 touch-target"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 overflow-y-auto px-4 pb-6">
                    <div className="py-4 space-y-4">
                      {activeTab === 'data' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Project Name</label>
                            <Input
                              value={project.name}
                              onChange={(e) => updateProjectName(e.target.value)}
                              placeholder="Enter project name"
                              className="h-12 text-base"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Chart Type</label>
                            <MemoizedChartTypeSelector selected={config.type} onSelect={handleTypeChange} />
                          </div>

                          <div data-tour="file-dropzone">
                            <FileDropzone onFileSelect={handleFileSelect} onUrlImport={handleUrlImport} />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <Button 
                              variant="outline" 
                              onClick={handleLoadSampleData} 
                              className="h-12 text-sm gap-1.5 touch-target"
                            >
                              <Sparkles className="h-4 w-4" />
                              <span>Sample</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={handleRandomData} 
                              className="h-12 text-sm gap-1.5 touch-target"
                            >
                              <Shuffle className="h-4 w-4" />
                              <span>Random</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={handleClearData} 
                              className="h-12 touch-target"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>

                          <MemoizedQuickStats data={displayData} />

                          {data.datasets.length > 0 && (
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-muted-foreground">Datasets</label>
                              <MemoizedDatasetPanel datasets={data.datasets} onUpdate={handleDataUpdate} />
                            </div>
                          )}

                          <div className="pt-4 border-t space-y-4">
                            <MemoizedDataCleaningPanel data={data} onUpdate={handleDataCleanUpdate} />
                            <MemoizedInteractiveFilters data={data} onFilteredDataChange={handleFilteredDataChange} />
                          </div>
                        </>
                      )}

                      {activeTab === 'style' && (
                        <>
                          {data.datasets.length > 0 && (
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-muted-foreground">Dataset Colors</label>
                              <MemoizedDatasetPanel datasets={data.datasets} onUpdate={handleDataUpdate} />
                            </div>
                          )}
                        </>
                      )}

                      {activeTab === 'config' && (
                        <>
                          <div data-tour="config-panel">
                            <MemoizedChartConfigPanel config={config} onUpdate={handleConfigUpdate} />
                          </div>
                          
                          <div className="pt-4 border-t space-y-4">
                            <MemoizedVersionHistory 
                              versions={versions}
                              onRestore={handleRestoreVersion}
                              onDelete={deleteVersion}
                              onClearAll={clearVersions}
                              lastSaved={lastSaved}
                              isSaving={isSaving}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>

            {/* Floating Action Button */}
            <button
              onClick={() => {
                setActiveTab('data');
                setMobileDrawerOpen(true);
              }}
              className="lg:hidden fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-2xl hover:shadow-primary/50 active:scale-95 transition-all flex items-center justify-center touch-target"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>

        <ProjectsDialog open={projectsOpen} onOpenChange={setProjectsOpen} onLoadProject={handleLoadProject} />
        <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
        <TemplateGallery 
          open={templatesOpen} 
          onOpenChange={setTemplatesOpen} 
          onSelectTemplate={handleTemplateSelect} 
        />
        <DataConnector 
          open={dataConnectorOpen} 
          onClose={() => setDataConnectorOpen(false)} 
          onDataFetched={handleDataConnectorLoad} 
        />
        
        {/* Data Preview Dialog */}
        {previewData && (
          <DataPreviewDialog
            open={!!previewData}
            onOpenChange={(open) => !open && setPreviewData(null)}
            data={previewData.data}
            fileName={previewData.fileName}
            onConfirm={handleConfirmImport}
            onCancel={() => setPreviewData(null)}
          />
        )}

        {/* Help Dialog */}
        <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
      </div>
    </TooltipProvider>
  );
}
