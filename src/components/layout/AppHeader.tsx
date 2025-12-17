import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Zap, FolderOpen, Save, Download, Plus, Moon, Sun, 
  Undo2, Redo2, Keyboard, Image, Sparkles, Database, HelpCircle
} from 'lucide-react';
import { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';

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
  onShowHelp?: () => void;
  onOpenTemplates?: () => void;
  onOpenDataConnector?: () => void;
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
  onShowHelp,
  onOpenTemplates,
  onOpenDataConnector,
}: AppHeaderProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <header className="h-12 border-b border-border bg-card/80 backdrop-blur-md px-2 sm:px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link to="/" className="group">
            <Tooltip>
              <TooltipTrigger asChild>
                <img 
                  src="/vizor-logo.jpeg" 
                  alt="Vizor Logo" 
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-cover shadow-lg hover:scale-110 transition-transform cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>Back to Home</TooltipContent>
            </Tooltip>
          </Link>
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <span className="font-bold text-sm sm:text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">Vizor</span>
          </Link>
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

        {onOpenTemplates && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onOpenTemplates} className="h-7 sm:h-8 px-2 gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden lg:inline text-xs">Templates</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Chart Templates</TooltipContent>
          </Tooltip>
        )}

        {onOpenDataConnector && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onOpenDataConnector} className="h-7 sm:h-8 px-2 gap-1">
                <Database className="h-3.5 w-3.5" />
                <span className="hidden lg:inline text-xs">Data</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Data Connectors</TooltipContent>
          </Tooltip>
        )}

        <div className="h-4 w-px bg-border mx-0.5 hidden sm:block" />

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
            <Button variant="secondary" size="sm" onClick={onExport} className="h-7 sm:h-8 px-2 gap-1" data-tour="export-button">
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

        {onShowHelp && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={onShowHelp}>
                <HelpCircle className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Help (Ctrl+/)</TooltipContent>
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
