import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Contrast, Type, MousePointer, Zap } from 'lucide-react';

interface AccessibilitySettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface AccessibilityPreferences {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number; // 1.0 = 100%, 1.5 = 150%
  focusIndicatorStyle: 'default' | 'bold' | 'glow';
  keyboardNavigation: boolean;
}

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  highContrast: false,
  reducedMotion: false,
  fontSize: 1.0,
  focusIndicatorStyle: 'default',
  keyboardNavigation: true,
};

/**
 * Accessibility Settings Dialog
 * Allows users to customize accessibility preferences
 */
export default function AccessibilitySettings({ open, onOpenChange }: AccessibilitySettingsProps) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    const saved = localStorage.getItem('Vizor-accessibility');
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  // Apply preferences to document
  useEffect(() => {
    applyAccessibilityPreferences(preferences);
    localStorage.setItem('Vizor-accessibility', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Accessibility Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* High Contrast Mode */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="high-contrast" className="text-sm font-medium">
                  High Contrast Mode
                </Label>
              </div>
              <Switch
                id="high-contrast"
                checked={preferences.highContrast}
                onCheckedChange={(checked) => updatePreference('highContrast', checked)}
              />
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Increase contrast for better visibility
            </p>
          </div>

          {/* Reduced Motion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="reduced-motion" className="text-sm font-medium">
                  Reduced Motion
                </Label>
              </div>
              <Switch
                id="reduced-motion"
                checked={preferences.reducedMotion}
                onCheckedChange={(checked) => updatePreference('reducedMotion', checked)}
              />
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Minimize animations and transitions
            </p>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Font Size</Label>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[preferences.fontSize * 100]}
                onValueChange={([value]) => updatePreference('fontSize', value / 100)}
                min={80}
                max={150}
                step={10}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12 text-right">
                {Math.round(preferences.fontSize * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Adjust text size throughout the app
            </p>
          </div>

          {/* Focus Indicator Style */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Focus Indicator Style</Label>
            <Select
              value={preferences.focusIndicatorStyle}
              onValueChange={(value: any) => updatePreference('focusIndicatorStyle', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bold">Bold Outline</SelectItem>
                <SelectItem value="glow">Glowing Outline</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Customize keyboard focus visibility
            </p>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setPreferences(DEFAULT_PREFERENCES)}
          >
            Reset to Defaults
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Apply accessibility preferences to the document
 */
export function applyAccessibilityPreferences(preferences: AccessibilityPreferences) {
  const root = document.documentElement;

  // High Contrast Mode
  if (preferences.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  // Reduced Motion
  if (preferences.reducedMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }

  // Font Size
  root.style.fontSize = `${preferences.fontSize * 16}px`;

  // Focus Indicator Style
  root.setAttribute('data-focus-style', preferences.focusIndicatorStyle);
}

/**
 * Load and apply saved accessibility preferences on app start
 */
export function initializeAccessibility() {
  const saved = localStorage.getItem('Vizor-accessibility');
  const preferences: AccessibilityPreferences = saved
    ? JSON.parse(saved)
    : DEFAULT_PREFERENCES;

  applyAccessibilityPreferences(preferences);

  // Also check system preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;

  if (prefersReducedMotion && !preferences.reducedMotion) {
    preferences.reducedMotion = true;
    applyAccessibilityPreferences(preferences);
  }

  if (prefersHighContrast && !preferences.highContrast) {
    preferences.highContrast = true;
    applyAccessibilityPreferences(preferences);
  }
}
