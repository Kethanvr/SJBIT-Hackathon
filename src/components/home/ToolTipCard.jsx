// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\components\home\ToolTipCard.jsx
import React, { useState } from "react";
import { FiLayers, FiPlay } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { motion } from "framer-motion";
import { AnalyticsTracker } from "../../utils/analyticsTracker";
import ToolTipsGuide from "../onboarding/ToolTipsGuide";

const ToolTipCard = () => {
  const { t } = useTranslation("home");
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const isPro = profile?.pro_user;
  const [showToolTips, setShowToolTips] = useState(false);
  
  // Handle showing the tooltip guide
  const handleShowToolTips = () => {
    setShowToolTips(true);
    // Track this interaction
    AnalyticsTracker.trackEvent('tutorial_cards_opened', {
      from: 'home_page',
      timestamp: new Date().toISOString()
    });
  };
  
  // Handle closing the tooltip guide
  const handleToolTipsComplete = () => {
    setShowToolTips(false);
  };
  
  // Different styling based on user's pro status
  const cardBg = isPro 
    ? "bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200" 
    : "bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100";
  const titleColor = isPro ? "text-purple-900" : "text-indigo-900";
  const descColor = isPro ? "text-purple-800" : "text-indigo-800";
  const iconBg = isPro ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600";
  const buttonBg = isPro 
    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700" 
    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700";

  return (
    <>
      <div className={`mt-4 ${cardBg} rounded-xl p-5 shadow-sm`}>      
        <div className="flex items-center">
          <div className={`${iconBg} rounded-full p-3 mr-4`}>
            <FiLayers className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${titleColor}`}>
              {t('toolTipCard.title', 'Interactive Tutorial')}
            </h3>
            <p className={`text-sm mt-1 ${descColor}`}>
              {t('toolTipCard.description', 'Get a quick visual tour of key features')}
            </p>            <button 
              onClick={handleShowToolTips}
              className={`mt-3 px-4 py-2 ${buttonBg} text-white rounded-lg flex items-center shadow-sm hover:shadow-md transition duration-200`}
            >
              <FiPlay className="mr-2" />
              {t('toolTipCard.button', 'Start Interactive Tutorial')}
            </button>
          </div>
        </div>
      </div>

      {/* ToolTips Guide Overlay */}
      {showToolTips && (
        <ToolTipsGuide 
          onComplete={handleToolTipsComplete}
          isManuallyTriggered={true}
        />
      )}
    </>
  );
};

export default ToolTipCard;
