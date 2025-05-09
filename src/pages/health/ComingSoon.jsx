import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCalendar, FiFileText, FiAlertCircle, FiCheckCircle, FiActivity, FiBell, FiHeart, FiTrendingUp } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const FeatureBox = ({ icon: Icon, title, description, status }) => {
  const { t } = useTranslation('comingSoon');
  const statusColors = {
    inProgress: "bg-yellow-100 text-yellow-800 border-yellow-300",
    planned: "bg-blue-100 text-blue-800 border-blue-300",
    soon: "bg-teal-100 text-teal-800 border-teal-300"
  };

  const statusClasses = statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300";

  const statusText = {
    inProgress: t('statuses.inProgress'),
    planned: t('statuses.planned'),
    soon: t('statuses.soon')
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
      <div className="flex items-start">
        <div className="mr-4 bg-blue-100 p-3 rounded-lg text-blue-600">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClasses}`}>
              {statusText[status] || t('statuses.soon')}
            </span>
          </div>
          <p className="text-gray-600 mt-2 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ComingSoon = () => {
  const { t } = useTranslation('comingSoon');
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const feature = params.get('feature');

  // Define features with translation keys
  const features = [
    { id: 'health-management', icon: FiHeart, titleKey: 'features.healthManagement.title', descriptionKey: 'features.healthManagement.description', status: 'inProgress' },
    { id: 'appointment-reminders', icon: FiCalendar, titleKey: 'features.reminders.title', descriptionKey: 'features.reminders.description', status: 'planned' },
    { id: 'symptom-tracker', icon: FiActivity, titleKey: 'features.symptomTracker.title', descriptionKey: 'features.symptomTracker.description', status: 'planned' },
    { id: 'health-trends', icon: FiTrendingUp, titleKey: 'features.healthTrends.title', descriptionKey: 'features.healthTrends.description', status: 'soon' },
    { id: 'medication-alerts', icon: FiBell, titleKey: 'features.medicationAlerts.title', descriptionKey: 'features.medicationAlerts.description', status: 'soon' },
    { id: 'report-sharing', icon: FiFileText, titleKey: 'features.reportSharing.title', descriptionKey: 'features.reportSharing.description', status: 'soon' },
  ];

  // Determine which feature to highlight (if any)
  const highlightedFeature = feature ? features.find(f => f.id === feature) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <FiArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold">
            {highlightedFeature ? t(highlightedFeature.titleKey) : t('pageTitle')}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Optional: Highlighted Feature Details */}
        {highlightedFeature && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 shadow">
            <div className="flex items-center mb-3">
              <div className="mr-3 bg-blue-100 p-2 rounded-lg text-blue-600">
                <highlightedFeature.icon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-blue-800">{t(highlightedFeature.titleKey)}</h2>
            </div>
            <p className="text-blue-700 mb-4">{t(highlightedFeature.descriptionKey)}</p>
            <div className="flex items-center text-sm">
              <FiClock className="w-4 h-4 mr-2 text-blue-500" />
              <span>{t('statusLabel')}: {t(`statuses.${highlightedFeature.status}`)}</span>
            </div>
          </div>
        )}

        {/* List of all upcoming features */}
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          {t('listTitle')}
        </h2>
        <div className="space-y-4">
          {features.map((f) => (
            <FeatureBox
              key={f.id}
              icon={f.icon}
              title={t(f.titleKey)}
              description={t(f.descriptionKey)}
              status={f.status}
            />
          ))}
        </div>

        {/* Optional: Call to action or feedback */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>{t('feedbackPrompt')}</p>
          {/* Consider adding a FeedbackButton component here */}
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;