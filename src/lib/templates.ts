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
  {
    id: 'crypto-portfolio',
    name: 'Crypto Portfolio',
    description: 'Track cryptocurrency holdings and performance',
    category: 'finance',
    tags: ['crypto', 'portfolio', 'investment', 'blockchain'],
    config: {
      type: 'pie',
      title: 'Crypto Portfolio Distribution',
      showLegend: true,
      showDataLabels: true,
      colorScheme: 'neon',
      animated: true,
    },
    sampleData: {
      labels: ['Bitcoin', 'Ethereum', 'Cardano', 'Solana', 'Polkadot'],
      datasets: [{
        id: 'holdings',
        name: 'Value ($)',
        values: [45000, 28000, 12000, 8000, 7000],
        color: '#FF006E',
        visible: true,
      }],
    },
  },
  {
    id: 'project-timeline',
    name: 'Project Budget',
    description: 'Visualize project budget changes over phases',
    category: 'business',
    tags: ['project', 'budget', 'waterfall', 'progress'],
    config: {
      type: 'waterfall',
      title: 'Project Budget Waterfall',
      xAxisLabel: 'Phase',
      yAxisLabel: 'Budget ($)',
      showGrid: true,
      colorScheme: 'earth',
      animated: true,
    },
    sampleData: {
      labels: ['Initial', 'Development', 'Marketing', 'Operations', 'Final'],
      datasets: [{
        id: 'budget',
        name: 'Budget',
        values: [100000, -35000, -20000, -15000, 30000],
        color: '#2D6A4F',
        visible: true,
      }],
    },
  },
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction',
    description: 'Measure customer satisfaction across touchpoints',
    category: 'analytics',
    tags: ['customer', 'satisfaction', 'feedback', 'nps'],
    config: {
      type: 'radar',
      title: 'Customer Satisfaction Score',
      showLegend: true,
      showGrid: true,
      colorScheme: 'candy',
      animated: true,
    },
    sampleData: {
      labels: ['Quality', 'Service', 'Price', 'Delivery', 'Support'],
      datasets: [{
        id: 'satisfaction',
        name: 'Score',
        values: [92, 88, 85, 90, 87],
        color: '#FFB6D9',
        visible: true,
      }],
    },
  },
  {
    id: 'app-downloads',
    name: 'App Downloads',
    description: 'Track mobile app download trends',
    category: 'marketing',
    tags: ['app', 'downloads', 'mobile', 'growth'],
    config: {
      type: 'area',
      title: 'Daily App Downloads',
      xAxisLabel: 'Day',
      yAxisLabel: 'Downloads',
      smooth: true,
      showGrid: true,
      colorScheme: 'neon',
      animated: true,
    },
    sampleData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        id: 'downloads',
        name: 'Downloads',
        values: [1250, 1580, 1820, 2100, 2450, 3200, 2800],
        color: '#00F5FF',
        visible: true,
      }],
    },
  },
  {
    id: 'employee-skills',
    name: 'Employee Skills',
    description: 'Visualize team member skill levels',
    category: 'business',
    tags: ['skills', 'team', 'assessment', 'hr'],
    config: {
      type: 'radar',
      title: 'Team Skills Assessment',
      showLegend: true,
      showGrid: true,
      colorScheme: 'ocean',
      animated: true,
    },
    sampleData: {
      labels: ['Technical', 'Communication', 'Leadership', 'Problem Solving', 'Creativity'],
      datasets: [
        {
          id: 'john',
          name: 'John',
          values: [90, 75, 80, 85, 70],
          color: 'hsl(199, 84%, 55%)',
          visible: true,
        },
        {
          id: 'sarah',
          name: 'Sarah',
          values: [85, 90, 88, 80, 92],
          color: 'hsl(262, 83%, 58%)',
          visible: true,
        },
      ],
    },
  },
  {
    id: 'quarterly-performance',
    name: 'Quarterly Performance',
    description: 'Compare quarterly business metrics',
    category: 'dashboard',
    tags: ['quarterly', 'performance', 'metrics', 'comparison'],
    config: {
      type: 'bar',
      title: 'Quarterly Performance Metrics',
      xAxisLabel: 'Quarter',
      yAxisLabel: 'Value (K)',
      showGrid: true,
      showLegend: true,
      colorScheme: 'vibrant',
      animated: true,
      barRadius: 6,
    },
    sampleData: {
      labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
      datasets: [
        {
          id: 'revenue',
          name: 'Revenue',
          values: [450, 520, 580, 640],
          color: 'hsl(348, 83%, 62%)',
          visible: true,
        },
        {
          id: 'profit',
          name: 'Profit',
          values: [120, 145, 170, 195],
          color: 'hsl(158, 64%, 60%)',
          visible: true,
        },
      ],
    },
  },
  {
    id: 'age-distribution',
    name: 'Age Distribution',
    description: 'Demographic age distribution analysis',
    category: 'analytics',
    tags: ['demographics', 'age', 'population', 'distribution'],
    config: {
      type: 'bar',
      title: 'Population by Age Group',
      xAxisLabel: 'Age Group',
      yAxisLabel: 'Population',
      showGrid: true,
      showDataLabels: true,
      colorScheme: 'earth',
      animated: true,
    },
    sampleData: {
      labels: ['0-17', '18-34', '35-49', '50-64', '65+'],
      datasets: [{
        id: 'population',
        name: 'Population',
        values: [18500, 32400, 28900, 21200, 14800],
        color: '#52B788',
        visible: true,
      }],
    },
  },
  {
    id: 'conversion-rate',
    name: 'Conversion Rate',
    description: 'Track conversion rates over time',
    category: 'marketing',
    tags: ['conversion', 'rate', 'funnel', 'optimization'],
    config: {
      type: 'line',
      title: 'Monthly Conversion Rate',
      xAxisLabel: 'Month',
      yAxisLabel: 'Rate (%)',
      smooth: true,
      showGrid: true,
      showDataLabels: true,
      colorScheme: 'sunset',
      animated: true,
      strokeWidth: 3,
    },
    sampleData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [{
        id: 'conversion',
        name: 'Conversion Rate',
        values: [2.3, 2.8, 3.1, 3.5, 4.2, 4.6, 5.1, 5.8],
        color: 'hsl(25, 95%, 63%)',
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
