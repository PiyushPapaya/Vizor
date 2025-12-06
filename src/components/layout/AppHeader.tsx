import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  BarChart3, FolderOpen, Save, Download, Plus, Moon, Sun, 
  Undo2, Redo2, Keyboard, Image
} from 'lucide-react';
import { useEffect, useState, memo } from 'react';

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

function AppHeader({ 
  projectName, 
  onSave, 
  onNew, 
  onExport,
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

  return (
    <header className="h-12 border-b border-border bg-card/80 backdrop-blur-md px-2 sm:px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="p-1 sm:p-1.5 rounded-md gradient-primary">
            <BarChart3 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm sm:text-base hidden sm:block">DataViz</span>
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[100px] sm:max-w-[150px]">
          {projectName}
        </span>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {onUndo && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} className="h-7 w-7 sm:h-8 sm:w-8">
                  <Undo2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} className="h-7 w-7 sm:h-8 sm:w-8">
                  <Redo2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
            <div className="h-4 w-px bg-border mx-0.5 hidden sm:block" />
          </>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onNew} className="h-7 sm:h-8 px-2 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden lg:inline text-xs">New</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onOpenProjects} className="h-7 sm:h-8 px-2 gap-1">
              <FolderOpen className="h-3.5 w-3.5" />
              <span className="hidden lg:inline text-xs">Open</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Projects</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onSave} className="h-7 sm:h-8 px-2 gap-1">
              <Save className="h-3.5 w-3.5" />
              <span className="hidden lg:inline text-xs">Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={onExport} className="h-7 sm:h-8 px-2 gap-1">
              <Image className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export PNG</TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-border mx-0.5" />

        {onShowShortcuts && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:flex" onClick={onShowShortcuts}>
                <Keyboard className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Shortcuts</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Theme</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}

export default memo(AppHeader);
