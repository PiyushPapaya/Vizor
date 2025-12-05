import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
}

export default function FileDropzone({ onFileSelect, accept = '.csv,.json', className }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validExtensions = accept.split(',').map(ext => ext.trim().replace('.', ''));
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      setError(`Invalid file type. Accepted: ${accept}`);
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size: 10MB');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect, accept]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        'relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer',
        'hover:border-primary/50 hover:bg-primary/5',
        isDragging && 'border-primary bg-primary/10 scale-[1.02]',
        error && 'border-destructive',
        className
      )}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
        <div className={cn(
          'p-4 rounded-full transition-colors',
          isDragging ? 'bg-primary/20' : 'bg-muted'
        )}>
          {error ? (
            <AlertCircle className="h-8 w-8 text-destructive" />
          ) : (
            <Upload className={cn('h-8 w-8', isDragging ? 'text-primary' : 'text-muted-foreground')} />
          )}
        </div>
        
        <div className="text-center">
          <p className="font-medium">
            {isDragging ? 'Drop your file here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports CSV, JSON files (max 10MB)
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">CSV, JSON</span>
        </div>
      </div>
    </div>
  );
}
