import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size], className)} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

interface LoadingOverlayProps {
  text?: string;
  transparent?: boolean;
}

export function LoadingOverlay({ text = 'Loading...', transparent = false }: LoadingOverlayProps) {
  return (
    <div className={cn(
      'absolute inset-0 flex items-center justify-center z-50',
      transparent ? 'bg-background/50 backdrop-blur-sm' : 'bg-background'
    )}>
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Skeleton loaders for different content types
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  );
}

export function ChartSkeleton() {
  return (
    <div className="space-y-3 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-3">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

interface LoadingStateProps {
  type?: 'spinner' | 'chart' | 'table' | 'card';
  text?: string;
  rows?: number;
}

export function LoadingState({ type = 'spinner', text, rows }: LoadingStateProps) {
  switch (type) {
    case 'chart':
      return <ChartSkeleton />;
    case 'table':
      return <TableSkeleton rows={rows} />;
    case 'card':
      return <CardSkeleton />;
    default:
      return (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text={text} />
        </div>
      );
  }
}
