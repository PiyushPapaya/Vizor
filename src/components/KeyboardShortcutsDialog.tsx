import { motion } from 'framer-motion';
import { listContainerVariants, listItemVariants } from '@/lib/animations';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  { keys: ['Ctrl', 'S'], description: 'Save project', category: 'File' },
  { keys: ['Ctrl', 'N'], description: 'New project', category: 'File' },
  { keys: ['Ctrl', 'O'], description: 'Open projects', category: 'File' },
  { keys: ['Ctrl', 'E'], description: 'Export chart as PNG', category: 'File' },
  { keys: ['Ctrl', 'I'], description: 'Import data', category: 'Data' },
  { keys: ['Ctrl', 'T'], description: 'Open templates', category: 'View' },
  { keys: ['Ctrl', 'Z'], description: 'Undo', category: 'Edit' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo', category: 'Edit' },
  { keys: ['Ctrl', 'Y'], description: 'Redo (alternative)', category: 'Edit' },
  { keys: ['Ctrl', 'D'], description: 'Toggle dark/light mode', category: 'View' },
  { keys: ['Ctrl', ','], description: 'Settings & Tutorial', category: 'View' },
  { keys: ['Ctrl', '/'], description: 'Show help', category: 'Help' },
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Help' },
];

export default function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, typeof shortcuts>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4">
          <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Use these shortcuts to work faster
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-4 sm:px-6">
          <div className="space-y-4 pb-4">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">{category}</h3>
                <motion.div 
                  className="space-y-1"
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {categoryShortcuts.map((shortcut, index) => (
                    <motion.div 
                      key={index}
                      variants={listItemVariants}
                      className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <kbd 
                            key={i}
                            className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border shadow-sm"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            💡 Tip: Use <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded border border-border">Cmd</kbd> instead of <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded border border-border">Ctrl</kbd> on macOS
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
