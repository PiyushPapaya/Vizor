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

export interface ChartAnnotation {
  id: string;
  type: 'text' | 'line' | 'referenceLine' | 'area';
  label: string;
  value?: number;
  position?: { x: number; y: number };
  color: string;
  visible: boolean;
  orientation?: 'horizontal' | 'vertical';
  strokeDasharray?: string;
  y1?: number;
  y2?: number;
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
  // Customization options
  strokeWidth?: number;
  fontSize?: number;
  barRadius?: number;
  opacity?: number;
  showDataLabels?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  colorScheme?: 'default' | 'vibrant' | 'pastel' | 'monochrome' | 'ocean' | 'sunset' | 'custom';
  customColors?: string[];
  // Annotations
  annotations?: ChartAnnotation[];
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
  'hsl(199, 89%, 48%)',   // Cyan
  'hsl(262, 83%, 58%)',   // Purple
  'hsl(142, 76%, 36%)',   // Green
  'hsl(25, 95%, 53%)',    // Orange
  'hsl(346, 77%, 50%)',   // Rose
  'hsl(217, 91%, 60%)',   // Blue
  'hsl(280, 67%, 65%)',   // Violet
  'hsl(173, 80%, 40%)',   // Teal
  'hsl(45, 93%, 47%)',    // Yellow
  'hsl(338, 78%, 60%)',   // Pink
];

export const COLOR_SCHEMES = {
  default: [
    'hsl(199, 89%, 48%)',
    'hsl(262, 83%, 58%)',
    'hsl(142, 76%, 36%)',
    'hsl(25, 95%, 53%)',
    'hsl(346, 77%, 50%)',
    'hsl(217, 91%, 60%)'
  ],
  vibrant: [
    'hsl(348, 83%, 62%)',  // Bright Red
    'hsl(176, 69%, 52%)',  // Turquoise
    'hsl(54, 91%, 62%)',   // Bright Yellow
    'hsl(158, 64%, 60%)',  // Mint
    'hsl(351, 76%, 68%)',  // Coral
    'hsl(261, 60%, 70%)'   // Lavender
  ],
  pastel: [
    'hsl(199, 53%, 78%)',  // Soft Blue
    'hsl(261, 51%, 78%)',  // Soft Purple
    'hsl(338, 68%, 84%)',  // Soft Pink
    'hsl(54, 77%, 88%)',   // Soft Yellow
    'hsl(158, 44%, 77%)',  // Soft Green
    'hsl(217, 50%, 80%)'   // Soft Indigo
  ],
  monochrome: [
    'hsl(220, 26%, 14%)',  // Dark Navy
    'hsl(219, 28%, 25%)',  // Navy
    'hsl(217, 33%, 37%)',  // Blue Grey
    'hsl(261, 35%, 48%)',  // Purple Grey
    'hsl(348, 79%, 58%)',  // Accent Red
    'hsl(0, 0%, 95%)'      // Light Grey
  ],
  ocean: [
    'hsl(199, 84%, 55%)',  // Ocean Blue
    'hsl(184, 77%, 34%)',  // Deep Teal
    'hsl(172, 66%, 50%)',  // Turquoise
    'hsl(197, 71%, 73%)',  // Light Blue
    'hsl(210, 100%, 56%)', // Sky Blue
    'hsl(187, 85%, 43%)'   // Cyan
  ],
  sunset: [
    'hsl(14, 91%, 58%)',   // Coral
    'hsl(25, 95%, 63%)',   // Orange
    'hsl(45, 97%, 62%)',   // Gold
    'hsl(340, 82%, 52%)',  // Pink
    'hsl(280, 61%, 60%)',  // Purple
    'hsl(262, 52%, 47%)'   // Deep Purple
  ]
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
