import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartRendererRef } from '@/components/charts/ChartRenderer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Share2, Image as ImageIcon, FileCode, FileType,
  ChevronLeft, ChevronRight, Check, X, Smartphone, Monitor,
  Square, RectangleHorizontal, Instagram, Twitter
} from 'lucide-react';
import { ANIMATION_TIMING, mobileSpring, bouncySpring, triggerHaptic } from '@/lib/animations';
import { Drawer } from 'vaul';

// Export format types
type ExportFormat = 'png' | 'svg' | 'jpg' | 'webp';
type ExportSize = 'instagram' | 'twitter' | 'presentation' | 'custom';

interface ExportFormatOption {
  id: ExportFormat;
  name: string;
  description: string;
  icon: typeof ImageIcon;
  quality: string;
  recommended?: boolean;
}

interface ExportSizeOption {
  id: ExportSize;
  name: string;
  dimensions: string;
  width: number;
  height: number;
  icon: typeof Square;
}

const exportFormats: ExportFormatOption[] = [
  { 
    id: 'png', 
    name: 'PNG', 
    description: 'High quality, transparent background', 
    icon: ImageIcon,
    quality: 'Best for sharing',
    recommended: true
  },
  { 
    id: 'svg', 
    name: 'SVG', 
    description: 'Vector format, infinite scaling', 
    icon: FileCode,
    quality: 'Best for editing'
  },
  { 
    id: 'jpg', 
    name: 'JPG', 
    description: 'Compressed, smaller file size', 
    icon: FileType,
    quality: 'Best for web'
  },
  { 
    id: 'webp', 
    name: 'WebP', 
    description: 'Modern format, best compression', 
    icon: ImageIcon,
    quality: 'Smallest size'
  },
];

const exportSizes: ExportSizeOption[] = [
  { 
    id: 'instagram', 
    name: 'Instagram Post', 
    dimensions: '1080 × 1080', 
    width: 1080, 
    height: 1080,
    icon: Instagram 
  },
  { 
    id: 'twitter', 
    name: 'Twitter/X Post', 
    dimensions: '1200 × 675', 
    width: 1200, 
    height: 675,
    icon: Twitter 
  },
  { 
    id: 'presentation', 
    name: 'Presentation (16:9)', 
    dimensions: '1920 × 1080', 
    width: 1920, 
    height: 1080,
    icon: Monitor 
  },
  { 
    id: 'custom', 
    name: 'Original Size', 
    dimensions: 'As displayed', 
    width: 0, 
    height: 0,
    icon: RectangleHorizontal 
  },
];

interface MobileExportFlowProps {
  isOpen: boolean;
  onClose: () => void;
  chartRef: React.RefObject<ChartRendererRef>;
  onExportPNG?: () => void;
  onExportSVG?: () => void;
  chartTitle?: string;
  hasData: boolean;
}

type ExportStep = 1 | 2 | 3;

