import { memo, useMemo } from 'react';
import { ChartData } from '@/types/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface DataTableViewProps {
  data: ChartData;
}

function DataTableView({ data }: DataTableViewProps) {
  if (data.labels.length === 0 || data.datasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p className="text-sm">No data available</p>
      </div>
    );
  }

  const visibleDatasets = useMemo(
    () => data.datasets.filter(ds => ds.visible),
    [data.datasets]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-sm md:text-base font-semibold">Data Preview</h3>
        <Badge variant="secondary" className="text-xs md:text-sm">
          {data.labels.length} × {visibleDatasets.length + 1}
        </Badge>
      </div>
      
      {/* Desktop Table View */}
      <ScrollArea className="hidden md:flex flex-1 rounded-lg border-2 border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold sticky left-0 bg-muted/50 z-10 text-sm">#</TableHead>
              <TableHead className="font-semibold text-sm">Label</TableHead>
              {visibleDatasets.map(ds => (
                <TableHead key={ds.id} className="text-right font-semibold text-sm">
                  <div className="flex items-center justify-end gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
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
                <TableCell className="font-mono text-muted-foreground text-sm sticky left-0 bg-background z-10">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium text-sm">{label}</TableCell>
                {visibleDatasets.map(ds => (
                  <TableCell key={ds.id} className="text-right font-mono text-sm">
                    {ds.values[index]?.toLocaleString() ?? '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Mobile Card View */}
      <ScrollArea className="flex md:hidden flex-1">
        <div className="space-y-3">
          {data.labels.map((label, index) => (
            <Card key={index} className="border-2 border-border/60">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="font-semibold text-base">{label}</div>
                  <Badge variant="secondary" className="text-xs font-mono">#{index + 1}</Badge>
                </div>
                <div className="space-y-2">
                  {visibleDatasets.map(ds => (
                    <div key={ds.id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: ds.color }}
                        />
                        <span className="text-sm text-muted-foreground">{ds.name}</span>
                      </div>
                      <span className="text-sm font-mono font-semibold">
                        {ds.values[index]?.toLocaleString() ?? '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default memo(DataTableView);
