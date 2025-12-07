import { useState, useRef, useCallback, useMemo, memo } from 'react';
import { toast } from 'sonner';
import { ChartData, ChartConfig, Project } from '@/types/chart';
import { parseFile, generateSampleData, generateRandomData } from '@/lib/data-parser';
import { saveProject, createNewProject } from '@/lib/project-storage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import AppHeader from '@/components/layout/AppHeader';
import ChartRenderer, { ChartRendererRef } from '@/components/charts/ChartRenderer';
import ChartTypeSelector from '@/components/charts/ChartTypeSelector';
import DatasetPanel from '@/components/charts/DatasetPanel';
import ChartConfigPanel from '@/components/charts/ChartConfigPanel';
import FileDropzone from '@/components/FileDropzone';
import ProjectsDialog from '@/components/ProjectsDialog';
import KeyboardShortcutsDialog from '@/components/KeyboardShortcutsDialog';
import DataTableView from '@/components/DataTableView';
import QuickStats from '@/components/QuickStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { 
  Database, Settings, Palette, Sparkles, RefreshCw, 
  Shuffle, Table2, BarChart2
} from 'lucide-react';

// Memoized components for performance
const MemoizedChartTypeSelector = memo(ChartTypeSelector);
const MemoizedDatasetPanel = memo(DatasetPanel);
const MemoizedChartConfigPanel = memo(ChartConfigPanel);
const MemoizedQuickStats = memo(QuickStats);

