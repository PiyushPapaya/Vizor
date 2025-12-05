import { ChartData, Dataset, CHART_COLORS } from '@/types/chart';

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const parseCSV = (content: string): ChartData => {
  const lines = content.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const labels: string[] = [];
  const dataColumns: number[][] = [];

  // Initialize data columns
  for (let i = 1; i < headers.length; i++) {
    dataColumns.push([]);
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    if (values.length !== headers.length) continue;
    
    labels.push(values[0]);
    for (let j = 1; j < values.length; j++) {
      const num = parseFloat(values[j]);
      dataColumns[j - 1].push(isNaN(num) ? 0 : num);
    }
  }

  const datasets: Dataset[] = dataColumns.map((values, index) => ({
    id: generateId(),
    name: headers[index + 1],
    values,
    color: CHART_COLORS[index % CHART_COLORS.length],
    visible: true,
  }));

  return { labels, datasets };
};

export const parseJSON = (content: string): ChartData => {
  const parsed = JSON.parse(content);
  
  // Handle array of objects
  if (Array.isArray(parsed) && parsed.length > 0) {
    const keys = Object.keys(parsed[0]);
    const labelKey = keys[0];
    const valueKeys = keys.slice(1);

    const labels = parsed.map(item => String(item[labelKey]));
    const datasets: Dataset[] = valueKeys.map((key, index) => ({
      id: generateId(),
      name: key,
      values: parsed.map(item => {
        const val = parseFloat(item[key]);
        return isNaN(val) ? 0 : val;
      }),
      color: CHART_COLORS[index % CHART_COLORS.length],
      visible: true,
    }));

    return { labels, datasets };
  }

  // Handle pre-formatted chart data
  if (parsed.labels && parsed.datasets) {
    return {
      labels: parsed.labels,
      datasets: parsed.datasets.map((ds: any, index: number) => ({
        id: ds.id || generateId(),
        name: ds.name || `Dataset ${index + 1}`,
        values: ds.values || ds.data || [],
        color: ds.color || CHART_COLORS[index % CHART_COLORS.length],
        visible: ds.visible !== false,
      })),
    };
  }

  throw new Error('Invalid JSON format');
};

export const parseFile = async (file: File): Promise<ChartData> => {
  const content = await file.text();
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'csv':
      return parseCSV(content);
    case 'json':
      return parseJSON(content);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
};

export const generateSampleData = (): ChartData => {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        id: generateId(),
        name: 'Revenue',
        values: [4500, 5200, 4800, 6100, 5800, 7200],
        color: CHART_COLORS[0],
        visible: true,
      },
      {
        id: generateId(),
        name: 'Expenses',
        values: [3200, 3800, 3500, 4200, 3900, 4800],
        color: CHART_COLORS[1],
        visible: true,
      },
    ],
  };
};
