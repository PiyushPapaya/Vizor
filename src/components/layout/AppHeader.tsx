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
  Undo2, Redo2, Keyboard, Image, Sparkles, Database, HelpCircle, MoreVertical, BookmarkPlus
} from 'lucide-react';
import { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

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
  onSaveAsTemplate?: () => void;
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
  onSaveAsTemplate,
}: AppHeaderProps) {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <header className="h-12 sm:h-14 border-b border-border/40 bg-gradient-to-r from-card/95 via-card/90 to-card/95 backdrop-blur-xl px-2.5 sm:px-3.5 md:px-5 flex items-center justify-between shrink-0 shadow-depth-sm relative overflow-hidden">
      {/* Subtle gradient overlay like landing nav */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-accent/[0.02] pointer-events-none" />
      
      <div className="relative flex items-center gap-1.5 sm:gap-2.5 md:gap-3.5 min-w-0 flex-1 mr-2">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 shrink-0">
          <Link to="/" className="group touch-target-lg flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-lg opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
                  <img 
                    src="/vizor-logo.jpeg" 
                    alt="Vizor Logo" 
                    className="relative h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg object-cover shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex-shrink-0 border border-border/30"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>Back to Home</TooltipContent>
            </Tooltip>
          </Link>
          <Link to="/" className="hover:opacity-80 transition-opacity touch-target flex items-center">
            <span className="font-bold text-sm sm:text-base md:text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden xs:block">Vizor</span>
          </Link>
        </div>
        <div className="h-3.5 w-px bg-border hidden sm:block" />
        <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-[200px]">
          {projectName}
        </span>
      </div>

      {/* Desktop Actions - Original Layout (lg and above) */}
      <div className="hidden lg:flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        {onUndo && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} className="h-7 w-7 sm:h-8 sm:w-8">
                  <Undo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} className="h-7 w-7 sm:h-8 sm:w-8">
                  <Redo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
            <div className="h-3.5 w-px bg-border mx-0.5" />
          </>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onNew} className="h-7 sm:h-8 px-1.5 sm:px-2 gap-1">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline text-xs">New</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New (Ctrl+N)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onOpenProjects} className="h-7 sm:h-8 px-1.5 sm:px-2 gap-1">
              <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline text-xs">Open</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Projects (Ctrl+O)</TooltipContent>
        </Tooltip>

        {onOpenTemplates && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onOpenTemplates} className="h-7 sm:h-8 px-1.5 sm:px-2 gap-1" data-tour="templates">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline text-xs">Templates</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Chart Templates</TooltipContent>
          </Tooltip>
        )}

        {onSaveAsTemplate && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onSaveAsTemplate} className="h-8 sm:h-9 px-1.5 sm:px-2 gap-1">
                <BookmarkPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xl:inline text-xs">Save Template</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save as Template</TooltipContent>
          </Tooltip>
        )}

        {onOpenDataConnector && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onOpenDataConnector} className="h-8 sm:h-9 px-1.5 sm:px-2 gap-1">
                <Database className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline text-xs">Data</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Data Connectors</TooltipContent>
          </Tooltip>
        )}

        <div className="h-4 w-px bg-border mx-0.5" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onSave} className="h-8 sm:h-9 px-1.5 sm:px-2 gap-1">
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline text-xs">Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save (Ctrl+S)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              onClick={onExport} 
              className="h-9 sm:h-10 px-3 sm:px-4 gap-1.5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-0" 
              data-tour="export-button"
            >
              <Image className="h-4 w-4" />
              <span className="text-xs font-semibold">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export PNG (Ctrl+E)</TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-border mx-0.5" />

        {onShowShortcuts && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={onShowShortcuts} data-tour="keyboard-shortcuts">
                <Keyboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Shortcuts</TooltipContent>
          </Tooltip>
        )}

        {onShowHelp && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={onShowHelp}>
                <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('shortcuts.help')}</TooltipContent>
          </Tooltip>
        )}

        <LanguageSelector variant="compact" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('aria.themeToggle')}</TooltipContent>
        </Tooltip>
      </div>

      {/* Mobile Actions - Optimized Layout (below lg) */}
      <div className="flex lg:hidden items-center gap-1 sm:gap-2 flex-shrink-0">
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
            <Button 
              size="sm" 
              onClick={onExport} 
              className="h-11 sm:h-12 px-4 sm:px-5 gap-2 touch-target-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            >
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
