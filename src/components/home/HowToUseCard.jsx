import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHelpCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { motion } from "framer-motion";
import { AnalyticsTracker } from "../../utils/analyticsTracker";

const HowToUseCard = () => {
  const { t } = useTranslation("home");
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const isPro = profile?.pro_user;
  const [showPrompt, setShowPrompt] = useState(false);
  
  // Check if user skipped the tutorial
  useEffect(() => {
    const skippedTutorial = localStorage.getItem('skippedTutorial') === 'true';
    const howToUseViewed = localStorage.getItem('howToUseViewed') === 'true';
    
    // Only show the special prompt if they skipped but never viewed the how-to page
    setShowPrompt(skippedTutorial && !howToUseViewed);
  }, []);
  
  // Track when user clicks on the get started button
  const handleGetStartedClick = () => {
    localStorage.setItem('howToUseViewed', 'true');
    AnalyticsTracker.trackTutorialView();
  };
  
  // Different styling based on user's pro status
  const cardBg = isPro 
    ? "bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200" 
    : "bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100";
  const titleColor = isPro ? "text-purple-900" : "text-indigo-900";
  const descColor = isPro ? "text-purple-800" : "text-indigo-800";
  const iconColor = isPro ? "text-purple-500" : "text-indigo-600";

  // If user skipped tutorial, show a more prominent card
  if (showPrompt) {
    return (
      <motion.div 
        className={`mt-6 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-xl p-6 shadow-md`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Need help getting started?</h3>
            <p className="text-sm mt-1 text-blue-800">Check out our quick guide to make the most of MediScan!</p>
          </div>
          <div className="flex-shrink-0 ml-4 bg-blue-500 text-white p-3 rounded-full">
            <FiHelpCircle className="w-6 h-6" />
          </div>
        </div>
        <Link to="/how-to-use" onClick={handleGetStartedClick}>
          <button 
            className={`w-full py-3 mt-2 rounded-lg font-medium text-white ${
              isPro ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
            } shadow-md hover:shadow-lg transition duration-200`}
          >
            {t('getStartedButton', 'Get Started with MediScan')}
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className={`mt-6 ${cardBg} rounded-xl p-6 shadow-sm`}>      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-lg font-semibold ${titleColor}`}>{t('howToUseCard.title')}</h3>
          <p className={`text-sm mt-1 ${descColor}`}>{t('howToUseCard.description')}</p>
        </div>
        <FiHelpCircle className={`w-8 h-8 flex-shrink-0 ml-5 ${iconColor}`} />
      </div>
      <Link to="/how-to-use" onClick={handleGetStartedClick}>
        <button 
          className={`w-full py-3 mt-2 rounded-lg font-medium text-white ${
            isPro ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
          } shadow-md hover:shadow-lg transition duration-200`}
        >
          {t('getStartedButton', 'Get Started with MediScan')}
        </button>
      </Link>
    </div>
  );
};

export default HowToUseCard;
