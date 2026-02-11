import { ReactNode } from 'react';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface ResponsiveLayoutManagerProps {
  mobileLayout: ReactNode;
  tabletPortraitLayout?: ReactNode;
  tabletLandscapeLayout?: ReactNode;
  desktopLayout: ReactNode;
}

/**
 * Ensures only ONE layout is rendered at a time based on screen size.
 * Supports mobile, tablet (portrait/landscape), laptop, desktop, and ultra-wide layouts.
 * This prevents chart duplication and layout conflicts.
 * 
 * Layout Breakpoints:
 * - Mobile: < 768px (phones)
 * - Tablet Portrait: 768-1023px portrait orientation
 * - Tablet Landscape: 768-1023px landscape orientation
 * - Laptop: 1024-1279px
 * - Desktop: 1280-1919px
 * - Ultra-wide: >= 1920px
 */
export function ResponsiveLayoutManager({ 
  mobileLayout, 
  tabletPortraitLayout,
  tabletLandscapeLayout,
  desktopLayout 
}: ResponsiveLayoutManagerProps) {
  const { layoutMode } = useResponsiveLayout();
  
  // Render only the appropriate layout based on layoutMode
  // Using conditional rendering instead of CSS display to prevent unnecessary rendering
  return (
    <>
      {/* Mobile Layout: < 768px */}
      {layoutMode === 'mobile' && (
        <div className="flex flex-1 overflow-hidden w-full h-full">
          {mobileLayout}
        </div>
      )}
      
      {/* Tablet Portrait Layout: 768-1023px portrait */}
      {layoutMode === 'tablet-portrait' && (
        <div className="flex flex-1 overflow-hidden w-full h-full">
          {tabletPortraitLayout || desktopLayout}
        </div>
      )}
      
      {/* Tablet Landscape Layout: 768-1023px landscape */}
      {layoutMode === 'tablet-landscape' && (
        <div className="flex flex-1 overflow-hidden w-full h-full">
          {tabletLandscapeLayout || desktopLayout}
        </div>
      )}
      
      {/* Laptop Layout: 1024-1279px (compact desktop) */}
      {layoutMode === 'laptop' && (
        <div className="flex flex-1 overflow-hidden w-full h-full">
          {desktopLayout}
        </div>
      )}
      
      {/* Desktop Layout: 1280-1919px */}
      {layoutMode === 'desktop' && (
        <div className="flex flex-1 overflow-hidden w-full h-full">
          {desktopLayout}
        </div>
      )}
      
      {/* Ultra-wide Layout: >= 1920px (with max-width constraint) */}
      {layoutMode === 'ultra-wide' && (
        <div className="flex flex-1 overflow-hidden w-full h-full">
          {desktopLayout}
        </div>
      )}

      {/* Fallback: render desktop layout for any unknown mode */}
      {!['mobile', 'tablet-portrait', 'tablet-landscape', 'laptop', 'desktop', 'ultra-wide'].includes(layoutMode) && (
        <div className="flex flex-1 overflow-hidden w-full h-full">
          {desktopLayout}
        </div>
      )}
    </>
  );
}

export default ResponsiveLayoutManager;
