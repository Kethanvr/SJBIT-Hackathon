import React from 'react';
import { useProTheme } from '../../utils/useProTheme';

/**
 * StandardLoadingIndicator component - A unified loading indicator for the entire application
 * 
 * @param {Object} props
 * @param {string} props.size - Size of the spinner ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {string} props.variant - Type of loading indicator ('spinner', 'dots', 'overlay')
 * @param {string} props.message - Optional message to display with the loading indicator
 * @param {string} props.note - Additional note text (used primarily with overlay variant)
 * @param {string} props.className - Additional CSS classes to apply
 * @returns {JSX.Element} - Rendered loading indicator
 */
const StandardLoadingIndicator = ({
  size = 'md',
  variant = 'spinner',
  message = 'Loading...',
  note,
  className = '',
}) => {
  const { isPro } = useProTheme();
  
  // Determine theme color based on pro status
  const themeColor = isPro ? 'yellow' : 'blue';
  
  // Size mappings for the spinner
  const sizeMap = {
    xs: { spinner: 'h-4 w-4', border: 'border-2', text: 'text-xs' },
    sm: { spinner: 'h-6 w-6', border: 'border-2', text: 'text-sm' },
    md: { spinner: 'h-8 w-8', border: 'border-3', text: 'text-base' },
    lg: { spinner: 'h-12 w-12', border: 'border-4', text: 'text-lg' },
    xl: { spinner: 'h-16 w-16', border: 'border-4', text: 'text-xl' },
  };
  
  // Get size styles or default to medium if invalid size provided
  const sizeStyle = sizeMap[size] || sizeMap.md;
  
  // Dots loading indicator variant
  if (variant === 'dots') {
    const dotSize = {
      xs: 'h-1 w-1 mx-0.5',
      sm: 'h-1.5 w-1.5 mx-0.5',
      md: 'h-2 w-2 mx-1',
      lg: 'h-3 w-3 mx-1',
      xl: 'h-4 w-4 mx-1.5',
    }[size] || 'h-2 w-2 mx-1';
    
    return (
      <div className={`flex flex-col items-center justify-center ${className}`} role="status" aria-label={message}>
        <div className="flex items-center">
          <div className={`rounded-full ${dotSize} bg-${themeColor}-400 animate-pulse`} style={{ animationDelay: '0ms' }} />
          <div className={`rounded-full ${dotSize} bg-${themeColor}-400 animate-pulse`} style={{ animationDelay: '300ms' }} />
          <div className={`rounded-full ${dotSize} bg-${themeColor}-400 animate-pulse`} style={{ animationDelay: '600ms' }} />
        </div>
        {message && <p className={`mt-2 ${sizeStyle.text} text-${themeColor}-700`}>{message}</p>}
      </div>
    );
  }
  
  // Full-screen overlay with loading indicator
  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50 p-4">
        <div className={`animate-spin rounded-full ${sizeStyle.spinner} ${sizeStyle.border} border-${themeColor}-400 border-t-transparent mb-4`} />
        <p className={`text-${themeColor}-700 text-center mb-2 font-medium`}>{message}</p>
        {note && <p className="text-gray-500 text-sm text-center max-w-xs">{note}</p>}
      </div>
    );
  }
  
  // Default spinner variant
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} role="status" aria-label={message}>
      <div className={`animate-spin rounded-full ${sizeStyle.spinner} ${sizeStyle.border} border-${themeColor}-500 border-t-transparent`} />
      {message && <p className={`mt-2 ${sizeStyle.text} text-gray-600`}>{message}</p>}
    </div>
  );
};

export default StandardLoadingIndicator;
