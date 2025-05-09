import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

/**
 * ScrollToTopButton - A floating button that appears when scrolling down and allows
 * users to quickly return to the top of the page
 * 
 * @param {Object} props
 * @param {number} [props.threshold=300] - Scroll threshold in pixels before showing button
 * @param {boolean} [props.smooth=true] - Whether to use smooth scrolling animation
 * @param {string} [props.position='bottom-right'] - Position of button ('bottom-right', 'bottom-left')
 * @param {string} [props.className] - Additional CSS classes for the button
 * @param {string} [props.iconClass] - Additional CSS classes for the icon
 */
const ScrollToTopButton = ({
  threshold = 300,
  smooth = true,
  position = 'bottom-right',
  className = '',
  iconClass = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll event to show/hide button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  // Don't render anything if not visible
  if (!isVisible) {
    return null;
  }

  // Determine position classes
  const positionClasses = {
    'bottom-right': 'right-4 bottom-20',
    'bottom-left': 'left-4 bottom-20',
    'bottom-center': 'left-1/2 -translate-x-1/2 bottom-20',
  }[position] || 'right-4 bottom-20';

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${positionClasses} z-40 bg-blue-600 text-white rounded-full p-2.5 shadow-lg hover:bg-blue-700 transition-all duration-300 animate-fade-in ${className}`}
      aria-label="Scroll to top"
    >
      <FiArrowUp className={`h-5 w-5 ${iconClass}`} />
    </button>
  );
};

export default ScrollToTopButton;
