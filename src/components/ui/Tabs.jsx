import React from 'react';
import { cn } from '../../utils/cn';

/**
 * TabGroup component to manage tabs
 */
const TabGroup = ({ children, className = "" }) => {
  return (
    <div className={cn("border-b", className)}>
      <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4">
        {children}
      </div>
    </div>
  );
};

/**
 * Tab component for individual tab items
 */
const Tab = ({ 
  children, 
  isActive = false, 
  onClick, 
  className = "",
  variant = "underline"
}) => {
  // Variant styles
  const variantStyles = {
    underline: {
      base: "py-4 text-sm font-medium border-b-2 whitespace-nowrap mr-6",
      active: "border-blue-600 text-blue-600",
      inactive: "border-transparent text-gray-500 hover:text-gray-700"
    },
    pill: {
      base: "px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 mr-2",
      active: "bg-blue-600 text-white",
      inactive: "bg-gray-100 text-gray-600 hover:bg-gray-200"
    },
    minimal: {
      base: "px-4 py-2 text-sm font-medium mr-4",
      active: "text-blue-600",
      inactive: "text-gray-500 hover:text-gray-700"
    }
  };

  const style = variantStyles[variant];
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        style.base,
        isActive ? style.active : style.inactive,
        className
      )}
      role="tab"
      aria-selected={isActive}
    >
      {children}
    </button>
  );
};

/**
 * TabPanel component for tab content
 */
const TabPanel = ({ children, className = "", isActive = false }) => {
  if (!isActive) return null;
  
  return (
    <div className={className} role="tabpanel">
      {children}
    </div>
  );
};

TabGroup.Tab = Tab;
TabGroup.Panel = TabPanel;

export default TabGroup;