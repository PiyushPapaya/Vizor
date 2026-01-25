/**
 * MobileChartTypeSelector - Horizontal carousel with category filters
 * 
 * Features:
 * - Horizontal scrollable carousel (no grid)
 * - Category filter pills
 * - Larger touch targets (64x80px)
 * - Recommended charts based on data structure
 * - Haptic feedback on selection
 * - Snap scrolling for precise selection
 */

import React, { useMemo, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2,
  LineChart,
  PieChart,
  AreaChart,
  Boxes,
  Circle,
  Activity,
  TrendingUp,
  Target,
  Layers,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic, mobileSpring } from '@/lib/animations';
import { ChartType } from '@/types/chart';
import { Badge } from '@/components/ui/badge';

interface ChartTypeInfo {
  type: ChartType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'basic' | 'comparison' | 'distribution' | 'trends';
  description: string;
}

const chartTypes: ChartTypeInfo[] = [
  { type: 'bar', label: 'Bar', icon: BarChart2, category: 'basic', description: 'Compare categories' },
  { type: 'line', label: 'Line', icon: LineChart, category: 'trends', description: 'Show trends' },
  { type: 'pie', label: 'Pie', icon: PieChart, category: 'distribution', description: 'Show proportions' },
  { type: 'area', label: 'Area', icon: AreaChart, category: 'trends', description: 'Filled line chart' },
  { type: 'scatter', label: 'Scatter', icon: Circle, category: 'comparison', description: 'Plot relationships' },
  { type: 'donut', label: 'Donut', icon: Circle, category: 'distribution', description: 'Pie with hole' },
  { type: 'barHorizontal', label: 'H-Bar', icon: Activity, category: 'basic', description: 'Horizontal bars' },
  { type: 'bubble', label: 'Bubble', icon: Boxes, category: 'comparison', description: 'Compare with size' },
  { type: 'radar', label: 'Radar', icon: Target, category: 'comparison', description: 'Multi-axis comparison' },
  { type: 'radialBar', label: 'Radial', icon: Layers, category: 'distribution', description: 'Circular bars' },
  { type: 'composed', label: 'Combo', icon: TrendingUp, category: 'trends', description: 'Mixed chart types' },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'basic', label: 'Basic' },
  { id: 'comparison', label: 'Compare' },
  { id: 'distribution', label: 'Parts' },
  { id: 'trends', label: 'Trends' },
];

interface MobileChartTypeSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
  recommendedTypes?: ChartType[];
  className?: string;
  hapticEnabled?: boolean;
}

export function MobileChartTypeSelector({
  selectedType,
  onTypeChange,
  recommendedTypes = [],
  className,
  hapticEnabled = true,
}: MobileChartTypeSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredCharts = useMemo(() => {
    if (activeCategory === 'all') return chartTypes;
    return chartTypes.filter((chart) => chart.category === activeCategory);
  }, [activeCategory]);

  const handleTypeSelect = useCallback(
    (type: ChartType) => {
      if (hapticEnabled) {
        triggerHaptic('light');
      }
      onTypeChange(type);
    },
    [onTypeChange, hapticEnabled]
  );

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId);
      // Scroll to start when category changes
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    },
    []
  );

  const scrollToSelected = useCallback(() => {
    if (!scrollRef.current) return;
    const selectedIndex = filteredCharts.findIndex((c) => c.type === selectedType);
    if (selectedIndex >= 0) {
      const cardWidth = 76; // 64px + 12px gap
      scrollRef.current.scrollTo({
        left: selectedIndex * cardWidth - scrollRef.current.clientWidth / 2 + 32,
        behavior: 'smooth',
      });
    }
  }, [selectedType, filteredCharts]);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with current selection */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Chart Type</span>
        <Badge
          variant="secondary"
          className="h-7 px-3 text-xs font-semibold bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
          onClick={scrollToSelected}
        >
          {chartTypes.find((c) => c.type === selectedType)?.label || 'Select'}
          <ChevronRight className="w-3 h-3 ml-1" />
        </Badge>
      </div>

      {/* Recommended section */}
      {recommendedTypes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Recommended</span>
          </div>
          <div className="flex gap-2">
            {recommendedTypes.slice(0, 3).map((recType) => {
              const chartInfo = chartTypes.find((c) => c.type === recType);
              if (!chartInfo) return null;
              const Icon = chartInfo.icon;
              const isSelected = selectedType === recType;

              return (
                <motion.button
                  key={recType}
                  className={cn(
                    'h-9 px-3 rounded-lg border-2 flex items-center gap-2 text-xs font-medium',
                    'transition-all duration-150',
                    isSelected
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400'
                  )}
                  onClick={() => handleTypeSelect(recType)}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden min-[360px]:inline">{chartInfo.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category filter pills */}
      <div className="category-filter-pills">
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              'category-filter-pill',
              activeCategory === category.id ? 'active' : 'inactive'
            )}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Chart type carousel - wrapped in container query context */}
      <div className="@container">
        <div
          ref={scrollRef}
          className="chart-type-carousel"
          role="listbox"
          aria-label="Select chart type"
        >
          <AnimatePresence mode="popLayout">
            {filteredCharts.map((chart, index) => {
              const Icon = chart.icon;
              const isSelected = selectedType === chart.type;

              return (
                <motion.button
                  key={chart.type}
                  className={cn(
                    'chart-type-card',
                    isSelected ? 'selected' : 'unselected'
                  )}
                  onClick={() => handleTypeSelect(chart.type)}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    ...mobileSpring,
                    delay: index * 0.02,
                  }}
                  role="option"
                  aria-selected={isSelected}
                  aria-label={`${chart.label}: ${chart.description}`}
                >
                  <Icon
                    className={cn(
                      'chart-type-icon transition-colors duration-200',
                      isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                    )}
                  />
                  <span
                    className={cn(
                      'chart-type-label',
                      isSelected ? 'text-primary-foreground font-semibold' : ''
                    )}
                  >
                    {chart.label}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for phone landscape
 */
export function MobileChartTypeSelectorCompact({
  selectedType,
  onTypeChange,
  className,
  hapticEnabled = true,
}: Omit<MobileChartTypeSelectorProps, 'recommendedTypes'>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTypeSelect = useCallback(
    (type: ChartType) => {
      if (hapticEnabled) {
        triggerHaptic('light');
      }
      onTypeChange(type);
    },
    [onTypeChange, hapticEnabled]
  );

  return (
    <div
      ref={scrollRef}
      className={cn(
        'flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory',
        'scrollbar-none',
        className
      )}
    >
      {chartTypes.map((chart) => {
        const Icon = chart.icon;
        const isSelected = selectedType === chart.type;

        return (
          <motion.button
            key={chart.type}
            className={cn(
              'w-14 h-16 flex-shrink-0 p-1.5',
              'flex flex-col items-center justify-center gap-0.5',
              'rounded-lg border-2 snap-start',
              'transition-all duration-150',
              isSelected
                ? 'bg-primary/20 border-primary'
                : 'bg-card/80 border-border/50 hover:border-primary/40'
            )}
            onClick={() => handleTypeSelect(chart.type)}
            whileTap={{ scale: 0.95 }}
          >
            <Icon
              className={cn(
                'w-5 h-5',
                isSelected ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-[9px] font-medium',
                isSelected ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {chart.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default MobileChartTypeSelector;
