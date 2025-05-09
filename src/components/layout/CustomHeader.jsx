import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiWifi, FiWifiOff } from 'react-icons/fi';

/**
 * A reusable custom header component with back button navigation
 * @param {Object} props - Component props
 * @param {String} props.title - The title to display in the header
 * @param {Function} props.onBack - Optional custom back function, defaults to navigate(-1)
 * @param {Boolean} props.networkError - Optional network error state to display indicator
 * @param {Boolean} props.darkMode - Whether to use dark mode styling
 * @param {String} props.className - Additional classes to apply
 * @param {React.ReactNode} props.actions - Optional action buttons to show on the right side of the header
 */
const CustomHeader = ({ 
  title, 
  onBack, 
  networkError = false, 
  darkMode = false,
  className = "",
  actions = null
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('header');
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const baseClasses = darkMode 
    ? "bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20 text-white" 
    : "bg-white sticky top-0 z-10 shadow-sm";

  return (
    <div className={`px-4 py-3 ${baseClasses} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">          <button 
            onClick={handleBack} 
            className={darkMode ? "text-white" : "text-gray-600"}
            aria-label={t('backButtonLabel')}
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <h1 className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {title}
          </h1>
        </div>
          <div className="flex items-center space-x-3">
          {/* Action buttons */}
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
          
          {/* Optional network status indicator */}
          {(networkError !== undefined) && (            <div className="w-6">
              {networkError ? (
                <FiWifiOff className="w-5 h-5 text-red-400" title={t('networkStatus.error')} /> 
              ) : (
                <FiWifi className="w-5 h-5 text-green-400" title={t('networkStatus.ok')} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomHeader;
