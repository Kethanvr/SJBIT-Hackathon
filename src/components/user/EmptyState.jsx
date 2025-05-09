import React from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useProTheme } from "../../utils/useProTheme";

const EmptyState = ({ 
  icon = undefined, 
  title, 
  message, 
  actions = [] 
}) => {
  const { isPro, theme } = useProTheme();
  
  // Use custom icon if provided, otherwise use default with theme-specific color
  const displayIcon = icon || <FiSearch className={`w-8 h-8 ${theme.emptyIcon}`} />;

  return (
    <div className="text-center py-8">
      <div className={`w-16 h-16 ${theme.emptyBackground} rounded-full flex items-center justify-center mx-auto mb-4`}>
        {displayIcon}
      </div>
      <h3 className={`${theme.emptyTitle} font-medium`}>{title}</h3>
      <p className={`${theme.emptyText} mt-1`}>{message}</p>
      {actions.length > 0 && (
        <div className="mt-4 flex justify-center space-x-3">
          {actions.map((action, idx) => (
            <Link 
              key={idx} 
              to={action.to} 
              className={`inline-block px-4 py-2 rounded-lg ${theme.button}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
