import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
import { Upload, Download, Palette } from 'lucide-react';

export default function FeaturesNew() {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState('#14b8a6');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file.name);
      setTimeout(() => setUploadedFile(''), 3000);
    }
  }, []);

  const handleExport = () => {
    // Create a simple CSV
    const csv = 'data:text/csv;charset=utf-8,Name,Value\nSample,100\nDemo,200';
    const link = document.createElement('a');
    link.href = csv;
    link.download = 'vizor-demo-export.csv';
    link.click();
  };

  const colors = [
    '#14b8a6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'
  ];

  return (
    <section 
      id="features" 
      className="py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('features.mainTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.mainSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* File Drop Demo */}
          <Card className="p-8 bg-card/95 backdrop-blur-xl border-2 border-border/50 hover:border-primary/50 hover:shadow-depth-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {t('features.hero.dropData.title')}
              </h3>
            </div>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                h-[200px] rounded-xl border-2 border-dashed
                flex flex-col items-center justify-center gap-3
                transition-all duration-300 cursor-pointer
                ${isDragging 
                  ? 'border-primary bg-primary/10 scale-105' 
                  : 'border-border/50 bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-sm text-muted-foreground text-center px-4">
                {uploadedFile ? (
                  <span className="text-primary font-medium">✓ {uploadedFile}</span>
                ) : (
                  'Drop a CSV or Excel file here'
                )}
              </p>
            </div>
          </Card>

          {/* Color Picker Demo */}
          <Card className="p-8 bg-card/95 backdrop-blur-xl border-2 border-border/50 hover:border-primary/50 hover:shadow-depth-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Custom Colors</h3>
            </div>
            
            <div className="space-y-4">
              <div 
                className="h-[120px] rounded-xl transition-all duration-300"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="grid grid-cols-6 gap-2">
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
              <p className="text-xs text-center text-muted-foreground font-mono">
                {selectedColor.toUpperCase()}
              </p>
            </div>
          </Card>

          {/* Export Demo */}
          <Card className="p-8 bg-card/95 backdrop-blur-xl border-2 border-border/50 hover:border-primary/50 hover:shadow-depth-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {t('features.hero.exportGo.title')}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="h-[120px] rounded-xl bg-muted/30 border border-border/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Download className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Your chart preview</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-11"
                  onClick={handleExport}
                >
                  PNG
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-11"
                  onClick={handleExport}
                >
                  SVG
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-11"
                  onClick={handleExport}
                >
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-11"
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
