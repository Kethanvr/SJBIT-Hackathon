// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\components\layout\PageHeader.jsx
import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { useProTheme } from '../../utils/useProTheme';

/**
 * Reusable page header component with back button and optional actions
 */
const PageHeader = ({
  title,
  showBackButton = true,
  backButtonPath,
  actions,
  fixed = false,
  className = '',
  borderBottom = true,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('header');
  const { isPro, theme } = useProTheme();

  const handleBackClick = () => {
    if (backButtonPath) {
      navigate(backButtonPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div 
      className={cn(
        "px-4 py-4 z-10",
        isPro ? "bg-gradient-to-tr from-yellow-50 to-white" : "bg-white",
        fixed ? "fixed top-0 left-0 right-0" : "",
        borderBottom ? isPro ? "border-b border-yellow-200" : "border-b" : "",
        className
      )}
    >
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              type="button"
              onClick={handleBackClick}
              className={isPro ? theme.navInactive : "text-gray-600 hover:text-gray-800"}
              aria-label={t('backButtonLabel')}
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className={`text-xl font-semibold ${isPro ? 'text-yellow-900' : ''}`}>{title}</h1>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-1">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;