// CallbackMessage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CallbackMessage({ status, redirectUrl }) {
  const { t } = useTranslation('auth');

  if (status === 'processing') {
    return <p className="text-gray-600 mb-8">{t('callback.message.processing')}</p>;
  }
  if (status === 'success') {
    return (
      <>
        <div className="text-gray-600 mb-6 space-y-4">
          <p>
            <strong>{t('callback.message.success.greeting')}</strong> {t('callback.message.success.main')}
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded text-left">
            <p className="font-medium text-blue-700">{t('callback.message.success.nextStepsTitle')}:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-2 text-blue-600">
              <li>{t('callback.message.success.step1')}</li>
              <li>{t('callback.message.success.step2')}</li>
              <li>{t('callback.message.success.step3')}</li>
              <li>{t('callback.message.success.step4')}</li>
            </ol>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <a
            href={redirectUrl}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.01] shadow-lg"
          >
            {t('callback.returnButton')}
          </a>
          <p className="text-sm text-gray-500 mt-2">
            {t('callback.message.success.alternative')}
          </p>
        </div>
      </>
    );
  }
  // error or unknown
  return (
    <>
      <p className="text-gray-600 mb-6">
        {status === 'error' ? t('callback.message.error') : t('callback.message.unknown')}
      </p>
      <a
        href={redirectUrl}
        className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
      >
        {t('callback.returnButton')}
      </a>
    </>
  );
}
