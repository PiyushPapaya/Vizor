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
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className
    )}>
      <div className="relative mb-4">
        {/* Decorative circles */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl" />
        </div>
        
        <div className="relative p-6 bg-muted/50 rounded-full">
          <Icon className="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>

      <div className="flex gap-2">
        {action && (
          <Button 
            onClick={action.onClick}
            variant={action.variant || 'default'}
            size="lg"
          >
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button 
            onClick={secondaryAction.onClick}
            variant="outline"
            size="lg"
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

// Pre-built empty states for common scenarios
export function NoDataEmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <EmptyState
      icon="database"
      title="Ready to Create Something Amazing? 🎨"
      description="Let's start by uploading your data! We support CSV, Excel, and JSON files. Don't worry, we'll handle the rest! 😊"
      action={{
        label: '📂 Upload Your Data',
        onClick: onUpload,
      }}
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
      title="No Projects Yet 📁"
      description="Create your first project to start building beautiful charts and visualizations. It's quick and easy! ✨"
      action={{
        label: '✨ Create Project',
        onClick: onCreate,
      }}
      secondaryAction={{
        label: '📥 Import Project',
        onClick: onImport,
      }}
    />
  );
}

export function NoChartsEmptyState({ onCreateChart }: { onCreateChart: () => void }) {
  return (
    <EmptyState
      icon="chart"
      title="Let's Make Your First Chart! 📊"
      description="Upload your data and pick a chart type — we'll create something beautiful together! 🎯"
      action={{
        label: '🚀 Get Started',
        onClick: onCreateChart,
      }}
    />
  );
}

export function NoSearchResultsEmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      icon="search"
      title="Hmm, Nothing Found 🔍"
      description={`We couldn't find anything matching "${query}". Try different keywords or start fresh! 💡`}
      action={{
        label: '🔄 Clear Search',
        onClick: onClear,
        variant: 'outline',
      }}
    />
  );
}

export function ErrorEmptyState({ 
  title = 'Oops, Something Went Wrong! 😅',
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
      description={description + " Don't worry, let's try that again!"}
      action={{
        label: '🔄 Try Again',
        onClick: onRetry,
      }}
    />
  );
}
