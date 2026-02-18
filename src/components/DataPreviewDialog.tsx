import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, AlertTriangle, FileSpreadsheet, Table2, Upload } from 'lucide-react';
import { ChartData } from '@/types/chart';

interface DataPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ChartData | null;
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
}

function validateData(data: ChartData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!data || !data.labels || data.labels.length === 0) {
    issues.push({ type: 'error', message: 'No data labels found' });
  }

  if (!data.datasets || data.datasets.length === 0) {
    issues.push({ type: 'error', message: 'No datasets found' });
  }

  data.datasets.forEach((dataset: any, idx) => {
    if (!dataset.name) {
      issues.push({ type: 'warning', message: `Dataset ${idx + 1} has no label` });
    }
    if (!dataset.values || dataset.values.length === 0) {
      issues.push({ type: 'error', message: `Dataset "${dataset.name || idx + 1}" has no data` });
    }
    if (dataset.values && dataset.values.some((val: any) => typeof val !== 'number')) {
      issues.push({ type: 'warning', message: `Dataset "${dataset.name}" contains non-numeric values` });
    }
  });

  if (data.labels.length > 100) {
    issues.push({ type: 'info', message: `Large dataset detected (${data.labels.length} data points). Performance may be affected.` });
  }

  if (data.datasets.length > 20) {
    issues.push({ type: 'warning', message: `Many datasets detected (${data.datasets.length}). Consider filtering or grouping data.` });
  }

  return issues;
}

export function DataPreviewDialog({
  open,
  onOpenChange,
  data,
  fileName,
  onConfirm,
  onCancel,
}: DataPreviewDialogProps) {
  const [activeTab, setActiveTab] = useState('preview');
  const issues = data ? validateData(data) : [];
  const hasErrors = issues.some(issue => issue.type === 'error');
  const hasWarnings = issues.some(issue => issue.type === 'warning');

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 font-bold tracking-tight">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
            </div>
            Data Import Preview
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            Review your data before importing: <strong>{fileName}</strong>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-muted/40 p-1 rounded-xl">
            <TabsTrigger value="preview" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Table2 className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="validation" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              Validation
              {(hasErrors || hasWarnings) && (
                <Badge variant={hasErrors ? 'destructive' : 'secondary'} className="ml-2">
                  {issues.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="summary" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <ScrollArea className="h-[400px] border border-border/30 rounded-xl overflow-hidden">
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="p-2 text-left font-semibold border-b">Label</th>
                      {data.datasets.map((dataset: any, idx) => (
                        <th key={idx} className="p-2 text-right font-semibold border-b">
                          {dataset.name || `Dataset ${idx + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.labels.slice(0, 50).map((label, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{label}</td>
                        {data.datasets.map((dataset: any, datasetIdx) => (
                          <td key={datasetIdx} className="p-2 text-right tabular-nums">
                            {dataset.values?.[idx] ?? '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.labels.length > 50 && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    Showing first 50 of {data.labels.length} rows
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <ScrollArea className="h-[400px]">
              {issues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Good!</h3>
                  <p className="text-muted-foreground">No validation issues found with your data.</p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {issues.map((issue, idx) => (
                    <Alert key={idx} variant={issue.type === 'error' ? 'destructive' : 'default'}>
                      {issue.type === 'error' && <AlertCircle className="h-4 w-4" />}
                      {issue.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                      {issue.type === 'info' && <CheckCircle2 className="h-4 w-4" />}
                      <AlertDescription>{issue.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-4">
              <div className="border border-border/30 rounded-xl p-4">
                <p className="text-sm text-muted-foreground/70 mb-1">File Name</p>
                <p className="font-bold truncate">{fileName}</p>
              </div>
              <div className="border border-border/30 rounded-xl p-4">
                <p className="text-sm text-muted-foreground/70 mb-1">Data Points</p>
                <p className="font-bold">{data.labels.length.toLocaleString()}</p>
              </div>
              <div className="border border-border/30 rounded-xl p-4">
                <p className="text-sm text-muted-foreground/70 mb-1">Datasets</p>
                <p className="font-bold">{data.datasets.length}</p>
              </div>
              <div className="border border-border/30 rounded-xl p-4">
                <p className="text-sm text-muted-foreground/70 mb-1">Status</p>
                <Badge variant={hasErrors ? 'destructive' : hasWarnings ? 'secondary' : 'default'}>
                  {hasErrors ? 'Has Errors' : hasWarnings ? 'Has Warnings' : 'Valid'}
                </Badge>
              </div>
            </div>

            <div className="border border-border/30 rounded-xl p-4">
              <h4 className="font-bold mb-3">Detected Columns</h4>
              <div className="flex flex-wrap gap-2">
                {data.datasets.map((dataset: any, idx) => (
                  <Badge key={idx} variant="outline">
                    {dataset.name || `Column ${idx + 1}`}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {hasErrors && (
              <span className="flex items-center gap-1.5 text-destructive">
                <AlertCircle className="w-4 h-4" />
                Fix errors before importing
              </span>
            )}
            {!hasErrors && hasWarnings && (
              <span className="flex items-center gap-1.5 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                {issues.filter(i => i.type === 'warning').length} warning(s)
              </span>
            )}
          </div>
          <div className="flex gap-2.5">
            <Button variant="outline" onClick={onCancel} className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={hasErrors} className="rounded-lg font-semibold shadow-sm shadow-primary/10">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
