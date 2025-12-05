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
  | 'funnel';

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
  'hsl(175, 70%, 45%)',
  'hsl(260, 60%, 55%)',
  'hsl(35, 90%, 55%)',
  'hsl(340, 75%, 55%)',
  'hsl(200, 75%, 50%)',
  'hsl(150, 60%, 45%)',
  'hsl(280, 65%, 50%)',
  'hsl(15, 85%, 55%)',
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
};
