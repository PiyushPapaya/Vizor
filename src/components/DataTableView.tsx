import { ChartData } from '@/types/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface DataTableViewProps {
  data: ChartData;
}

export default function DataTableView({ data }: DataTableViewProps) {
  if (data.labels.length === 0 || data.datasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No data available</p>
      </div>
    );
  }

  const visibleDatasets = data.datasets.filter(ds => ds.visible);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Data Preview</h3>
        <Badge variant="secondary" className="text-xs">
          {data.labels.length} rows × {visibleDatasets.length + 1} columns
        </Badge>
      </div>
      
      <ScrollArea className="flex-1 rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold sticky left-0 bg-muted/50 z-10">#</TableHead>
              <TableHead className="font-semibold">Label</TableHead>
              {visibleDatasets.map(ds => (
                <TableHead key={ds.id} className="text-right font-semibold">
                  <div className="flex items-center justify-end gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: ds.color }}
                    />
                    {ds.name}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.labels.map((label, index) => (
              <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-muted-foreground text-xs sticky left-0 bg-background z-10">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium">{label}</TableCell>
                {visibleDatasets.map(ds => (
                  <TableCell key={ds.id} className="text-right font-mono">
                    {ds.values[index]?.toLocaleString() ?? '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
