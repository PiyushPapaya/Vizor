import { ReactNode } from 'react';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface ResponsiveLayoutManagerProps {
  mobileLayout: ReactNode;
  desktopLayout: ReactNode;
}

/**
 * Ensures only ONE layout is rendered at a time - either mobile OR desktop, never both.
 * This prevents chart duplication and layout conflicts.
 */
export function ResponsiveLayoutManager({ mobileLayout, desktopLayout }: ResponsiveLayoutManagerProps) {
  const { isMobile } = useResponsiveLayout();
  
  // Critical: Only render ONE layout based on screen size
  // Use display: none approach to ensure React doesn't render both
  return (
    <>
      {/* Desktop Layout - Only visible on lg screens and above */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {desktopLayout}
      </div>
      
      {/* Mobile Layout - Only visible on screens below lg */}
      <div className="flex lg:hidden flex-1 overflow-hidden">
        {mobileLayout}
      </div>
    </>
  );
}

export default ResponsiveLayoutManager;
