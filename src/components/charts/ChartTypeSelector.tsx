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
  BarChartHorizontal,
  Droplets,
  TrendingUp,
} from 'lucide-react';
import { memo } from 'react';

interface ChartTypeSelectorProps {
  selected: ChartType;
  onSelect: (type: ChartType) => void;
}

const chartTypes: { type: ChartType; icon: React.ReactNode; label: string }[] = [
  { type: 'line', icon: <LineChart className="h-4 w-4" />, label: 'Line' },
  { type: 'bar', icon: <BarChart3 className="h-4 w-4" />, label: 'Bar' },
  { type: 'barHorizontal', icon: <BarChartHorizontal className="h-4 w-4" />, label: 'H-Bar' },
  { type: 'area', icon: <Activity className="h-4 w-4" />, label: 'Area' },
  { type: 'pie', icon: <PieChart className="h-4 w-4" />, label: 'Pie' },
  { type: 'donut', icon: <Circle className="h-4 w-4" />, label: 'Donut' },
  { type: 'scatter', icon: <Target className="h-4 w-4" />, label: 'Scatter' },
  { type: 'bubble', icon: <Droplets className="h-4 w-4" />, label: 'Bubble' },
  { type: 'radar', icon: <Radar className="h-4 w-4" />, label: 'Radar' },
  { type: 'radialBar', icon: <Target className="h-4 w-4" />, label: 'Radial' },
  { type: 'composed', icon: <Layers className="h-4 w-4" />, label: 'Combo' },
  { type: 'funnel', icon: <ArrowDownWideNarrow className="h-4 w-4" />, label: 'Funnel' },
  { type: 'treemap', icon: <Grid3X3 className="h-4 w-4" />, label: 'Tree' },
  { type: 'waterfall', icon: <TrendingUp className="h-4 w-4" />, label: 'Waterfall' },
];

function ChartTypeSelector({ selected, onSelect }: ChartTypeSelectorProps) {
  return (
    <div className="grid grid-cols-7 gap-1" data-tour="chart-selector">
      {chartTypes.map(({ type, icon, label }) => (
        <Tooltip key={type}>
          <TooltipTrigger asChild>
            <Button
              variant={selected === type ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSelect(type)}
              className={cn(
                'flex flex-col h-12 py-1.5 px-0.5 gap-1 text-[10px] font-medium transition-all duration-200',
                'transition-[transform,background-color,box-shadow]',
                selected === type 
                  ? 'ring-2 ring-primary/50 shadow-glow-primary scale-[1.03]' 
                  : 'hover:bg-accent/80 hover:scale-[1.04] active:scale-[0.96] hover:shadow-glow-subtle',
                'ease-[cubic-bezier(0.34,1.56,0.64,1)]'
              )}
            >
              {icon}
              <span className="truncate w-full text-center leading-none">{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs font-medium">{label} Chart</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export default memo(ChartTypeSelector);