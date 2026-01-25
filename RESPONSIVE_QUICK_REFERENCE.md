# Responsive Design Quick Reference

## Breakpoint Classes (Tailwind)

### Standard Breakpoints
```css
/* Mobile first - base styles apply to all sizes */
.class                  /* 0px+ (all devices) */
sm:class               /* 640px+ (large phones landscape) */
md:class               /* 768px+ (tablets) */
lg:class               /* 1024px+ (laptops) */
xl:class               /* 1280px+ (desktops) */
2xl:class              /* 1400px+ (large desktops) */
3xl:class              /* 1920px+ (ultra-wide) */

/* Custom */
xs:class               /* 475px+ (small phones landscape) */
```

### Usage Examples
```tsx
// Responsive padding
<div className="p-3 sm:p-4 md:p-6 lg:p-8 2xl:p-10">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

// Responsive text
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">

// Hide/show at breakpoints
<div className="hidden lg:flex">Desktop Only</div>
<div className="flex lg:hidden">Mobile/Tablet Only</div>
```

## useResponsiveLayout Hook

### Basic Usage
```typescript
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

function MyComponent() {
  const { 
    isMobile,     // < 768px (phones)
    isTablet,     // 768-1023px
    isLaptop,     // 1024-1279px
    isDesktop,    // 1280-1919px
    isUltraWide,  // 1920px+
    layoutMode,   // 'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'laptop' | 'desktop' | 'ultra-wide'
    width,        // Current viewport width
    height,       // Current viewport height
    orientation,  // 'portrait' | 'landscape'
  } = useResponsiveLayout();
  
  return <div>Width: {width}px</div>;
}
```

### Advanced Usage
```typescript
const { 
  getMobileChartConfig,  // Helper for chart configurations
  getLayoutClasses,      // Get layout-specific classes
  config,                // Responsive config (fonts, spacing, etc.)
} = useResponsiveLayout();

// Get responsive chart config
const chartConfig = getMobileChartConfig({
  fontSize: 12,
  strokeWidth: 2,
});

// Get layout classes
const classes = getLayoutClasses();
// Returns: { container, chartArea, controlsArea, header }
```

### Device Flags
```typescript
const {
  isPhonePortrait,      // Phone in portrait
  isPhoneLandscape,     // Phone in landscape
  isTabletPortrait,     // Tablet in portrait
  isTabletLandscape,    // Tablet in landscape
  isTouchDevice,        // Touch capability
  isVeryTallScreen,     // Aspect ratio > 2
} = useResponsiveLayout();
```

## Layout Modes

### Mobile (< 768px)
```typescript
if (layoutMode === 'mobile') {
  // Use bottom navigation
  // Show drawers for controls
  // Large touch targets (44-48px)
}
```

### Tablet Portrait (768-1023px portrait)
```typescript
if (layoutMode === 'tablet-portrait') {
  // Vertical split layout
  // Chart: 55vh, Controls: 45vh
  // Medium touch targets (40px)
}
```

### Tablet Landscape (768-1023px landscape)
```typescript
if (layoutMode === 'tablet-landscape') {
  // Horizontal split layout
  // Chart: 65%, Controls: 35%
}
```

### Laptop (1024-1279px)
```typescript
if (layoutMode === 'laptop') {
  // Compact desktop layout
  // Sidebar: 300-380px
  // Optimized spacing
}
```

### Desktop (1280-1919px)
```typescript
if (layoutMode === 'desktop') {
  // Full desktop layout
  // Sidebar: 280-400px
  // Standard spacing
}
```

### Ultra-Wide (1920px+)
```typescript
if (layoutMode === 'ultra-wide') {
  // Constrained max-width
  // Centered content
  // Larger fonts and spacing
}
```

## CSS Utility Classes

### Modern Viewport Heights
```css
.h-screen-safe          /* height: 100dvh (dynamic) */
.min-h-screen-safe      /* min-height: 100dvh */
.max-h-screen-safe      /* max-height: 100dvh */
.h-screen-small         /* height: 100svh (small) */
.h-screen-large         /* height: 100lvh (large) */
```

### Ultra-Wide Constraints
```css
.ultra-wide-container   /* max-width: 1920px (2400px on 4K) */
.ultra-wide-content     /* max-width: 1600px (1920px on 4K) */
.chart-container        /* max-width: 1600px for charts */
```

### Touch Targets
```css
.touch-target           /* min 40x40px touch area */
.touch-target-lg        /* min 44x44px touch area */
```

### Responsive Grids
```css
.grid-responsive        /* Auto-responsive grid */
.grid-responsive-2      /* 2-column responsive */
```

## Common Patterns

### Conditional Rendering
```typescript
// By device type
{isMobile && <MobileComponent />}
{isTablet && <TabletComponent />}
{isDesktop && <DesktopComponent />}

// By layout mode
{layoutMode === 'mobile' && <MobileNav />}
{layoutMode !== 'mobile' && <DesktopNav />}

// By orientation
{orientation === 'portrait' && <PortraitLayout />}
{orientation === 'landscape' && <LandscapeLayout />}
```

