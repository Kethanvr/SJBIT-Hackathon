/**
 * A utility function for providing consistent blue theme values
 */
import { useProTheme } from './useProTheme';

/**
 * Returns the standardized blue theme
 * @returns {Object} Object containing isPro and theme properties
 */
export const useSafeProTheme = () => {
  // Simply use the useProTheme hook which now always returns blue theme
  try {
    return useProTheme();
  } catch (error) {
    console.error('Error in useSafeProTheme:', error);
    
    // Return default blue theme if there's an error
    return { 
      isPro: false, 
      theme: {
        cardBg: "bg-white",
        linkBg: "bg-gray-50",
        navActive: "text-blue-600",
        navInactive: "text-gray-600",
        scanBg: "bg-blue-600",
        icon: "text-blue-600",
        iconNav: "text-white",
        title: "text-blue-900",
        desc: "text-blue-900",
        button: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        emptyIcon: "text-gray-400",
        emptyTitle: "text-gray-900",
        emptyText: "text-gray-500",
        emptyBackground: "bg-gray-100"
      }
    };
  }
};

export default useSafeProTheme;
