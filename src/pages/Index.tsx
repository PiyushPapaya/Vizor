import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { ChartData, ChartConfig, Project } from '@/types/chart';
import { parseFile, generateSampleData } from '@/lib/data-parser';
import { saveProject, createNewProject } from '@/lib/project-storage';
import AppHeader from '@/components/layout/AppHeader';
import ChartRenderer, { ChartRendererRef } from '@/components/charts/ChartRenderer';
import ChartTypeSelector from '@/components/charts/ChartTypeSelector';
import DatasetPanel from '@/components/charts/DatasetPanel';
import ChartConfigPanel from '@/components/charts/ChartConfigPanel';
import FileDropzone from '@/components/FileDropzone';
import ProjectsDialog from '@/components/ProjectsDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Database, Settings, Palette, Sparkles, RefreshCw } from 'lucide-react';

export default function Index() {
  const chartRef = useRef<ChartRendererRef>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);
  
  const [project, setProject] = useState<Project>(() => createNewProject());
  const [data, setData] = useState<ChartData>(() => project.data);
  const [config, setConfig] = useState<ChartConfig>(() => project.config);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const parsedData = await parseFile(file);
      setData(parsedData);
      toast.success(`Imported ${parsedData.datasets.length} dataset(s) from ${file.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse file');
    }
  }, []);

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

  const handleLoadProject = useCallback((loadedProject: Project) => {
    setProject(loadedProject);
    setData(loadedProject.data);
    setConfig(loadedProject.config);
    toast.success(`Loaded project: ${loadedProject.name}`);
  }, []);

  const updateProjectName = (name: string) => {
    setProject(prev => ({ ...prev, name }));
    setConfig(prev => ({ ...prev, title: name }));
  };

  const handleLoadSampleData = () => {
    setData(generateSampleData());
    toast.success('Sample data loaded');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        projectName={project.name}
        onSave={handleSave}
        onNew={handleNew}
        onExport={handleExport}
        onOpenProjects={() => setProjectsOpen(true)}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-border bg-card/50 flex flex-col max-h-[40vh] lg:max-h-none">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-5">
              {/* Project Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Project Name</label>
                  <Badge variant="secondary" className="text-xs">
                    {data.datasets.length} dataset{data.datasets.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <Input
                  value={project.name}
                  onChange={(e) => updateProjectName(e.target.value)}
                  placeholder="Project name"
                  className="bg-background"
                />
              </div>

              {/* Chart Type */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Chart Type</label>
                <ChartTypeSelector
                  selected={config.type}
                  onSelect={(type) => setConfig(prev => ({ ...prev, type }))}
                />
              </div>

              {/* Tabs */}
              <Tabs defaultValue="data" className="w-full">
                <TabsList className="w-full grid grid-cols-3 h-10">
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
                      Load Sample
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setData({ labels: [], datasets: [] })}
                      className="gap-2"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Clear
                    </Button>
                  </div>

                  {data.datasets.length > 0 && (
                    <DatasetPanel
                      datasets={data.datasets}
                      onUpdate={(datasets) => setData(prev => ({ ...prev, datasets }))}
                    />
                  )}
                </TabsContent>

                <TabsContent value="style" className="space-y-4 mt-4">
                  <DatasetPanel
                    datasets={data.datasets}
                    onUpdate={(datasets) => setData(prev => ({ ...prev, datasets }))}
                  />
                </TabsContent>

                <TabsContent value="config" className="mt-4">
                  <ChartConfigPanel config={config} onUpdate={setConfig} />
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Chart Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col min-h-[60vh] lg:min-h-0">
          <Card className="flex-1 flex flex-col glass shadow-glow animate-fade-in overflow-hidden">
            <CardHeader className="pb-2 flex-shrink-0 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">{config.title || 'Untitled Chart'}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {config.type} Chart
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-hidden">
              <ChartRenderer ref={chartRef} data={data} config={config} />
            </CardContent>
          </Card>
        </main>
      </div>

      <ProjectsDialog
        open={projectsOpen}
        onOpenChange={setProjectsOpen}
        onLoadProject={handleLoadProject}
      />
    </div>
  );
}
