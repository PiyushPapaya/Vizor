import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  BarChart3, FolderOpen, Save, Download, Plus, Moon, Sun, 
  Undo2, Redo2, Keyboard, FileSpreadsheet, Image
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface AppHeaderProps {
  projectName: string;
  onSave: () => void;
  onNew: () => void;
  onExport: () => void;
  onExportSVG?: () => void;
  onOpenProjects: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onShowShortcuts?: () => void;
}

export default function AppHeader({ 
  projectName, 
  onSave, 
  onNew, 
  onExport,
  onExportSVG,
  onOpenProjects,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onShowShortcuts,
}: AppHeaderProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg gradient-primary shadow-lg">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">DataViz</span>
        </div>
        <div className="h-5 w-px bg-border" />
        <span className="text-sm text-muted-foreground max-w-[150px] truncate">{projectName}</span>
      </div>

      <div className="flex items-center gap-1">
        {/* Undo/Redo */}
        {onUndo && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onUndo} 
                disabled={!canUndo}
                className="h-8 w-8"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>
        )}
        {onRedo && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onRedo}
                disabled={!canRedo}
                className="h-8 w-8"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>
        )}

        <div className="h-5 w-px bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onNew} className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Project (Ctrl+N)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onOpenProjects} className="gap-1.5">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open Projects (Ctrl+O)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onSave} className="gap-1.5">
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save Project (Ctrl+S)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={onExport} className="gap-1.5">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">PNG</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export as PNG (Ctrl+E)</TooltipContent>
        </Tooltip>

        {onExportSVG && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onExportSVG} className="gap-1.5">
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">SVG</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export as SVG</TooltipContent>
          </Tooltip>
        )}

        <div className="h-5 w-px bg-border mx-1" />

        {onShowShortcuts && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onShowShortcuts}
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Keyboard Shortcuts (?)</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Theme (Ctrl+D)</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
