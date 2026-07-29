import { useState, useRef, useCallback, useMemo, memo, useEffect, lazy, Suspense } from 'react';
import { toast } from 'sonner';
import { ChartData, ChartConfig, Project, ChartAnnotation } from '@/types/chart';
import { ChartTemplate } from '@/lib/templates';
import { parseFile, generateSampleData, generateRandomData } from '@/lib/data-parser';
import { saveProject, createNewProject } from '@/lib/project-storage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutosave } from '@/hooks/useAutosave';
import { useTheme } from '@/hooks/useTheme';
import { trackEvent } from '@/lib/analytics';
import { updateMetaTags, SEO_CONFIGS } from '@/lib/seo';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import AppHeader from '@/components/layout/AppHeader';
import ChartRenderer, { ChartRendererRef } from '@/components/charts/ChartRenderer';
import ChartTypeSelector from '@/components/charts/ChartTypeSelector';
import DatasetPanel from '@/components/charts/DatasetPanel';
import ChartConfigAccordion from '@/components/charts/ChartConfigAccordion';
import FileDropzone from '@/components/FileDropzone';
import DataTableView from '@/components/DataTableView';
import DatasetEditor from '@/components/DatasetEditor';
import QuickStats from '@/components/QuickStats';
import DataCleaningPanel from '@/components/DataCleaningPanel';
import InteractiveFilters from '@/components/InteractiveFilters';
import ChartAnnotations from '@/components/ChartAnnotations';
import VersionHistory from '@/components/VersionHistory';
import { addUserTemplate } from '@/components/TemplateGallery';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/LoadingState';
import { NoDataEmptyState } from '@/components/EmptyState';
import { useCommandPalette } from '@/components/CommandPalette';
import MobileAppInterface from '@/components/mobile/MobileAppInterface';
import ResponsiveLayoutManager from '@/components/ResponsiveLayoutManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Database, Settings, Palette, Sparkles, RefreshCw,
  Shuffle, Table2, BarChart2, Edit3, GripVertical, MessageCircle
} from 'lucide-react';

// Lazy load heavy dialog components to reduce initial bundle size
const ExportDialog = lazy(() => import('@/components/ExportDialog'));
const ProjectsDialog = lazy(() => import('@/components/ProjectsDialog'));
const KeyboardShortcutsDialog = lazy(() => import('@/components/KeyboardShortcutsDialog'));
const TemplateGallery = lazy(() => import('@/components/TemplateGallery'));
const DataConnector = lazy(() => import('@/components/DataConnector'));
const OnboardingTutorial = lazy(() => import('@/components/OnboardingTutorial'));
const DataPreviewDialog = lazy(() => import('@/components/DataPreviewDialog').then(m => ({ default: m.DataPreviewDialog })));
const HelpDialog = lazy(() => import('@/components/HelpDialog').then(m => ({ default: m.HelpDialog })));
const CommandPalette = lazy(() => import('@/components/CommandPalette').then(m => ({ default: m.default })));
const FeedbackDialog = lazy(() => import('@/components/FeedbackDialog'));
const PerformanceWarning = lazy(() => import('@/components/PerformanceWarning'));
const AccessibilitySettings = lazy(() => import('@/components/AccessibilitySettings'));

