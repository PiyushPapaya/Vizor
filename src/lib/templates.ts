import { ChartConfig, ChartData } from '@/types/chart';

export interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'finance' | 'marketing' | 'analytics' | 'dashboard' | 'education';
  config: Partial<ChartConfig>;
  sampleData?: ChartData;
  thumbnail?: string;
  tags: string[];
}

export const CHART_TEMPLATES: ChartTemplate[] = [
  {
    id: 'revenue-growth',
    name: 'Revenue Growth',
    description: 'Track revenue growth over time with smooth area chart',
    category: 'business',
    tags: ['revenue', 'growth', 'business', 'financial'],
    config: {
      type: 'area',
      title: 'Monthly Revenue Growth',
      xAxisLabel: 'Month',
      yAxisLabel: 'Revenue ($)',
      smooth: true,
      showGrid: true,
      showDataLabels: true,
      colorScheme: 'ocean',
      animated: true,
    },
    sampleData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        id: 'revenue',
        name: 'Revenue',
        values: [45000, 52000, 48000, 61000, 72000, 85000],
        color: 'hsl(199, 89%, 48%)',
        visible: true,
      }],
    },
  },
  {
    id: 'sales-funnel',
    name: 'Sales Funnel',
    description: 'Visualize conversion rates through sales stages',
    category: 'marketing',
    tags: ['sales', 'funnel', 'conversion', 'marketing'],
    config: {
      type: 'funnel',
      title: 'Sales Conversion Funnel',
      showTooltip: true,
      showLegend: true,
      colorScheme: 'sunset',
      animated: true,
    },
    sampleData: {
      labels: ['Visitors', 'Leads', 'Qualified', 'Proposals', 'Customers'],
      datasets: [{
        id: 'funnel',
        name: 'Conversion',
        values: [10000, 5000, 2500, 1000, 450],
        color: 'hsl(25, 95%, 53%)',
        visible: true,
      }],
    },
  },
  {
    id: 'market-share',
    name: 'Market Share Analysis',
    description: 'Display market share distribution with donut chart',
    category: 'business',
    tags: ['market', 'share', 'distribution', 'competitors'],
    config: {
      type: 'donut',
      title: 'Market Share by Company',
      showLegend: true,
      showTooltip: true,
      colorScheme: 'vibrant',
      animated: true,
    },
    sampleData: {
      labels: ['Company A', 'Company B', 'Company C', 'Company D', 'Others'],
      datasets: [{
        id: 'share',
        name: 'Market Share',
        values: [35, 28, 18, 12, 7],
        color: 'hsl(234, 89%, 58%)',
        visible: true,
      }],
    },
  },
  {
    id: 'kpi-dashboard',
    name: 'KPI Dashboard',
    description: 'Multi-metric dashboard with composed chart',
    category: 'dashboard',
    tags: ['kpi', 'dashboard', 'metrics', 'overview'],
    config: {
      type: 'composed',
      title: 'Key Performance Indicators',
      xAxisLabel: 'Quarter',
      yAxisLabel: 'Performance',
      showGrid: true,
      showLegend: true,
      colorScheme: 'default',
      animated: true,
    },
    sampleData: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          id: 'revenue',
          name: 'Revenue',
          values: [180000, 220000, 245000, 290000],
          color: 'hsl(234, 89%, 58%)',
          visible: true,
        },
        {
          id: 'costs',
          name: 'Costs',
          values: [120000, 135000, 150000, 165000],
          color: 'hsl(346, 77%, 50%)',
          visible: true,
        },
      ],
    },
  },
  {
    id: 'social-engagement',
    name: 'Social Media Engagement',
    description: 'Track social media metrics over time',
    category: 'marketing',
    tags: ['social', 'engagement', 'marketing', 'analytics'],
    config: {
      type: 'line',
      title: 'Social Media Engagement',
      xAxisLabel: 'Week',
      yAxisLabel: 'Engagement',
      smooth: true,
      showGrid: true,
      showDataLabels: false,
      colorScheme: 'vibrant',
      animated: true,
    },
    sampleData: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [
        {
          id: 'likes',
          name: 'Likes',
          values: [1200, 1450, 1680, 1890, 2100, 2350],
          color: 'hsl(348, 83%, 62%)',
          visible: true,
        },
        {
          id: 'shares',
          name: 'Shares',
          values: [340, 420, 510, 580, 650, 720],
          color: 'hsl(176, 69%, 52%)',
          visible: true,
        },
        {
          id: 'comments',
          name: 'Comments',
          values: [180, 230, 290, 340, 390, 450],
          color: 'hsl(261, 60%, 70%)',
          visible: true,
        },
      ],
    },
  },
  {
    id: 'expense-breakdown',
    name: 'Expense Breakdown',
    description: 'Analyze spending by category with pie chart',
    category: 'finance',
    tags: ['expenses', 'budget', 'spending', 'finance'],
    config: {
      type: 'pie',
      title: 'Monthly Expense Breakdown',
      showLegend: true,
      showDataLabels: true,
      colorScheme: 'pastel',
      animated: true,
    },
    sampleData: {
      labels: ['Rent', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Savings'],
      datasets: [{
        id: 'expenses',
        name: 'Amount',
        values: [1200, 450, 300, 200, 180, 670],
        color: 'hsl(234, 89%, 58%)',
        visible: true,
      }],
    },
  },
  {
    id: 'product-comparison',
    name: 'Product Comparison',
    description: 'Compare products across multiple metrics',
    category: 'analytics',
    tags: ['comparison', 'products', 'radar', 'analytics'],
    config: {
      type: 'radar',
      title: 'Product Feature Comparison',
      showLegend: true,
      showGrid: true,
      colorScheme: 'ocean',
      animated: true,
    },
    sampleData: {
      labels: ['Performance', 'Design', 'Price', 'Support', 'Features'],
      datasets: [
        {
          id: 'product-a',
          name: 'Product A',
          values: [85, 90, 70, 95, 80],
          color: 'hsl(199, 84%, 55%)',
          visible: true,
        },
        {
          id: 'product-b',
          name: 'Product B',
          values: [90, 75, 85, 80, 88],
          color: 'hsl(184, 77%, 34%)',
          visible: true,
        },
      ],
    },
  },
  {
    id: 'student-performance',
    name: 'Student Performance',
    description: 'Track student grades across subjects',
    category: 'education',
    tags: ['education', 'grades', 'performance', 'students'],
    config: {
      type: 'bar',
      title: 'Student Performance by Subject',
      xAxisLabel: 'Subject',
      yAxisLabel: 'Grade (%)',
      showGrid: true,
      showDataLabels: true,
      colorScheme: 'sunset',
      animated: true,
      barRadius: 8,
    },
    sampleData: {
      labels: ['Math', 'Science', 'English', 'History', 'Art'],
      datasets: [{
        id: 'grades',
        name: 'Grade',
        values: [92, 88, 95, 85, 90],
        color: 'hsl(262, 83%, 58%)',
        visible: true,
      }],
    },
  },
  {
    id: 'website-traffic',
    name: 'Website Traffic',
    description: 'Monitor website visitor patterns',
    category: 'analytics',
    tags: ['traffic', 'website', 'visitors', 'analytics'],
    config: {
      type: 'area',
      title: 'Website Traffic Trends',
      xAxisLabel: 'Date',
      yAxisLabel: 'Visitors',
      smooth: true,
      showGrid: true,
      stacked: true,
      colorScheme: 'default',
      animated: true,
    },
    sampleData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          id: 'desktop',
          name: 'Desktop',
          values: [2400, 2800, 3200, 3100, 3400, 2900, 2600],
          color: 'hsl(234, 89%, 58%)',
          visible: true,
        },
        {
          id: 'mobile',
          name: 'Mobile',
          values: [1800, 2100, 2400, 2600, 2800, 3100, 2900],
          color: 'hsl(270, 95%, 75%)',
          visible: true,
        },
      ],
    },
  },
  {
    id: 'inventory-levels',
    name: 'Inventory Levels',
    description: 'Track inventory status with horizontal bars',
    category: 'business',
    tags: ['inventory', 'stock', 'warehouse', 'logistics'],
    config: {
      type: 'barHorizontal',
      title: 'Current Inventory Levels',
      xAxisLabel: 'Units',
      yAxisLabel: 'Product',
      showGrid: true,
      showDataLabels: true,
      colorScheme: 'ocean',
      animated: true,
    },
    sampleData: {
      labels: ['Widget A', 'Widget B', 'Widget C', 'Widget D', 'Widget E'],
      datasets: [{
        id: 'stock',
        name: 'Stock',
        values: [450, 680, 320, 890, 560],
        color: 'hsl(172, 66%, 50%)',
        visible: true,
      }],
    },
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: 'LayoutGrid' },
  { id: 'business', name: 'Business', icon: 'Briefcase' },
  { id: 'finance', name: 'Finance', icon: 'DollarSign' },
  { id: 'marketing', name: 'Marketing', icon: 'TrendingUp' },
  { id: 'analytics', name: 'Analytics', icon: 'BarChart' },
  { id: 'dashboard', name: 'Dashboard', icon: 'Layout' },
  { id: 'education', name: 'Education', icon: 'GraduationCap' },
];

export function getTemplatesByCategory(category: string): ChartTemplate[] {
  if (category === 'all') return CHART_TEMPLATES;
  return CHART_TEMPLATES.filter(t => t.category === category);
}

export function searchTemplates(query: string): ChartTemplate[] {
  const lowerQuery = query.toLowerCase();
  return CHART_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
