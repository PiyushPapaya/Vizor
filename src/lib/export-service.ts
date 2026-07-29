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
  backgroundColor?: string | null; // null = transparent
  scale?: number; // 1-4 for sharpness
}

export interface ExportPreset {
  name: string;
  width: number;
  height: number;
  scale?: number;
  quality?: number;
  icon: string;
  description: string;
}

// Export presets for common use cases
export const EXPORT_PRESETS: Record<string, ExportPreset> = {
  hd: {
    name: 'HD (1280×720)',
    width: 1280,
    height: 720,
    scale: 2,
    icon: 'monitor',
    description: 'Standard HD resolution for screens',
  },
  fullHd: {
    name: 'Full HD (1920×1080)',
    width: 1920,
    height: 1080,
    scale: 2,
    icon: 'monitor',
    description: 'Full HD for presentations',
  },
  presentation: {
    name: 'Presentation (1600×900)',
    width: 1600,
    height: 900,
    scale: 2,
    icon: 'presentation',
    description: '16:9 slides and presentations',
  },
  print: {
    name: 'Print (2400×1800)',
    width: 2400,
    height: 1800,
    scale: 3,
    quality: 1.0,
    icon: 'printer',
    description: 'High resolution for printing',
  },
  twitter: {
    name: 'Twitter/X (1200×675)',
    width: 1200,
    height: 675,
    scale: 2,
    icon: 'twitter',
    description: 'Optimized for Twitter/X posts',
  },
  linkedin: {
    name: 'LinkedIn (1200×628)',
    width: 1200,
    height: 628,
    scale: 2,
    icon: 'linkedin',
    description: 'LinkedIn feed posts',
  },
  instagram: {
    name: 'Instagram (1080×1080)',
    width: 1080,
    height: 1080,
    scale: 2,
    icon: 'instagram',
    description: 'Square format for Instagram',
  },
  story: {
    name: 'Story (1080×1920)',
    width: 1080,
    height: 1920,
    scale: 2,
    icon: 'smartphone',
    description: 'Vertical story format',
  },
};

/**
 * Comprehensive export service for Vizor
 * Supports multiple formats: PNG, SVG, PDF, HTML embed, JSON
 */
