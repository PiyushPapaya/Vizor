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
    <header className="h-12 sm:h-14 border-b border-border bg-card/80 backdrop-blur-md px-2 sm:px-3 md:px-4 flex items-center justify-between shrink-0 touch-target">
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1 mr-2">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
          <Link to="/" className="group touch-target flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <img 
                  src="/vizor-logo.jpeg" 
                  alt="Vizor Logo" 
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-lg object-cover shadow-lg hover:scale-110 transition-transform cursor-pointer flex-shrink-0"
                />
              </TooltipTrigger>
              <TooltipContent>Back to Home</TooltipContent>
            </Tooltip>
          </Link>
          <Link to="/" className="hover:opacity-80 transition-opacity touch-target flex items-center">
            <span className="font-bold text-xs sm:text-sm md:text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden xs:block">Vizor</span>
          </Link>
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-[200px]">
          {projectName}
        </span>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        {onUndo && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} className="h-8 w-8 sm:h-9 sm:w-9 touch-target hidden xs:flex">
                  <Undo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} className="h-8 w-8 sm:h-9 sm:w-9 touch-target hidden xs:flex">
                  <Redo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
            <div className="h-4 w-px bg-border mx-0.5 hidden md:block" />
          </>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onNew} className="h-8 sm:h-9 px-1.5 sm:px-2 gap-1 touch-target">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline text-xs\">New</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New (Ctrl+N)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onOpenProjects} className="h-8 sm:h-9 px-1.5 sm:px-2 gap-1 touch-target">
              <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline text-xs">Open</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Projects (Ctrl+O)</TooltipContent>
        </Tooltip>

        {onOpenTemplates && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onOpenTemplates} className="h-8 sm:h-9 px-1.5 sm:px-2 gap-1 touch-target hidden sm:flex">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline text-xs">Templates</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Chart Templates</TooltipContent>
          </Tooltip>
        )}

        {onOpenDataConnector && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onOpenDataConnector} className="h-8 sm:h-9 px-1.5 sm:px-2 gap-1 touch-target hidden md:flex">
                <Database className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline text-xs">Data</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Data Connectors</TooltipContent>
          </Tooltip>
        )}

        <div className="h-4 w-px bg-border mx-0.5 hidden md:block" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onSave} className="h-8 sm:h-9 px-1.5 sm:px-2 gap-1 touch-target">
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline text-xs">Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save (Ctrl+S)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={onExport} className="h-8 sm:h-9 px-2 sm:px-3 gap-1 touch-target" data-tour="export-button">
              <Image className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline text-xs">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export PNG (Ctrl+E)</TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-border mx-0.5 hidden sm:block" />

        {onShowShortcuts && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hidden md:flex touch-target" onClick={onShowShortcuts}>
                <Keyboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Shortcuts</TooltipContent>
          </Tooltip>
        )}

        {onShowHelp && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 touch-target" onClick={onShowHelp}>
                <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Help (Ctrl+/)</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 touch-target" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Theme</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}

export default memo(AppHeader);
