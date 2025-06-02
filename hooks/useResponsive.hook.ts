/* REACT IMPORTS */
import { useEffect, useState } from "react";

/**
 * Custom hook for responsive breakpoint detection
 * @param {Object} breakpoints - Object containing breakpoint values in pixels
 * @returns {Object} Object with boolean values for each breakpoint
 *
 * Example usage:
 * const { isMobile, isTablet, isDesktop } = useResponsive({
 *   mobile: 768,
 *   tablet: 1024,
 *   desktop: 1280
 * });
 */
const useResponsive = (customBreakpoints = {}) => {
  // Default breakpoints
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
    ...customBreakpoints,
  };

  // Initialize state with an empty object for SSR compatibility
  const [responsive, setResponsive] = useState({});

  useEffect(() => {
    // Function to update responsive state based on window width
    const handleResize = () => {
      const width = window.innerWidth;

      // Create the responsive state object
      const newState = {
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
        isDesktop: width >= breakpoints.tablet && width < breakpoints.desktop,
        isLargeDesktop: width >= breakpoints.desktop,

        // Additional helper properties
        width,
        isMobileOrTablet: width < breakpoints.tablet,
        isTabletOrDesktop: width >= breakpoints.mobile,
      };

      setResponsive(newState);
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array since breakpoints won't change

  return responsive;
};

export default useResponsive;

// Usage example:

/*
import useResponsive from './useResponsive';
  const { isMobile } = useResponsive();
  return (
    <div>
      {isMobile ? (
        <p>This is a mobile view</p>
      ) : (
        <p>This is not a mobile view</p>
      )}
    </div>
  );

  // OR
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div>
      {isMobile && <p>This is a mobile view</p>}
      {isTablet && <p>This is a tablet view</p>}
      {isDesktop && <p>This is a desktop view</p>}
    </div>
  );
*/
