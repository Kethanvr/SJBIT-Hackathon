import React from "react";
import { Link } from "react-router-dom";
import { BsQrCodeScan } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useProTheme } from '../../utils/useProTheme';

const LoggedOutView = () => {
  const { t } = useTranslation("home");
  const { isPro } = useProTheme();
  
  return (
    <div className="h-screen bg-white flex flex-col justify-between">
      <div className="flex-1 flex flex-col justify-center px-6">
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-12 h-12 mr-3 ${isPro ? 'bg-yellow-500' : 'bg-blue-600'} rounded-xl flex items-center justify-center shadow-lg`}>
            <BsQrCodeScan className="text-2xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t('loggedOut.appName')}</h1>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {t('loggedOut.welcomeTitle')}
          </h2>
          <p className="text-gray-600 text-base">
            {t('loggedOut.welcomeMessage')}
          </p>
        </div>

        {/* Auth Buttons */}
        <div className="space-y-3 px-4">
          <Link
            to="/auth"
            className={`block w-full ${isPro ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} text-white text-center py-3.5 rounded-lg font-medium transition`}
          >
            {t('loggedOut.registerButton')}
          </Link>
          <Link
            to="/auth"
            className="block w-full bg-gray-100 text-gray-800 text-center py-3.5 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            {t('loggedOut.loginButton')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoggedOutView;
