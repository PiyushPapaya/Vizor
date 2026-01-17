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
import { useTranslation } from 'react-i18next';

interface ChartTypeSelectorProps {
  selected: ChartType;
  onSelect: (type: ChartType) => void;
}

const chartTypeIcons: { type: ChartType; icon: React.ReactNode; labelKey: string }[] = [
  { type: 'line', icon: <LineChart className="h-4 w-4" />, labelKey: 'chartTypes.line' },
  { type: 'bar', icon: <BarChart3 className="h-4 w-4" />, labelKey: 'chartTypes.bar' },
  { type: 'barHorizontal', icon: <BarChartHorizontal className="h-4 w-4" />, labelKey: 'chartTypes.barHorizontal' },
  { type: 'area', icon: <Activity className="h-4 w-4" />, labelKey: 'chartTypes.area' },
  { type: 'pie', icon: <PieChart className="h-4 w-4" />, labelKey: 'chartTypes.pie' },
  { type: 'donut', icon: <Circle className="h-4 w-4" />, labelKey: 'chartTypes.donut' },
  { type: 'scatter', icon: <Target className="h-4 w-4" />, labelKey: 'chartTypes.scatter' },
  { type: 'bubble', icon: <Droplets className="h-4 w-4" />, labelKey: 'chartTypes.bubble' },
  { type: 'radar', icon: <Radar className="h-4 w-4" />, labelKey: 'chartTypes.radar' },
  { type: 'radialBar', icon: <Target className="h-4 w-4" />, labelKey: 'chartTypes.radialBar' },
  { type: 'composed', icon: <Layers className="h-4 w-4" />, labelKey: 'chartTypes.composed' },
  { type: 'funnel', icon: <ArrowDownWideNarrow className="h-4 w-4" />, labelKey: 'chartTypes.funnel' },
  { type: 'treemap', icon: <Grid3X3 className="h-4 w-4" />, labelKey: 'chartTypes.treemap' },
  { type: 'waterfall', icon: <TrendingUp className="h-4 w-4" />, labelKey: 'chartTypes.waterfall' },
];

function ChartTypeSelector({ selected, onSelect }: ChartTypeSelectorProps) {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-2.5" data-tour="chart-selector">
      {chartTypeIcons.map(({ type, icon, labelKey }) => {
        const label = t(labelKey);
        const isSelected = selected === type;
        return (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => onSelect(type)}
                className={cn(
                  'group relative flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3 lg:p-2.5',
                  'h-auto min-h-[72px] sm:min-h-[78px] lg:min-h-[64px]',
                  'rounded-xl sm:rounded-2xl lg:rounded-xl overflow-hidden',
                  'border-2 transition-all duration-300 ease-out',
                  'hover:scale-[1.05] active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  isSelected
                    ? [
                        'bg-gradient-to-br from-primary via-primary/95 to-accent',
                        'border-primary/50 shadow-lg shadow-primary/30',
                        'text-primary-foreground',
                        'before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/25 before:to-transparent before:opacity-100',
                      ]
                    : [
                        'bg-card/80 backdrop-blur-sm',
                        'border-border/50 hover:border-primary/40',
                        'hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/5 hover:shadow-md hover:shadow-primary/10',
                        'text-foreground/90 hover:text-foreground',
                      ]
                )}
              >
                {/* Icon */}
                <span className={cn(
                  'relative z-10 flex-shrink-0 transition-transform duration-300',
                  'group-hover:scale-110',
                  isSelected && 'drop-shadow-sm'
                )}>
                  <span className="[&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6 lg:[&>svg]:h-5 lg:[&>svg]:w-5">
                    {icon}
                  </span>
                </span>
                
                {/* Label */}
                <span className={cn(
                  'relative z-10 text-[10px] sm:text-xs lg:text-[10px] font-medium leading-none',
                  'text-center max-w-full px-0.5 truncate',
                  'transition-all duration-300',
                  isSelected ? 'font-semibold' : 'font-medium group-hover:font-semibold'
                )}>
                  {label}
                </span>

                {/* Selection indicator */}
                {isSelected && (
                  <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs font-medium px-2 py-1">
              <span className="font-semibold">{label}</span> Chart
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default memo(ChartTypeSelector);