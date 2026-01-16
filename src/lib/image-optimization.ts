/**
 * Image optimization utilities for chart exports
 * Provides compression, resizing, and quality optimization
 */

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/png' | 'image/jpeg' | 'image/webp';
  maintainAspectRatio?: boolean;
}

export interface OptimizedImage {
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
}

/**
 * Image optimization service
 */
export class ImageOptimizer {
  /**
   * Optimize an image from a data URL
   */
  static async optimize(
    dataUrl: string,
    options: OptimizationOptions = {}
  ): Promise<OptimizedImage> {
    const {
      maxWidth = 2000,
      maxHeight = 2000,
      quality = 0.92,
      format = 'image/png',
      maintainAspectRatio = true,
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          
          if (maintainAspectRatio) {
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }
          } else {
            width = Math.min(width, maxWidth);
            height = Math.min(height, maxHeight);
          }

          // Create optimized canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw the image
          ctx.drawImage(img, 0, 0, width, height);

          // Get optimized data URL
          const optimizedDataUrl = canvas.toDataURL(format, quality);

          // Calculate sizes (approximate from base64)
          const originalSize = Math.round((dataUrl.length * 3) / 4);
          const optimizedSize = Math.round((optimizedDataUrl.length * 3) / 4);

          resolve({
            dataUrl: optimizedDataUrl,
            width,
            height,
            originalSize,
            optimizedSize,
            compressionRatio: originalSize / optimizedSize,
          });
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  }

  /**
   * Resize an image to specific dimensions
   */
  static async resize(
    dataUrl: string,
    targetWidth: number,
    targetHeight: number,
    options: Partial<OptimizationOptions> = {}
  ): Promise<string> {
    const { quality = 1.0, format = 'image/png' } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        resolve(canvas.toDataURL(format, quality));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  }

  /**
   * Convert image format
   */
  static async convertFormat(
    dataUrl: string,
    targetFormat: 'image/png' | 'image/jpeg' | 'image/webp',
    quality: number = 0.92
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // For JPEG, fill with white background (no transparency)
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL(targetFormat, quality));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  }

  /**
   * Add a background color to a transparent image
   */
  static async addBackground(
    dataUrl: string,
    backgroundColor: string,
    options: Partial<OptimizationOptions> = {}
  ): Promise<string> {
    const { quality = 1.0, format = 'image/png' } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image on top
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL(format, quality));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  }

  /**
   * Crop an image to specific dimensions
   */
  static async crop(
    dataUrl: string,
    x: number,
    y: number,
    width: number,
    height: number,
    options: Partial<OptimizationOptions> = {}
  ): Promise<string> {
    const { quality = 1.0, format = 'image/png' } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        resolve(canvas.toDataURL(format, quality));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  }

  /**
   * Get image dimensions from a data URL
   */
  static async getDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  }

  /**
   * Estimate file size from data URL
   */
  static estimateFileSize(dataUrl: string): number {
    // Remove data URL prefix
    const base64 = dataUrl.split(',')[1] || '';
    // Base64 encodes 3 bytes into 4 characters
    return Math.round((base64.length * 3) / 4);
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Create a thumbnail from an image
   */
  static async createThumbnail(
    dataUrl: string,
    maxSize: number = 200
  ): Promise<string> {
    const { width, height } = await this.getDimensions(dataUrl);
    
    const ratio = Math.min(maxSize / width, maxSize / height);
    const thumbWidth = Math.round(width * ratio);
    const thumbHeight = Math.round(height * ratio);

    return this.resize(dataUrl, thumbWidth, thumbHeight, {
      quality: 0.8,
      format: 'image/jpeg',
    });
  }
}

export default ImageOptimizer;
