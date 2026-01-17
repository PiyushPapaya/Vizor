import { useState, useRef, useCallback, useMemo, memo, useEffect } from 'react';
import { toast } from 'sonner';
import { ChartData, ChartConfig, Project, ChartAnnotation } from '@/types/chart';
import { ChartTemplate } from '@/lib/templates';
import { parseFile, generateSampleData, generateRandomData } from '@/lib/data-parser';
import { saveProject, createNewProject } from '@/lib/project-storage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutosave } from '@/hooks/useAutosave';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { trackEvent } from '@/lib/analytics';
import { updateMetaTags, SEO_CONFIGS } from '@/lib/seo';
import ExportDialog from '@/components/ExportDialog';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import AppHeader from '@/components/layout/AppHeader';
import ChartRenderer, { ChartRendererRef } from '@/components/charts/ChartRenderer';
import ChartTypeSelector from '@/components/charts/ChartTypeSelector';
import DatasetPanel from '@/components/charts/DatasetPanel';
import ChartConfigPanel from '@/components/charts/ChartConfigPanel';
import ChartConfigAccordion from '@/components/charts/ChartConfigAccordion';
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
import TemplateGallery, { addUserTemplate } from '@/components/TemplateGallery';
import DataConnector from '@/components/DataConnector';
import ErrorBoundary from '@/components/ErrorBoundary';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import { LoadingState } from '@/components/LoadingState';
import { NoDataEmptyState } from '@/components/EmptyState';
import { DataPreviewDialog } from '@/components/DataPreviewDialog';
import { HelpDialog } from '@/components/HelpDialog';
import { CommandPalette, useCommandPalette } from '@/components/CommandPalette';
import { FeedbackDialog } from '@/components/FeedbackDialog';
import { PerformanceWarning } from '@/components/PerformanceWarning';
import MobileAppInterface from '@/components/mobile/MobileAppInterface';
import ResponsiveLayoutManager from '@/components/ResponsiveLayoutManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { 
  Database, Settings, Palette, Sparkles, RefreshCw, 
  Shuffle, Table2, BarChart2, Wand2, Edit3, ChevronUp, Plus, ChevronLeft, ChevronRight, GripVertical, MessageCircle
} from 'lucide-react';

