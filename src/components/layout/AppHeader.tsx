import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Zap, FolderOpen, Save, Download, Plus, Moon, Sun, 
  Undo2, Redo2, Keyboard, Image, Sparkles, Database, HelpCircle, MoreVertical
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
    <header className="h-14 sm:h-16 md:h-14 border-b-2 border-border bg-card/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
        <Link to="/" className="group touch-target-lg flex items-center shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <img 
                src="/vizor-logo.jpeg" 
                alt="Vizor Logo" 
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg object-cover shadow-lg hover:scale-110 transition-transform cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent>Back to Home</TooltipContent>
          </Tooltip>
        </Link>
        <Link to="/" className="hover:opacity-80 transition-opacity shrink-0">
          <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden xs:block">Vizor</span>
        </Link>
        <div className="h-5 w-px bg-border hidden sm:block" />
        <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]">
          {projectName}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Critical Actions - Always Visible */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onNew} className="h-11 w-11 sm:h-12 sm:w-12 p-0 touch-target-lg">
              <Plus className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Project</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onSave} className="h-11 w-11 sm:h-12 sm:w-12 p-0 touch-target-lg">
              <Save className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save Project</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="sm" onClick={onExport} className="h-11 sm:h-12 px-3 sm:px-4 gap-2 touch-target-lg">
              <Image className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-semibold">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export Chart</TooltipContent>
        </Tooltip>

        <div className="h-5 w-px bg-border hidden md:block" />

        {/* Theme Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-11 w-11 sm:h-12 sm:w-12 touch-target-lg hidden sm:flex" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Theme</TooltipContent>
        </Tooltip>

        {/* Overflow Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-11 w-11 sm:h-12 sm:w-12 touch-target-lg">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onOpenProjects} className="h-11 gap-3 text-sm">
              <FolderOpen className="h-4 w-4" />
              <span>Open Projects</span>
            </DropdownMenuItem>
            
            {onOpenTemplates && (
              <DropdownMenuItem onClick={onOpenTemplates} className="h-11 gap-3 text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Templates</span>
              </DropdownMenuItem>
            )}
            
            {onOpenDataConnector && (
              <DropdownMenuItem onClick={onOpenDataConnector} className="h-11 gap-3 text-sm">
                <Database className="h-4 w-4" />
                <span>Data Connectors</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {onUndo && (
              <>
                <DropdownMenuItem onClick={onUndo} disabled={!canUndo} className="h-11 gap-3 text-sm">
                  <Undo2 className="h-4 w-4" />
                  <span>Undo</span>
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+Z</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={onRedo} disabled={!canRedo} className="h-11 gap-3 text-sm">
                  <Redo2 className="h-4 w-4" />
                  <span>Redo</span>
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+Y</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
              </>
            )}

            {onShowShortcuts && (
              <DropdownMenuItem onClick={onShowShortcuts} className="h-11 gap-3 text-sm">
                <Keyboard className="h-4 w-4" />
                <span>Keyboard Shortcuts</span>
              </DropdownMenuItem>
            )}

            {onShowHelp && (
              <DropdownMenuItem onClick={onShowHelp} className="h-11 gap-3 text-sm">
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator className="sm:hidden" />
            
            <DropdownMenuItem onClick={() => setIsDark(!isDark)} className="h-11 gap-3 text-sm sm:hidden">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default memo(AppHeader);
