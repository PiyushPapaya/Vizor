import { useState, useRef, useCallback, useMemo } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { 
  Database, Settings, Palette, Sparkles, RefreshCw, 
  Shuffle, Table2, BarChart2
} from 'lucide-react';

export default function Index() {
  const chartRef = useRef<ChartRendererRef>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  
  const [project, setProject] = useState<Project>(() => createNewProject());
  const [data, setData] = useState<ChartData>(() => project.data);
  const [config, setConfig] = useState<ChartConfig>(() => project.config);
  
  // History for undo/redo
  const [history, setHistory] = useState<{ data: ChartData; config: ChartConfig }[]>([{ data: project.data, config: project.config }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback((newData: ChartData, newConfig: ChartConfig) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ data: newData, config: newConfig });
      if (newHistory.length > 30) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 29));
  }, [historyIndex]);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const parsedData = await parseFile(file);
      setData(parsedData);
      pushHistory(parsedData, config);
      toast.success(`Imported ${parsedData.datasets.length} dataset(s) from ${file.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse file');
    }
  }, [config, pushHistory]);

  const handleSave = useCallback(() => {
    const updatedProject: Project = {
      ...project,
      data,
      config,
      updatedAt: new Date().toISOString(),
    };
    saveProject(updatedProject);
    setProject(updatedProject);
    toast.success('Project saved!');
  }, [project, data, config]);

  const handleNew = useCallback(() => {
    const newProject = createNewProject();
    setProject(newProject);
    setData(newProject.data);
    setConfig(newProject.config);
    setHistory([{ data: newProject.data, config: newProject.config }]);
    setHistoryIndex(0);
    toast.success('New project created');
  }, []);

  const handleExport = useCallback(async () => {
    const dataUrl = await chartRef.current?.exportToPNG();
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${config.title || 'chart'}.png`;
      a.click();
      toast.success('Chart exported as PNG');
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
      toast.success('Chart exported as SVG');
    }
  }, [config.title]);

  const handleLoadProject = useCallback((loadedProject: Project) => {
    setProject(loadedProject);
    setData(loadedProject.data);
    setConfig(loadedProject.config);
    setHistory([{ data: loadedProject.data, config: loadedProject.config }]);
    setHistoryIndex(0);
    toast.success(`Loaded project: ${loadedProject.name}`);
  }, []);

  const updateProjectName = (name: string) => {
    setProject(prev => ({ ...prev, name }));
    setConfig(prev => ({ ...prev, title: name }));
  };

  const handleLoadSampleData = () => {
    const sampleData = generateSampleData();
    setData(sampleData);
    pushHistory(sampleData, config);
    toast.success('Sample data loaded');
  };

  const handleRandomData = () => {
    const randomData = generateRandomData(8, 3);
    setData(randomData);
    pushHistory(randomData, config);
    toast.success('Random data generated');
  };

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setData(prevState.data);
      setConfig(prevState.config);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setData(nextState.data);
      setConfig(nextState.config);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.toggle('dark');
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts(useMemo(() => [
    { key: 's', ctrl: true, action: handleSave, description: 'Save project' },
    { key: 'n', ctrl: true, action: handleNew, description: 'New project' },
    { key: 'e', ctrl: true, action: handleExport, description: 'Export chart' },
    { key: 'o', ctrl: true, action: () => setProjectsOpen(true), description: 'Open projects' },
    { key: 'z', ctrl: true, action: handleUndo, description: 'Undo' },
    { key: 'z', ctrl: true, shift: true, action: handleRedo, description: 'Redo' },
    { key: 'd', ctrl: true, action: toggleTheme, description: 'Toggle theme' },
    { key: '?', action: () => setShortcutsOpen(true), description: 'Show shortcuts' },
  ], [handleSave, handleNew, handleExport, handleUndo, handleRedo, toggleTheme]));

  const handleConfigUpdate = useCallback((newConfig: ChartConfig) => {
    setConfig(newConfig);
  }, []);

  const handleDataUpdate = useCallback((datasets: typeof data.datasets) => {
    const newData = { ...data, datasets };
    setData(newData);
  }, [data]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
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
          {/* Sidebar */}
          <aside className="w-full lg:w-[360px] border-b lg:border-b-0 lg:border-r border-border bg-card/30 flex flex-col max-h-[45vh] lg:max-h-none">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-5">
                {/* Project Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Project</label>
                    <Badge variant="secondary" className="text-xs font-mono">
                      {data.datasets.length} dataset{data.datasets.length !== 1 ? 's' : ''} · {data.labels.length} points
                    </Badge>
                  </div>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProjectName(e.target.value)}
                    placeholder="Project name"
                    className="bg-background h-9"
                  />
                </div>

                {/* Chart Type */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">Chart Type</label>
                  <ChartTypeSelector
                    selected={config.type}
                    onSelect={(type) => handleConfigUpdate({ ...config, type })}
                  />
                </div>

                {/* Quick Stats */}
                <QuickStats data={data} />

                {/* Tabs */}
                <Tabs defaultValue="data" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 h-9">
                    <TabsTrigger value="data" className="gap-1.5 text-xs">
                      <Database className="h-3.5 w-3.5" />
                      Data
                    </TabsTrigger>
                    <TabsTrigger value="style" className="gap-1.5 text-xs">
                      <Palette className="h-3.5 w-3.5" />
                      Style
                    </TabsTrigger>
                    <TabsTrigger value="config" className="gap-1.5 text-xs">
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
                        className="flex-1 gap-2"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Sample
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRandomData}
                        className="flex-1 gap-2"
                      >
                        <Shuffle className="h-3.5 w-3.5" />
                        Random
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setData({ labels: [], datasets: [] });
                          pushHistory({ labels: [], datasets: [] }, config);
                        }}
                        className="gap-2"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {data.datasets.length > 0 && (
                      <DatasetPanel
                        datasets={data.datasets}
                        onUpdate={handleDataUpdate}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="style" className="space-y-4 mt-4">
                    <DatasetPanel
                      datasets={data.datasets}
                      onUpdate={handleDataUpdate}
                    />
                  </TabsContent>

                  <TabsContent value="config" className="mt-4">
                    <ChartConfigPanel config={config} onUpdate={handleConfigUpdate} />
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </aside>

          {/* Main Chart Area */}
          <main className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col min-h-[55vh] lg:min-h-0">
            <Card className="flex-1 flex flex-col glass shadow-glow animate-fade-in overflow-hidden">
              <CardHeader className="pb-2 flex-shrink-0 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">{config.title || 'Untitled Chart'}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-muted/50 rounded-lg p-0.5">
                      <Button
                        variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 gap-1"
                        onClick={() => setViewMode('chart')}
                      >
                        <BarChart2 className="h-3.5 w-3.5" />
                        <span className="text-xs">Chart</span>
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 gap-1"
                        onClick={() => setViewMode('table')}
                      >
                        <Table2 className="h-3.5 w-3.5" />
                        <span className="text-xs">Table</span>
                      </Button>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs">
                      {config.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4 overflow-hidden">
                {viewMode === 'chart' ? (
                  <ChartRenderer ref={chartRef} data={data} config={config} />
                ) : (
                  <DataTableView data={data} />
                )}
              </CardContent>
            </Card>
          </main>
        </div>

        <ProjectsDialog
          open={projectsOpen}
          onOpenChange={setProjectsOpen}
          onLoadProject={handleLoadProject}
        />
        
        <KeyboardShortcutsDialog 
          open={shortcutsOpen} 
          onOpenChange={setShortcutsOpen} 
        />
      </div>
    </TooltipProvider>
  );
}
