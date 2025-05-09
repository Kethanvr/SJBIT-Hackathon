import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const languages = [
  { code: "en", name: "English" },
  { code: "kn", name: "ಕನ್ನಡ" },

];

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  
  // Apply saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, [i18n]);

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    document.documentElement.lang = langCode;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage: i18n.language, 
        languages, 
        changeLanguage 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}