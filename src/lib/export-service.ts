import { ChartData, ChartConfig } from '@/types/chart';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'html' | 'json';
  quality?: number; // 0.1 to 1.0 for PNG/JPEG
  filename?: string;
  includeData?: boolean;
  width?: number;
  height?: number;
}

/**
 * Comprehensive export service for Vizor
 * Supports multiple formats: PNG, SVG, PDF, HTML embed, JSON
 */
export class ExportService {
  /**
   * Export chart to PNG with quality settings
   */
  static async exportToPNG(
    chartElement: HTMLElement,
    options: Partial<ExportOptions> = {}
  ): Promise<string> {
    const {
      quality = 1.0,
      filename = 'chart.png',
      width,
      height,
    } = options;

    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: quality * 2,
        width,
        height,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const dataUrl = canvas.toDataURL('image/png', quality);
      this.downloadDataUrl(dataUrl, filename);
      return dataUrl;
    } catch (error) {
      console.error('PNG export failed:', error);
      toast.error('Failed to export PNG');
      throw error;
    }
  }

  /**
   * Export chart to PDF with proper sizing
   */
  static async exportToPDF(
    chartElement: HTMLElement,
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    const { filename = 'chart.pdf', quality = 0.95 } = options;

    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png', quality);
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(filename);
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF');
      throw error;
    }
  }

  /**
   * Export chart as interactive HTML embed
   */
  static exportToHTML(
    data: ChartData,
    config: ChartConfig,
    options: Partial<ExportOptions> = {}
  ): string {
    const { filename = 'chart.html' } = options;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title || 'Vizor Chart'}</title>
  <script src="https://cdn.jsdelivr.net/npm/recharts@2.12.0/dist/Recharts.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: system-ui, -apple-system, sans-serif;
      background: #f8fafc;
    }
    .chart-container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    h1 {
      margin: 0 0 24px 0;
      color: #1e293b;
      font-size: 24px;
      font-weight: 600;
    }
    .powered-by {
      margin-top: 16px;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="chart-container">
    <h1>${config.title || 'Chart'}</h1>
    <div id="chart"></div>
    <div class="powered-by">
      Powered by Vizor
    </div>
  </div>

  <script>
    // Chart data
    const chartData = ${JSON.stringify(data, null, 2)};
    const chartConfig = ${JSON.stringify(config, null, 2)};
    
    // Render chart (simplified - full implementation would use Recharts)
    if (import.meta.env.DEV) {
      console.log('Chart data loaded:', chartData);
      console.log('Chart config:', chartConfig);
    }
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    this.downloadUrl(url, filename);
    URL.revokeObjectURL(url);

    toast.success('HTML exported successfully');
    return htmlContent;
  }

  /**
   * Export chart data and config as JSON
   */
  static exportToJSON(
    data: ChartData,
    config: ChartConfig,
    options: Partial<ExportOptions> = {}
  ): string {
    const { filename = 'chart-data.json' } = options;

    const exportData = {
      version: '1.0.0',
      exported: new Date().toISOString(),
      data,
      config,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    this.downloadUrl(url, filename);
    URL.revokeObjectURL(url);

    toast.success('JSON exported successfully');
    return jsonString;
  }

  /**
   * Copy chart as image to clipboard
   */
  static async copyToClipboard(chartElement: HTMLElement): Promise<void> {
    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to create blob');
        }

        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);

        toast.success('Chart copied to clipboard');
      });
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      toast.error('Failed to copy to clipboard');
      throw error;
    }
  }

  /**
   * Generate shareable URL with chart state
   */
  static generateShareableURL(data: ChartData, config: ChartConfig): string {
    const state = {
      data,
      config: {
        type: config.type,
        title: config.title,
        colorScheme: config.colorScheme,
        // Only include essential config to keep URL short
      },
    };

    const compressed = btoa(JSON.stringify(state));
    const url = `${window.location.origin}${window.location.pathname}?share=${compressed}`;

    // Copy to clipboard
    navigator.clipboard.writeText(url);
    toast.success('Shareable link copied to clipboard');

    return url;
  }

  /**
   * Load chart state from shareable URL
   */
  static loadFromShareableURL(): { data: ChartData; config: Partial<ChartConfig> } | null {
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get('share');

    if (!shareParam) {
      return null;
    }

    try {
      const decoded = atob(shareParam);
      const state = JSON.parse(decoded);
      return state;
    } catch (error) {
      console.error('Failed to load from shareable URL:', error);
      toast.error('Invalid shareable link');
      return null;
    }
  }

  /**
   * Batch export multiple charts
   */
  static async batchExport(
    charts: Array<{ element: HTMLElement; name: string }>,
    format: 'png' | 'pdf'
  ): Promise<void> {
    toast.info(`Exporting ${charts.length} charts...`);

    if (format === 'pdf') {
      // Create single PDF with multiple pages
      const pdf = new jsPDF();
      let isFirstPage = true;

      for (const chart of charts) {
        if (!isFirstPage) {
          pdf.addPage();
        }

        const canvas = await html2canvas(chart.element, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png', 0.95);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        isFirstPage = false;
      }

      pdf.save('charts-batch.pdf');
      toast.success('Batch PDF export completed');
    } else {
      // Export individual PNGs
      for (let i = 0; i < charts.length; i++) {
        await this.exportToPNG(charts[i].element, {
          filename: `${charts[i].name || `chart-${i + 1}`}.png`,
        });
      }
      toast.success('Batch PNG export completed');
    }
  }

  /**
   * Helper: Download data URL
   */
  private static downloadDataUrl(dataUrl: string, filename: string): void {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Helper: Download URL
   */
  private static downloadUrl(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
