import { useState, useEffect, useCallback } from 'react';
import Joyride, { 
  Step, 
  CallBackProps, 
  STATUS, 
  ACTIONS, 
  EVENTS,
  TooltipRenderProps,
  Placement
} from 'react-joyride';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, ChevronLeft, ChevronRight, 
  FileUp, BarChart, Settings, Download, CheckCircle2,
  Palette, Filter, Table, Wand2, Keyboard, Sparkles,
  RotateCcw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

// Storage keys
const STORAGE_KEY = 'Vizor-onboarding-completed';
const PROGRESS_KEY = 'Vizor-onboarding-progress';

// Tutorial step interface - use 'auto' as a workaround for centered steps
interface TutorialStep {
  id: string;
  target: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  placement?: Placement | 'center';
  spotlightPadding?: number;
  disableBeacon?: boolean;
  disableOverlayClose?: boolean;
  hideFooter?: boolean;
  category?: 'basics' | 'data' | 'customization' | 'export';
}

// Define all tutorial steps with i18n keys
const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    target: 'body',
    titleKey: 'onboarding.steps.welcome.title',
    descriptionKey: 'onboarding.steps.welcome.description',
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    placement: 'center',
    disableBeacon: true,
    category: 'basics',
  },
  {
    id: 'upload',
    target: '[data-tour="file-dropzone"]',
    titleKey: 'onboarding.steps.upload.title',
    descriptionKey: 'onboarding.steps.upload.description',
    icon: <FileUp className="w-8 h-8 text-primary" />,
    placement: 'right',
    spotlightPadding: 8,
    category: 'data',
  },
  {
    id: 'templates',
    target: '[data-tour="templates"]',
    titleKey: 'onboarding.steps.templates.title',
    descriptionKey: 'onboarding.steps.templates.description',
    icon: <Table className="w-8 h-8 text-primary" />,
    placement: 'right',
    spotlightPadding: 4,
    category: 'data',
  },
  {
    id: 'chart-type',
    target: '[data-tour="chart-selector"]',
    titleKey: 'onboarding.steps.chartType.title',
    descriptionKey: 'onboarding.steps.chartType.description',
    icon: <BarChart className="w-8 h-8 text-primary" />,
    placement: 'left',
    spotlightPadding: 8,
    category: 'basics',
  },
  {
    id: 'data-cleaning',
    target: '[data-tour="data-cleaning"]',
    titleKey: 'onboarding.steps.dataCleaning.title',
    descriptionKey: 'onboarding.steps.dataCleaning.description',
    icon: <Wand2 className="w-8 h-8 text-primary" />,
    placement: 'left',
    spotlightPadding: 4,
    category: 'data',
  },
  {
    id: 'quick-stats',
    target: '[data-tour="quick-stats"]',
    titleKey: 'onboarding.steps.quickStats.title',
    descriptionKey: 'onboarding.steps.quickStats.description',
    icon: <Filter className="w-8 h-8 text-primary" />,
    placement: 'left',
    spotlightPadding: 4,
    category: 'data',
  },
  {
    id: 'customize',
    target: '[data-tour="config-panel"]',
    titleKey: 'onboarding.steps.customize.title',
    descriptionKey: 'onboarding.steps.customize.description',
    icon: <Palette className="w-8 h-8 text-primary" />,
    placement: 'left',
    spotlightPadding: 8,
    category: 'customization',
  },
  {
    id: 'style-options',
    target: '[data-tour="style-options"]',
    titleKey: 'onboarding.steps.styleOptions.title',
    descriptionKey: 'onboarding.steps.styleOptions.description',
    icon: <Settings className="w-8 h-8 text-primary" />,
    placement: 'left',
    spotlightPadding: 4,
    category: 'customization',
  },
  {
    id: 'chart-preview',
    target: '[data-tour="chart-preview"]',
    titleKey: 'onboarding.steps.chartPreview.title',
    descriptionKey: 'onboarding.steps.chartPreview.description',
    icon: <BarChart className="w-8 h-8 text-primary" />,
    placement: 'left',
    spotlightPadding: 12,
    category: 'basics',
  },
  {
    id: 'export',
    target: '[data-tour="export-button"]',
    titleKey: 'onboarding.steps.export.title',
    descriptionKey: 'onboarding.steps.export.description',
    icon: <Download className="w-8 h-8 text-primary" />,
    placement: 'bottom',
    spotlightPadding: 4,
    category: 'export',
  },
  {
    id: 'keyboard-shortcuts',
    target: '[data-tour="help-button"]',
    titleKey: 'onboarding.steps.shortcuts.title',
    descriptionKey: 'onboarding.steps.shortcuts.description',
    icon: <Keyboard className="w-8 h-8 text-primary" />,
    placement: 'bottom',
    spotlightPadding: 4,
    category: 'basics',
  },
  {
    id: 'complete',
    target: 'body',
    titleKey: 'onboarding.steps.complete.title',
    descriptionKey: 'onboarding.steps.complete.description',
    icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
    placement: 'center',
    category: 'basics',
  },
];

