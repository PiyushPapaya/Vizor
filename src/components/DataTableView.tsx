import { memo, useMemo, useRef, useState, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChartData } from '@/types/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableViewProps {
  data: ChartData;
}

// Performance thresholds
const VIRTUALIZATION_THRESHOLD = 100;
const LARGE_DATASET_THRESHOLD = 1000;
const VERY_LARGE_DATASET_THRESHOLD = 10000;
const PAGE_SIZE_OPTIONS = [50, 100, 250, 500, 1000];

function DataTableView({ data }: DataTableViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const parentRef = useRef<HTMLDivElement>(null);
  const mobileParentRef = useRef<HTMLDivElement>(null);

  const visibleDatasets = useMemo(
    () => data.datasets.filter(ds => ds.visible),
    [data.datasets]
  );

  // Filter data based on search query
  const filteredIndices = useMemo(() => {
    if (!searchQuery.trim()) {
      return Array.from({ length: data.labels.length }, (_, i) => i);
    }
    const query = searchQuery.toLowerCase();
    return data.labels
      .map((label, index) => ({ label, index }))
      .filter(({ label }) => label.toLowerCase().includes(query))
      .map(({ index }) => index);
  }, [data.labels, searchQuery]);

  // Pagination calculations
  const totalRows = filteredIndices.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const isLargeDataset = data.labels.length >= LARGE_DATASET_THRESHOLD;
  const isVeryLargeDataset = data.labels.length >= VERY_LARGE_DATASET_THRESHOLD;
  const useVirtualization = totalRows > VIRTUALIZATION_THRESHOLD;

  // Get current page data
  const currentPageIndices = useMemo(() => {
    if (useVirtualization && !isLargeDataset) {
      // Use full virtualization for medium datasets
      return filteredIndices;
    }
    // Use pagination for very large datasets
    const start = currentPage * pageSize;
    const end = Math.min(start + pageSize, totalRows);
    return filteredIndices.slice(start, end);
  }, [filteredIndices, currentPage, pageSize, totalRows, useVirtualization, isLargeDataset]);

  // Virtual row setup
  const rowVirtualizer = useVirtualizer({
    count: currentPageIndices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const mobileVirtualizer = useVirtualizer({
    count: currentPageIndices.length,
    getScrollElement: () => mobileParentRef.current,
    estimateSize: () => 120 + visibleDatasets.length * 36,
    overscan: 5,
  });

  // Navigation handlers
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  }, [totalPages]);

  const goToFirstPage = () => goToPage(0);
  const goToLastPage = () => goToPage(totalPages - 1);
  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  if (data.labels.length === 0 || data.datasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p className="text-sm">No data available</p>
      </div>
    );
  }

  const renderPerformanceIndicator = () => {
    if (!isLargeDataset) return null;
    
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium",
        isVeryLargeDataset 
          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
          : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
      )}>
        {isVeryLargeDataset ? (
          <AlertTriangle className="w-3.5 h-3.5" />
        ) : (
          <Zap className="w-3.5 h-3.5" />
        )}
        <span>
          {isVeryLargeDataset 
            ? `${(data.labels.length / 1000).toFixed(1)}K rows - Paginated view`
            : `${data.labels.length.toLocaleString()} rows - Optimized`}
        </span>
      </div>
    );
  };

  const renderPagination = () => {
    if (!isLargeDataset || totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-3 py-2.5 border-t border-border/30 bg-muted/20 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            Showing {(currentPage * pageSize + 1).toLocaleString()}-
            {Math.min((currentPage + 1) * pageSize, totalRows).toLocaleString()} of {totalRows.toLocaleString()}
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            className="h-7 px-2 text-xs rounded border border-border bg-background"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size} per page</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={goToFirstPage}
            disabled={currentPage === 0}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={goToPrevPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="px-2 text-xs font-medium">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={goToLastPage}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  const virtualRows = rowVirtualizer.getVirtualItems();
  const mobileVirtualRows = mobileVirtualizer.getVirtualItems();

  return (
    <div className="h-full flex flex-col">
      {/* Header with stats and search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 md:mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-sm md:text-base font-semibold">Data Preview</h3>
          <Badge variant="secondary" className="text-xs md:text-sm">
            {data.labels.length.toLocaleString()} × {visibleDatasets.length + 1}
          </Badge>
          {renderPerformanceIndicator()}
        </div>
        
        {/* Search for large datasets */}
        {data.labels.length > 50 && (
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search labels..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(0);
              }}
              className="h-8 pl-8 pr-3 w-full sm:w-48 text-sm"
            />
          </div>
        )}
      </div>
      
      {/* Desktop Virtualized Table View */}
      <div className="hidden md:flex flex-col flex-1 rounded-xl border border-border/30 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        {/* Fixed Header */}
        <div className="bg-muted/40 border-b border-border/30">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold w-14 text-sm">#</TableHead>
                <TableHead className="font-semibold text-sm min-w-[120px]">Label</TableHead>
                {visibleDatasets.map(ds => (
                  <TableHead key={ds.id} className="text-right font-semibold text-sm min-w-[100px]">
                    <div className="flex items-center justify-end gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: ds.color }}
                      />
                      <span className="truncate">{ds.name}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Virtualized Body */}
        <div
          ref={parentRef}
          className="flex-1 overflow-auto"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualRows.map((virtualRow) => {
              const dataIndex = currentPageIndices[virtualRow.index];
              const label = data.labels[dataIndex];
              
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Table>
                    <TableBody>
                      <TableRow className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-muted-foreground text-sm w-14">
                          {dataIndex + 1}
                        </TableCell>
                        <TableCell className="font-medium text-sm min-w-[120px]">
                          <span className="truncate block max-w-[200px]" title={label}>
                            {label}
                          </span>
                        </TableCell>
                        {visibleDatasets.map(ds => (
                          <TableCell key={ds.id} className="text-right font-mono text-sm min-w-[100px]">
                            {ds.values[dataIndex]?.toLocaleString() ?? '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Footer */}
        {renderPagination()}
      </div>

      {/* Mobile Virtualized Card View */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden">
        <div
          ref={mobileParentRef}
          className="flex-1 overflow-auto"
        >
          <div
            style={{
              height: `${mobileVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {mobileVirtualRows.map((virtualRow) => {
              const dataIndex = currentPageIndices[virtualRow.index];
              const label = data.labels[dataIndex];
              
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                    padding: '0 0 12px 0',
                  }}
                >
                  <Card className="border border-border/30 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-border/20">
                        <div className="font-semibold text-base truncate max-w-[200px]" title={label}>
                          {label}
                        </div>
                        <Badge variant="secondary" className="text-xs font-mono">
                          #{dataIndex + 1}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {visibleDatasets.map(ds => (
                          <div key={ds.id} className="flex items-center justify-between py-1.5">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: ds.color }}
                              />
                              <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                                {ds.name}
                              </span>
                            </div>
                            <span className="text-sm font-mono font-semibold">
                              {ds.values[dataIndex]?.toLocaleString() ?? '-'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}

export default memo(DataTableView);
