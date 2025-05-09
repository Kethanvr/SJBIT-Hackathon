import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define the namespaces based on your JSON file names
const namespaces = [
  'personalInfo',
  'notifications',
  'history',
  'account',
  'accessibility',
  'splashScreen',
  'home',
  'aboutCreators',
  'userSettings',
  'scanner',
  'scanHistory',
  'healthRecords',
  'healthManagement',
  'comingSoon',
  'auth',
  'scanGuide',
  'healthTrends',
  'cameraModal',
  'sidebar',
  'results',
  'feedbackModal',
  'creatorCard',
  'creator',
  'header',
  'language',
  'updates', // Added updates namespace
  'updatesPage', // Added updatesPage namespace
  'payments', // Add payments namespace
  'howToUse', // Added how to use namespace
  'common' // Add common namespace
];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'kn'],
    ns: namespaces,
    defaultNS: 'home', // Default namespace is 'home'
    debug: false, // Disable debug logs for production
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

export default i18n;