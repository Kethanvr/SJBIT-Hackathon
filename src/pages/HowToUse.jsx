import React from 'react';
import { useTranslation } from 'react-i18next';
import { howToUseData } from '../data/howToUseContent';

/**
 * HowToUse component displays instructions and guidance for using the application
 */
const HowToUse = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('howToUse.title', 'How to Use')}</h1>
        
        <div className="space-y-6">
          {howToUseData.map((section, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                {t(`howToUse.sections.${section.title}`, section.title)}
              </h2>
              <p className="text-gray-600 mb-4">
                {t(`howToUse.sections.${section.description}`, section.description)}
              </p>
              {section.steps && (
                <ol className="list-decimal list-inside space-y-2">
                  {section.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-gray-700">
                      {t(`howToUse.sections.${step}`, step)}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
