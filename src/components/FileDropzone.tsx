import { Upload, FileSpreadsheet, FileJson, FileType, Link as LinkIcon, Download } from 'lucide-react';
import { useCallback, useState, memo } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseCSV, parseJSON, parseExcel } from '@/lib/data-parser';
import { ChartData } from '@/types/chart';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  onUrlImport?: (data: ChartData) => void;
}

const ACCEPTED_EXTENSIONS = ['.csv', '.json', '.xlsx', '.xls'];

function FileDropzone({ onFileSelect, onUrlImport }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

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

  const handleUrlImport = useCallback(async () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    if (!onUrlImport) {
      toast.error('URL import not supported');
      return;
    }

    setIsLoadingUrl(true);

    try {
      const url = urlInput.trim();
      let fileExtension = '';
      
      // Detect file type from URL
      if (url.includes('.csv')) fileExtension = 'csv';
      else if (url.includes('.json')) fileExtension = 'json';
      else if (url.includes('.xlsx') || url.includes('.xls')) fileExtension = 'excel';
      else {
        // Try to detect from content-type
        toast.info('Detecting file type...');
      }

      const response = await fetch(url, {
        mode: 'cors',
        headers: {
          'Accept': 'text/csv, application/json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      // Detect from content-type if not detected from URL
      if (!fileExtension) {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('csv') || contentType?.includes('text')) {
          fileExtension = 'csv';
        } else if (contentType?.includes('json')) {
          fileExtension = 'json';
        } else if (contentType?.includes('spreadsheet') || contentType?.includes('excel')) {
          fileExtension = 'excel';
        } else {
          fileExtension = 'csv'; // Default to CSV
        }
      }

      let data: ChartData;

      if (fileExtension === 'csv') {
        const text = await response.text();
        data = parseCSV(text);
      } else if (fileExtension === 'json') {
        const text = await response.text();
        data = parseJSON(text);
      } else if (fileExtension === 'excel') {
        const blob = await response.blob();
        const file = new File([blob], 'imported.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        data = await parseExcel(file);
      } else {
        throw new Error('Unsupported file type');
      }

      onUrlImport(data);
      toast.success('File imported successfully from URL!');
      setUrlInput('');
    } catch (error: any) {
      console.error('URL import error:', error);
      if (error.message.includes('CORS')) {
        toast.error('CORS error: The URL must allow cross-origin requests');
      } else {
        toast.error(error.message || 'Failed to import from URL');
      }
    } finally {
      setIsLoadingUrl(false);
    }
  }, [urlInput, onUrlImport]);

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload" className="text-xs">
          <Upload className="h-3 w-3 mr-1.5" />
          Upload File
        </TabsTrigger>
        <TabsTrigger value="url" className="text-xs">
          <LinkIcon className="h-3 w-3 mr-1.5" />
          Import from URL
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-2">
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          className={cn(
            'cursor-pointer rounded-lg border-2 border-dashed p-3 sm:p-4 transition-all duration-200 touch-target',
            'ease-[cubic-bezier(0.34,1.56,0.64,1)]',
            isDragging 
              ? 'border-primary bg-primary/15 scale-[1.03] shadow-glow-primary' 
              : 'border-border/60 hover:border-primary/60 hover:bg-primary/8 hover:scale-[1.01]'
          )}
        >
          <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
            <div className={cn(
              'p-1.5 sm:p-2 rounded-lg transition-colors',
              isDragging ? 'bg-primary/10' : 'bg-muted/50'
            )}>
              <Upload className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', isDragging ? 'text-primary' : 'text-muted-foreground')} />
            </div>
            <div>
              <p className="text-xs font-medium">
                {isDragging ? 'Drop here' : 'Drop or click'}
              </p>
              <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 whitespace-nowrap">
                  <FileType className="h-2.5 w-2.5" /> CSV
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 whitespace-nowrap">
                  <FileJson className="h-2.5 w-2.5" /> JSON
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 whitespace-nowrap">
                  <FileSpreadsheet className="h-2.5 w-2.5" /> Excel
                </span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="url" className="mt-2 space-y-2">
        <div className="rounded-lg border-2 border-dashed border-border/60 p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LinkIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <p className="text-xs font-medium">Import from online file</p>
            </div>
            
            <Input
              type="url"
              placeholder="https://example.com/data.csv"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlImport()}
              className="text-xs touch-target"
              disabled={isLoadingUrl}
            />

            <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-0.5 whitespace-nowrap">
                <FileType className="h-2.5 w-2.5" /> CSV
              </span>
              <span className="flex items-center gap-0.5 whitespace-nowrap">
                <FileJson className="h-2.5 w-2.5" /> JSON
              </span>
              <span className="flex items-center gap-0.5 whitespace-nowrap">
                <FileSpreadsheet className="h-2.5 w-2.5" /> Excel
              </span>
            </div>

            <Button 
              onClick={handleUrlImport} 
              disabled={isLoadingUrl || !urlInput.trim()}
              size="sm"
              className="w-full touch-target"
            >
              {isLoadingUrl ? (
                <>
                  <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 animate-pulse" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2" />
                  Import from URL
                </>
              )}
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default memo(FileDropzone);