const MobileExportFlow = memo(({
  isOpen,
  onClose,
  chartRef,
  onExportPNG,
  onExportSVG,
  chartTitle = 'My Chart',
  hasData,
}: MobileExportFlowProps) => {
  const [step, setStep] = useState<ExportStep>(1);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [selectedSize, setSelectedSize] = useState<ExportSize>('custom');
  const [isExporting, setIsExporting] = useState(false);

  const handleFormatSelect = useCallback((format: ExportFormat) => {
    triggerHaptic('selection');
    setSelectedFormat(format);
  }, []);

  const handleSizeSelect = useCallback((size: ExportSize) => {
    triggerHaptic('selection');
    setSelectedSize(size);
  }, []);

  const handleNext = useCallback(() => {
    triggerHaptic('light');
    if (step < 3) {
      setStep((s) => (s + 1) as ExportStep);
    }
  }, [step]);

  const handleBack = useCallback(() => {
    triggerHaptic('light');
    if (step > 1) {
      setStep((s) => (s - 1) as ExportStep);
    }
  }, [step]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    triggerHaptic('medium');
    
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (selectedFormat === 'svg') {
        onExportSVG?.();
      } else {
        onExportPNG?.();
      }
      
      triggerHaptic('success');
      
      // Close after brief delay to show success
      setTimeout(() => {
        onClose();
        setStep(1);
        setIsExporting(false);
      }, 300);
    } catch (error) {
      triggerHaptic('error');
      setIsExporting(false);
    }
  }, [selectedFormat, onExportPNG, onExportSVG, onClose]);

  const handleShare = useCallback(async () => {
    triggerHaptic('medium');
    
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: chartTitle,
          text: `Check out this chart: ${chartTitle}`,
        });
        triggerHaptic('success');
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to regular export
      handleExport();
    }
  }, [chartTitle, handleExport]);

  const handleClose = useCallback(() => {
    triggerHaptic('light');
    onClose();
    // Reset after animation
    setTimeout(() => {
      setStep(1);
      setSelectedFormat('png');
      setSelectedSize('custom');
    }, ANIMATION_TIMING.drawer);
  }, [onClose]);

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const selectedFormatInfo = exportFormats.find(f => f.id === selectedFormat);
  const selectedSizeInfo = exportSizes.find(s => s.id === selectedSize);

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-[20px] max-h-[85vh] flex flex-col">
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1.5 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9" 
                  onClick={handleBack}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h3 className="text-lg font-semibold">Export Chart</h3>
                <p className="text-xs text-muted-foreground">
                  Step {step} of 3: {step === 1 ? 'Format' : step === 2 ? 'Size' : 'Preview'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="px-4 py-3">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    s <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden px-4">
            <AnimatePresence mode="wait" custom={step}>
              {/* Step 1: Format Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={1}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={mobileSpring}
                  className="space-y-3"
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose your export format
                  </p>
                  {exportFormats.map((format) => (
                    <Card
                      key={format.id}
                      className={`p-4 cursor-pointer transition-all active:scale-[0.98] ${
                        selectedFormat === format.id
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleFormatSelect(format.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${
                          selectedFormat === format.id ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                          <format.icon className={`h-5 w-5 ${
                            selectedFormat === format.id ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{format.name}</span>
                            {format.recommended && (
                              <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{format.description}</p>
                        </div>
                        {selectedFormat === format.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={bouncySpring}
                          >
                            <Check className="h-5 w-5 text-primary" />
                          </motion.div>
                        )}
                      </div>
                    </Card>
                  ))}
                </motion.div>
              )}

              {/* Step 2: Size Selection */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={2}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={mobileSpring}
                  className="space-y-3"
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose export size
                  </p>
                  {exportSizes.map((size) => (
                    <Card
                      key={size.id}
                      className={`p-4 cursor-pointer transition-all active:scale-[0.98] ${
                        selectedSize === size.id
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleSizeSelect(size.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${
                          selectedSize === size.id ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                          <size.icon className={`h-5 w-5 ${
                            selectedSize === size.id ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold">{size.name}</span>
                          <p className="text-xs text-muted-foreground">{size.dimensions}</p>
                        </div>
                        {selectedSize === size.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={bouncySpring}
                          >
                            <Check className="h-5 w-5 text-primary" />
                          </motion.div>
                        )}
                      </div>
                    </Card>
                  ))}
                </motion.div>
              )}

              {/* Step 3: Preview & Export */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={3}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={mobileSpring}
                  className="space-y-4"
                >
                  {/* Preview Card */}
                  <Card className="p-4 bg-muted/30">
                    <div className="aspect-video bg-card rounded-lg border flex items-center justify-center mb-4 overflow-hidden">
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{chartTitle}</p>
                      </div>
                    </div>
                    
                    {/* Export Summary */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Format</span>
                        <span className="font-medium">{selectedFormatInfo?.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-medium">{selectedSizeInfo?.dimensions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quality</span>
                        <span className="font-medium">{selectedFormatInfo?.quality}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t bg-card/50 safe-area-bottom">
            {step < 3 ? (
              <Button 
                className="w-full h-12 text-base font-semibold" 
                onClick={handleNext}
                disabled={!hasData}
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 h-12 text-base font-semibold"
                  onClick={handleShare}
                  disabled={isExporting || !hasData}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button 
                  className="flex-1 h-12 text-base font-semibold"
                  onClick={handleExport}
                  disabled={isExporting || !hasData}
                >
                  {isExporting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
});

MobileExportFlow.displayName = 'MobileExportFlow';

export default MobileExportFlow;

// Compact export button for action dock
export const ExportQuickAction = memo(({ 
  onPress,
  disabled 
}: { 
  onPress: () => void;
  disabled?: boolean;
}) => (
  <Button
    variant="outline"
    className="h-11 px-4 gap-2 rounded-xl border-primary/30 hover:bg-primary/10"
    onClick={() => {
      triggerHaptic('light');
      onPress();
    }}
    disabled={disabled}
  >
    <Share2 className="h-4 w-4" />
    <span className="text-sm font-medium">Export</span>
  </Button>
));

ExportQuickAction.displayName = 'ExportQuickAction';
