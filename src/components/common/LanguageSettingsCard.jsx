import React from 'react';
import { FiGlobe } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

/**
 * A card component for displaying and changing language settings.
 * @param {object} props
 * @param {Array} props.supportedLanguages - Array of language objects ({ code, name }).
 * @param {string} props.currentLanguage - The code of the currently selected language.
 * @param {Function} props.changeLanguage - Function to call when a language button is clicked.
 */
const LanguageSettingsCard = ({ supportedLanguages, currentLanguage, changeLanguage }) => {
  const { t } = useTranslation('accessibility'); // Use the same namespace

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg p-6 shadow-sm">
      <div>
        <div className="flex items-center space-x-2">
          <FiGlobe className="w-6 h-6 text-[var(--text-secondary)]" />
          <h3 className="text-lg font-medium">{t('language.title')}</h3>
        </div>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {t('language.description')}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {supportedLanguages.map((lang) => (
          <button
            type="button"
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`p-3 text-sm rounded-lg border transition-colors ${
              currentLanguage === lang.code
                ? "border-blue-600 bg-blue-50/10 text-blue-500"
                : "border-gray-700/10 hover:border-gray-700/30"
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSettingsCard;
