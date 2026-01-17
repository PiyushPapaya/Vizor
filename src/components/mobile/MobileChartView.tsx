import { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { ChartData, ChartConfig } from '@/types/chart';
import ChartRenderer, { ChartRendererRef } from '@/components/charts/ChartRenderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize2, Minimize2, BarChart2, Table2, Edit3, 
  ZoomIn, ZoomOut, RotateCcw, Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResponsiveLayout, MobileViewMode } from '@/hooks/useResponsiveLayout';
import DataTableView from '@/components/DataTableView';
import DatasetEditor from '@/components/DatasetEditor';
import ErrorBoundary from '@/components/ErrorBoundary';
import { NoDataEmptyState } from '@/components/EmptyState';

interface MobileChartViewProps {
  data: ChartData;
  config: ChartConfig;
  onDataUpdate?: (data: ChartData) => void;
  onOpenDrawer?: () => void;
  className?: string;
}

export interface MobileChartViewRef {
  chartRef: ChartRendererRef | null;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
}

type ViewType = 'chart' | 'table' | 'edit';

const MobileChartView = forwardRef<MobileChartViewRef, MobileChartViewProps>(
  ({ data, config, onDataUpdate, onOpenDrawer, className }, ref) => {
    const chartRef = useRef<ChartRendererRef>(null);
    const { isMobile, isVeryTallScreen, mobileViewMode, setMobileViewMode } = useResponsiveLayout();
    
    const [viewType, setViewType] = useState<ViewType>('chart');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showToolbar, setShowToolbar] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(1);
    
    const toolbarTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
      chartRef: chartRef.current,
      enterFullscreen: () => setIsFullscreen(true),
      exitFullscreen: () => setIsFullscreen(false),
    }));

    const handleFullscreenToggle = useCallback(() => {
      setIsFullscreen(!isFullscreen);
      if (!isFullscreen) {
        setMobileViewMode('fullscreen');
        setShowToolbar(true);
        // Auto-hide toolbar after 3 seconds
        toolbarTimeoutRef.current = setTimeout(() => {
          setShowToolbar(false);
        }, 3000);
      } else {
        setMobileViewMode('view');
        if (toolbarTimeoutRef.current) {
          clearTimeout(toolbarTimeoutRef.current);
        }
      }
    }, [isFullscreen, setMobileViewMode]);

    const handleChartTap = useCallback(() => {
      if (isFullscreen) {
        setShowToolbar(!showToolbar);
        if (!showToolbar) {
          toolbarTimeoutRef.current = setTimeout(() => {
            setShowToolbar(false);
          }, 3000);
        }
      }
    }, [isFullscreen, showToolbar]);

    const handleZoomIn = useCallback(() => {
      setZoomLevel(prev => Math.min(prev + 0.25, 2));
    }, []);

    const handleZoomOut = useCallback(() => {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    }, []);

    const handleZoomReset = useCallback(() => {
      setZoomLevel(1);
    }, []);

    const hasData = data.datasets.length > 0;

    // Fullscreen mode
    if (isFullscreen) {
      return (
        <div className="fullscreen-overlay" onClick={handleChartTap}>
          {/* Toolbar */}
          <div className={cn(
            "fullscreen-toolbar",
            showToolbar && "visible"
          )}>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize text-xs h-7 px-2">
                {config.type}
              </Badge>
              <span className="text-sm font-medium truncate max-w-[150px]">
                {config.title || 'Untitled Chart'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                className="fullscreen-exit-btn"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); handleZoomReset(); }}
                className="fullscreen-exit-btn"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                className="fullscreen-exit-btn"
                disabled={zoomLevel >= 2}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); handleFullscreenToggle(); }}
                className="fullscreen-exit-btn ml-2"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chart */}
          <div 
            className="w-full h-full p-4"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            onClick={(e) => e.stopPropagation()}
          >
            {hasData ? (
              <ChartRenderer ref={chartRef} data={data} config={config} />
            ) : (
              <NoDataEmptyState onUpload={onOpenDrawer} />
            )}
          </div>
        </div>
      );
    }

    // Regular mobile view
    return (
      <div className={cn(
        "flex flex-col h-full overflow-hidden",
        mobileViewMode === 'edit' && "mobile-edit-mode",
        className
      )}>
        {/* Header with view toggle and actions */}
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/40 flex-shrink-0 bg-card/50">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h2 className="text-sm font-semibold truncate">
              {config.title || 'Untitled Chart'}
            </h2>
            <Badge variant="outline" className="capitalize text-[10px] h-5 px-1.5 flex-shrink-0">
              {config.type}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            {/* View type toggle */}
            <div className="flex bg-muted/60 rounded-md p-0.5">
              <Button
                variant={viewType === 'chart' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewType('chart')}
              >
                <BarChart2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewType === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewType('table')}
              >
                <Table2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewType === 'edit' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewType('edit')}
              >
                <Edit3 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Fullscreen button */}
            {viewType === 'chart' && hasData && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleFullscreenToggle}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden min-h-0 p-2">
          <ErrorBoundary onReset={() => setViewType('chart')}>
            {!hasData ? (
              <NoDataEmptyState onUpload={onOpenDrawer} />
            ) : viewType === 'chart' ? (
              <div 
                className="mobile-chart-container h-full gesture-pinch-area"
                data-chart-container
              >
                <ChartRenderer ref={chartRef} data={data} config={config} />
              </div>
            ) : viewType === 'table' ? (
              <div className="h-full overflow-auto mobile-scroll-area">
                <DataTableView data={data} />
              </div>
            ) : (
              <div className="h-full overflow-auto mobile-scroll-area">
                <DatasetEditor 
                  data={data} 
                  onUpdate={(newData) => onDataUpdate?.(newData)} 
                />
              </div>
            )}
          </ErrorBoundary>
        </div>
      </div>
    );
  }
);

MobileChartView.displayName = 'MobileChartView';

export default MobileChartView;
