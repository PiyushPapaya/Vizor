import { z } from 'zod';

/**
 * Zod schema for dataset validation
 * Ensures data integrity before processing
 */
export const DatasetSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Dataset name is required'),
  values: z.array(z.number()).min(1, 'Dataset must have at least one value'),
  color: z.string().regex(/^(hsl|rgb|#)/, 'Invalid color format'),
  visible: z.boolean().default(true),
});

/**
 * Zod schema for chart data validation
 * Ensures labels and datasets are properly structured
 */
export const ChartDataSchema = z.object({
  labels: z.array(z.string()).min(1, 'At least one label is required'),
  datasets: z.array(DatasetSchema).min(1, 'At least one dataset is required'),
}).refine(
  (data) => {
    // Ensure all datasets have the same number of values as labels
    const labelCount = data.labels.length;
    return data.datasets.every((ds) => ds.values.length === labelCount);
  },
  {
    message: 'All datasets must have the same number of values as labels',
  }
);

/**
 * Zod schema for chart configuration validation
 * Ensures config has required fields with proper types
 */
export const ChartConfigSchema = z.object({
  id: z.string(),
  type: z.enum([
    'line',
    'bar',
    'area',
    'pie',
    'donut',
    'scatter',
    'bubble',
    'radar',
    'radialBar',
    'composed',
    'funnel',
    'treemap',
    'waterfall',
    'heatmap',
  ]),
  title: z.string().default('Untitled Chart'),
  xAxisLabel: z.string().optional(),
  yAxisLabel: z.string().optional(),
  showGrid: z.boolean().default(true),
  showLegend: z.boolean().default(true),
  showTooltip: z.boolean().default(true),
  showDataLabels: z.boolean().default(false),
  colorScheme: z.enum(['default', 'vibrant', 'pastel', 'monochrome', 'ocean', 'sunset', 'neon', 'earth', 'candy', 'custom']).default('default'),
  stacked: z.boolean().default(false),
  smooth: z.boolean().default(false),
  animated: z.boolean().default(true),
  annotations: z.array(z.any()).default([]),
});

/**
 * Type exports derived from Zod schemas
 */
export type ValidatedChartData = z.infer<typeof ChartDataSchema>;
export type ValidatedChartConfig = z.infer<typeof ChartConfigSchema>;
export type ValidatedDataset = z.infer<typeof DatasetSchema>;

/**
 * Validation helper functions
 */
export class DataValidator {
  /**
   * Validate chart data with detailed error messages
   */
  static validateChartData(data: unknown): { success: boolean; data?: ValidatedChartData; errors?: string[] } {
    const result = ChartDataSchema.safeParse(data);

    if (result.success) {
      return { success: true, data: result.data };
    }

    const errors = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
    return { success: false, errors };
  }

  /**
   * Validate chart config with detailed error messages
   */
  static validateChartConfig(config: unknown): { success: boolean; data?: ValidatedChartConfig; errors?: string[] } {
    const result = ChartConfigSchema.safeParse(config);

    if (result.success) {
      return { success: true, data: result.data };
    }

    const errors = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
    return { success: false, errors };
  }

  /**
   * Validate and sanitize imported data
   * Attempts to fix common issues automatically
   */
  static sanitizeChartData(data: unknown): ValidatedChartData | null {
    try {
      // Type guard: Ensure data structure exists
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data structure');
      }

      // Cast to any only after type check for property access
      const rawData = data as Record<string, unknown>;

      // Fix missing labels
      if (!rawData.labels || !Array.isArray(rawData.labels)) {
        const firstDataset = Array.isArray(rawData.datasets) && rawData.datasets[0];
        const values = firstDataset && typeof firstDataset === 'object' && 'values' in firstDataset 
          ? (firstDataset as any).values 
          : [];
        rawData.labels = Array.isArray(values) ? values.map((_: unknown, i: number) => `Item ${i + 1}`) : [];
      }

      // Fix missing datasets
      if (!rawData.datasets || !Array.isArray(rawData.datasets)) {
        throw new Error('No datasets found');
      }

      // Sanitize each dataset
      rawData.datasets = rawData.datasets.map((ds: unknown, index: number) => {
        const dataset = (ds && typeof ds === 'object' ? ds : {}) as Record<string, unknown>;
        return {
          id: typeof dataset.id === 'string' ? dataset.id : `dataset-${index}`,
          name: typeof dataset.name === 'string' ? dataset.name : `Dataset ${index + 1}`,
          values: Array.isArray(dataset.values) ? dataset.values.map(Number).filter((n) => !isNaN(n)) : [],
          color: typeof dataset.color === 'string' ? dataset.color : `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
          visible: dataset.visible !== false,
        };
      });

      // Pad datasets to match label length
      const maxLength = Array.isArray(rawData.labels) ? rawData.labels.length : 0;
      (rawData.datasets as any[]).forEach((ds: any) => {
        while (ds.values.length < maxLength) {
          ds.values.push(0);
        }
        ds.values = ds.values.slice(0, maxLength);
      });

      // Validate sanitized data
      const result = this.validateChartData(rawData);
      return result.success ? result.data! : null;
    } catch (error) {
      console.error('Data sanitization failed:', error);
      return null;
    }
  }

  /**
   * Check data integrity and return warnings
   */
  static checkDataIntegrity(data: ValidatedChartData): string[] {
    const warnings: string[] = [];

    // Check for empty labels
    if (data.labels.some((label) => !label || label.trim() === '')) {
      warnings.push('Some labels are empty');
    }

    // Check for duplicate labels
    const uniqueLabels = new Set(data.labels);
    if (uniqueLabels.size !== data.labels.length) {
      warnings.push('Duplicate labels detected');
    }

    // Check for all-zero datasets
    data.datasets.forEach((ds, index) => {
      if (ds.values.every((v) => v === 0)) {
        warnings.push(`Dataset "${ds.name}" contains only zeros`);
      }
    });

    // Check for extreme outliers
    data.datasets.forEach((ds) => {
      const values = ds.values.filter((v) => v !== 0);
      if (values.length > 0) {
        const max = Math.max(...values);
        const min = Math.min(...values);
        if (max / min > 1000) {
          warnings.push(`Dataset "${ds.name}" has extreme value range`);
        }
      }
    });

    // Check for very large datasets
    if (data.labels.length > 1000) {
      warnings.push('Large dataset detected - performance may be affected');
    }

    return warnings;
  }
}
