import { ChartType } from '@/types/chart';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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

interface ChartTypeSelectorProps {
  selected: ChartType;
  onSelect: (type: ChartType) => void;
}

const chartTypes: { type: ChartType; icon: React.ReactNode; label: string; description: string }[] = [
  { type: 'line', icon: <LineChart className="h-4 w-4" />, label: 'Line', description: 'Show trends over time' },
  { type: 'bar', icon: <BarChart3 className="h-4 w-4" />, label: 'Bar', description: 'Compare categories' },
  { type: 'area', icon: <Activity className="h-4 w-4" />, label: 'Area', description: 'Show volume over time' },
  { type: 'pie', icon: <PieChart className="h-4 w-4" />, label: 'Pie', description: 'Show proportions' },
  { type: 'donut', icon: <Circle className="h-4 w-4" />, label: 'Donut', description: 'Proportions with center' },
  { type: 'scatter', icon: <Target className="h-4 w-4" />, label: 'Scatter', description: 'Show relationships' },
  { type: 'radar', icon: <Radar className="h-4 w-4" />, label: 'Radar', description: 'Compare metrics' },
  { type: 'radialBar', icon: <Target className="h-4 w-4" />, label: 'Radial', description: 'Progress indicators' },
  { type: 'composed', icon: <Layers className="h-4 w-4" />, label: 'Combo', description: 'Mix bar and line' },
  { type: 'funnel', icon: <ArrowDownWideNarrow className="h-4 w-4" />, label: 'Funnel', description: 'Conversion flow' },
  { type: 'treemap', icon: <Grid3X3 className="h-4 w-4" />, label: 'Treemap', description: 'Hierarchical data' },
];

export default function ChartTypeSelector({ selected, onSelect }: ChartTypeSelectorProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
      {chartTypes.map(({ type, icon, label, description }) => (
        <Tooltip key={type}>
          <TooltipTrigger asChild>
            <Button
              variant={selected === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelect(type)}
              className={cn(
                'flex flex-col h-14 py-2 px-1 gap-1 text-xs transition-all',
                selected === type 
                  ? 'shadow-md ring-2 ring-primary/30 ring-offset-1 ring-offset-background' 
                  : 'hover:bg-accent hover:border-primary/30'
              )}
            >
              {icon}
              <span className="truncate w-full text-center text-[10px]">{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="font-medium">{label} Chart</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
