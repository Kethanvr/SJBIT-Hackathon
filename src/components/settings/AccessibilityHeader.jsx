import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const AccessibilityHeader = () => {
  const { t } = useTranslation('accessibility');

  return (
    <div className="bg-[var(--bg-secondary)] px-4 py-4 border-b border-gray-700/10">
      <div className="flex items-center space-x-4">
        <Link to="/account" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold">
          {t('title')}
        </h1>
      </div>
    </div>
  );
};

export default AccessibilityHeader;
