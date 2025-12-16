import { useState, useRef, useCallback, useMemo, memo, useEffect } from 'react';
import { toast } from 'sonner';
import { ChartData, ChartConfig, Project, ChartAnnotation } from '@/types/chart';
import { ChartTemplate } from '@/lib/templates';
import { parseFile, generateSampleData, generateRandomData } from '@/lib/data-parser';
import { saveProject, createNewProject } from '@/lib/project-storage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutosave } from '@/hooks/useAutosave';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { 
  Database, Settings, Palette, Sparkles, RefreshCw, 
  Shuffle, Table2, BarChart2, Wand2, Edit3
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
  
  const [project, setProject] = useState<Project>(() => createNewProject());
  const [data, setData] = useState<ChartData>(() => project.data);
  const [filteredData, setFilteredData] = useState<ChartData | null>(null);
  const [config, setConfig] = useState<ChartConfig>(() => project.config);
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);
  
  // Simplified history
  const [history, setHistory] = useState<{ data: ChartData; config: ChartConfig }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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
      setData(parsedData);
      setFilteredData(null);
      pushHistory(parsedData, config);
      toast.success(`Imported ${parsedData.datasets.length} dataset(s)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse file');
    }
  }, [config, pushHistory]);

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
    { key: 's', ctrl: true, action: handleSave, description: 'Save' },
    { key: 'n', ctrl: true, action: handleNew, description: 'New' },
    { key: 'e', ctrl: true, action: handleExport, description: 'Export' },
    { key: 'o', ctrl: true, action: () => setProjectsOpen(true), description: 'Projects' },
    { key: 'z', ctrl: true, action: handleUndo, description: 'Undo' },
    { key: 'z', ctrl: true, shift: true, action: handleRedo, description: 'Redo' },
    { key: 'd', ctrl: true, action: toggleTheme, description: 'Theme' },
    { key: '?', action: () => setShortcutsOpen(true), description: 'Shortcuts' },
  ], [handleSave, handleNew, handleExport, handleUndo, handleRedo, toggleTheme]);

  useKeyboardShortcuts(shortcuts);

  const handleConfigUpdate = useCallback((newConfig: ChartConfig) => setConfig(newConfig), []);
  const handleDataUpdate = useCallback((datasets: typeof data.datasets) => {
    setData(d => ({ ...d, datasets }));
    setFilteredData(null);
  }, []);
  const handleClearData = useCallback(() => {
    setData({ labels: [], datasets: [] });
    setFilteredData(null);
    pushHistory({ labels: [], datasets: [] }, config);
  }, [config, pushHistory]);

  const handleTypeChange = useCallback((type: ChartConfig['type']) => {
    setConfig(c => ({ ...c, type }));
  }, []);

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
          onOpenTemplates={() => setTemplatesOpen(true)}
          onOpenDataConnector={() => setDataConnectorOpen(true)}
        />

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-4 p-4">
          {/* Sidebar - Cleaner Design */}
          <aside className="w-full lg:w-80 xl:w-96 bg-card rounded-xl border border-border/60 shadow-lg flex flex-col shrink-0 max-h-[50vh] lg:max-h-none overflow-hidden">
            <div className="p-4 border-b border-border/40">
              <div className="space-y-3">
                {/* Project Name */}
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Chart Type</label>
                  <MemoizedChartTypeSelector selected={config.type} onSelect={handleTypeChange} />
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4">
                {/* Tabs */}
                <Tabs defaultValue="data" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 h-9 bg-muted/50 p-0.5">
                    <TabsTrigger value="data" className="text-xs gap-1.5 h-8">
                      <Database className="h-3.5 w-3.5" />
                      Data
                    </TabsTrigger>
                    <TabsTrigger value="style" className="text-xs gap-1.5 h-8">
                      <Palette className="h-3.5 w-3.5" />
                      Style
                    </TabsTrigger>
                    <TabsTrigger value="config" className="text-xs gap-1.5 h-8">
                      <Settings className="h-3.5 w-3.5" />
                      Config
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="data" className="space-y-4 mt-4">
                    <FileDropzone onFileSelect={handleFileSelect} />
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleLoadSampleData} 
                        className="flex-1 h-9 text-xs gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Sample
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRandomData} 
                        className="flex-1 h-9 text-xs gap-1.5"
                      >
                        <Shuffle className="h-3.5 w-3.5" />
                        Random
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleClearData} 
                        className="h-9 w-9 p-0"
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
                    
                    <div className="pt-4 border-t space-y-3">
                      <MemoizedChartAnnotations annotations={annotations} onUpdate={setAnnotations} />
                    </div>
                  </TabsContent>

                  <TabsContent value="config" className="mt-4 space-y-4">
                    <MemoizedChartConfigPanel config={config} onUpdate={handleConfigUpdate} />
                    
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

          {/* Main Chart Area - Cleaner Design */}
          <main className="flex-1 overflow-hidden flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col overflow-hidden shadow-xl rounded-xl border-border/60">
              <CardHeader className="py-3 px-5 flex-shrink-0 border-b border-border/40">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">{config.title || 'Untitled Chart'}</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-muted/60 rounded-lg p-0.5">
                      <Button
                        variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-3 text-xs gap-1.5 rounded-md"
                        onClick={() => setViewMode('chart')}
                      >
                        <BarChart2 className="h-3.5 w-3.5" />
                        Chart
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-3 text-xs gap-1.5 rounded-md"
                        onClick={() => setViewMode('table')}
                      >
                        <Table2 className="h-3.5 w-3.5" />
                        Table
                      </Button>
                      <Button
                        variant={viewMode === 'edit' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-3 text-xs gap-1.5 rounded-md"
                        onClick={() => setViewMode('edit')}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs h-7 px-3 font-medium">
                      {config.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6 overflow-hidden min-h-0">
                <ErrorBoundary onReset={() => setViewMode('chart')}>
                  {viewMode === 'chart' ? (
                    <ChartRenderer ref={chartRef} data={displayData} config={config} />
                  ) : viewMode === 'table' ? (
                    <DataTableView data={displayData} />
                  ) : (
                    <DatasetEditor data={data} onUpdate={setData} />
                  )}
                </ErrorBoundary>
              </CardContent>
            </Card>
          </main>
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
      </div>
    </TooltipProvider>
  );
}
