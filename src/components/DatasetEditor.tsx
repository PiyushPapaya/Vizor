import { useState, memo, useCallback, useMemo } from 'react';
import { ChartData } from '@/types/chart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Trash2, 
  Edit3,
  Check,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface DatasetEditorProps {
  data: ChartData;
  onUpdate: (data: ChartData) => void;
}

function DatasetEditor({ data, onUpdate }: DatasetEditorProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(
    new Set(Array.from({ length: data.labels.length }, (_, i) => i))
  );
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  const [editingDatasetName, setEditingDatasetName] = useState<string | null>(null);

  const handleCellEdit = useCallback((rowIndex: number, colIndex: number, currentValue: string | number) => {
    setEditingCell({ row: rowIndex, col: colIndex });
    setEditValue(String(currentValue));
  }, []);

  const handleCellSave = useCallback(() => {
    if (editingCell === null) return;
    
    const { row, col } = editingCell;
    
    if (col === -1) {
      // Editing label
      const newData = { ...data };
      newData.labels[row] = editValue;
      onUpdate(newData);
      toast.success('Label updated');
    } else {
      // Editing dataset value
      const value = parseFloat(editValue);
      if (isNaN(value)) {
        toast.error('Invalid number');
        return;
      }
      
      const newData = { ...data };
      newData.datasets[col].values[row] = value;
      onUpdate(newData);
      toast.success('Value updated');
    }
    
    setEditingCell(null);
    setEditValue('');
  }, [editingCell, editValue, data, onUpdate]);

  const handleCellCancel = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, []);

  const handleAddRow = useCallback(() => {
    const newData = { ...data };
    newData.labels.push(`Row ${data.labels.length + 1}`);
    newData.datasets.forEach(ds => {
      ds.values.push(0);
    });
    onUpdate(newData);
    setSelectedRows(new Set([...selectedRows, data.labels.length]));
    toast.success('Row added');
  }, [data, onUpdate, selectedRows]);

  const handleDeleteRow = useCallback((rowIndex: number) => {
    if (data.labels.length <= 1) {
      toast.error('Cannot delete last row');
      return;
    }
    
    const newData = { ...data };
    newData.labels.splice(rowIndex, 1);
    newData.datasets.forEach(ds => {
      ds.values.splice(rowIndex, 1);
    });
    onUpdate(newData);
    
    const newSelected = new Set(selectedRows);
    newSelected.delete(rowIndex);
    setSelectedRows(new Set([...newSelected].map(i => i > rowIndex ? i - 1 : i)));
    toast.success('Row deleted');
  }, [data, onUpdate, selectedRows]);

  const handleAddColumn = () => {
    const newData = { ...data };
    const newDataset = {
      id: `dataset-${Date.now()}`,
      name: `Dataset ${data.datasets.length + 1}`,
      values: Array(data.labels.length).fill(0),
      color: `hsl(${(data.datasets.length * 45) % 360}, 70%, 60%)`,
      visible: true
    };
    newData.datasets.push(newDataset);
    onUpdate(newData);
    toast.success('Column added');
  };

  const handleDeleteColumn = (colIndex: number) => {
    if (data.datasets.length <= 1) {
      toast.error('Cannot delete last column');
      return;
    }
    
    const newData = { ...data };
    newData.datasets.splice(colIndex, 1);
    onUpdate(newData);
    toast.success('Column deleted');
  };

  const handleToggleRow = (rowIndex: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowIndex)) {
      newSelected.delete(rowIndex);
    } else {
      newSelected.add(rowIndex);
    }
    setSelectedRows(newSelected);
  };

  const handleToggleAllRows = () => {
    if (selectedRows.size === data.labels.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(Array.from({ length: data.labels.length }, (_, i) => i)));
    }
  };

  const handleApplySelection = () => {
    if (selectedRows.size === 0) {
      toast.error('Select at least one row');
      return;
    }
    
    const selectedIndices = Array.from(selectedRows).sort((a, b) => a - b);
    const newData = {
      labels: selectedIndices.map(i => data.labels[i]),
      datasets: data.datasets.map(ds => ({
        ...ds,
        values: selectedIndices.map(i => ds.values[i])
      }))
    };
    onUpdate(newData);
    setSelectedRows(new Set(Array.from({ length: newData.labels.length }, (_, i) => i)));
    toast.success(`Filtered to ${selectedIndices.length} rows`);
  };

  const handleLabelEdit = (index: number, newLabel: string) => {
    const newData = { ...data };
    newData.labels[index] = newLabel;
    onUpdate(newData);
    setEditingLabel(null);
  };

  const handleDatasetNameEdit = (datasetId: string, newName: string) => {
    const newData = { ...data };
    const dataset = newData.datasets.find(ds => ds.id === datasetId);
    if (dataset) {
      dataset.name = newName;
      onUpdate(newData);
    }
    setEditingDatasetName(null);
  };

  if (data.labels.length === 0 || data.datasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-3">
          <Edit3 className="h-12 w-12 mx-auto opacity-30" />
          <p className="text-sm">No data to edit</p>
          <p className="text-xs text-muted-foreground/70">Import or generate data first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3 sm:gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-sm font-semibold">Dataset Editor</h3>
          <p className="text-sm sm:text-xs text-muted-foreground leading-relaxed">
            Edit values, add/remove rows & columns, select rows to visualize
          </p>
        </div>
        <Badge variant="secondary" className="text-sm sm:text-xs py-1.5 sm:py-1 self-start sm:self-center">
          {selectedRows.size} / {data.labels.length} rows selected
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button 
          size="sm" 
          onClick={handleAddRow}
          className="h-10 sm:h-9 md:h-8 text-xs sm:text-sm gap-1.5 min-w-[100px] touch-manipulation"
        >
          <Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          Add Row
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleAddColumn}
          className="h-10 sm:h-9 md:h-8 text-xs sm:text-sm gap-1.5 min-w-[120px] touch-manipulation"
        >
          <Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          Add Column
        </Button>
        <div className="flex-1 min-w-[120px]" />
        {selectedRows.size !== data.labels.length && (
          <Button 
            size="sm" 
            variant="secondary"
            onClick={handleApplySelection}
            className="h-10 sm:h-9 md:h-8 text-xs sm:text-sm gap-1.5 min-w-[140px] touch-manipulation"
          >
            <Check className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            Apply Filter ({selectedRows.size})
          </Button>
        )}
      </div>

      {/* Table */}
      <Card className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="min-w-max">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12 sm:w-10 sticky left-0 bg-muted/50 z-20 border-r">
                    <Checkbox 
                      checked={selectedRows.size === data.labels.length}
                      onCheckedChange={handleToggleAllRows}
                      className="h-5 w-5 sm:h-4 sm:w-4"
                    />
                  </TableHead>
                  <TableHead className="w-14 sm:w-12 sticky left-12 sm:left-10 bg-muted/50 z-20 border-r">#</TableHead>
                  <TableHead className="min-w-[180px] sm:min-w-[150px] sticky left-26 sm:left-22 bg-muted/50 z-20 font-semibold border-r">
                    Label
                  </TableHead>
                {data.datasets.map((ds, idx) => (
                  <TableHead key={ds.id} className="text-right min-w-[160px] sm:min-w-[120px]">
                    <div className="flex items-center justify-end gap-2">
                      {editingDatasetName === ds.id ? (
                        <div className="flex items-center gap-1.5">
                          <Input
                            value={ds.name}
                            onChange={(e) => handleDatasetNameEdit(ds.id, e.target.value)}
                            className="h-8 sm:h-7 md:h-6 text-sm sm:text-xs touch-manipulation"
                            autoFocus
                            onBlur={() => setEditingDatasetName(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') setEditingDatasetName(null);
                              if (e.key === 'Escape') setEditingDatasetName(null);
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          <div 
                            className="w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" 
                            style={{ backgroundColor: ds.color }}
                          />
                          <span 
                            className="font-semibold cursor-pointer hover:text-primary touch-manipulation active:text-primary text-sm sm:text-xs"
                            onClick={() => setEditingDatasetName(ds.id)}
                          >
                            {ds.name}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteColumn(idx)}
                            className="h-8 w-8 sm:h-7 sm:w-7 md:h-6 md:w-6 p-0 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive touch-manipulation"
                            aria-label="Delete column"
                          >
                            <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5 md:h-3 md:w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-20 sm:w-16 sticky right-0 bg-muted/50 z-20 border-l">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.labels.map((label, rowIndex) => (
                <TableRow 
                  key={rowIndex} 
                  className={`hover:bg-muted/30 active:bg-muted/40 transition-colors group ${
                    !selectedRows.has(rowIndex) ? 'opacity-50' : ''
                  }`}
                >
                  <TableCell className="sticky left-0 bg-background z-10 border-r">
                    <Checkbox 
                      checked={selectedRows.has(rowIndex)}
                      onCheckedChange={() => handleToggleRow(rowIndex)}
                      className="h-5 w-5 sm:h-4 sm:w-4"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm sm:text-xs text-muted-foreground sticky left-12 sm:left-10 bg-background z-10 border-r">
                    {rowIndex + 1}
                  </TableCell>
                  <TableCell className="sticky left-26 sm:left-22 bg-background z-10 border-r">
                    {editingLabel === rowIndex ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={label}
                          onChange={(e) => {
                            const newData = { ...data };
                            newData.labels[rowIndex] = e.target.value;
                            onUpdate(newData);
                          }}
                          className="h-7 text-sm"
                          autoFocus
                          onBlur={() => setEditingLabel(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingLabel(null);
                            if (e.key === 'Escape') setEditingLabel(null);
                          }}
                        />
                      </div>
                    ) : (
                      <div 
                        className="font-medium cursor-pointer hover:text-primary"
                        onClick={() => setEditingLabel(rowIndex)}
                      >
                        {label}
                      </div>
                    )}
                  </TableCell>
                  {data.datasets.map((ds, colIndex) => (
                    <TableCell className="text-right">
                      {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-9 sm:h-8 md:h-7 text-sm text-right w-28 sm:w-24 touch-manipulation"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCellSave();
                              if (e.key === 'Escape') handleCellCancel();
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCellSave}
                            className="h-9 w-9 sm:h-8 sm:w-8 md:h-7 md:w-7 p-0 text-green-600 touch-manipulation"
                          >
                            <Check className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCellCancel}
                            className="h-9 w-9 sm:h-8 sm:w-8 md:h-7 md:w-7 p-0 text-red-600 touch-manipulation"
                          >
                            <X className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="font-mono cursor-pointer hover:bg-muted/50 active:bg-muted rounded px-3 py-2 sm:px-2 sm:py-1 inline-block min-h-[36px] sm:min-h-0 flex items-center justify-end touch-manipulation"
                          onClick={() => handleCellEdit(rowIndex, colIndex, ds.values[rowIndex])}
                        >
                          {ds.values[rowIndex]?.toLocaleString() ?? '-'}
                        </div>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="sticky right-0 bg-background z-10">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleRow(rowIndex)}
                        className="h-9 w-9 sm:h-8 sm:w-8 md:h-7 md:w-7 p-0 touch-manipulation"
                        aria-label={selectedRows.has(rowIndex) ? "Hide row" : "Show row"}
                      >
                        {selectedRows.has(rowIndex) ? (
                          <Eye className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                        ) : (
                          <EyeOff className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteRow(rowIndex)}
                        className="h-9 w-9 sm:h-8 sm:w-8 md:h-7 md:w-7 p-0 hover:bg-destructive/10 hover:text-destructive touch-manipulation"
                        aria-label="Delete row"
                      >
                        <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </ScrollArea>
      </Card>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Click any cell to edit • Use Enter to save, Escape to cancel</span>
        <span>{data.labels.length} rows × {data.datasets.length} datasets</span>
      </div>
    </div>
  );
}

export default memo(DatasetEditor);
