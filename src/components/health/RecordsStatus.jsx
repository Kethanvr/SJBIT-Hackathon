import React from 'react';
import Button from '../ui/Button';
import { useProTheme } from '../../utils/useProTheme';
import { useTranslation } from 'react-i18next';

const RecordsStatus = ({ loading, error, records, activeTab, onAddClick }) => {
  const { isPro, theme } = useProTheme();
  const { t } = useTranslation("healthRecords");
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isPro ? 'border-yellow-400' : 'border-blue-600'}`} />
      </div>
    );
  }
  
    if (error) {
    return (
      <div className={`${isPro ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded mb-4 border`}>
        {error}
      </div>
    );
  }
  
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 h-60 text-center">        <p className={`${isPro ? 'text-yellow-600' : 'text-gray-500'} mb-4`}>
          {t(`noRecords.message_${activeTab}`, { defaultValue: t("noRecords.message") })}
        </p>
        <Button 
          onClick={onAddClick} 
          variant={isPro ? "gold" : "outline"}
        >
          {t("noRecords.addButton", "Add Health Record")}
        </Button>
      </div>
    );
  }
  
  return null;
};

export default RecordsStatus;
