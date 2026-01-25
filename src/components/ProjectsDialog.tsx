import { Project } from '@/types/chart';
import { getProjects, deleteProject, exportProjectToFile } from '@/lib/project-storage';
import { motion } from 'framer-motion';
import { listContainerVariants, listItemVariants, hoverLift, tapScale } from '@/lib/animations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Download, FolderOpen, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadProject: (project: Project) => void;
}

export default function ProjectsDialog({ open, onOpenChange, onLoadProject }: ProjectsDialogProps) {
  const projects = getProjects();

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProject(id);
    onOpenChange(true); // Force refresh
  };

  const handleExport = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    exportProjectToFile(project);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4">
          <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Your Projects
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Load or manage your saved chart projects.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 sm:px-6">
          <motion.div 
            className="space-y-2 pb-4"
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No saved projects yet.</p>
              <p className="text-sm mt-1">Create a chart and save it to see it here.</p>
            </div>
          ) : (
            projects.map((project) => (
              <motion.div
                key={project.id}
                variants={listItemVariants}
                whileHover={hoverLift}
                whileTap={tapScale}
                onClick={() => {
                  onLoadProject(project);
                  onOpenChange(false);
                }}
                className="group p-3 sm:p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all touch-target-critical"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium truncate">{project.name}</h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1 text-[10px] sm:text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Updated {format(new Date(project.updatedAt), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span className="capitalize">{project.config.type} chart</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 touch-target-secondary"
                      onClick={(e) => handleExport(project, e)}
                    >
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive touch-target-secondary"
                      onClick={(e) => handleDelete(project.id, e)}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
