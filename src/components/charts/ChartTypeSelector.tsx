import { ChartType } from '@/types/chart';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, PieChart, AreaChart, ScatterChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartTypeSelectorProps {
  selected: ChartType;
  onSelect: (type: ChartType) => void;
}

const chartTypes: { type: ChartType; icon: React.ReactNode; label: string }[] = [
  { type: 'bar', icon: <BarChart3 className="h-4 w-4" />, label: 'Bar' },
  { type: 'line', icon: <LineChart className="h-4 w-4" />, label: 'Line' },
  { type: 'area', icon: <AreaChart className="h-4 w-4" />, label: 'Area' },
  { type: 'pie', icon: <PieChart className="h-4 w-4" />, label: 'Pie' },
  { type: 'scatter', icon: <ScatterChart className="h-4 w-4" />, label: 'Scatter' },
];

export default function ChartTypeSelector({ selected, onSelect }: ChartTypeSelectorProps) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {chartTypes.map(({ type, icon, label }) => (
        <Button
          key={type}
          variant="ghost"
          size="sm"
          onClick={() => onSelect(type)}
          className={cn(
            'flex-1 gap-1.5 transition-all',
            selected === type && 'bg-background shadow-sm text-primary'
          )}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}
