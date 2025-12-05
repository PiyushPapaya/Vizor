import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { ChartData, ChartConfig, Project, DEFAULT_CHART_CONFIG } from '@/types/chart';
import { parseFile, generateSampleData, generateId } from '@/lib/data-parser';
import { saveProject, createNewProject, getProject } from '@/lib/project-storage';
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
import { Database, Settings, Palette } from 'lucide-react';

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
    setConfig(prev => ({ ...prev, name }));
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

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card/30 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                value={project.name}
                onChange={(e) => updateProjectName(e.target.value)}
                placeholder="Project name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Type</label>
              <ChartTypeSelector
                selected={config.type}
                onSelect={(type) => setConfig(prev => ({ ...prev, type }))}
              />
            </div>

            <Tabs defaultValue="data" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="data" className="gap-1.5">
                  <Database className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Data</span>
                </TabsTrigger>
                <TabsTrigger value="style" className="gap-1.5">
                  <Palette className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Style</span>
                </TabsTrigger>
                <TabsTrigger value="config" className="gap-1.5">
                  <Settings className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Config</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="data" className="space-y-4 mt-4">
                <FileDropzone onFileSelect={handleFileSelect} />
                <DatasetPanel
                  datasets={data.datasets}
                  onUpdate={(datasets) => setData(prev => ({ ...prev, datasets }))}
                />
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
        </aside>

        {/* Main Chart Area */}
        <main className="flex-1 p-4 lg:p-6">
          <Card className="h-full glass shadow-glow animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{config.title || 'Untitled Chart'}</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
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
