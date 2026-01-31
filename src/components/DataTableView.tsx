import { useState } from 'react';
import { ChartData, Dataset } from '@/types/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface DataTableViewProps {
  data: ChartData;
  onDataUpdate?: (newData: ChartData) => void;
}

export default function DataTableView({ data, onDataUpdate }: DataTableViewProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [newColumnName, setNewColumnName] = useState('');
  const [addingColumn, setAddingColumn] = useState(false);

  if (data.labels.length === 0 || data.datasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No data available</p>
      </div>
    );
  }

  const visibleDatasets = data.datasets.filter(ds => ds.visible);

  const handleCellEdit = (rowIndex: number, column: string, currentValue: string | number) => {
    setEditingCell({ row: rowIndex, col: column });
    setEditValue(String(currentValue));
  };

  const handleSaveEdit = () => {
    if (!editingCell || !onDataUpdate) return;

    const newData = { ...data };
    if (editingCell.col === 'label') {
      newData.labels[editingCell.row] = editValue;
    } else {
      const dataset = newData.datasets.find(ds => ds.id === editingCell.col);
      if (dataset) {
        const numValue = parseFloat(editValue);
        if (!isNaN(numValue)) {
          dataset.values[editingCell.row] = numValue;
        } else {
          toast.error('Please enter a valid number');
          return;
        }
      }
    }

    onDataUpdate(newData);
    setEditingCell(null);
    toast.success('Cell updated');
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (!onDataUpdate) return;

    const newData = {
      labels: data.labels.filter((_, i) => i !== rowIndex),
      datasets: data.datasets.map(ds => ({
        ...ds,
        values: ds.values.filter((_, i) => i !== rowIndex),
      })),
    };

    onDataUpdate(newData);
    selectedRows.delete(rowIndex);
    setSelectedRows(new Set(selectedRows));
    toast.success('Row deleted');
  };

  const handleAddRow = () => {
    if (!onDataUpdate) return;

    const newData = {
      labels: [...data.labels, `Row ${data.labels.length + 1}`],
      datasets: data.datasets.map(ds => ({
        ...ds,
        values: [...ds.values, 0],
      })),
    };

    onDataUpdate(newData);
    toast.success('Row added');
  };

  const handleAddColumn = () => {
    if (!onDataUpdate || !newColumnName.trim()) {
      toast.error('Please enter a column name');
      return;
    }

    const newDataset: Dataset = {
      id: `col-${Date.now()}`,
      name: newColumnName,
      values: new Array(data.labels.length).fill(0),
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      visible: true,
    };

    const newData = {
      ...data,
      datasets: [...data.datasets, newDataset],
    };

    onDataUpdate(newData);
    setNewColumnName('');
    setAddingColumn(false);
    toast.success('Column added');
  };

  const handleDeleteColumn = (datasetId: string) => {
    if (!onDataUpdate) return;

    const newData = {
      ...data,
      datasets: data.datasets.filter(ds => ds.id !== datasetId),
    };

    onDataUpdate(newData);
    toast.success('Column deleted');
  };

  const toggleRowSelection = (rowIndex: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowIndex)) {
      newSelected.delete(rowIndex);
    } else {
      newSelected.add(rowIndex);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === data.labels.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.labels.map((_, i) => i)));
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Data Editor</h3>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs">
            {data.labels.length} rows × {visibleDatasets.length + 1} columns
          </Badge>
          {selectedRows.size > 0 && (
            <Badge variant="default" className="text-xs">
              {selectedRows.size} selected
            </Badge>
          )}
          <Button size="sm" onClick={handleAddRow} className="h-8 gap-2">
            <Plus className="h-4 w-4" />
            Add Row
          </Button>
          {!addingColumn ? (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setAddingColumn(true)}
              className="h-8 gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Column
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Column name"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="h-8 w-32"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddColumn();
                  if (e.key === 'Escape') setAddingColumn(false);
                }}
              />
              <Button size="sm" onClick={handleAddColumn} className="h-8 px-2">
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setAddingColumn(false)}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1 rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 font-semibold sticky left-0 bg-muted/50 z-10">
                <Checkbox
                  checked={selectedRows.size === data.labels.length && data.labels.length > 0}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              <TableHead className="w-12 font-semibold sticky left-12 bg-muted/50 z-10">#</TableHead>
              <TableHead className="font-semibold min-w-[150px]">Label</TableHead>
              {visibleDatasets.map(ds => (
                <TableHead key={ds.id} className="text-right font-semibold min-w-[120px]">
                  <div className="flex items-center justify-end gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: ds.color }}
                    />
                    <span>{ds.name}</span>
                    {onDataUpdate && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteColumn(ds.id)}
                        className="h-6 w-6 p-0 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableHead>
              ))}
              {onDataUpdate && (
                <TableHead className="w-20 font-semibold">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.labels.map((label, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className={`hover:bg-muted/30 transition-colors ${selectedRows.has(rowIndex) ? 'bg-muted/20' : ''}`}
              >
                <TableCell className="sticky left-0 bg-background z-10">
                  <Checkbox
                    checked={selectedRows.has(rowIndex)}
                    onCheckedChange={() => toggleRowSelection(rowIndex)}
                  />
                </TableCell>
                <TableCell className="font-mono text-muted-foreground text-xs sticky left-12 bg-background z-10">
                  {rowIndex + 1}
                </TableCell>
                <TableCell className="font-medium">
                  {editingCell?.row === rowIndex && editingCell?.col === 'label' ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="h-8"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleSaveEdit} className="h-8 px-2">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-8 px-2">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
                      onClick={() => onDataUpdate && handleCellEdit(rowIndex, 'label', label)}
                    >
                      <span>{label}</span>
                      {onDataUpdate && <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
                    </div>
                  )}
                </TableCell>
                {visibleDatasets.map(ds => (
                  <TableCell key={ds.id} className="text-right font-mono">
                    {editingCell?.row === rowIndex && editingCell?.col === ds.id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          className="h-8 text-right"
                          autoFocus
                        />
                        <Button size="sm" onClick={handleSaveEdit} className="h-8 px-2">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-8 px-2">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
                        onClick={() => onDataUpdate && handleCellEdit(rowIndex, ds.id, ds.values[rowIndex] ?? 0)}
                      >
                        {ds.values[rowIndex]?.toLocaleString() ?? '-'}
                      </div>
                    )}
                  </TableCell>
                ))}
                {onDataUpdate && (
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteRow(rowIndex)}
                      className="h-8 px-2 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