// Custom tooltip component
function CustomTooltip({
  index,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  isLastStep,
  size,
}: TooltipRenderProps) {
  const { t } = useTranslation();
  const currentStep = tutorialSteps[index];
  const progress = ((index + 1) / size) * 100;
  
  // Get category color
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'data': return 'bg-blue-500/10 text-blue-500';
      case 'customization': return 'bg-purple-500/10 text-purple-500';
      case 'export': return 'bg-green-500/10 text-green-500';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'data': return t('onboarding.categories.data');
      case 'customization': return t('onboarding.categories.customization');
      case 'export': return t('onboarding.categories.export');
      default: return t('onboarding.categories.basics');
    }
  };

  return (
    <Card className={cn(
      "w-[380px] max-w-[calc(100vw-32px)] shadow-2xl border-2",
      "animate-in fade-in-0 zoom-in-95 duration-300",
      currentStep?.id === 'welcome' || currentStep?.id === 'complete' 
        ? "border-primary/30" 
        : "border-border"
    )}>
      <CardContent className="p-0">
        {/* Progress bar */}
        <div className="h-1 w-full bg-muted overflow-hidden rounded-t-lg">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-5 pb-0 relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 opacity-70 hover:opacity-100"
            {...closeProps}
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Category badge and step counter */}
          <div className="flex items-center justify-between mb-3">
            <Badge 
              variant="secondary" 
              className={cn("text-[10px] font-medium", getCategoryColor(currentStep?.category))}
            >
              {getCategoryLabel(currentStep?.category)}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {index + 1} / {size}
            </span>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={cn(
              "p-4 rounded-2xl",
              currentStep?.id === 'complete' 
                ? "bg-green-500/10" 
                : "bg-primary/10"
            )}>
              {currentStep?.icon}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold mb-2">
              {t(currentStep?.titleKey || '')}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t(currentStep?.descriptionKey || '')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mb-4">
            {tutorialSteps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index 
                    ? 'w-6 bg-primary' 
                    : i < index 
                      ? 'w-1.5 bg-primary/50' 
                      : 'w-1.5 bg-muted-foreground/30'
                )}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-2">
            {index > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                {...backProps}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                {t('common.previous')}
              </Button>
            ) : (
              <Button
                variant="link"
                size="sm"
                {...skipProps}
                className="text-muted-foreground hover:text-foreground"
              >
                {t('onboarding.skip')}
              </Button>
            )}

            <Button
              size="sm"
              {...primaryProps}
              className="gap-1 min-w-[100px]"
            >
              {isLastStep ? (
                <>
                  {t('onboarding.getStarted')}
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : (
                <>
                  {t('common.next')}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OnboardingTutorialProps {
  onComplete: () => void;
  forceStart?: boolean;
}

export default function OnboardingTutorial({ onComplete, forceStart = false }: OnboardingTutorialProps) {
  const { t } = useTranslation();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  
  // Detect mobile for responsive placement
  const isMobile = window.innerWidth < 768;

  // Convert tutorial steps to Joyride steps with mobile-responsive placement
  const joyrideSteps: Step[] = tutorialSteps.map((step) => {
    // Determine placement based on mobile and step configuration
    let placement: Placement;
    
    if (step.placement === 'center') {
      // For center placement, use 'center' (will be cast in the step object)
      placement = 'center' as Placement;
    } else if (isMobile) {
      // On mobile, prefer bottom placement to avoid covering content
      placement = 'bottom';
    } else {
      // Use specified placement or auto
      placement = (step.placement || 'auto') as Placement;
    }
    
    return {
      target: step.target,
      content: '', // Content is rendered by custom tooltip
      placement,
      spotlightPadding: step.spotlightPadding ?? 8,
      disableBeacon: step.disableBeacon ?? true,
      disableOverlayClose: step.disableOverlayClose ?? false,
      hideFooter: true,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
    };
  });

  // Check if we should auto-start
  useEffect(() => {
    if (forceStart) {
      setStepIndex(0);
      setRun(true);
      return;
    }

    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Check for saved progress
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        const progress = parseInt(savedProgress, 10);
        if (progress > 0 && progress < tutorialSteps.length) {
          setStepIndex(progress);
        }
      }
      // Increased delay from 500ms to 1500ms to ensure all UI elements are rendered
      // This prevents glitches when tutorial starts before DOM is fully ready
      const timer = setTimeout(() => {
        // Additional check: verify that key elements exist before starting
        const hasRequiredElements = document.querySelector('[data-tour="file-dropzone"]') && 
                                    document.querySelector('[data-tour="chart-selector"]');
        if (hasRequiredElements || stepIndex === 0) {
          setRun(true);
        } else {
          // Retry after another second if elements aren't ready
          setTimeout(() => setRun(true), 1000);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [forceStart, stepIndex]);

  // Handle Joyride callback
  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { action, index, status, type } = data;

    // Handle target not found - skip to next step instead of breaking
    if (type === EVENTS.TARGET_NOT_FOUND) {
      console.warn(`Tutorial step ${index} target not found, skipping to next step`);
      if (action === ACTIONS.NEXT && index < tutorialSteps.length - 1) {
        setStepIndex(index + 1);
        return;
      } else if (action === ACTIONS.PREV && index > 0) {
        setStepIndex(index - 1);
        return;
      }
    }

    // Handle step changes
    if (type === EVENTS.STEP_AFTER) {
      // Save progress
      localStorage.setItem(PROGRESS_KEY, String(index + 1));
      
      if (action === ACTIONS.NEXT) {
        // Check if next step's target exists before advancing
        if (index + 1 < tutorialSteps.length) {
          const nextStep = tutorialSteps[index + 1];
          const targetExists = nextStep.target === 'body' || document.querySelector(nextStep.target);
          
          if (!targetExists) {
            // Target doesn't exist, skip this step
            console.warn(`Next step target ${nextStep.target} not found, skipping`);
            setStepIndex(index + 2);
          } else {
            setStepIndex(index + 1);
          }
        }
      } else if (action === ACTIONS.PREV) {
        setStepIndex(index - 1);
      }
    }

    // Handle tour end
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.removeItem(PROGRESS_KEY);
      onComplete();
    }

    // Handle close button
    if (action === ACTIONS.CLOSE) {
      setRun(false);
      // Don't mark as complete if closed early - save progress
    }
  }, [onComplete]);

  if (!run) return null;

  return (
    <Joyride
      steps={joyrideSteps}
      stepIndex={stepIndex}
      run={run}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      spotlightClicks={false}
      disableCloseOnEsc={false}
      disableOverlayClose={false}
      hideCloseButton
      tooltipComponent={CustomTooltip}
      callback={handleJoyrideCallback}
      floaterProps={{
        hideArrow: false,
        styles: {
          arrow: {
            length: 8,
            spread: 16,
          },
        },
      }}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: 'hsl(var(--primary))',
          backgroundColor: 'hsl(var(--background))',
          textColor: 'hsl(var(--foreground))',
          arrowColor: 'hsl(var(--background))',
          overlayColor: 'rgba(0, 0, 0, 0.75)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
        spotlight: {
          borderRadius: 8,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 30px rgba(59, 130, 246, 0.5)',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          display: 'none',
        },
        buttonBack: {
          display: 'none',
        },
        buttonClose: {
          display: 'none',
        },
        buttonSkip: {
          display: 'none',
        },
      }}
      locale={{
        back: t('common.previous'),
        close: t('common.close'),
        last: t('onboarding.getStarted'),
        next: t('common.next'),
        skip: t('onboarding.skip'),
      }}
    />
  );
}

// Helper component to restart tutorial from help menu
export function RestartTutorialButton({ onClick }: { onClick?: () => void }) {
  const { t } = useTranslation();
  
  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    onClick?.();
    window.location.reload();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRestart}
      className="gap-2"
    >
      <RotateCcw className="w-4 h-4" />
      {t('onboarding.restartTutorial')}
    </Button>
  );
}

// Check if tutorial is completed
export function isTutorialCompleted(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

// Reset tutorial progress
export function resetTutorial(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}
