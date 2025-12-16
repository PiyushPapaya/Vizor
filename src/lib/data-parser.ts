import * as XLSX from 'xlsx';
import { ChartData, Dataset, CHART_COLORS } from '@/types/chart';
import { DataValidator } from './validation';
import { toast } from 'sonner';
import { EnhancedError, ErrorCodes, ErrorLogger, validateFile } from './error-handling';

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

export const parseExcel = async (file: File): Promise<ChartData> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
  if (jsonData.length < 2) {
    throw new Error('Excel file must have at least a header and one data row');
  }

  const headers = jsonData[0].map(h => String(h || '').trim());
  const labels: string[] = [];
  const dataColumns: number[][] = [];

  // Initialize data columns
  for (let i = 1; i < headers.length; i++) {
    dataColumns.push([]);
  }

  // Parse data rows
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length === 0) continue;
    
    labels.push(String(row[0] || ''));
    for (let j = 1; j < headers.length; j++) {
      const num = parseFloat(row[j]);
      dataColumns[j - 1].push(isNaN(num) ? 0 : num);
    }
  }

  const datasets: Dataset[] = dataColumns.map((values, index) => ({
    id: generateId(),
    name: headers[index + 1] || `Column ${index + 2}`,
    values,
    color: CHART_COLORS[index % CHART_COLORS.length],
    visible: true,
  }));

  return { labels, datasets };
};

export const parseFile = async (file: File): Promise<ChartData> => {
  try {
    // Validate file first
    validateFile(file, 10);
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    let parsedData: ChartData;

    switch (extension) {
      case 'csv':
        const csvContent = await file.text();
        parsedData = parseCSV(csvContent);
        break;
      case 'json':
        const jsonContent = await file.text();
        parsedData = parseJSON(jsonContent);
        break;
      case 'xlsx':
      case 'xls':
        parsedData = await parseExcel(file);
        break;
      default:
        throw new EnhancedError(
          `Unsupported file type: ${extension}`,
          ErrorCodes.UNSUPPORTED_FILE_TYPE,
          undefined,
          { fileName: file.name }
        );
    }

    // Validate and sanitize parsed data
    const sanitized = DataValidator.sanitizeChartData(parsedData);
    if (!sanitized) {
      throw new EnhancedError(
        'Invalid data format - could not sanitize',
        ErrorCodes.DATA_VALIDATION_FAILED,
        undefined,
        { fileName: file.name }
      );
    }

    // Check for data integrity warnings
    const warnings = DataValidator.checkDataIntegrity(sanitized);
    if (warnings.length > 0) {
      warnings.forEach((warning) => toast.warning(warning));
    }

    return sanitized;
  } catch (error) {
    ErrorLogger.log(error as Error, { fileName: file.name });
    
    if (error instanceof EnhancedError) {
      throw error;
    }
    
    throw new EnhancedError(
      `File parsing failed: ${(error as Error).message}`,
      ErrorCodes.DATA_PARSING_FAILED,
      error as Error,
      { fileName: file.name }
    );
  }
};

export const generateSampleData = (): ChartData => {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        id: generateId(),
        name: 'Revenue',
        values: [4500, 5200, 4800, 6100, 5800, 7200, 6800, 7500],
        color: CHART_COLORS[0],
        visible: true,
      },
      {
        id: generateId(),
        name: 'Expenses',
        values: [3200, 3800, 3500, 4200, 3900, 4800, 4500, 5100],
        color: CHART_COLORS[1],
        visible: true,
      },
      {
        id: generateId(),
        name: 'Profit',
        values: [1300, 1400, 1300, 1900, 1900, 2400, 2300, 2400],
        color: CHART_COLORS[2],
        visible: true,
      },
    ],
  };
};

export const generateRandomData = (labels: number = 12, datasets: number = 2): ChartData => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dataLabels = months.slice(0, labels);
  
  return {
    labels: dataLabels,
    datasets: Array.from({ length: datasets }, (_, i) => ({
      id: generateId(),
      name: `Dataset ${i + 1}`,
      values: Array.from({ length: labels }, () => Math.floor(Math.random() * 1000) + 100),
      color: CHART_COLORS[i % CHART_COLORS.length],
      visible: true,
    })),
  };
};
