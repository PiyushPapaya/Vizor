import { Upload, FileSpreadsheet, FileJson, FileType, Link as LinkIcon, Download, Plus, TableIcon, BarChart3, Users, TrendingUp, Calendar } from 'lucide-react';
import { useCallback, useState, memo } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { parseCSV, parseJSON, parseExcel, generateId } from '@/lib/data-parser';
import { ChartData, CHART_COLORS } from '@/types/chart';
import { useTranslation } from 'react-i18next';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  onUrlImport?: (data: ChartData) => void;
  onCreateEmpty?: (data: ChartData) => void;
}

// Sample data templates for quick start
const DATA_TEMPLATES = {
  blank: {
    name: 'Blank Dataset',
    icon: TableIcon,
    description: '5 rows × 2 columns',
    generate: (rows: number = 5, cols: number = 2): ChartData => ({
      labels: Array.from({ length: rows }, (_, i) => `Row ${i + 1}`),
      datasets: Array.from({ length: cols }, (_, i) => ({
        id: generateId(),
        name: `Dataset ${i + 1}`,
        values: Array(rows).fill(0),
        color: CHART_COLORS[i % CHART_COLORS.length],
        visible: true,
      })),
    }),
  },
  sales: {
    name: 'Sales Report',
    icon: BarChart3,
    description: 'Monthly sales data',
    generate: (): ChartData => ({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        { id: generateId(), name: 'Revenue', values: [12500, 15000, 13200, 17800, 19500, 22000], color: CHART_COLORS[0], visible: true },
        { id: generateId(), name: 'Expenses', values: [8000, 8500, 7900, 9200, 10000, 11500], color: CHART_COLORS[1], visible: true },
      ],
    }),
  },
  survey: {
    name: 'Survey Results',
    icon: Users,
    description: 'Response distribution',
    generate: (): ChartData => ({
      labels: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
      datasets: [
        { id: generateId(), name: 'Responses', values: [45, 82, 35, 18, 8], color: CHART_COLORS[2], visible: true },
      ],
    }),
  },
  timeline: {
    name: 'Timeline Trend',
    icon: TrendingUp,
    description: 'Growth over time',
    generate: (): ChartData => ({
      labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'],
      datasets: [
        { id: generateId(), name: 'Users', values: [1200, 1800, 2400, 3100, 4200, 5500], color: CHART_COLORS[3], visible: true },
        { id: generateId(), name: 'Active', values: [800, 1200, 1900, 2500, 3400, 4600], color: CHART_COLORS[4], visible: true },
      ],
    }),
  },
  comparison: {
    name: 'Comparison',
    icon: Calendar,
    description: 'Category comparison',
    generate: (): ChartData => ({
      labels: ['Product A', 'Product B', 'Product C', 'Product D'],
      datasets: [
        { id: generateId(), name: 'This Year', values: [85, 72, 90, 68], color: CHART_COLORS[0], visible: true },
        { id: generateId(), name: 'Last Year', values: [65, 78, 70, 55], color: CHART_COLORS[5], visible: true },
      ],
    }),
  },
};

const ACCEPTED_EXTENSIONS = ['.csv', '.json', '.xlsx', '.xls'];

function FileDropzone({ onFileSelect, onUrlImport, onCreateEmpty }: FileDropzoneProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [blankRows, setBlankRows] = useState(5);
  const [blankCols, setBlankCols] = useState(2);

  const validateFile = useCallback((file: File): boolean => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      toast.error(t('data.useFileFormats'));
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t('data.maxFileSize'));
      return false;
    }
    return true;
  }, [t]);

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
      toast.error(t('data.enterUrl'));
      return;
    }

    if (!onUrlImport) {
      toast.error(t('data.urlNotSupported'));
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
        toast.info(t('data.detectingFileType'));
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
      toast.success(t('data.importSuccess'));
      setUrlInput('');
    } catch (error: any) {
      console.error('URL import error:', error);
      if (error.message.includes('CORS')) {
        toast.error(t('data.corsError'));
      } else {
        toast.error(error.message || 'Failed to import from URL');
      }
    } finally {
      setIsLoadingUrl(false);
    }
  }, [urlInput, onUrlImport, t]);

  const handleCreateBlank = useCallback(() => {
    if (!onCreateEmpty) {
      toast.error(t('data.manualEntryNotSupported'));
      return;
    }
    const data = DATA_TEMPLATES.blank.generate(blankRows, blankCols);
    onCreateEmpty(data);
    toast.success(t('data.createdBlankDataset', { rows: blankRows, cols: blankCols }));
  }, [onCreateEmpty, blankRows, blankCols, t]);

  const handleUseTemplate = useCallback((templateKey: keyof typeof DATA_TEMPLATES) => {
    if (!onCreateEmpty) {
      toast.error(t('data.manualEntryNotSupported'));
      return;
    }
    const template = DATA_TEMPLATES[templateKey];
    const data = template.generate();
    onCreateEmpty(data);
    toast.success(t('data.loadedTemplate', { name: t(`data.templates.${templateKey}.name`) }));
  }, [onCreateEmpty, t]);

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upload" className="text-xs">
          <Upload className="h-3 w-3 mr-1.5" />
          {t('data.upload')}
        </TabsTrigger>
        <TabsTrigger value="url" className="text-xs">
          <LinkIcon className="h-3 w-3 mr-1.5" />
          {t('data.url')}
        </TabsTrigger>
        <TabsTrigger value="create" className="text-xs">
          <Plus className="h-3 w-3 mr-1.5" />
          {t('data.create')}
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
                {isDragging ? t('data.dropHere') : t('data.dropOrClick')}
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
              <p className="text-xs font-medium">{t('data.importFromOnline')}</p>
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
                  {t('data.importing')}
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2" />
                  {t('data.importFromUrl')}
                </>
              )}
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="create" className="mt-2 space-y-3">
        {/* Quick Templates */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">{t('data.quickStartTemplates')}</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(DATA_TEMPLATES).filter(([key]) => key !== 'blank').map(([key, template]) => {
              const Icon = template.icon;
              return (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  className="h-auto py-2 px-3 flex flex-col items-start gap-1 hover:bg-primary/10 hover:border-primary/30 transition-all text-left"
                  onClick={() => handleUseTemplate(key as keyof typeof DATA_TEMPLATES)}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium">{t(`data.templates.${key}.name`)}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{t(`data.templates.${key}.description`)}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Custom Blank Dataset */}
        <div className="rounded-lg border-2 border-dashed border-border/60 p-3 space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TableIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <p className="text-xs font-medium">{t('data.createBlank')}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground">{t('data.rows')}</label>
              <Select value={String(blankRows)} onValueChange={(v) => setBlankRows(Number(v))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 8, 10, 15, 20].map(n => (
                    <SelectItem key={n} value={String(n)}>{t('data.rowsCount', { count: n })}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground">{t('data.columns')}</label>
              <Select value={String(blankCols)} onValueChange={(v) => setBlankCols(Number(v))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <SelectItem key={n} value={String(n)}>{n > 1 ? t('data.datasetsCountPlural', { count: n }) : t('data.datasetsCount', { count: n })}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleCreateBlank}
            size="sm"
            className="w-full touch-target"
          >
            <Plus className="h-3.5 w-3.5 mr-2" />
            {t('data.createEmptyDataset')}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default memo(FileDropzone);