// Memoized components for performance
const MemoizedChartTypeSelector = memo(ChartTypeSelector);
const MemoizedDatasetPanel = memo(DatasetPanel);
const MemoizedChartConfigPanel = memo(ChartConfigPanel);
const MemoizedChartConfigAccordion = memo(ChartConfigAccordion);
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
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // Use responsive layout hook
  const { isMobile, isTablet, isDesktop, orientation, mobileViewMode, setMobileViewMode } = useResponsiveLayout();
  
  // Command palette state
  const { open: commandPaletteOpen, setOpen: setCommandPaletteOpen } = useCommandPalette();
  
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

  // Demo mode handling
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      setIsDemoMode(true);
      // Pre-load sample data for demo
      const demoData = generateSampleData('sales');
      setData(demoData);
      pushHistory(demoData, config);
      trackEvent('demo_mode_activated');
    }
  }, []);

  const handleResetDemo = useCallback(() => {
    const demoData = generateSampleData('sales');
    setData(demoData);
    setFilteredData(null);
    pushHistory(demoData, config);
    toast.success('Demo reset to default data');
  }, [config, pushHistory]);

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

  const handleCreateEmpty = useCallback((newData: ChartData) => {
    setData(newData);
    setFilteredData(null);
    pushHistory(newData, config);
    setViewMode('edit'); // Automatically switch to edit mode for manual entry
    trackEvent('data_created_manually', { rows: newData.labels.length, datasets: newData.datasets.length });
  }, [config, pushHistory]);

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

  const handleExport = useCallback(() => {
    setExportDialogOpen(true);
    trackEvent('export_dialog_opened');
  }, []);

  // Get the chart container element for export
  const getChartElement = useCallback((): HTMLElement | null => {
    // Try to find the chart container from the ref first
    if (chartContainerRef.current) {
      return chartContainerRef.current;
    }
    // Fallback: find the recharts container
    const chartContainer = document.querySelector('[data-chart-container]') as HTMLElement;
    return chartContainer;
  }, []);

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

  // Handle command palette actions
  const handleCommandAction = useCallback((action: string) => {
    switch (action) {
      case 'new-project':
        handleNew();
        break;
      case 'open-project':
        setProjectsOpen(true);
        break;
      case 'save-project':
        handleSave();
        break;
      case 'undo':
        handleUndo();
        break;
      case 'redo':
        handleRedo();
        break;
      case 'import-data':
        setDataConnectorOpen(true);
        break;
      case 'change-chart-type':
        // Focus on chart type selector
        const chartSelector = document.querySelector('[data-tour="chart-selector"]');
        chartSelector?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      case 'export-chart':
        handleExport();
        break;
      case 'toggle-theme':
        toggleTheme();
        break;
      case 'open-settings':
        setShowOnboarding(true);
        break;
      case 'open-help':
        setHelpOpen(true);
        break;
      case 'start-tutorial':
        localStorage.removeItem('Vizor-onboarding-completed');
        localStorage.removeItem('Vizor-onboarding-progress');
        setShowOnboarding(true);
        break;
      default:
        console.log('Unknown command:', action);
    }
  }, [handleNew, handleSave, handleUndo, handleRedo, handleExport, toggleTheme]);

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
    { key: 'k', ctrl: true, action: () => { setCommandPaletteOpen(true); }, description: 'Command palette' },
  ], [handleSave, handleNew, handleExport, handleUndo, handleRedo, toggleTheme, setCommandPaletteOpen]);

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

  const handleSaveAsTemplate = useCallback(() => {
    if (data.datasets.length === 0) {
      toast.error('Create a chart first before saving as template');
      return;
    }
    const templateId = `user-${Date.now()}`;
    const templateName = config.title || project.name || 'My Template';
    addUserTemplate({
      id: templateId,
      name: templateName,
      description: `Custom template created on ${new Date().toLocaleDateString()}`,
      category: 'business',
      config: { ...config },
      sampleData: { ...data },
      tags: ['custom', config.type],
    });
    toast.success(`Template "${templateName}" saved!`);
    trackEvent('template_saved', { type: config.type });
  }, [data, config, project.name]);

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
          onSaveAsTemplate={handleSaveAsTemplate}
        />

        {/* Responsive Layout Manager - renders either mobile OR desktop layout */}
        <ResponsiveLayoutManager
          mobileLayout={
            <MobileAppInterface
              project={project}
              data={data}
              config={config}
              displayData={displayData}
              chartRef={chartRef}
              onProjectNameChange={updateProjectName}
              onChartTypeChange={handleTypeChange}
              onFileSelect={handleFileSelect}
              onUrlImport={handleUrlImport}
              onCreateEmpty={handleCreateEmpty}
              onLoadSample={handleLoadSampleData}
              onRandomData={handleRandomData}
              onClearData={handleClearData}
              onDataUpdate={handleDataUpdate}
              onDataCleanUpdate={handleDataCleanUpdate}
              onFilteredDataChange={handleFilteredDataChange}
              onConfigUpdate={handleConfigUpdate}
              versions={versions}
              onRestoreVersion={handleRestoreVersion}
              onDeleteVersion={deleteVersion}
              onClearVersions={clearVersions}
              lastSaved={lastSaved}
              isSaving={isSaving}
              onExport={handleExport}
              onExportSVG={handleExportSVG}
            />
          }
          desktopLayout={
            <PanelGroup 
              direction="horizontal" 
              autoSaveId="dataviz-sidebar-layout"
              className="flex-1 overflow-hidden p-4 sm:p-5 md:p-6 lg:p-8 gap-0"
            >
          {/* Sidebar Panel - Resizable */}
          <Panel
            id="sidebar"
            defaultSize={28}
            minSize={20}
            maxSize={45}
            className="min-w-0"
          >
            <aside className="h-full bg-gradient-to-br from-card/98 via-card/95 to-card/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-border/40 shadow-depth-md hover:shadow-depth-lg hover:border-primary/20 transition-all duration-500 flex flex-col overflow-hidden relative">
              {/* Subtle orb background like landing page */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
              
              <div className="p-4 sm:p-5 border-b border-border/30 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 relative z-10">
                <div className="space-y-3 sm:space-y-4">
                  {/* Demo Mode Indicator */}
                  {isDemoMode && (
                    <div className="bg-gradient-to-r from-accent/20 to-primary/20 border border-primary/30 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-gradient-to-r from-primary to-accent text-white">
                          Demo Mode
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You're exploring Vizor. Data is pre-loaded.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResetDemo}
                        className="w-full h-8 text-xs"
                      >
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Reset Demo
                      </Button>
                    </div>
                  )}
                  
                  {/* Project Name */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Project Name</label>
                      <Badge variant="secondary" className="text-[10px] font-mono h-5 px-2 bg-primary/10 text-primary border-primary/20">
                        {displayData.datasets.length} × {displayData.labels.length}
                      </Badge>
                    </div>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProjectName(e.target.value)}
                      placeholder="Enter project name"
                      className="h-9 text-sm bg-background/50 border-border/50 focus:border-primary/50 rounded-lg transition-all duration-300"
                    />
                  </div>

                  {/* Chart Type */}
                  <div className="space-y-1.5 sm:space-y-2" data-tour="chart-selector">
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
                        <FileDropzone onFileSelect={handleFileSelect} onUrlImport={handleUrlImport} onCreateEmpty={handleCreateEmpty} />
                      </div>
                      
                      <div className="flex flex-wrap sm:flex-nowrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleLoadSampleData} 
                          className="flex-1 min-w-[80px] h-9 sm:h-10 text-xs gap-1.5 hover:scale-105 transition-transform"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Sample</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleRandomData} 
                          className="flex-1 min-w-[80px] h-9 sm:h-10 text-xs gap-1.5 hover:scale-105 transition-transform"
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

                      <div data-tour="quick-stats">
                        <MemoizedQuickStats data={displayData} />
                      </div>

                      {data.datasets.length > 0 && (
                        <div className="space-y-2" data-tour="datasets">
                          <label className="text-xs font-semibold text-muted-foreground">Datasets</label>
                          <MemoizedDatasetPanel datasets={data.datasets} onUpdate={handleDataUpdate} />
                        </div>
                      )}

                      <div className="pt-4 border-t space-y-3" data-tour="data-cleaning">
                        <MemoizedDataCleaningPanel data={data} onUpdate={handleDataCleanUpdate} />
                        <MemoizedInteractiveFilters data={data} onFilteredDataChange={handleFilteredDataChange} />
                      </div>
                    </TabsContent>

                    <TabsContent value="style" className="mt-4 space-y-4" data-tour="style-options">
                      {data.datasets.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground">Dataset Colors</label>
                          <MemoizedDatasetPanel datasets={data.datasets} onUpdate={handleDataUpdate} />
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="config" className="mt-4 space-y-4">
                      <div data-tour="config-panel">
                        {/* New Accordion-based Config Panel */}
                        <MemoizedChartConfigAccordion config={config} onUpdate={handleConfigUpdate} />
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
          </Panel>

          {/* Resizable Handle */}
          <PanelResizeHandle className="w-2 mx-1 relative group flex items-center justify-center cursor-col-resize">
            {/* Visual drag indicator */}
            <div className="absolute inset-y-0 w-1 bg-border group-hover:bg-primary/50 group-active:bg-primary transition-all duration-150 rounded-full" />
            {/* Grip dots on hover */}
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col gap-1">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            {/* Wider hit area for easier grabbing */}
            <div className="absolute inset-y-0 -left-2 -right-2" />
          </PanelResizeHandle>

          {/* Main Chart Area Panel */}
          <Panel
            id="chart-area"
            minSize={40}
            className="min-w-0"
          >
            <main className="h-full overflow-hidden flex flex-col">
              {/* Chart Card with floating orb background like landing page */}
              <Card className="flex-1 flex flex-col overflow-hidden shadow-depth-lg hover:shadow-3xl transition-all duration-500 rounded-xl sm:rounded-2xl border-2 border-border/40 hover:border-primary/30 bg-gradient-to-br from-card/98 via-card/95 to-card/90 backdrop-blur-xl relative group animate-float-subtle">
                {/* Floating orb background - matching landing page style */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity duration-700" aria-hidden="true" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-accent/8 rounded-full blur-3xl pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity duration-700" aria-hidden="true" />
                
                <CardHeader className="py-3 sm:py-4 px-4 sm:px-6 flex-shrink-0 border-b border-border/30 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold truncate max-w-full bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{config.title || 'Untitled Chart'}</h2>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="flex bg-muted/60 backdrop-blur-sm rounded-xl p-1 flex-1 sm:flex-none border border-border/30 shadow-sm">
                        <Button
                          variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
                          size="sm"
                          className={`h-8 sm:h-9 px-3 sm:px-4 text-xs gap-1.5 rounded-lg flex-1 sm:flex-none transition-all duration-300 ${viewMode === 'chart' ? 'bg-gradient-to-r from-primary/20 to-accent/10 shadow-sm' : ''}`}
                          onClick={() => setViewMode('chart')}
                        >
                          <BarChart2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Chart</span>
                        </Button>
                        <Button
                          variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                          size="sm"
                          className={`h-8 sm:h-9 px-3 sm:px-4 text-xs gap-1.5 rounded-lg flex-1 sm:flex-none transition-all duration-300 ${viewMode === 'table' ? 'bg-gradient-to-r from-primary/20 to-accent/10 shadow-sm' : ''}`}
                          onClick={() => setViewMode('table')}
                        >
                          <Table2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Table</span>
                        </Button>
                        <Button
                          variant={viewMode === 'edit' ? 'secondary' : 'ghost'}
                          size="sm"
                          className={`h-8 sm:h-9 px-3 sm:px-4 text-xs gap-1.5 rounded-lg flex-1 sm:flex-none transition-all duration-300 ${viewMode === 'edit' ? 'bg-gradient-to-r from-primary/20 to-accent/10 shadow-sm' : ''}`}
                          onClick={() => setViewMode('edit')}
                        >
                          <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Edit</span>
                        </Button>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs h-8 sm:h-9 px-3 sm:px-4 font-medium border-2 border-primary/20 bg-primary/5">
                        {config.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-4 sm:p-6 md:p-8 overflow-hidden min-h-0 relative z-10">
                  <ErrorBoundary onReset={() => setViewMode('chart')}>
                    {data.datasets.length === 0 ? (
                      <NoDataEmptyState onUpload={() => {
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        fileInput?.click();
                      }} />
                    ) : viewMode === 'chart' ? (
                      <div ref={chartContainerRef} data-chart-container data-tour="chart-preview" className="w-full h-full">
                        <ChartRenderer ref={chartRef} data={displayData} config={config} />
                      </div>
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
          </Panel>
        </PanelGroup>
          }
        />

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

        {/* Export Dialog */}
        <ExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          chartElement={getChartElement()}
          chartConfig={config}
          chartData={displayData}
        />

        {/* Command Palette */}
        <CommandPalette
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
          onAction={handleCommandAction}
        />

        {/* Feedback Dialog */}
        <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />

        {/* Floating Feedback Button */}
        <button
          onClick={() => setFeedbackOpen(true)}
          className="hidden lg:flex fixed bottom-6 left-6 z-40 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all items-center justify-center"
          aria-label="Send feedback"
          data-tour="feedback"
        >
          <MessageCircle className="h-5 w-5" />
        </button>

        {/* Performance Warning for large datasets */}
        <PerformanceWarning
          data={data}
          onOptimize={(optimizedData) => {
            setData(optimizedData);
            setFilteredData(null);
            toast.success('Data optimized for better performance');
          }}
          onContinue={() => {
            // User chose to continue without optimization
          }}
        />
      </div>
    </TooltipProvider>
  );
}
