import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProTheme } from '../../utils/useProTheme';

const tabList = [
  { key: 'all', labelKey: 'tabs.all' },
  { key: 'medication', labelKey: 'tabs.medication' },
  { key: 'condition', labelKey: 'tabs.condition' },
  { key: 'allergy', labelKey: 'tabs.allergy' },
  { key: 'procedure', labelKey: 'tabs.procedure' },
  { key: 'immunization', labelKey: 'tabs.immunization' },
  { key: 'lab_result', labelKey: 'tabs.labResult' },
  { key: 'prescription', labelKey: 'tabs.prescription' },
  { key: 'note', labelKey: 'tabs.note' },
  { key: 'other', labelKey: 'tabs.other' },
];

const HealthRecordsTabs = ({ activeTab, setActiveTab, className = '' }) => {
  const { isPro, theme } = useProTheme();
  const { t } = useTranslation("healthRecords");
    return (
    <div
      className={`w-full overflow-x-auto scrollbar-hide px-1 md:px-0 health-record-tabs`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex flex-nowrap gap-2 w-full">
        {tabList.map(tab => (
          <button
            key={tab.key}
            className={`flex-shrink-0 px-4 py-2 rounded-md border transition-colors duration-150 text-sm font-medium focus:outline-none focus:ring-2 ${isPro ? 'focus:ring-yellow-400' : 'focus:ring-blue-400'} min-w-[110px] md:min-w-[120px] text-center health-record-tab ${
              activeTab === tab.key
                ? isPro 
                  ? 'bg-gradient-to-tr from-yellow-300 to-yellow-500 text-yellow-900 border-2 border-yellow-400 shadow-md'
                  : 'bg-blue-600 text-white border-blue-600 shadow-md'
                : isPro
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100 hover:text-yellow-800'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HealthRecordsTabs;
