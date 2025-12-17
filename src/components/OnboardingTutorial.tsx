import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, ArrowRight, ChevronLeft, ChevronRight, 
  FileUp, BarChart, Settings, Download, CheckCircle2 
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string; // CSS selector for highlighting
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ChartForge! 🎉',
    description: 'Create stunning data visualizations in minutes. Let\'s take a quick tour to get you started.',
    icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
  },
  {
    id: 'upload',
    title: 'Upload Your Data',
    description: 'Start by uploading a CSV, JSON, or Excel file. You can also paste data directly or use our sample dataset.',
    icon: <FileUp className="w-8 h-8 text-primary" />,
    target: '[data-tour="file-dropzone"]',
    position: 'bottom',
  },
  {
    id: 'chart-type',
    title: 'Choose Chart Type',
    description: 'Select from 15+ chart types including bar, line, pie, scatter, and more. Each chart updates in real-time.',
    icon: <BarChart className="w-8 h-8 text-primary" />,
    target: '[data-tour="chart-selector"]',
    position: 'right',
  },
  {
    id: 'customize',
    title: 'Customize Your Chart',
    description: 'Adjust colors, labels, titles, and styling. All changes are applied instantly with live preview.',
    icon: <Settings className="w-8 h-8 text-primary" />,
    target: '[data-tour="config-panel"]',
    position: 'left',
  },
  {
    id: 'export',
    title: 'Export & Share',
    description: 'Export your chart as PNG, SVG, PDF, or get a shareable link. Ready to use in presentations and reports!',
    icon: <Download className="w-8 h-8 text-primary" />,
    target: '[data-tour="export-button"]',
    position: 'bottom',
  },
];

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export default function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [show, setShow] = useState(true);

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        let top = 0;
        let left = 0;

        switch (step.position) {
          case 'bottom':
            top = rect.bottom + 20;
            left = rect.left + rect.width / 2;
            break;
          case 'top':
            top = rect.top - 20;
            left = rect.left + rect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - 20;
            break;
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + 20;
            break;
        }

        setPosition({ top, left });

        // Highlight the element
        element.classList.add('onboarding-highlight');
        return () => {
          element.classList.remove('onboarding-highlight');
        };
      }
    } else {
      // Center on screen for welcome step
      setPosition({ 
        top: window.innerHeight / 2, 
        left: window.innerWidth / 2 
      });
    }
  }, [currentStep, step.target, step.position]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setShow(false);
    localStorage.setItem('chartforge-onboarding-completed', 'true');
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-in fade-in duration-300" />

      {/* Tutorial Card */}
      <Card 
        className="fixed z-[9999] w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{
          top: isFirstStep ? '50%' : `${position.top}px`,
          left: isFirstStep ? '50%' : `${position.left}px`,
          transform: isFirstStep ? 'translate(-50%, -50%)' : step.position === 'left' ? 'translate(-100%, -50%)' : step.position === 'right' ? 'translate(0, -50%)' : step.position === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
        }}
      >
        <CardContent className="p-6">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleSkip}
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Icon */}
          <div className="mb-4 flex justify-center">
            {step.icon}
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-primary w-8' 
                    : index < currentStep 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={isFirstStep}
            >
              <ChevronLeft className="mr-2 w-4 h-4" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </span>

            <Button onClick={handleNext}>
              {isLastStep ? 'Get Started' : 'Next'}
              {isLastStep ? <CheckCircle2 className="ml-2 w-4 h-4" /> : <ChevronRight className="ml-2 w-4 h-4" />}
            </Button>
          </div>

          {/* Skip Button */}
          {!isLastStep && (
            <Button
              variant="link"
              className="w-full mt-4 text-xs"
              onClick={handleSkip}
            >
              Skip Tutorial
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Highlight Style */}
      <style>{`
        .onboarding-highlight {
          position: relative;
          z-index: 9997;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          animation: pulse-highlight 2s infinite;
        }

        @keyframes pulse-highlight {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.5);
          }
        }
      `}</style>
    </>
  );
}
