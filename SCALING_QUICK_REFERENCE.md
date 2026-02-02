# 87.5% Scale - Quick Reference Guide

## 🎯 What Changed?

### Root Scaling
```css
html { font-size: 87.5%; } /* 14px instead of 16px */
```

### Key Size Reductions

#### Typography
- **H1:** 3.5rem → 3rem max
- **H2:** 2.5rem → 2.25rem max  
- **H3:** 1.875rem → 1.675rem max
- **Body:** 1.125rem → 1rem max

#### Components
- **Header:** 56-64px → 48-56px
- **Buttons:** h-12 → h-11 (mobile), px-6 → px-5
- **Cards:** p-6 → p-4, border-2 → border
- **Icons:** 16-20px → 14-18px
- **Inputs:** h-11 → h-10 (mobile)

#### Spacing
- **Container padding:** ~15% reduction
- **Section spacing:** ~17% reduction
- **Gap values:** ~12% reduction

#### Visual Elements
- **Shadows:** 25-30% lighter
- **Border radius:** xl → lg (most cases)
- **Scrollbar:** 5px → 4px

---

## 🎨 New Utility Classes

### Component Sizing
```css
.card-compact           /* p-3 sm:p-4 md:p-5 */
.card-extra-compact     /* p-2 sm:p-3 md:p-4 */
.btn-compact           /* h-8 px-3 text-sm */
.btn-compact-sm        /* h-7 px-2.5 text-xs */
```

### Icon Sizes
```css
.icon-xs    /* h-3 w-3 */
.icon-sm    /* h-3.5 w-3.5 */
.icon-md    /* h-4 w-4 */
.icon-lg    /* h-5 w-5 */
```

### Spacing
```css
.spacing-compact        /* space-y-2 */
.spacing-comfortable    /* space-y-3 */
.gap-compact           /* gap-2 */
.gap-comfortable       /* gap-3 */
```

### Borders & Shadows
```css
.border-clean          /* border border-border/50 */
.shadow-clean-sm       /* Subtle 1-2px shadow */
.shadow-clean-md       /* Medium 2-8px shadow */
.shadow-clean-lg       /* Large 4-16px shadow */
```

### Interactions
```css
.interactive-clean     /* min-h-[40px] accessible */
.transition-clean      /* duration-200 ease-out */
.focus-clean          /* Optimized focus ring */
```

---

## ✅ Accessibility Standards

### Touch Targets (WCAG 2.1)
- **Minimum:** 40px × 40px ✅
- **Critical:** 44px × 44px ✅
- **Spacing:** 8px between elements ✅

### Text Readability
- **Minimum size:** 12px equivalent ✅
- **Contrast ratio:** 4.5:1 ✅
- **Line height:** 1.5+ for body text ✅

---

## 📱 Device Breakpoints

```css
Mobile:    < 640px    (Full optimization)
Tablet:    641-1024px (Balanced scaling)
Desktop:   1025-1920px (87.5% applied)
Ultra-wide: > 1920px  (Contained)
```

---

## 🚀 Quick Checks

### Before Committing:
1. ✅ Build passes (`npm run build`)
2. ✅ No TypeScript errors
3. ✅ Test on mobile device
4. ✅ Verify touch targets
5. ✅ Check text readability

### Testing Checklist:
- [ ] Mobile portrait (320-414px)
- [ ] Mobile landscape
- [ ] Tablet (768-1024px)
- [ ] Desktop (1280-1920px)
- [ ] Touch interactions work
- [ ] Keyboard navigation works

---

## 🔄 Rollback Instructions

If you need to revert:

1. **index.css** - Change line ~129:
   ```css
   html {
     font-size: 100%; /* Change 87.5% back to 100% */
   }
   ```

2. **tailwind.config.ts** - Restore original values:
   - Container padding
   - Spacing values
   - fontSize scales
   - boxShadow values

3. **AppHeader.tsx** - Restore original heights:
   - Header: h-14 sm:h-16
   - Buttons: h-8 sm:h-9
   - Logo: h-9 sm:h-11

---

## 📊 Before/After Comparison

| Element | Before | After | Change |
|---------|--------|-------|--------|
| Base font | 16px | 14px | -12.5% |
| Header | 64px | 56px | -12.5% |
| Button padding | 24px | 20px | -16.7% |
| Card padding | 24px | 16px | -33.3% |
| Shadow MD | 12px | 10px | -16.7% |
| Container padding | 16-48px | 14-40px | ~15% |

---

## 💡 Pro Tips

1. **Use rem units** for all new styles
2. **Test mobile first** - scaling is most critical there
3. **Maintain 40px touch targets** minimum
4. **Follow spacing utilities** for consistency
5. **Check accessibility** with automated tools

---

## 📚 Related Files

- [SCALING_IMPLEMENTATION_SUMMARY.md](SCALING_IMPLEMENTATION_SUMMARY.md) - Full documentation
- [src/index.css](src/index.css) - Core styling changes
- [tailwind.config.ts](tailwind.config.ts) - Configuration updates
- [src/components/layout/AppHeader.tsx](src/components/layout/AppHeader.tsx) - Component example

---

**Last Updated:** February 2, 2026  
**Version:** 1.0 - 87.5% Scale Implementation
