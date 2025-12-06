import { Upload, FileSpreadsheet, FileJson, FileType } from 'lucide-react';
import { useCallback, useState, memo } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
}

const ACCEPTED_EXTENSIONS = ['.csv', '.json', '.xlsx', '.xls'];

function FileDropzone({ onFileSelect }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback((file: File): boolean => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      toast.error('Use CSV, JSON, or Excel files');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Max 10MB');
      return false;
    }
    return true;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) onFileSelect(file);
  }, [onFileSelect, validateFile]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ACCEPTED_EXTENSIONS.join(',');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && validateFile(file)) onFileSelect(file);
    };
    input.click();
  }, [onFileSelect, validateFile]);

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
      className={cn(
        'cursor-pointer rounded-lg border-2 border-dashed p-4 transition-all duration-150',
        isDragging 
          ? 'border-primary bg-primary/5 scale-[1.01]' 
          : 'border-border/60 hover:border-primary/40 hover:bg-muted/30'
      )}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div className={cn(
          'p-2 rounded-lg transition-colors',
          isDragging ? 'bg-primary/10' : 'bg-muted/50'
        )}>
          <Upload className={cn('h-4 w-4', isDragging ? 'text-primary' : 'text-muted-foreground')} />
        </div>
        <div>
          <p className="text-xs font-medium">
            {isDragging ? 'Drop here' : 'Drop or click'}
          </p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <FileType className="h-2.5 w-2.5" /> CSV
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <FileJson className="h-2.5 w-2.5" /> JSON
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <FileSpreadsheet className="h-2.5 w-2.5" /> Excel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(FileDropzone);
