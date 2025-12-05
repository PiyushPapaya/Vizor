import { Project } from '@/types/chart';
import { getProjects, deleteProject, exportProjectToFile } from '@/lib/project-storage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Your Projects
          </DialogTitle>
          <DialogDescription>
            Load or manage your saved chart projects.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No saved projects yet.</p>
              <p className="text-sm mt-1">Create a chart and save it to see it here.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  onLoadProject(project);
                  onOpenChange(false);
                }}
                className="group p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Updated {format(new Date(project.updatedAt), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span className="capitalize">{project.config.type} chart</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => handleExport(project, e)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => handleDelete(project.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
