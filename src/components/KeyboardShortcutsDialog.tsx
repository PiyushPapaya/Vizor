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
          <DialogTitle className="text-lg sm:text-xl flex items-center gap-2.5 font-bold tracking-tight">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Keyboard className="h-4 w-4 text-primary" />
            </div>
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground/80">
            Use these shortcuts to work faster
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-4 sm:px-6">
          <div className="space-y-4 pb-4">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest">{category}</h3>
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
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/40 transition-all duration-200"
                    >
                      <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <kbd 
                            key={i}
                          className="px-2.5 py-1 text-xs font-mono font-medium bg-muted/60 rounded-lg border border-border/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
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
        
        <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-border/30">
          <p className="text-xs text-muted-foreground/70 text-center">
            Tip: Use <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium bg-muted/60 rounded-md border border-border/40">Cmd</kbd> instead of <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium bg-muted/60 rounded-md border border-border/40">Ctrl</kbd> on macOS
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
