export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'barHorizontal'
  | 'pie' 
  | 'donut'
  | 'area' 
  | 'scatter' 
  | 'bubble'
  | 'radar'
  | 'radialBar'
  | 'composed'
  | 'funnel'
  | 'treemap'
  | 'waterfall';

export interface Dataset {
  id: string;
  name: string;
  values: number[];
  color: string;
  visible: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface ChartConfig {
  id: string;
  name: string;
  type: ChartType;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  showLegend: boolean;
  showGrid: boolean;
  showTooltip: boolean;
  backgroundColor: string;
  animated: boolean;
  stacked?: boolean;
  smooth?: boolean;
  // New customization options
  strokeWidth?: number;
  fontSize?: number;
  barRadius?: number;
  opacity?: number;
  showDataLabels?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  colorScheme?: 'default' | 'vibrant' | 'pastel' | 'monochrome';
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: ChartData;
  config: ChartConfig;
}

export const CHART_COLORS = [
  '#06b6d4',
  '#8b5cf6',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#ec4899',
  '#3b82f6',
  '#f97316',
  '#84cc16',
  '#6366f1',
];

export const COLOR_SCHEMES = {
  default: ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'],
  vibrant: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'],
  pastel: ['#a8d8ea', '#aa96da', '#fcbad3', '#ffffd2', '#b5ead7', '#c7ceea'],
  monochrome: ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560', '#f1f1f1'],
};

export const DEFAULT_CHART_CONFIG: ChartConfig = {
  id: '',
  name: 'Untitled Chart',
  type: 'bar',
  title: 'My Chart',
  xAxisLabel: 'Category',
  yAxisLabel: 'Value',
  showLegend: true,
  showGrid: true,
  showTooltip: true,
  backgroundColor: 'transparent',
  animated: true,
  stacked: false,
  smooth: true,
  strokeWidth: 2,
  fontSize: 12,
  barRadius: 4,
  opacity: 100,
  showDataLabels: false,
  legendPosition: 'bottom',
  colorScheme: 'default',
};
