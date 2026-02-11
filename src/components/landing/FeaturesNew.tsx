import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useState, useCallback, useRef } from 'react';
import { Upload, Download, Palette, Check } from 'lucide-react';
import { parseFile } from '@/lib/data-parser';
import { toast } from 'sonner';

export default function FeaturesNew() {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#14b8a6');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appBase = import.meta.env.BASE_URL || '/';
  const appPath = appBase.endsWith('/') ? `${appBase}app` : `${appBase}/app`;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    setUploadedFile(file.name);
    setIsProcessing(true);
    
    try {
      // Parse the file
      const parsedData = await parseFile(file);
      
      // Store in localStorage for app to pick up
      localStorage.setItem('vizor-landing-upload', JSON.stringify({
        data: parsedData,
        fileName: file.name,
        color: selectedColor,
        timestamp: Date.now()
      }));
      
      // Show success message
      toast.success('Data loaded! Opening app...');
      
      // Navigate to app after a short delay
      setTimeout(() => {
        window.location.href = `${appPath}?source=landing-upload`;
      }, 800);
    } catch (error) {
      console.error('File parsing error:', error);
      toast.error('Failed to parse file. Please try a CSV or Excel file.');
      setUploadedFile('');
      setIsProcessing(false);
    }
  }, [selectedColor]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  }, [processFile]);

  const handleFileInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  }, [processFile]);

  const handleDropZoneClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleExport = () => {
    // Store demo data for the app
    const demoData = {
      labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
      datasets: [
        {
          label: 'Sales 2024',
          data: [42, 68, 53, 81, 45],
          color: selectedColor
        }
      ]
    };
    
    localStorage.setItem('vizor-landing-upload', JSON.stringify({
      data: demoData,
      fileName: 'demo-export-data.csv',
      color: selectedColor,
      timestamp: Date.now()
    }));
    
    toast.success('Opening app with demo data...');
    setTimeout(() => {
      window.location.href = `${appPath}?source=landing-export`;
    }, 500);
  };

  const colors = [
    '#14b8a6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'
  ];

  return (
    <section 
      id="features" 
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {t('features.mainTitle')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {t('features.mainSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
          {/* File Drop Demo */}
          <Card className="p-5 sm:p-6 md:p-8 bg-card/95 backdrop-blur-xl border-2 border-border/50 hover:border-primary/50 hover:shadow-depth-lg transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                {t('features.hero.dropData.title')}
              </h3>
            </div>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleDropZoneClick}
              className={`
                h-[160px] sm:h-[180px] md:h-[200px] rounded-xl border-2 border-dashed
                flex flex-col items-center justify-center gap-2 sm:gap-3
                transition-all duration-300 cursor-pointer
                ${isProcessing ? 'pointer-events-none opacity-50' : ''}
                ${isDragging 
                  ? 'border-primary bg-primary/10 scale-[1.02]' 
                  : 'border-border/50 bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              {isProcessing ? (
                <>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs sm:text-sm text-primary font-medium">Processing...</p>
                </>
              ) : (
                <>
                  {uploadedFile ? (
                    <Check className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  ) : (
                    <Upload className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground text-center px-3 sm:px-4">
                    {uploadedFile ? (
                      <span className="text-primary font-medium break-all">✓ {uploadedFile}</span>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Drop a CSV or Excel file here or click to browse</span>
                        <span className="sm:hidden">Drop file or click to browse</span>
                      </>
                    )}
                  </p>
                </>
              )}
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </Card>

          {/* Color Picker Demo */}
          <Card className="p-5 sm:p-6 md:p-8 bg-card/95 backdrop-blur-xl border-2 border-border/50 hover:border-primary/50 hover:shadow-depth-lg transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                <Palette className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Custom Colors</h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div 
                className="h-[100px] sm:h-[110px] md:h-[120px] rounded-xl transition-all duration-300"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      w-full aspect-square rounded-lg transition-all duration-300
                      ${selectedColor === color 
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110' 
                        : 'hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color}`}
                  />
                ))}
              </div>
              <p className="text-[10px] sm:text-xs text-center text-muted-foreground font-mono">
                {selectedColor.toUpperCase()}
              </p>
            </div>
          </Card>

          {/* Export Demo */}
          <Card className="p-5 sm:p-6 md:p-8 bg-card/95 backdrop-blur-xl border-2 border-border/50 hover:border-primary/50 hover:shadow-depth-lg transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                {t('features.hero.exportGo.title')}
              </h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="h-[100px] sm:h-[110px] md:h-[120px] rounded-xl bg-muted/30 border border-border/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Download className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Your chart preview</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                  onClick={handleExport}
                >
                  PNG
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                  onClick={handleExport}
                >
                  SVG
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                  onClick={handleExport}
                >
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                  onClick={handleExport}
                >
                  CSV
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
