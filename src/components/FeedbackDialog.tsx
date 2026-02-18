import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Bug, Lightbulb, Sparkles, HelpCircle, Send, Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';

const feedbackTypeIcons: Record<FeedbackType, React.ReactNode> = {
  bug: <Bug className="h-4 w-4" />,
  feature: <Lightbulb className="h-4 w-4" />,
  improvement: <Sparkles className="h-4 w-4" />,
  other: <HelpCircle className="h-4 w-4" />,
};

const feedbackTypeColors: Record<FeedbackType, string> = {
  bug: 'bg-red-500/10 text-red-500 border-red-500/20',
  feature: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  improvement: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  other: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const { t } = useTranslation();
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('improvement');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleCapture = async () => {
    try {
      // Create a simple screenshot indicator
      toast.info('Screenshot capture is not available in this demo');
    } catch (error) {
      toast.error('Failed to capture screenshot');
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual API call to backend
      // Feedback data: type, description, email, screenshot, timestamp, userAgent, url

      toast.success(t('feedback.submitted'));
      
      // Reset form
      setDescription('');
      setEmail('');
      setScreenshot(null);
      onOpenChange(false);
    } catch (error) {
      toast.error(t('feedback.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 font-bold tracking-tight">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            {t('feedback.title')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            {t('feedback.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Feedback Type Selection */}
          <div className="space-y-2">
            <Label>{t('feedback.type')}</Label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(feedbackTypeIcons) as FeedbackType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFeedbackType(type)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200",
                    feedbackType === type
                      ? feedbackTypeColors[type] + ' border-current shadow-sm'
                      : 'border-transparent bg-muted/40 hover:bg-muted/60'
                  )}
                >
                  {feedbackTypeIcons[type]}
                  <span className="text-[10px] font-medium">
                    {t(`feedback.types.${type}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('feedback.description')}</Label>
            <Textarea
              id="description"
              placeholder={t('feedback.descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Email (optional) */}
          <div className="space-y-2">
            <Label htmlFor="email">{t('feedback.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('feedback.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Screenshot */}
          <div className="space-y-2">
            <Label>{t('feedback.attachScreenshot')}</Label>
            {screenshot ? (
              <div className="relative">
                <img 
                  src={screenshot} 
                  alt="Screenshot" 
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => setScreenshot(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleCapture}
              >
                <Camera className="h-4 w-4" />
                {t('feedback.attachScreenshot')}
              </Button>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !description.trim()}
            className="w-full gap-2 rounded-xl h-11 font-semibold shadow-sm shadow-primary/10 hover:shadow-md hover:shadow-primary/15 transition-all"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t('feedback.submit')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Floating feedback button
export function FeedbackButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="fixed bottom-4 right-4 gap-2 shadow-lg shadow-black/5 z-40 rounded-xl border-border/40 backdrop-blur-sm hover:border-primary/30 hover:shadow-xl transition-all duration-300"
    >
      <MessageSquare className="h-4 w-4" />
      {t('feedback.title')}
    </Button>
  );
}

export default FeedbackDialog;