export default function Index() {
  const chartRef = useRef<ChartRendererRef>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  
  const [project, setProject] = useState<Project>(() => createNewProject());
  const [data, setData] = useState<ChartData>(() => project.data);
  const [config, setConfig] = useState<ChartConfig>(() => project.config);
  
  // Simplified history
  const [history, setHistory] = useState<{ data: ChartData; config: ChartConfig }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = useCallback((newData: ChartData, newConfig: ChartConfig) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), { data: newData, config: newConfig }].slice(-20));
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [historyIndex]);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const parsedData = await parseFile(file);
      setData(parsedData);
      pushHistory(parsedData, config);
      toast.success(`Imported ${parsedData.datasets.length} dataset(s)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse file');
    }
  }, [config, pushHistory]);

  const handleSave = useCallback(() => {
    const updatedProject: Project = { ...project, data, config, updatedAt: new Date().toISOString() };
    saveProject(updatedProject);
    setProject(updatedProject);
    toast.success('Saved');
  }, [project, data, config]);

  const handleNew = useCallback(() => {
    const newProject = createNewProject();
    setProject(newProject);
    setData(newProject.data);
    setConfig(newProject.config);
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
    setConfig(loadedProject.config);
    setHistory([]);
    setHistoryIndex(-1);
    toast.success(`Loaded: ${loadedProject.name}`);
  }, []);

  const updateProjectName = useCallback((name: string) => {
    setProject(prev => ({ ...prev, name }));
    setConfig(prev => ({ ...prev, title: name }));
  }, []);

  const handleLoadSampleData = useCallback(() => {
    const sampleData = generateSampleData();
    setData(sampleData);
    pushHistory(sampleData, config);
    toast.success('Sample loaded');
  }, [config, pushHistory]);

  const handleRandomData = useCallback(() => {
    const randomData = generateRandomData(8, 3);
    setData(randomData);
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
  const handleDataUpdate = useCallback((datasets: typeof data.datasets) => setData(d => ({ ...d, datasets })), []);
  const handleClearData = useCallback(() => {
    setData({ labels: [], datasets: [] });
    pushHistory({ labels: [], datasets: [] }, config);
  }, [config, pushHistory]);

  const handleTypeChange = useCallback((type: ChartConfig['type']) => {
    setConfig(c => ({ ...c, type }));
  }, []);

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
        />

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Sidebar - Responsive */}
          <aside className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-border/60 bg-card/50 backdrop-blur-sm flex flex-col shrink-0 max-h-[40vh] sm:max-h-[45vh] lg:max-h-none transition-all duration-300">
            <ScrollArea className="flex-1 scrollbar-thin">
              <div className="p-3 sm:p-4 space-y-4">
                {/* Project Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Project</label>
                    <Badge variant="secondary" className="text-[10px] font-mono h-5 px-2 bg-muted/60">
                      {data.datasets.length} × {data.labels.length}
                    </Badge>
                  </div>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProjectName(e.target.value)}
                    placeholder="Project name"
                    className="h-9 text-sm bg-background/60 border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Chart Type */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Chart Type</label>
                  <MemoizedChartTypeSelector selected={config.type} onSelect={handleTypeChange} />
                </div>

                {/* Quick Stats */}
                <div className="hidden sm:block">
                  <MemoizedQuickStats data={data} />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="data" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 h-9 bg-muted/50 p-0.5">
                    <TabsTrigger value="data" className="text-xs gap-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                      <Database className="h-3.5 w-3.5" />
                      <span className="hidden xs:inline">Data</span>
                    </TabsTrigger>
                    <TabsTrigger value="style" className="text-xs gap-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                      <Palette className="h-3.5 w-3.5" />
                      <span className="hidden xs:inline">Style</span>
                    </TabsTrigger>
                    <TabsTrigger value="config" className="text-xs gap-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                      <Settings className="h-3.5 w-3.5" />
                      <span className="hidden xs:inline">Config</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="data" className="space-y-3 mt-3 animate-in">
                    <FileDropzone onFileSelect={handleFileSelect} />
                    
                    <div className="flex gap-1.5">
                      <Button variant="outline" size="sm" onClick={handleLoadSampleData} className="flex-1 h-9 text-xs gap-1.5 hover:bg-accent transition-colors">
                        <Sparkles className="h-3.5 w-3.5" />
                        Sample
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleRandomData} className="flex-1 h-9 text-xs gap-1.5 hover:bg-accent transition-colors">
                        <Shuffle className="h-3.5 w-3.5" />
                        Random
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleClearData} className="h-9 w-9 p-0 hover:bg-destructive/10 hover:border-destructive/50 transition-colors">
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {data.datasets.length > 0 && (
                      <MemoizedDatasetPanel datasets={data.datasets} onUpdate={handleDataUpdate} />
                    )}
                  </TabsContent>

                  <TabsContent value="style" className="mt-3 animate-in">
                    <MemoizedDatasetPanel datasets={data.datasets} onUpdate={handleDataUpdate} />
                  </TabsContent>

                  <TabsContent value="config" className="mt-3 animate-in">
                    <MemoizedChartConfigPanel config={config} onUpdate={handleConfigUpdate} />
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </aside>

          {/* Main Chart Area */}
          <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-hidden flex flex-col min-h-0 gradient-mesh">
            <Card className="flex-1 flex flex-col glass overflow-hidden transition-gpu shadow-elevated">
              <CardHeader className="py-2.5 px-3 sm:px-5 flex-shrink-0 border-b border-border/40 bg-background/30">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-semibold truncate text-gradient">{config.title || 'Untitled'}</h2>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex bg-muted/50 rounded-lg p-0.5 shadow-inner">
                      <Button
                        variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2.5 text-xs gap-1.5 rounded-md transition-all"
                        onClick={() => setViewMode('chart')}
                      >
                        <BarChart2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Chart</span>
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2.5 text-xs gap-1.5 rounded-md transition-all"
                        onClick={() => setViewMode('table')}
                      >
                        <Table2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Table</span>
                      </Button>
                    </div>
                    <Badge variant="outline" className="capitalize text-[10px] h-6 px-2 hidden sm:flex font-medium bg-background/50">
                      {config.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-3 sm:p-5 overflow-hidden min-h-0">
                {viewMode === 'chart' ? (
                  <ChartRenderer ref={chartRef} data={data} config={config} />
                ) : (
                  <DataTableView data={data} />
                )}
              </CardContent>
            </Card>
          </main>
        </div>

        <ProjectsDialog open={projectsOpen} onOpenChange={setProjectsOpen} onLoadProject={handleLoadProject} />
        <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      </div>
    </TooltipProvider>
  );
}
