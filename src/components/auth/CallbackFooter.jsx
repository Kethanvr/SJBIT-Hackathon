// CallbackFooter.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CallbackFooter  () {
  const { t } = useTranslation('auth');
  return (
    <div className="mt-10 pt-6 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        {t('callback.footer.copyright', { year: new Date().getFullYear() })}<br/>
        {t('callback.footer.tagline')}
      </p>
    </div>
  );
}
 
