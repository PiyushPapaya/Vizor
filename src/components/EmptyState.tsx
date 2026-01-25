import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  FileQuestion, 
  FolderOpen, 
  BarChart3, 
  Database,
  Search,
  AlertCircle,
  Upload,
  Plus
} from 'lucide-react';

interface EmptyStateProps {
  icon?: 'file' | 'folder' | 'chart' | 'database' | 'search' | 'alert';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const icons = {
  file: FileQuestion,
  folder: FolderOpen,
  chart: BarChart3,
  database: Database,
  search: Search,
  alert: AlertCircle,
};

export function EmptyState({
  icon = 'file',
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-16 px-6 text-center relative',
      className
    )}>
      {/* Floating orbs matching landing page style */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/12 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>
      
      <div className="relative mb-6">
        {/* Gradient ring behind icon */}
        <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl" />
        
        <div className="relative p-7 bg-gradient-to-br from-muted/80 to-muted/50 rounded-full border-2 border-border/30 shadow-depth-sm backdrop-blur-sm">
          <Icon className="w-14 h-14 text-primary/70" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-8 text-base leading-relaxed">{description}</p>

      <div className="flex gap-3">
        {action && (
          <Button 
            onClick={action.onClick}
            variant={action.variant || 'default'}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 px-6 h-12"
          >
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button 
            onClick={secondaryAction.onClick}
            variant="outline"
            size="lg"
            className="border-2 h-12 px-6"
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

// Pre-built empty states for common scenarios
export function NoDataEmptyState({ onUpload, onCreateTable }: { onUpload: () => void; onCreateTable?: () => void }) {
  return (
    <EmptyState
      icon="database"
      title="Get Started with Your Data"
      description="Upload your data file (CSV, Excel, or JSON) to create beautiful visualizations, or start with a blank table to enter data manually."
      action={{
        label: 'Upload Data',
        onClick: onUpload,
      }}
      secondaryAction={onCreateTable ? {
        label: 'Create Table',
        onClick: onCreateTable,
      } : undefined}
    />
  );
}

export function NoProjectsEmptyState({ 
  onCreate, 
  onImport 
}: { 
  onCreate: () => void; 
  onImport: () => void;
}) {
  return (
    <EmptyState
      icon="folder"
      title="No Projects Yet"
      description="Create your first project to start building beautiful charts and visualizations."
      action={{
        label: 'Create Project',
        onClick: onCreate,
      }}
      secondaryAction={{
        label: 'Import Project',
        onClick: onImport,
      }}
    />
  );
}

export function NoChartsEmptyState({ onCreateChart }: { onCreateChart: () => void }) {
  return (
    <EmptyState
      icon="chart"
      title="Create Your First Chart"
      description="Upload your data and select a chart type to begin visualizing your information."
      action={{
        label: 'Get Started',
        onClick: onCreateChart,
      }}
    />
  );
}

export function NoSearchResultsEmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      icon="search"
      title="No Results Found"
      description={`No matches found for "${query}". Try different keywords or clear your search.`}
      action={{
        label: 'Clear Search',
        onClick: onClear,
        variant: 'outline',
      }}
    />
  );
}

export function ErrorEmptyState({ 
  title = 'Something Went Wrong',
  description,
  onRetry 
}: { 
  title?: string;
  description: string; 
  onRetry: () => void;
}) {
  return (
    <EmptyState
      icon="alert"
      title={title}
      description={description}
      action={{
        label: 'Try Again',
        onClick: onRetry,
      }}
    />
  );
}
