import React from 'react';
import { FiAlertCircle, FiInfo, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { useProTheme } from '../../utils/useProTheme';

/**
 * StandardErrorMessage component - A unified error message component for the entire application
 * 
 * @param {Object} props
 * @param {string} props.type - Type of message ('error', 'warning', 'info', 'success')
 * @param {string} props.title - Optional title for the message
 * @param {string} props.message - The message content
 * @param {boolean} props.dismissible - Whether the message can be dismissed 
 * @param {Function} props.onDismiss - Callback function when dismissing the message
 * @param {string} props.className - Additional CSS classes to apply
 * @returns {JSX.Element} - Rendered error message
 */
const StandardErrorMessage = ({
  type = 'error',
  title,
  message,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const { isPro } = useProTheme();
  
  if (!message && !title) return null;
  
  // Define styles and icons based on message type
  const typeStyles = {
    error: {
      wrapper: isPro ? 'bg-red-50 border-red-200 text-red-800' : 'bg-red-50 border-red-200 text-red-800',
      icon: <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5" />,
      titleClass: 'text-red-800',
      messageClass: 'text-red-600',
    },
    warning: {
      wrapper: isPro ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-orange-50 border-orange-200 text-orange-800',
      icon: <FiAlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />,
      titleClass: isPro ? 'text-yellow-800' : 'text-orange-800',
      messageClass: isPro ? 'text-yellow-700' : 'text-orange-700',
    },
    info: {
      wrapper: isPro ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <FiInfo className="w-5 h-5 text-blue-600 mt-0.5" />,
      titleClass: 'text-blue-800',
      messageClass: 'text-blue-600',
    },
    success: {
      wrapper: 'bg-green-50 border-green-200 text-green-800',
      icon: <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />,
      titleClass: 'text-green-800',
      messageClass: 'text-green-600',
    },
  };
  
  const styles = typeStyles[type] || typeStyles.error;
  
  return (
    <div className={`${styles.wrapper} border rounded-lg p-4 mb-4 flex items-start space-x-3 ${className}`}>
      {styles.icon}
      <div className="flex-1">
        {title && <h3 className={`font-medium ${styles.titleClass}`}>{title}</h3>}
        {message && <p className={`${title ? 'mt-1' : ''} ${styles.messageClass}`}>{message}</p>}
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-gray-200 rounded-full"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default StandardErrorMessage;
