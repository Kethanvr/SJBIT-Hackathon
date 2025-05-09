import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Scrolls to the top of the page when the route changes
 * Place this component at the top level of your app, inside Router but outside Routes
 * 
 * @param {Object} props - Component props
 * @param {boolean} [props.smooth=false] - Whether to use smooth scrolling (can cause jank on route changes)
 * @param {Function} [props.onRouteChange] - Optional callback that fires after scrolling on route change
 */
const ScrollToTop = ({ smooth = false, onRouteChange }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use instant scroll by default for better UX on route change
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
    
    // Call the callback if provided
    if (onRouteChange) {
      onRouteChange(pathname);
    }
  }, [pathname, smooth, onRouteChange]);

  return null;
};

export default ScrollToTop;