import React from 'react';
import { FiInfo } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const ScanGuide = ({ isVisible, onClose }) => {
  const { t } = useTranslation('scanGuide');
  
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-medium flex items-center">
            <FiInfo className="mr-2" /> {t('title')}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            &times;
          </button>
        </div>
          <div className="space-y-4 text-gray-200">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
              <span className="text-white text-sm">1</span>
            </div>
            <p>{t('tip1')}</p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
              <span className="text-white text-sm">2</span>
            </div>
            <p>{t('tip2')}</p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
              <span className="text-white text-sm">3</span>
            </div>
            <p>{t('tip3')}</p>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
              <span className="text-white text-sm">4</span>
            </div>
            <p>{t('tip4')}</p>
          </div>
        </div>
          <button
          onClick={onClose}
          className="mt-5 w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
        >
          {t('closeButton')}
        </button>
      </div>
    </div>
  );
};

export default ScanGuide;