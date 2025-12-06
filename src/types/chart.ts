export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'donut'
  | 'area' 
  | 'scatter' 
  | 'radar'
  | 'radialBar'
  | 'composed'
  | 'funnel'
  | 'treemap';

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
};
