/**
 * MobileActionDock - Primary navigation for mobile devices
 * 
 * Replaces the 5-tab bottom navigation with a 3-button action dock
 * featuring Data, Style, and Config buttons that trigger drawer opens.
 * 
 * Features:
 * - Large touch targets (56px height)
 * - Gradient backgrounds per category
 * - Swipe-up gesture to expand drawer
 * - Visual feedback with scale animations
 * - Safe area inset handling
 */

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Palette, Settings, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/animations';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export type DrawerType = 'data' | 'style' | 'config' | null;

interface MobileActionDockProps {
  activeDrawer: DrawerType;
  onDrawerChange: (drawer: DrawerType) => void;
  className?: string;
  hapticEnabled?: boolean;
}

const dockButtons = [
  {
    id: 'data' as const,
    label: 'Data',
    icon: Database,
    colorClass: 'data',
    description: 'Upload, datasets & filters',
  },
  {
    id: 'style' as const,
    label: 'Style',
    icon: Palette,
    colorClass: 'style',
    description: 'Colors & appearance',
  },
  {
    id: 'config' as const,
    label: 'Config',
    icon: Settings,
    colorClass: 'config',
    description: 'Chart configuration',
  },
];

export function MobileActionDock({
  activeDrawer,
  onDrawerChange,
  className,
  hapticEnabled = true,
}: MobileActionDockProps) {
  const { config } = useResponsiveLayout();

  const handleButtonPress = useCallback(
    (drawerId: DrawerType) => {
      if (hapticEnabled) {
        triggerHaptic('light');
      }

      // Toggle drawer - if same drawer is active, close it
      if (activeDrawer === drawerId) {
        onDrawerChange(null);
      } else {
        onDrawerChange(drawerId);
      }
    },
    [activeDrawer, onDrawerChange, hapticEnabled]
  );

  return (
    <motion.div
      className={cn('mobile-action-dock', className)}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {dockButtons.map((button) => {
        const Icon = button.icon;
        const isActive = activeDrawer === button.id;

        return (
          <motion.button
            key={button.id}
            className={cn(
              'mobile-action-dock-button',
              button.colorClass,
              isActive && 'active'
            )}
            onClick={() => handleButtonPress(button.id)}
            whileTap={{ scale: 0.95 }}
            aria-label={`Open ${button.label} panel`}
            aria-expanded={isActive}
            aria-describedby={`dock-${button.id}-desc`}
          >
            {/* Swipe-up indicator */}
            <AnimatePresence>
              {!isActive && (
                <motion.div
                  className="absolute -top-1 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 0.4, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                >
                  <ChevronUp className="w-3 h-3 text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>

            <Icon
              className={cn(
                'mobile-action-dock-icon transition-colors duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'mobile-action-dock-label transition-colors duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {button.label}
            </span>

            {/* Hidden description for screen readers */}
            <span id={`dock-${button.id}-desc`} className="sr-only">
              {button.description}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

// Compact version for landscape mode
export function MobileActionDockCompact({
  activeDrawer,
  onDrawerChange,
  className,
  hapticEnabled = true,
}: MobileActionDockProps) {
  const handleButtonPress = useCallback(
    (drawerId: DrawerType) => {
      if (hapticEnabled) {
        triggerHaptic('light');
      }
      onDrawerChange(activeDrawer === drawerId ? null : drawerId);
    },
    [activeDrawer, onDrawerChange, hapticEnabled]
  );

  return (
    <div className={cn('flex gap-1 p-2 border-b border-border/40', className)}>
      {dockButtons.map((button) => {
        const Icon = button.icon;
        const isActive = activeDrawer === button.id;

        return (
          <motion.button
            key={button.id}
            className={cn(
              'phone-landscape-tab',
              isActive ? 'active' : 'inactive'
            )}
            onClick={() => handleButtonPress(button.id)}
            whileTap={{ scale: 0.95 }}
            aria-label={button.label}
            aria-pressed={isActive}
          >
            <Icon className="w-[18px] h-[18px]" />
          </motion.button>
        );
      })}
    </div>
  );
}

export default MobileActionDock;