export class ExportService {
  /**
   * Generate a preview of the export (smaller, faster)
   */
  static async generatePreview(
    chartElement: HTMLElement,
    options: Partial<ExportOptions> = {}
  ): Promise<string> {
    const {
      backgroundColor = '#ffffff',
      quality = 0.8,
      scale = 1,
    } = options;

    try {
      // Compute CSS variables to actual colors for accurate preview
      const computedStyles = this.computeCSSVariables(chartElement);
      
      // Capture the full chart element (no width/height restrictions)
      const canvas = await html2canvas(chartElement, {
        backgroundColor: backgroundColor,
        scale: scale,
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc, clonedElement) => {
          // Apply computed styles to ensure CSS variables resolve
          this.applyComputedStyles(clonedElement, computedStyles);
        },
      });

      return canvas.toDataURL('image/png', quality);
    } catch (error) {
      console.error('Preview generation failed:', error);
      throw error;
    }
  }

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
      backgroundColor = '#ffffff',
      scale = 2,
    } = options;

    try {
      // Compute CSS variables for accurate export
      const computedStyles = this.computeCSSVariables(chartElement);
      
      const canvas = await html2canvas(chartElement, {
        backgroundColor: backgroundColor,
        scale: scale,
        width,
        height,
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc, clonedElement) => {
          // Apply computed styles to ensure CSS variables resolve
          this.applyComputedStyles(clonedElement, computedStyles);
        },
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
   * Export chart to SVG
   */
  static exportToSVG(
    chartElement: HTMLElement,
    options: Partial<ExportOptions> = {}
  ): string | null {
    const { filename = 'chart.svg', backgroundColor } = options;

    try {
      // Recursively search for SVG element (Recharts wraps it in divs)
      const findSVG = (element: HTMLElement): SVGSVGElement | null => {
        if (element.tagName.toLowerCase() === 'svg') {
          return element as SVGSVGElement;
        }
        const svg = element.querySelector('svg');
        if (svg) return svg;
        
        // Search through all children
        for (const child of Array.from(element.children)) {
          const found = findSVG(child as HTMLElement);
          if (found) return found;
        }
        return null;
      };
      
      const svg = findSVG(chartElement);
      if (!svg) {
        toast.error('No SVG element found in chart');
        return null;
      }

      // Clone the SVG to modify it
      const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
      
      // Add background if specified
      if (backgroundColor && backgroundColor !== 'transparent') {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', backgroundColor);
        clonedSvg.insertBefore(rect, clonedSvg.firstChild);
      }

      // Inline CSS variables and styles
      this.inlineSVGStyles(clonedSvg);

      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      this.downloadUrl(url, filename);
      URL.revokeObjectURL(url);
      
      toast.success('SVG exported successfully');
      return svgData;
    } catch (error) {
      console.error('SVG export failed:', error);
      toast.error('Failed to export SVG');
      return null;
    }
  }

  /**
   * Export chart to PDF with proper sizing
   */
  static async exportToPDF(
    chartElement: HTMLElement,
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    const { 
      filename = 'chart.pdf', 
      quality = 0.95,
      backgroundColor = '#ffffff',
    } = options;

    try {
      const computedStyles = this.computeCSSVariables(chartElement);
      
      const canvas = await html2canvas(chartElement, {
        backgroundColor: backgroundColor,
        scale: 2,
        logging: false,
        onclone: (clonedDoc, clonedElement) => {
          this.applyComputedStyles(clonedElement, computedStyles);
        },
      });

      const imgData = canvas.toDataURL('image/png', quality);
      
      // Use standard A4 page size for better compatibility
      const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate dimensions to fit image on page while maintaining aspect ratio
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgAspect = canvas.width / canvas.height;
      const pageAspect = pageWidth / pageHeight;
      
      let imgWidth = pageWidth;
      let imgHeight = pageHeight;
      
      if (imgAspect > pageAspect) {
        // Image is wider - fit to width
        imgHeight = pageWidth / imgAspect;
      } else {
        // Image is taller - fit to height
        imgWidth = pageHeight * imgAspect;
      }
      
      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
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
  static async copyToClipboard(
    chartElement: HTMLElement,
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    const { backgroundColor = null, scale = 2 } = options;
    
    try {
      const computedStyles = this.computeCSSVariables(chartElement);
      
      const canvas = await html2canvas(chartElement, {
        backgroundColor: backgroundColor,
        scale: scale,
        logging: false,
        onclone: (clonedDoc, clonedElement) => {
          this.applyComputedStyles(clonedElement, computedStyles);
        },
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to create blob');
        }

        try {
          // Check if Clipboard API is supported
          if (navigator.clipboard && ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            toast.success('Chart copied to clipboard');
          } else {
            // Fallback: copy as data URL (works in more browsers)
            const dataUrl = canvas.toDataURL('image/png');
            await navigator.clipboard.writeText(dataUrl);
            toast.success('Chart data URL copied to clipboard');
          }
        } catch (clipError) {
          console.error('Clipboard write failed:', clipError);
          // Final fallback: try the deprecated execCommand method
          const dataUrl = canvas.toDataURL('image/png');
          const textArea = document.createElement('textarea');
          textArea.value = dataUrl;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            toast.success('Chart data URL copied to clipboard');
          } catch (execError) {
            toast.error('Failed to copy to clipboard. Please try downloading instead.');
          }
          document.body.removeChild(textArea);
        }
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
    format: 'png' | 'pdf',
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    const { backgroundColor = '#ffffff' } = options;
    
    toast.info(`Exporting ${charts.length} charts...`);

    if (format === 'pdf') {
      // Create single PDF with multiple pages
      const pdf = new jsPDF();
      let isFirstPage = true;

      for (const chart of charts) {
        if (!isFirstPage) {
          pdf.addPage();
        }

        const computedStyles = this.computeCSSVariables(chart.element);
        
        const canvas = await html2canvas(chart.element, {
          backgroundColor: backgroundColor,
          scale: 2,
          logging: false,
          onclone: (clonedDoc, clonedElement) => {
            this.applyComputedStyles(clonedElement, computedStyles);
          },
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
          backgroundColor,
        });
      }
      toast.success('Batch PNG export completed');
    }
  }

  /**
   * Compute CSS variable values from the current theme
   */
  private static computeCSSVariables(element: HTMLElement): Record<string, string> {
    const computedStyle = getComputedStyle(document.documentElement);
    const cssVars: Record<string, string> = {};
    
    // Common CSS variables used in charts
    const varNames = [
      '--background',
      '--foreground', 
      '--card',
      '--card-foreground',
      '--popover',
      '--popover-foreground',
      '--primary',
      '--primary-foreground',
      '--secondary',
      '--secondary-foreground',
      '--muted',
      '--muted-foreground',
      '--accent',
      '--accent-foreground',
      '--destructive',
      '--destructive-foreground',
      '--border',
      '--input',
      '--ring',
    ];

    varNames.forEach(varName => {
      const value = computedStyle.getPropertyValue(varName).trim();
      if (value) {
        cssVars[varName] = value;
      }
    });

    return cssVars;
  }

  /**
   * Apply computed styles to cloned element for export
   */
  private static applyComputedStyles(
    element: HTMLElement, 
    cssVars: Record<string, string>
  ): void {
    // Set CSS variables on the cloned element's root
    Object.entries(cssVars).forEach(([varName, value]) => {
      element.style.setProperty(varName, value);
    });

    // Find all elements using hsl(var(--xxx)) and convert to actual colors
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        const style = getComputedStyle(el);
        
        // Convert color properties
        ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'].forEach(prop => {
          const value = style.getPropertyValue(prop);
          if (value && value.includes('var(')) {
            // Try to compute the actual value
            const computedValue = style[prop as keyof CSSStyleDeclaration];
            if (computedValue && typeof computedValue === 'string') {
              (el.style as any)[prop] = computedValue;
            }
          }
        });
      }
    });
  }

  /**
   * Inline CSS variables in SVG for export
   */
  private static inlineSVGStyles(svg: SVGSVGElement): void {
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Find all elements and inline their styles
    const allElements = svg.querySelectorAll('*');
    allElements.forEach((el) => {
      if (el instanceof SVGElement) {
        const elStyle = getComputedStyle(el);
        
        // Inline all relevant style properties for complete SVG export
        const styleProps = [
          { css: 'fill', attr: 'fill' },
          { css: 'stroke', attr: 'stroke' },
          { css: 'stroke-width', attr: 'stroke-width' },
          { css: 'stroke-dasharray', attr: 'stroke-dasharray' },
          { css: 'stroke-linecap', attr: 'stroke-linecap' },
          { css: 'stroke-linejoin', attr: 'stroke-linejoin' },
          { css: 'opacity', attr: 'opacity' },
          { css: 'fill-opacity', attr: 'fill-opacity' },
          { css: 'stroke-opacity', attr: 'stroke-opacity' },
          { css: 'font-family', attr: 'font-family' },
          { css: 'font-size', attr: 'font-size' },
          { css: 'font-weight', attr: 'font-weight' },
          { css: 'font-style', attr: 'font-style' },
          { css: 'text-anchor', attr: 'text-anchor' },
          { css: 'dominant-baseline', attr: 'dominant-baseline' },
        ];
        
        styleProps.forEach(({ css, attr }) => {
          const value = elStyle.getPropertyValue(css);
          if (value && value !== 'none' && value !== 'normal') {
            el.setAttribute(attr, value);
          }
        });
      }
    });
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
