import * as React from "react"

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useLayoutEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkWidth(); // run immediately before paint

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkWidth);
    return () => mql.removeEventListener("change", checkWidth);
  }, []);

  // Fallback to false if undefined
  return isMobile ?? false;
}
