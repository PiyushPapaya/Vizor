import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChartType } from '@/types/chart';
import { cn } from '@/lib/utils';
import {
  LineChart,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Layers,
  ArrowDownWideNarrow,
  Radar,
  Circle,
  Grid3X3,
} from 'lucide-react';
import { memo } from 'react';

interface ChartTypeSelectorProps {
  selected: ChartType;
  onSelect: (type: ChartType) => void;
}

const chartTypes: { type: ChartType; icon: React.ReactNode; label: string }[] = [
  { type: 'line', icon: <LineChart className="h-3.5 w-3.5" />, label: 'Line' },
  { type: 'bar', icon: <BarChart3 className="h-3.5 w-3.5" />, label: 'Bar' },
  { type: 'area', icon: <Activity className="h-3.5 w-3.5" />, label: 'Area' },
  { type: 'pie', icon: <PieChart className="h-3.5 w-3.5" />, label: 'Pie' },
  { type: 'donut', icon: <Circle className="h-3.5 w-3.5" />, label: 'Donut' },
  { type: 'scatter', icon: <Target className="h-3.5 w-3.5" />, label: 'Scatter' },
  { type: 'radar', icon: <Radar className="h-3.5 w-3.5" />, label: 'Radar' },
  { type: 'radialBar', icon: <Target className="h-3.5 w-3.5" />, label: 'Radial' },
  { type: 'composed', icon: <Layers className="h-3.5 w-3.5" />, label: 'Combo' },
  { type: 'funnel', icon: <ArrowDownWideNarrow className="h-3.5 w-3.5" />, label: 'Funnel' },
  { type: 'treemap', icon: <Grid3X3 className="h-3.5 w-3.5" />, label: 'Tree' },
];

function ChartTypeSelector({ selected, onSelect }: ChartTypeSelectorProps) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-6 gap-1">
      {chartTypes.map(({ type, icon, label }) => (
        <Tooltip key={type}>
          <TooltipTrigger asChild>
            <Button
              variant={selected === type ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSelect(type)}
              className={cn(
                'flex flex-col h-11 sm:h-12 py-1 px-0.5 gap-0.5 text-[10px] transition-all duration-150',
                selected === type 
                  ? 'ring-1 ring-primary/50 shadow-sm' 
                  : 'hover:bg-muted/80'
              )}
            >
              {icon}
              <span className="truncate w-full text-center leading-none">{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">{label} Chart</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export default memo(ChartTypeSelector);
