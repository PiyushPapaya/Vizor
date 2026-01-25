/**
 * MobileDrawerSystem - Enhanced drawer system for mobile
 * 
 * Features:
 * - Snap points (collapsed, half, expanded, full)
 * - Smooth spring animations
 * - Gesture-based interaction (swipe to expand/collapse)
 * - Content sections for Data, Style, and Config
 * - Handle for drag interaction
 */

import React, { useCallback, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { X, Database, Palette, Settings, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic, mobileSpring, GESTURE_THRESHOLDS } from '@/lib/animations';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { ScrollArea } from '@/components/ui/scroll-area';

export type DrawerType = 'data' | 'style' | 'config' | 'export' | null;
export type SnapPoint = 'collapsed' | 'half' | 'expanded' | 'full';

interface MobileDrawerProps {
  type: DrawerType;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  initialSnapPoint?: SnapPoint;
  hapticEnabled?: boolean;
}

const drawerConfig = {
  data: {
    icon: Database,
    title: 'Data & Upload',
    color: 'text-blue-500',
    defaultHeight: '70vh',
  },
  style: {
    icon: Palette,
    title: 'Style',
    color: 'text-purple-500',
    defaultHeight: '65vh',
  },
  config: {
    icon: Settings,
    title: 'Configure',
    color: 'text-orange-500',
    defaultHeight: '75vh',
  },
  export: {
    icon: Share2,
    title: 'Export',
    color: 'text-green-500',
    defaultHeight: '85vh',
  },
};

const snapPointHeights: Record<SnapPoint, string> = {
  collapsed: '64px',
  half: '50vh',
  expanded: '85vh',
  full: '100vh',
};

export function MobileDrawer({
  type,
  isOpen,
  onClose,
  children,
  title,
  className,
  initialSnapPoint = 'expanded',
  hapticEnabled = true,
}: MobileDrawerProps) {
  const { config: layoutConfig } = useResponsiveLayout();
  const [currentSnap, setCurrentSnap] = useState<SnapPoint>(initialSnapPoint);
  const constraintsRef = useRef(null);
  const y = useMotionValue(0);

  if (!type) return null;

  const drawerInfo = drawerConfig[type];
  const Icon = drawerInfo.icon;
  const displayTitle = title || drawerInfo.title;

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const velocity = info.velocity.y;
      const offset = info.offset.y;

      // Determine snap point based on velocity and offset
      if (velocity > GESTURE_THRESHOLDS.velocityThreshold || offset > 100) {
        // Swipe down - collapse or close
        if (currentSnap === 'expanded' || currentSnap === 'full') {
          setCurrentSnap('half');
          if (hapticEnabled) triggerHaptic('threshold');
        } else {
          onClose();
          if (hapticEnabled) triggerHaptic('light');
        }
      } else if (velocity < -GESTURE_THRESHOLDS.velocityThreshold || offset < -100) {
        // Swipe up - expand
        if (currentSnap === 'half') {
          setCurrentSnap('expanded');
          if (hapticEnabled) triggerHaptic('threshold');
        } else if (currentSnap === 'expanded') {
          setCurrentSnap('full');
          if (hapticEnabled) triggerHaptic('threshold');
        }
      }
    },
    [currentSnap, onClose, hapticEnabled]
  );

  const getDrawerHeight = () => {
    if (!isOpen) return '0px';
    return snapPointHeights[currentSnap];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            ref={constraintsRef}
            className={cn('mobile-drawer-enhanced', className)}
            initial={{ y: '100%' }}
            animate={{
              y: 0,
              height: getDrawerHeight(),
            }}
            exit={{ y: '100%' }}
            transition={mobileSpring}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ y }}
          >
            {/* Handle */}
            <div className="mobile-drawer-handle-container">
              <motion.div
                className="mobile-drawer-handle-enhanced"
                whileTap={{ scaleX: 1.2 }}
              />
            </div>

            {/* Header */}
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-title">
                <Icon className={cn('w-5 h-5', drawerInfo.color)} />
                <span>{displayTitle}</span>
              </div>
              <button
                className="mobile-drawer-close"
                onClick={onClose}
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <ScrollArea
              className="mobile-drawer-content"
              style={{
                '--drawer-height': getDrawerHeight(),
              } as React.CSSProperties}
            >
              <div className="space-y-4 py-2">{children}</div>
            </ScrollArea>

            {/* Snap indicator dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {(['half', 'expanded', 'full'] as SnapPoint[]).map((snap) => (
                <button
                  key={snap}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-200',
                    currentSnap === snap
                      ? 'bg-primary w-4'
                      : 'bg-muted-foreground/30'
                  )}
                  onClick={() => {
                    setCurrentSnap(snap);
                    if (hapticEnabled) triggerHaptic('light');
                  }}
                  aria-label={`Snap to ${snap}`}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * MobileDrawerSection - Collapsible section within a drawer
 */
interface MobileDrawerSectionProps {
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function MobileDrawerSection({
  title,
  icon,
  badge,
  defaultExpanded = false,
  children,
  className,
}: MobileDrawerSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn('space-y-2', className)}>
      <button
        className={cn(
          'mobile-section-header w-full',
          isExpanded && 'expanded'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileDrawer;
