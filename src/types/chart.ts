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
  colorScheme?: 'default' | 'vibrant' | 'pastel' | 'monochrome' | 'ocean' | 'sunset' | 'neon' | 'earth' | 'candy' | 'custom';
  customColors?: string[];
  gridType?: 'solid' | 'dashed' | 'dotted' | 'none';
  gridSize?: number;
  gridOpacity?: number;
  // Annotations
  annotations?: ChartAnnotation[];
  
  // === NEW: Axis Options ===
  xAxisMin?: number;
  xAxisMax?: number;
  yAxisMin?: number;
  yAxisMax?: number;
  yAxisTickCount?: number;
  axisFormat?: 'number' | 'currency' | 'percent' | 'compact';
  axisCurrency?: string; // e.g., '$', '€', '£'
  axisDecimals?: number;
  xAxisRotation?: number; // -90 to 90 degrees
  showXAxis?: boolean;
  showYAxis?: boolean;
  
  // === NEW: Chart-Specific Options ===
  // Pie/Donut
  pieStartAngle?: number;
  pieInnerRadius?: number; // 0-100 as percentage
  pieLabelPosition?: 'inside' | 'outside' | 'none';
  
  // Bar
  barGap?: number; // percentage gap between bars
  barCategoryGap?: number; // percentage gap between categories
  
  // Line/Area
  pointSize?: number;
  pointStyle?: 'circle' | 'square' | 'diamond' | 'triangle' | 'none';
  fillOpacity?: number; // for area charts
  
  // === NEW: Tooltip Options ===
  tooltipStyle?: 'default' | 'compact' | 'detailed';
  sharedTooltip?: boolean;
  
  // === NEW: Data Label Options ===
  dataLabelPosition?: 'top' | 'center' | 'bottom' | 'inside' | 'outside';
  dataLabelFormat?: 'value' | 'percent' | 'both';
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
    'hsl(291, 64%, 42%)',  // Purple
    'hsl(4, 90%, 58%)'     // Red
  ],
  neon: [
    '#FF006E',  // Hot pink
    '#00F5FF',  // Cyan
    '#FFBE0B',  // Yellow
    '#8338EC',  // Purple
    '#3A86FF',  // Blue
    '#FB5607'   // Orange
  ],
  earth: [
    '#2D6A4F',  // Forest green
    '#52B788',  // Green
    '#B7E4C7',  // Light green
    '#DDA15E',  // Tan
    '#BC6C25',  // Brown
    '#6C584C'   // Dark brown
  ],
  candy: [
    '#FFB6D9',  // Pink
    '#A8DADC',  // Light blue
    '#F4E285',  // Yellow
    '#D4A5A5',  // Rose
    '#B6E2D3',  // Mint
    '#E8C4D9'   // Lavender
  ],
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
  // New defaults
  showXAxis: true,
  showYAxis: true,
  yAxisTickCount: 5,
  axisFormat: 'number',
  axisDecimals: 0,
  axisCurrency: '$',
  xAxisRotation: 0,
  pieStartAngle: 0,
  pieInnerRadius: 0,
  pieLabelPosition: 'outside',
  barGap: 4,
  barCategoryGap: 20,
  pointSize: 4,
  pointStyle: 'circle',
  fillOpacity: 30,
  tooltipStyle: 'default',
  sharedTooltip: true,
  dataLabelPosition: 'top',
  dataLabelFormat: 'value',
};