### Responsive Styles
```typescript
// Using Tailwind classes
<Button className={`
  h-11 w-11           // Mobile
  sm:h-12 sm:w-12     // Small screens
  lg:h-10 lg:w-10     // Desktop
  touch-target-lg     // Touch devices
`}>

// Using inline styles
<div style={{
  padding: isMobile ? 8 : isTablet ? 12 : 16,
  fontSize: isMobile ? 14 : isUltraWide ? 18 : 16,
}}>

// Using className prop
<div className={isMobile ? 'mobile-class' : 'desktop-class'}>
```

### Responsive Images
```tsx
<img 
  src={isMobile ? 'small.jpg' : isUltraWide ? 'large.jpg' : 'medium.jpg'}
  className="w-full h-auto"
  srcSet={`
    small.jpg 640w,
    medium.jpg 1280w,
    large.jpg 1920w,
    xlarge.jpg 3840w
  `}
  sizes={`
    (max-width: 640px) 100vw,
    (max-width: 1280px) 50vw,
    33vw
  `}
/>
```

## Media Queries (CSS)

### Breakpoint Queries
```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Laptop */
@media (min-width: 1024px) and (max-width: 1279px) { }

/* Desktop */
@media (min-width: 1280px) and (max-width: 1919px) { }

/* Ultra-wide */
@media (min-width: 1920px) { }
```

### Orientation Queries
```css
/* Portrait */
@media (orientation: portrait) { }

/* Landscape */
@media (orientation: landscape) { }

/* Phone landscape (low height) */
@media (max-height: 500px) and (orientation: landscape) { }

/* Tablet portrait */
@media (min-width: 768px) and (max-width: 1023px) and (orientation: portrait) { }
```

### Feature Queries
```css
/* Touch devices */
@media (pointer: coarse) { }

/* Mouse/trackpad devices */
@media (pointer: fine) { }

/* High contrast mode */
@media (prefers-contrast: high) { }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) { }

/* Dark mode */
@media (prefers-color-scheme: dark) { }
```

## Performance Tips

### 1. Use Layout Modes Over Width Checks
```typescript
// ❌ Bad
if (width < 768) { }

// ✅ Good
if (layoutMode === 'mobile') { }
```

### 2. Memoize Expensive Calculations
```typescript
const responsiveConfig = useMemo(() => ({
  fontSize: isMobile ? 12 : 14,
  padding: isMobile ? 8 : 16,
}), [isMobile]);
```

### 3. Avoid Re-renders
```typescript
// ❌ Bad - re-renders on every width change
const { width } = useResponsiveLayout();
return <div style={{ width: width / 2 }}>

// ✅ Good - only re-renders when layout mode changes
const { layoutMode } = useResponsiveLayout();
return <div className={layoutMode === 'mobile' ? 'w-full' : 'w-1/2'}>
```

### 4. Lazy Load Components
```typescript
const MobileComponent = lazy(() => import('./MobileComponent'));
const DesktopComponent = lazy(() => import('./DesktopComponent'));

{isMobile ? <MobileComponent /> : <DesktopComponent />}
```

## Common Issues & Solutions

### Issue: Layout shifts on resize
**Solution:** Use CSS transitions
```css
.container {
  transition: width 0.3s ease;
}
```

### Issue: Touch targets too small
**Solution:** Use utility classes
```tsx
<Button className="touch-target-lg" />
```

### Issue: Content overflows on small screens
**Solution:** Use responsive containers
```tsx
<div className="max-w-full overflow-x-auto" />
```

### Issue: Charts too small on ultra-wide
**Solution:** Use max-width constraint
```tsx
<div className="max-w-[1600px] mx-auto" />
```

### Issue: Fixed heights cause issues
**Solution:** Use dynamic viewport units
```css
.full-height {
  height: 100vh;
  height: 100dvh; /* Better for mobile */
}
```

## Testing Checklist

- [ ] Mobile portrait (< 640px)
- [ ] Mobile landscape (< 768px landscape)
- [ ] Tablet portrait (768-1023px portrait)
- [ ] Tablet landscape (768-1023px landscape)
- [ ] Laptop (1024-1279px)
- [ ] Desktop (1280-1919px)
- [ ] Ultra-wide (1920px+)
- [ ] Rotation transitions
- [ ] Touch interactions
- [ ] Keyboard navigation
- [ ] Screen readers
- [ ] High contrast mode
- [ ] Reduced motion mode

---

**Quick Links:**
- [Full Documentation](./RESPONSIVE_OPTIMIZATION.md)
- [Tailwind Config](./tailwind.config.ts)
- [Responsive Hook](./src/hooks/useResponsiveLayout.ts)
- [Layout Manager](./src/components/ResponsiveLayoutManager.tsx)
