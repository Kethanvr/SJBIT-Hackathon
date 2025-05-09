// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\pages\Language.jsx
import React from 'react';
import { Link } from "react-router-dom";
import { FiArrowLeft, FiGlobe, FiCheck } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import Card, { CardHeader, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { withErrorBoundary } from "../components/ui/ErrorBoundary";
import { ROUTES } from "../utils/constants";

function Language() {
  const { t } = useTranslation('language'); // Using the language namespace
  const { languages, currentLanguage, changeLanguage } = useLanguage();

  // Filter languages to show only English and Kannada
  const supportedLanguages = languages.filter(lang => ['en', 'kn'].includes(lang.code));
  
  // Languages that will be added in the future (Hindi and others)
  const upcomingLanguages = languages.filter(lang => !['en', 'kn'].includes(lang.code))
    .map(lang => lang.name).join(', ');

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-y-auto overscroll-behavior-y-contain">
      {/* Fixed Header */}
      <div className="bg-[var(--bg-secondary)] px-4 py-4 border-b border-gray-700/10 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Link to={ROUTES.ACCOUNT} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold">
            {t('title')}
          </h1>
        </div>
      </div>

      {/* Content - with improved mobile scrolling */}
      <div className="max-w-lg mx-auto p-4 space-y-6 pb-20 md:pb-4 overflow-y-auto">
        {/* Language Selection Card */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-gray-700/10">
            <div className="flex items-center space-x-3">
              <FiGlobe className="w-7 h-7 text-blue-500" />
              <div>
                <h3 className="text-lg font-medium">{t('title')}</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {t('description')}
                </p>
              </div>
            </div>
          </CardHeader>
          
          {/* Language Options */}
          <CardContent className="p-0">
            <div className="divide-y divide-gray-700/10">
              {supportedLanguages.map((lang) => (
                <Button
                  key={lang.code}
                  variant="ghost"
                  onClick={() => changeLanguage(lang.code)}
                  className="w-full flex items-center justify-between p-4 rounded-none"
                  fullWidth
                >
                  <div className="flex items-center">
                    <img 
                      src={`/locales/${lang.code}/flag.png`} 
                      alt={lang.name}
                      onError={(e) => e.target.style.display = 'none'} 
                      className="w-6 h-6 mr-3 rounded-sm object-cover" 
                    />
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  {currentLanguage === lang.code && (
                    <FiCheck className="w-5 h-5 text-blue-500" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
          
        {/* Coming Soon Card */}
        <Card className="p-6">
          <CardContent>
            <h3 className="text-lg font-medium mb-3">{t('comingSoonTitle')}</h3>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm">
                {t('comingSoonDescription')}
              </p>
              {upcomingLanguages && (
                <p className="text-sm mt-2">
                  {t('upcomingLanguages')} <span className="font-medium">{upcomingLanguages}</span>
                </p>
              )}
              <p className="text-sm mt-3 text-[var(--text-secondary)]">
                {t('helpTranslate')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withErrorBoundary(Language, {
  errorKey: 'language-page'
});
