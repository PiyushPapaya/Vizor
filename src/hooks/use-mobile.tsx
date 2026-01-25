import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * @deprecated This hook is deprecated and will be removed in a future version.
 * Please use `useResponsiveLayout` from './useResponsiveLayout' instead for comprehensive
 * responsive design support including tablet, laptop, desktop, and ultra-wide breakpoints.
 * 
 * Migration example:
 * ```
 * // Old:
 * const isMobile = useIsMobile();
 * 
 * // New:
 * const { isMobile } = useResponsiveLayout();
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