// Memoized components for performance
const MemoizedChartTypeSelector = memo(ChartTypeSelector);
const MemoizedDatasetPanel = memo(DatasetPanel);
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
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Command palette state
  const { open: commandPaletteOpen, setOpen: setCommandPaletteOpen } = useCommandPalette();
  
  // Create initial project once
  const [project, setProject] = useState<Project>(() => createNewProject());
  
  // Initialize data - check demo mode inline
  const [data, setData] = useState<ChartData>(() => {
    const params = new URLSearchParams(window.location.search);
    const isDemoMode = params.get('demo') === 'true';
    const source = params.get('source');
    
    // Check if coming from landing page with uploaded data
    if (source === 'landing-upload' || source === 'landing-export') {
      const storedData = localStorage.getItem('vizor-landing-upload');
      if (storedData) {
        try {
          const { data: landingData } = JSON.parse(storedData);
          // Clear the stored data
          localStorage.removeItem('vizor-landing-upload');
          return landingData;
        } catch (error) {
          console.error('Failed to parse landing data:', error);
        }
      }
    }
    
    // Check for HMR preserved data in development
    if (import.meta.env.DEV) {
      const hmrData = sessionStorage.getItem('vizor-hmr-data');
      if (hmrData) {
        try {
          const parsedData = JSON.parse(hmrData);
          // Only restore if it has actual data
          if (parsedData.labels?.length > 0 && parsedData.datasets?.length > 0) {
            return parsedData;
          }
        } catch (error) {
          console.error('Failed to restore HMR data:', error);
        }
      }
    }
    
    // Initialize with demo data immediately if in demo mode
    if (isDemoMode) {
      try {
        return generateSampleData();
      } catch (error) {
        console.error('Failed to generate demo data:', error);
        return { labels: [], datasets: [] };
      }
    }
    // Return empty data for non-demo mode (project.data may not be available here)
    return { labels: [], datasets: [] };
  });
  const [filteredData, setFilteredData] = useState<ChartData | null>(null);
  const [config, setConfig] = useState<ChartConfig>(() => project.config);
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);
  
  // Demo mode detection for UI (computed after state initialization)
  const isDemoMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('demo') === 'true';
  }, []);
  
  // Simplified history. Seed with the initial snapshot at index 0 so undo can
  // step all the way back to the starting state (e.g. the empty canvas).
  const [history, setHistory] = useState<{ data: ChartData; config: ChartConfig }[]>(
    () => [{ data, config }]
  );
  const [historyIndex, setHistoryIndex] = useState(0);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('Vizor-onboarding-completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
      trackEvent('onboarding_started');
    }
    
    // Update SEO meta tags for app
    updateMetaTags(SEO_CONFIGS.app);
    
    // Check if coming from landing page upload
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source');
    if (source === 'landing-upload') {
      toast.success('Data loaded from landing page! Ready to visualize.', { duration: 3000 });
      // Clean up URL
      window.history.replaceState({}, '', '/app');
    } else if (source === 'landing-export') {
      toast.success('Demo data loaded! Click Export to download your chart.', { duration: 4000 });
      setTimeout(() => setExportDialogOpen(true), 500);
      // Clean up URL
      window.history.replaceState({}, '', '/app');
    }
  }, []);

  // Save data to sessionStorage for HMR persistence (development only)
  useEffect(() => {
    if (import.meta.env.DEV && data.labels.length > 0) {
      try {
        sessionStorage.setItem('vizor-hmr-data', JSON.stringify(data));
      } catch (error) {
        // Ignore quota errors
        console.warn('Failed to save HMR data:', error);
      }
    }
  }, [data]);

  // Demo mode initialization effect
  useEffect(() => {
    if (isDemoMode) {
      // Track demo mode activation
      trackEvent('demo_mode_activated');
    }
  }, [isDemoMode]);

  const handleResetDemo = useCallback(() => {
    try {
      const demoData = generateSampleData();
      setData(demoData);
      setFilteredData(null);
      toast.success('Demo reset to default data');
    } catch (error) {
      console.error('Failed to reset demo data:', error);
      toast.error('Failed to reset demo data');
    }
  }, []);

  // Autosave hook. Memoize the composed project and the save callback so the
  // autosave effect only re-subscribes when the underlying data actually
  // changes — not on every render — which keeps the 5s debounce from resetting.
  const autosaveProject = useMemo(
    () => ({ ...project, data, config: { ...config, annotations } }),
    [project, data, config, annotations]
  );

  const {
    versions,
    lastSaved,
    isSaving,
    manualSave,
    restoreVersion,
    deleteVersion,
    clearVersions
  } = useAutosave(autosaveProject, saveProject, true);

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
      toast.info('Review your data and click Import to continue');
    } catch (error) {
      console.error('File parsing error:', error);
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
    
    const importedData = previewData.data;
    
    // Clear filtered data first
    setFilteredData(null);
    
    // Set the new data
    setData(importedData);
    
    // Push to history
    pushHistory(importedData, config);
    
    // Switch to chart view
    setViewMode('chart');
    
    toast.success(`Imported ${importedData.datasets.length} dataset(s) with ${importedData.labels.length} row(s)`);
    setPreviewData(null);
    trackEvent('data_imported', { datasets: importedData.datasets.length, rows: importedData.labels.length });
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
    setHistory([{ data: newProject.data, config: newProject.config }]);
    setHistoryIndex(0);
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
    } else {
      console.error('Failed to generate SVG data');
      toast.error('Failed to export SVG. Please try again.');
    }
  }, [config.title]);

  const handleLoadProject = useCallback((loadedProject: Project) => {
    setProject(loadedProject);
    setData(loadedProject.data);
    setFilteredData(null);
    setConfig(loadedProject.config);
    setAnnotations(loadedProject.config.annotations || []);
    setHistory([{ data: loadedProject.data, config: loadedProject.config }]);
    setHistoryIndex(0);
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
    setViewMode('chart');
    pushHistory(sampleData, config);
    toast.success('Sample loaded');
  }, [config, pushHistory]);

  const handleRandomData = useCallback(() => {
    const randomData = generateRandomData(8, 3);
    setData(randomData);
    setFilteredData(null);
    setViewMode('chart');
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

  const { toggleTheme } = useTheme();

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
      case 'change-chart-type': {
        // Focus on chart type selector
        const chartSelector = document.querySelector('[data-tour="chart-selector"]');
        chartSelector?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
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
      case 'open-accessibility':
        setAccessibilityOpen(true);
        break;
      case 'start-tutorial':
        localStorage.removeItem('Vizor-onboarding-completed');
        localStorage.removeItem('Vizor-onboarding-progress');
        setShowOnboarding(true);
        break;
      default:
        // Unknown command - ignore
    }
  }, [handleNew, handleSave, handleUndo, handleRedo, handleExport, toggleTheme]);

  const shortcuts = useMemo(() => [
    { key: 's', ctrl: true, action: () => { handleSave(); toast.success('Project saved'); }, description: 'Save project' },
    { key: 'n', ctrl: true, action: () => { handleNew(); toast.success('New project created'); }, description: 'New project' },
    { key: 'e', ctrl: true, action: () => { handleExport(); toast.success('Opening export...'); }, description: 'Export PNG' },
    { key: 'o', ctrl: true, action: () => { setProjectsOpen(true); toast.info('Opening projects'); }, description: 'Open projects' },
    { key: 'z', ctrl: true, action: () => { handleUndo(); toast.info('Undo'); }, description: 'Undo' },
    { key: 'z', ctrl: true, shift: true, action: () => { handleRedo(); toast.info('Redo'); }, description: 'Redo' },
    { key: 'y', ctrl: true, action: () => { handleRedo(); toast.info('Redo'); }, description: 'Redo (alternative)' },
    { key: 'd', ctrl: true, action: () => { toggleTheme(); toast.success('Theme toggled'); }, description: 'Toggle theme' },
    { key: 't', ctrl: true, action: () => { setTemplatesOpen(true); toast.info('Opening templates'); }, description: 'Templates' },
    { key: 'i', ctrl: true, action: () => { setDataConnectorOpen(true); toast.info('Opening data import'); }, description: 'Import data' },
    { key: ',', ctrl: true, action: () => { setShowOnboarding(true); toast.info('Opening settings'); }, description: 'Settings/Tutorial' },
    { key: '/', ctrl: true, action: () => { setHelpOpen(true); toast.info('Opening help'); }, description: 'Help' },
    { key: '?', shift: true, action: () => { setShortcutsOpen(true); toast.info('Keyboard shortcuts'); }, description: 'Show shortcuts' },
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
    // Don't set filtered data if it's empty but original data exists
    // This prevents the "no data" flash when filters are resetting
    if (filtered.labels.length === 0 && data.labels.length > 0) {
      // If filters would result in empty data, use original data instead
      setFilteredData(null);
      return;
    }
    
    // If filtered data is same as original, clear filtered state
    if (filtered.labels.length === data.labels.length) {
      setFilteredData(null);
      return;
    }
    
    setFilteredData(filtered);
  }, [data.labels.length]);

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
        <Suspense fallback={<LoadingState text="Loading tutorial..." />}>
          <OnboardingTutorial 
            onComplete={() => {
              setShowOnboarding(false);
              trackEvent('onboarding_completed');
            }} 
          />
        </Suspense>
      )}

      <div className="h-[100svh] min-h-[100svh] bg-background flex flex-col overflow-hidden">
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
              onOpenTemplates={() => setTemplatesOpen(true)}
            />
          }
          desktopLayout={
            <PanelGroup 
              direction="horizontal" 
              autoSaveId="dataviz-sidebar-layout"
              className="flex-1 overflow-hidden p-2 sm:p-3 md:p-4 lg:p-5 gap-0"
            >
          {/* Sidebar Panel - Resizable */}
          <Panel
            id="sidebar"
            defaultSize={28}
            minSize={20}
            maxSize={45}
            className="min-w-0"
          >
            <aside className="h-full bg-gradient-to-br from-card/98 via-card/96 to-card/92 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-border/30 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:border-primary/15 transition-all duration-500 flex flex-col overflow-hidden relative">
              {/* Subtle gradient accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.02] rounded-xl sm:rounded-2xl pointer-events-none" aria-hidden="true" />
              
              <div className="p-4 sm:p-5 border-b border-border/20 bg-gradient-to-r from-primary/[0.04] via-transparent to-accent/[0.04] relative z-10">
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
                      className="h-9 text-sm bg-background/60 border-border/40 focus:border-primary/40 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/10"
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
                    <TabsList className="w-full grid grid-cols-3 h-10 bg-muted/40 p-1 rounded-xl">
                      <TabsTrigger value="data" className="text-xs gap-1.5 h-8 rounded-lg transition-all min-w-0 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground font-medium">
                        <Database className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">Data</span>
                      </TabsTrigger>
                      <TabsTrigger value="style" className="text-xs gap-1.5 h-8 rounded-lg transition-all min-w-0 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground font-medium">
                        <Palette className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">Style</span>
                      </TabsTrigger>
                      <TabsTrigger value="config" className="text-xs gap-1.5 h-8 rounded-lg transition-all min-w-0 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground font-medium">
                        <Settings className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">Config</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="data" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                      <div data-tour="file-dropzone">
                        <FileDropzone onFileSelect={handleFileSelect} onUrlImport={handleUrlImport} onCreateEmpty={handleCreateEmpty} />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleLoadSampleData} 
                          className="flex-1 min-w-[80px] h-9 sm:h-10 text-xs gap-1.5 hover:scale-[1.02] hover:border-primary/30 transition-all duration-200 rounded-lg"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Sample</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleRandomData} 
                          className="flex-1 min-w-[80px] h-9 sm:h-10 text-xs gap-1.5 hover:scale-[1.02] hover:border-primary/30 transition-all duration-200 rounded-lg"
                        >
                          <Shuffle className="h-3.5 w-3.5" />
                          <span>Random</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleClearData} 
                          className="h-9 sm:h-10 w-9 sm:w-10 p-0 rounded-lg hover:border-destructive/30 hover:text-destructive transition-all duration-200"
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

                      <div className="pt-4 border-t border-border/20 space-y-3" data-tour="data-cleaning">
                        <MemoizedDataCleaningPanel data={data} onUpdate={handleDataCleanUpdate} />
                        <MemoizedInteractiveFilters data={data} onFilteredDataChange={handleFilteredDataChange} />
                      </div>
                    </TabsContent>

                    <TabsContent value="style" className="mt-4 space-y-4" data-tour="style-options">
                      {/* Color Scheme */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground">Color Scheme</label>
                        <Select 
                          value={config.colorScheme ?? 'default'} 
                          onValueChange={(v) => handleConfigUpdate({ ...config, colorScheme: v as ChartConfig['colorScheme'] })}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="ocean">Ocean</SelectItem>
                            <SelectItem value="sunset">Sunset</SelectItem>
                            <SelectItem value="vibrant">Vibrant</SelectItem>
                            <SelectItem value="pastel">Pastel</SelectItem>
                            <SelectItem value="monochrome">Monochrome</SelectItem>
                            <SelectItem value="neon">Neon</SelectItem>
                            <SelectItem value="earth">Earth</SelectItem>
                            <SelectItem value="candy">Candy</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Dataset Colors */}
                      {data.datasets.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground">Dataset Colors</label>
                          <MemoizedDatasetPanel datasets={data.datasets} onUpdate={handleDataUpdate} />
                        </div>
                      )}

                      {/* Visual Style Controls */}
                      <div className="space-y-3 pt-3 border-t border-border/50">
                        <label className="text-xs font-semibold text-muted-foreground">Visual Style</label>
                        
                        {/* Opacity */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">Opacity</Label>
                            <span className="text-xs font-medium text-foreground">{config.opacity ?? 100}%</span>
                          </div>
                          <Slider
                            value={[config.opacity ?? 100]}
                            onValueChange={([v]) => handleConfigUpdate({ ...config, opacity: v })}
                            min={20}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>

                        {/* Stroke Width */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">Stroke Width</Label>
                            <span className="text-xs font-medium text-foreground">{config.strokeWidth ?? 2}px</span>
                          </div>
                          <Slider
                            value={[config.strokeWidth ?? 2]}
                            onValueChange={([v]) => handleConfigUpdate({ ...config, strokeWidth: v })}
                            min={0.5}
                            max={6}
                            step={0.5}
                            className="w-full"
                          />
                        </div>

                        {/* Bar Radius */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">Bar Radius</Label>
                            <span className="text-xs font-medium text-foreground">{config.barRadius ?? 4}px</span>
                          </div>
                          <Slider
                            value={[config.barRadius ?? 4]}
                            onValueChange={([v]) => handleConfigUpdate({ ...config, barRadius: v })}
                            min={0}
                            max={20}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        {/* Font Size */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">Font Size</Label>
                            <span className="text-xs font-medium text-foreground">{config.fontSize ?? 12}px</span>
                          </div>
                          <Slider
                            value={[config.fontSize ?? 12]}
                            onValueChange={([v]) => handleConfigUpdate({ ...config, fontSize: v })}
                            min={8}
                            max={18}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="config" className="mt-4 space-y-4">
                      <div data-tour="config-panel">
                        {/* New Accordion-based Config Panel */}
                        <MemoizedChartConfigAccordion config={config} onUpdate={handleConfigUpdate} />
                      </div>

                      <div className="pt-4 border-t space-y-3">
                        <label className="text-xs font-semibold text-muted-foreground">Annotations</label>
                        <MemoizedChartAnnotations annotations={annotations} onUpdate={setAnnotations} />
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
              <Card className="flex-1 flex flex-col overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] transition-all duration-500 rounded-xl sm:rounded-2xl border border-border/30 hover:border-primary/20 bg-gradient-to-br from-card/98 via-card/96 to-card/92 backdrop-blur-2xl relative group">
                {/* Subtle gradient accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.015] via-transparent to-accent/[0.015] rounded-xl sm:rounded-2xl pointer-events-none" aria-hidden="true" />
                
                <CardHeader className="py-3.5 sm:py-4 px-4 sm:px-6 flex-shrink-0 border-b border-border/20 bg-gradient-to-r from-primary/[0.03] via-transparent to-accent/[0.03] relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold truncate max-w-full bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{config.title || 'Untitled Chart'}</h2>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="flex bg-muted/40 backdrop-blur-sm rounded-xl p-1 flex-1 sm:flex-none border border-border/20 shadow-sm">
                        <Button
                          variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
                          size="sm"
                          className={`h-8 sm:h-9 px-3 sm:px-4 text-xs gap-1.5 rounded-lg flex-1 sm:flex-none transition-all duration-300 font-medium ${viewMode === 'chart' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                          onClick={() => setViewMode('chart')}
                        >
                          <BarChart2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Chart</span>
                        </Button>
                        <Button
                          variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                          size="sm"
                          className={`h-8 sm:h-9 px-3 sm:px-4 text-xs gap-1.5 rounded-lg flex-1 sm:flex-none transition-all duration-300 font-medium ${viewMode === 'table' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                          onClick={() => setViewMode('table')}
                        >
                          <Table2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Table</span>
                        </Button>
                        <Button
                          variant={viewMode === 'edit' ? 'secondary' : 'ghost'}
                          size="sm"
                          className={`h-8 sm:h-9 px-3 sm:px-4 text-xs gap-1.5 rounded-lg flex-1 sm:flex-none transition-all duration-300 font-medium ${viewMode === 'edit' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                          onClick={() => setViewMode('edit')}
                        >
                          <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Edit</span>
                        </Button>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs h-8 sm:h-9 px-3 sm:px-4 font-semibold border border-primary/20 bg-primary/5 text-primary">
                        {config.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-4 sm:p-6 md:p-8 overflow-hidden min-h-0 relative z-10">
                  <ErrorBoundary onReset={() => setViewMode('chart')}>
                    {data.datasets.length === 0 ? (
                      <NoDataEmptyState 
                        onUpload={() => {
                          const fileInput = document.querySelector('[data-file-input]') as HTMLInputElement;
                          if (fileInput) {
                            fileInput.click();
                          } else {
                            console.error('File input not found');
                            toast.error('Upload button not available. Please use the Data tab in the sidebar.');
                          }
                        }}
                        onCreateTable={() => {
                          // Create a blank table with sample structure
                          const blankData = {
                            labels: ['Row 1', 'Row 2', 'Row 3', 'Row 4', 'Row 5'],
                            datasets: [
                              { id: 'ds-1', name: 'Dataset 1', values: [0, 0, 0, 0, 0], color: '#6366f1', visible: true },
                              { id: 'ds-2', name: 'Dataset 2', values: [0, 0, 0, 0, 0], color: '#8b5cf6', visible: true },
                            ],
                          };
                          handleCreateEmpty(blankData as ChartData);
                        }}
                      />
                    ) : viewMode === 'chart' ? (
                      <div ref={chartContainerRef} data-chart-container data-tour="chart-preview" className="w-full h-full">
                        <ChartRenderer ref={chartRef} data={displayData} config={config} />
                      </div>
                    ) : viewMode === 'table' ? (
                      <DataTableView data={displayData} />
                    ) : (
                      <DatasetEditor data={data} onUpdate={(newData) => {
                        setData(newData);
                        setFilteredData(null);
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

        <Suspense fallback={null}>
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
            chartElement={exportDialogOpen ? getChartElement() : null}
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

          {/* Accessibility Settings */}
          <AccessibilitySettings open={accessibilityOpen} onOpenChange={setAccessibilityOpen} />

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
        </Suspense>

        {/* Floating feedback button */}
        <Button
          size="sm"
          onClick={() => setFeedbackOpen(true)}
          className="fixed bottom-4 right-4 z-40 h-10 gap-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Send feedback"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Feedback</span>
        </Button>
      </div>
    </TooltipProvider>
  );
}
