import { Button } from '@/components/ui/button';
import { BarChart3, FolderOpen, Save, Download, Plus, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AppHeaderProps {
  projectName: string;
  onSave: () => void;
  onNew: () => void;
  onExport: () => void;
  onOpenProjects: () => void;
}

export default function AppHeader({ projectName, onSave, onNew, onExport, onOpenProjects }: AppHeaderProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg gradient-primary">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-lg">DataViz</span>
        </div>
        <div className="h-5 w-px bg-border" />
        <span className="text-sm text-muted-foreground">{projectName}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onNew} className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onOpenProjects} className="gap-1.5">
          <FolderOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Projects</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onSave} className="gap-1.5">
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button variant="secondary" size="sm" onClick={onExport} className="gap-1.5">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <div className="h-5 w-px bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
