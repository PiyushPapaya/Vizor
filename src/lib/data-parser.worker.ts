// Web Worker for parsing large data files
// This keeps the UI responsive during heavy file processing

import * as XLSX from 'xlsx';
import { ChartData, Dataset, CHART_COLORS } from '@/types/chart';

const generateId = () => Math.random().toString(36).substring(2, 9);

// Parse CSV content
function parseCSVContent(content: string): ChartData {
  const lines = content.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const labels: string[] = [];
  const dataColumns: number[][] = [];

  for (let i = 1; i < headers.length; i++) {
    dataColumns.push([]);
  }

  // Process in chunks for very large files
  const CHUNK_SIZE = 10000;
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    if (values.length !== headers.length) continue;
    
    labels.push(values[0]);
    for (let j = 1; j < values.length; j++) {
      const num = parseFloat(values[j]);
      dataColumns[j - 1].push(isNaN(num) ? 0 : num);
    }
    
    // Report progress for large files
    if (i % CHUNK_SIZE === 0) {
      self.postMessage({ 
        type: 'progress', 
        progress: Math.round((i / lines.length) * 100),
        message: `Processing row ${i.toLocaleString()} of ${(lines.length - 1).toLocaleString()}`
      });
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
}

// Parse JSON content
function parseJSONContent(content: string): ChartData {
  const parsed = JSON.parse(content);
  
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
}

// Parse Excel content
async function parseExcelContent(buffer: ArrayBuffer): Promise<ChartData> {
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

  for (let i = 1; i < headers.length; i++) {
    dataColumns.push([]);
  }

  // Process data rows
  const CHUNK_SIZE = 5000;
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length === 0) continue;
    
    labels.push(String(row[0] || ''));
    for (let j = 1; j < headers.length; j++) {
      const num = parseFloat(row[j]);
      dataColumns[j - 1].push(isNaN(num) ? 0 : num);
    }
    
    if (i % CHUNK_SIZE === 0) {
      self.postMessage({ 
        type: 'progress', 
        progress: Math.round((i / jsonData.length) * 100),
        message: `Processing row ${i.toLocaleString()} of ${(jsonData.length - 1).toLocaleString()}`
      });
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
}

// Handle messages from main thread
self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;
  
  try {
    let result: ChartData;
    
    switch (type) {
      case 'parseCSV':
        self.postMessage({ type: 'progress', progress: 0, message: 'Starting CSV parsing...' });
        result = parseCSVContent(payload.content);
        break;
        
      case 'parseJSON':
        self.postMessage({ type: 'progress', progress: 0, message: 'Starting JSON parsing...' });
        result = parseJSONContent(payload.content);
        break;
        
      case 'parseExcel':
        self.postMessage({ type: 'progress', progress: 0, message: 'Starting Excel parsing...' });
        result = await parseExcelContent(payload.buffer);
        break;
        
      default:
        throw new Error(`Unknown parse type: ${type}`);
    }
    
    self.postMessage({ 
      type: 'success', 
      data: result,
      stats: {
        rows: result.labels.length,
        columns: result.datasets.length,
        dataPoints: result.labels.length * result.datasets.length,
      }
    });
    
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export {};
