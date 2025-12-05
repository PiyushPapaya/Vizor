import { ChartType } from '@/types/chart';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LineChart,
  BarChart3,
  PieChart,
  Activity,
  ScatterChart,
  Target,
  Gauge,
  Layers,
  ArrowDownWideNarrow,
} from 'lucide-react';

interface ChartTypeSelectorProps {
  selected: ChartType;
  onSelect: (type: ChartType) => void;
}

const chartTypes: { type: ChartType; icon: React.ReactNode; label: string }[] = [
  { type: 'bar', icon: <BarChart3 className="h-4 w-4" />, label: 'Bar' },
  { type: 'line', icon: <LineChart className="h-4 w-4" />, label: 'Line' },
  { type: 'area', icon: <Activity className="h-4 w-4" />, label: 'Area' },
  { type: 'pie', icon: <PieChart className="h-4 w-4" />, label: 'Pie' },
  { type: 'donut', icon: <Target className="h-4 w-4" />, label: 'Donut' },
  { type: 'scatter', icon: <ScatterChart className="h-4 w-4" />, label: 'Scatter' },
  { type: 'radar', icon: <Gauge className="h-4 w-4" />, label: 'Radar' },
  { type: 'radialBar', icon: <Target className="h-4 w-4" />, label: 'Radial' },
  { type: 'composed', icon: <Layers className="h-4 w-4" />, label: 'Combo' },
  { type: 'funnel', icon: <ArrowDownWideNarrow className="h-4 w-4" />, label: 'Funnel' },
];

export default function ChartTypeSelector({ selected, onSelect }: ChartTypeSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {chartTypes.map(({ type, icon, label }) => (
        <Button
          key={type}
          variant={selected === type ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(type)}
          className={cn(
            'flex flex-col h-auto py-2 px-1 gap-1 text-xs transition-all',
            selected === type 
              ? 'shadow-md ring-2 ring-primary/20' 
              : 'hover:bg-accent hover:border-primary/30'
          )}
          title={label}
        >
          {icon}
          <span className="truncate w-full text-center">{label}</span>
        </Button>
      ))}
    </div>
  );
}
