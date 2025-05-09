import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import LanguageSettingsCard from "../components/common/LanguageSettingsCard";
import { withErrorBoundary } from "../components/ui/ErrorBoundary";
import Button from "../components/ui/Button";
import { ROUTES } from "../utils/constants";

function Accessibility() {
  const { t } = useTranslation('accessibility');
  const { languages, currentLanguage, changeLanguage } = useLanguage();

  // Filter languages to show only English, Kannada, and Hindi
  const supportedLanguages = languages.filter(lang => ['en', 'kn', 'hi'].includes(lang.code));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="bg-[var(--bg-secondary)] px-4 py-4 border-b border-gray-700/10">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost" 
            className="p-0"
            as={Link} 
            to={ROUTES.ACCOUNT}
          >
            <FiArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold">
            {t('title')}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Language Card - Replaced with component */}
        <LanguageSettingsCard
          supportedLanguages={supportedLanguages}
          currentLanguage={currentLanguage}
          changeLanguage={changeLanguage}
        />
      </div>
    </div>
  );
}

export default withErrorBoundary(Accessibility, {
  errorKey: 'accessibility-page'
});