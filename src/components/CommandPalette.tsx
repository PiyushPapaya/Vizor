import { useState, useEffect, useCallback } from 'react';
import { Command } from 'cmdk';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  FileUp, Download, Save, Undo2, Redo2, 
  Settings, HelpCircle, Sun, Moon, Palette,
  BarChart, LineChart, PieChart, FileText,
  Plus, FolderOpen, Play, Keyboard
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction?: (action: string) => void;
}

interface CommandItem {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
  category: 'actions' | 'navigation' | 'data' | 'chart' | 'export' | 'settings';
  shortcut?: string;
  action?: () => void;
}

export function CommandPalette({ open, onOpenChange, onAction }: CommandPaletteProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState('');

  const commands: CommandItem[] = [
    // Actions
    {
      id: 'new-project',
      labelKey: 'commandPalette.commands.newProject',
      icon: <Plus className="h-4 w-4" />,
      category: 'actions',
      shortcut: '⌘N',
    },
    {
      id: 'open-project',
      labelKey: 'commandPalette.commands.openProject',
      icon: <FolderOpen className="h-4 w-4" />,
      category: 'actions',
      shortcut: '⌘P',
    },
    {
      id: 'save-project',
      labelKey: 'commandPalette.commands.saveProject',
      icon: <Save className="h-4 w-4" />,
      category: 'actions',
      shortcut: '⌘S',
    },
    {
      id: 'undo',
      labelKey: 'commandPalette.commands.undoAction',
      icon: <Undo2 className="h-4 w-4" />,
      category: 'actions',
      shortcut: '⌘Z',
    },
    {
      id: 'redo',
      labelKey: 'commandPalette.commands.redoAction',
      icon: <Redo2 className="h-4 w-4" />,
      category: 'actions',
      shortcut: '⌘⇧Z',
    },
    // Data
    {
      id: 'import-data',
      labelKey: 'commandPalette.commands.importData',
      icon: <FileUp className="h-4 w-4" />,
      category: 'data',
    },
    // Chart
    {
      id: 'change-chart-type',
      labelKey: 'commandPalette.commands.changeChartType',
      icon: <BarChart className="h-4 w-4" />,
      category: 'chart',
    },
    // Export
    {
      id: 'export-chart',
      labelKey: 'commandPalette.commands.exportChart',
      icon: <Download className="h-4 w-4" />,
      category: 'export',
      shortcut: '⌘E',
    },
    // Settings
    {
      id: 'toggle-theme',
      labelKey: 'commandPalette.commands.toggleTheme',
      icon: theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
      category: 'settings',
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    },
    {
      id: 'open-settings',
      labelKey: 'commandPalette.commands.openSettings',
      icon: <Settings className="h-4 w-4" />,
      category: 'settings',
    },
    {
      id: 'open-help',
      labelKey: 'commandPalette.commands.openHelp',
      icon: <HelpCircle className="h-4 w-4" />,
      category: 'settings',
      shortcut: '⌘/',
    },
    {
      id: 'start-tutorial',
      labelKey: 'commandPalette.commands.startTutorial',
      icon: <Play className="h-4 w-4" />,
      category: 'settings',
    },
  ];

  const handleSelect = useCallback((commandId: string) => {
    const command = commands.find(c => c.id === commandId);
    if (command?.action) {
      command.action();
    }
    onAction?.(commandId);
    onOpenChange(false);
    setSearch('');
  }, [commands, onAction, onOpenChange]);

  // Group commands by category
  const groupedCommands = commands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const categories = Object.keys(groupedCommands) as Array<keyof typeof groupedCommands>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-lg">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <DialogDescription className="sr-only">Search and execute commands quickly</DialogDescription>
        <Command className="rounded-lg border-none shadow-lg">
          <div className="flex items-center border-b px-3">
            <Keyboard className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder={t('commandPalette.placeholder')}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              {t('commandPalette.noResults')}
            </Command.Empty>
            
            {categories.map(category => (
              <Command.Group 
                key={category} 
                heading={t(`commandPalette.categories.${category}`)}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
              >
                {groupedCommands[category].map(command => (
                  <Command.Item
                    key={command.id}
                    value={command.id}
                    onSelect={() => handleSelect(command.id)}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    )}
                  >
                    <span className="mr-2 text-muted-foreground">{command.icon}</span>
                    <span>{t(command.labelKey)}</span>
                    {command.shortcut && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {command.shortcut}
                      </span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

// Hook to manage command palette state
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return { open, setOpen };
}

export default CommandPalette;
