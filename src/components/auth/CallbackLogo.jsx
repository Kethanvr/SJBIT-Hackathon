// CallbackLogo.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CallbackLogo() {
  const { t } = useTranslation('auth');
  return (
    <div className="flex justify-center mb-6">
      <img
        src="https://res.cloudinary.com/drp9pr8up/image/upload/v1744224432/Mediscan_ag3iao.png"
        alt={t('callback.logoAlt')}
        className="h-14"
      />
    </div>
  );
}
