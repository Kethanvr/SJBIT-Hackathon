import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiAlertTriangle } from 'react-icons/fi';
import { useProTheme } from '../../utils/useProTheme';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, recordName }) => {
  const { t } = useTranslation('healthRecords');
  const { isPro } = useProTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`${isPro ? 'bg-gradient-to-tr from-yellow-50 to-white' : 'bg-white'} rounded-lg w-full max-w-md p-6 text-center`}>
        <div className="flex justify-center mb-4">
          <div className={`${isPro ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'} p-3 rounded-full`}>
            <FiAlertTriangle className="w-8 h-8" />
          </div>
        </div>
        
        <h2 className={`text-xl font-bold mb-2 ${isPro ? 'text-yellow-900' : 'text-gray-900'}`}>
          {t('deleteConfirm.title')}
        </h2>
        
        <p className={`mb-6 ${isPro ? 'text-yellow-700' : 'text-gray-600'}`}>
          {recordName 
            ? t('deleteConfirm.messageWithName', { name: recordName })
            : t('deleteConfirm.message')}
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-md ${
              isPro 
                ? 'bg-white text-yellow-700 border border-yellow-300 hover:bg-yellow-50' 
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            } transition-colors`}
          >
            {t('deleteConfirm.cancel')}
          </button>
          
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-md ${
              isPro 
                ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
            } transition-colors`}
          >
            {t('deleteConfirm.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
