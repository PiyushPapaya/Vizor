import { useEffect, useRef, useCallback } from 'react';

interface UseMobileGesturesOptions {
  onPullToRefresh?: () => void;
  onPinchZoom?: (scale: number) => void;
  enableHaptic?: boolean;
}

export function useMobileGestures({
  onPullToRefresh,
  onPinchZoom,
  enableHaptic = true,
}: UseMobileGesturesOptions = {}) {
  const startY = useRef(0);
  const startDistance = useRef(0);
  const isPulling = useRef(false);
  const isPinching = useRef(false);

  // Haptic feedback helper
  const vibrate = useCallback((pattern: number | number[]) => {
    if (enableHaptic && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, [enableHaptic]);

  // Pull to refresh
  useEffect(() => {
    if (!onPullToRefresh) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0 && e.touches.length === 1) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || e.touches.length !== 1) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 80) { // Threshold for pull to refresh
        vibrate(10); // Light feedback
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isPulling.current) return;

      const currentY = e.changedTouches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 80) {
        vibrate([10, 50, 10]); // Success pattern
        onPullToRefresh();
      }

      isPulling.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onPullToRefresh, vibrate]);

  // Pinch to zoom
  useEffect(() => {
    if (!onPinchZoom) return;

    const getDistance = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        startDistance.current = getDistance(e.touches[0], e.touches[1]);
        isPinching.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPinching.current || e.touches.length !== 2) return;

      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / startDistance.current;

      if (Math.abs(scale - 1) > 0.1) { // Threshold to prevent jitter
        onPinchZoom(scale);
      }
    };

    const handleTouchEnd = () => {
      isPinching.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onPinchZoom]);

  return { vibrate };
}

// Swipe gesture hook for dataset management
interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipe(
  ref: React.RefObject<HTMLElement>,
  { onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeOptions
) {
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEnd.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      const deltaX = touchEnd.current.x - touchStart.current.x;
      const deltaY = Math.abs(touchEnd.current.y - touchStart.current.y);

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(deltaX) > threshold && deltaY < threshold) {
        if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, onSwipeLeft, onSwipeRight, threshold]);
}
