import { useMemo } from "react";

/**
 * Returns a standardized blue theme set of color classes.
 * Usage: const { isPro, theme } = useProTheme();
 */
export function useProTheme() {
  // Always set isPro to false to enforce blue theme
  const isPro = false;

  // Get theme definition - using only blue theme
  const theme = useMemo(() => {
    // Generate blue theme object
    const themeValues = {
      // backgrounds
      cardBg: "bg-white",
      linkBg: "bg-gray-50",
      navActive: "text-blue-600",
      navInactive: "text-gray-600",
      scanBg: "bg-blue-600",
      // text
      icon: "text-blue-600",
      iconNav: "text-white",
      title: "text-blue-900",
      desc: "text-blue-900",
      // buttons
      button: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      // empty states
      emptyIcon: "text-gray-400",
      emptyTitle: "text-gray-900",
      emptyText: "text-gray-500",
      emptyBackground: "bg-gray-100",
      // etc. Add more as needed
    };    return themeValues;
  }, []);

  return { isPro, theme };
}
